import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
} from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { AuditService } from '../audit/audit.service';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { ALL_PERMISSIONS, PERMISSIONS } from '../permissions/catalog';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { PrismaService } from '../prisma/prisma.service';

class RoleDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  isOfficer?: boolean;

  @IsArray()
  @IsString({ each: true })
  permissions!: string[];
}

class AssignDto {
  @IsInt()
  memberId!: number;

  @IsDateString()
  startDate!: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}

/** Somebody who holds a role because of a credential rather than a decision. */
interface ConferredHolder {
  member: {
    id: number;
    firstName: string;
    preferredFirstName: string | null;
    lastName: string;
  };
  /**
   * The one credential worth naming: the highest thing they hold that
   * reaches this link. Not everything they hold — a driver's licence has
   * nothing to do with a role linked to Crew Chief — and not whichever rung
   * happened to match first, which made one Duty Supervisor read as a Crew
   * Chief Trainer here and an EES there.
   */
  credential: { key: string; name: string; title: string | null };
  /** True when they hold something above the link rather than the link. */
  inherited: boolean;
}

@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly graph: CredentialGraphService,
  ) {}

  @Get('permissions')
  permissionCatalog() {
    return ALL_PERMISSIONS;
  }

  /**
   * The roles, with both ways somebody comes to hold one.
   *
   * An assignment is a decision an officer made and can undo here. A
   * credential link is a standing rule — hold the credential or anything
   * above it, hold the role — and the people it covers change without
   * anybody touching this page.
   * Shown together because "who has this permission" has to be answerable
   * in one place; a role whose assignment list is empty while a credential
   * quietly confers it on thirty people is how a permission gets granted by
   * accident.
   */
  @Get()
  async list() {
    const [roles, conferred] = await Promise.all([
      this.prisma.role.findMany({
        include: {
          permissions: true,
          members: {
            include: {
              member: {
                select: {
                  id: true,
                  firstName: true,
                  preferredFirstName: true,
                  lastName: true,
                },
              },
            },
          },
          credentialLinks: {
            include: {
              credentialType: { select: { id: true, name: true, key: true } },
            },
          },
        },
        orderBy: { name: 'asc' },
      }),
      // The same rule the auth guard applies: an ACTIVE credential held by
      // an active member. A suspended credential confers nothing, and this
      // list must not say otherwise.
      this.prisma.memberCredential.findMany({
        where: { status: 'ACTIVE', member: { active: true } },
        select: {
          member: {
            select: {
              id: true,
              firstName: true,
              preferredFirstName: true,
              lastName: true,
            },
          },
          title: true,
          type: { select: { id: true, name: true, key: true } },
        },
      }),
    ]);

    // Read "or above", the way the guard reads it and the way every other
    // question about a credential is read here: a role linked to Crew Chief
    // is held by a Crew Chief Trainer and by a Duty Supervisor, whose
    // records often do not carry the rungs beneath them at all.
    // Everything each person holds, gathered once, so the badge can be the
    // top of whichever chain reaches the link.
    const heldByMember = new Map<
      number,
      Array<{ key: string; name: string; title: string | null }>
    >();
    for (const held of conferred) {
      const list = heldByMember.get(held.member.id) ?? [];
      list.push({
        key: held.type.key,
        name: held.type.name,
        title: held.title,
      });
      heldByMember.set(held.member.id, list);
    }

    const satisfiedByKey = new Map<string, Set<string>>();
    for (const key of new Set(conferred.map((held) => held.type.key))) {
      satisfiedByKey.set(key, await this.graph.keysSatisfiedBy(new Set([key])));
    }

    /** The top of what this person holds that actually reaches the link. */
    const badgeFor = async (memberId: number, linkKey: string) => {
      const held = heldByMember.get(memberId) ?? [];
      const reaching = held.filter(
        (credential) =>
          credential.key === linkKey ||
          satisfiedByKey.get(credential.key)?.has(linkKey),
      );
      const top = await this.graph.highestOf(
        reaching.map((credential) => credential.key),
      );
      return (
        reaching.find((credential) => credential.key === top) ??
        reaching[0] ?? { key: linkKey, name: linkKey, title: null }
      );
    };

    // Keyed by member so somebody holding both the linked credential and
    // one above it is listed once, under the one they hold that the link
    // actually names.
    const byRole = new Map<number, Map<number, ConferredHolder>>();
    for (const held of conferred) {
      const satisfied = satisfiedByKey.get(held.type.key) ?? new Set();
      for (const role of roles) {
        const link = role.credentialLinks.find(
          (candidate) =>
            candidate.credentialType.key === held.type.key ||
            satisfied.has(candidate.credentialType.key),
        );
        if (!link) continue;
        const holders =
          byRole.get(role.id) ?? new Map<number, ConferredHolder>();
        // Once per person per role, whichever of their credentials brought
        // us here: the badge is worked out from everything they hold, so
        // the row that triggered it no longer decides what it says.
        if (holders.has(held.member.id)) continue;
        const credential = await badgeFor(
          held.member.id,
          link.credentialType.key,
        );
        holders.set(held.member.id, {
          member: held.member,
          credential,
          inherited: credential.key !== link.credentialType.key,
        });
        byRole.set(role.id, holders);
      }
    }

    return roles.map((role) => ({
      ...role,
      conferred: [...(byRole.get(role.id)?.values() ?? [])].sort(
        (a, b) =>
          a.member.lastName.localeCompare(b.member.lastName) ||
          a.member.firstName.localeCompare(b.member.firstName),
      ),
    }));
  }

  @Post()
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  async create(@CurrentAuth() auth: AuthContext, @Body() body: RoleDto) {
    const role = await this.prisma.role.create({
      data: {
        name: body.name,
        description: body.description,
        isOfficer: body.isOfficer ?? false,
        permissions: {
          create: body.permissions
            .filter((p) => (ALL_PERMISSIONS as string[]).includes(p))
            .map((permission) => ({ permission })),
        },
      },
      include: { permissions: true },
    });
    await this.audit.log(auth, 'roles.create', 'Role', role.id);
    return role;
  }

  @Put(':id')
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  async update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: RoleDto,
  ) {
    await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
    const role = await this.prisma.role.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        isOfficer: body.isOfficer ?? false,
        permissions: {
          create: body.permissions
            .filter((p) => (ALL_PERMISSIONS as string[]).includes(p))
            .map((permission) => ({ permission })),
        },
      },
      include: { permissions: true },
    });
    await this.audit.log(auth, 'roles.update', 'Role', id);
    return role;
  }

  @Delete(':id')
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  async remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    await this.prisma.role.delete({ where: { id } });
    await this.audit.log(auth, 'roles.delete', 'Role', id);
    return { ok: true };
  }

  @Post(':id/assignments')
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  async assign(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) roleId: number,
    @Body() body: AssignDto,
  ) {
    const assignment = await this.prisma.memberRole.create({
      data: {
        roleId,
        memberId: body.memberId,
        startDate: new Date(body.startDate),
        endDate: body.endDate ? new Date(body.endDate) : null,
      },
    });
    await this.audit.log(
      auth,
      'roles.assign',
      'MemberRole',
      assignment.id,
      body,
    );
    return assignment;
  }

  @Delete('assignments/:assignmentId')
  @RequirePermissions(PERMISSIONS.ROLES_MANAGE)
  async unassign(
    @CurrentAuth() auth: AuthContext,
    @Param('assignmentId', ParseIntPipe) assignmentId: number,
  ) {
    await this.prisma.memberRole.delete({ where: { id: assignmentId } });
    await this.audit.log(auth, 'roles.unassign', 'MemberRole', assignmentId);
    return { ok: true };
  }
}
