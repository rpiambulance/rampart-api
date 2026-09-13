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
  credentialType: { id: number; name: string; key: string };
}

@Controller({ path: 'roles', version: '1' })
export class RolesController {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
  ) {}

  @Get('permissions')
  permissionCatalog() {
    return ALL_PERMISSIONS;
  }

  /**
   * The roles, with both ways somebody comes to hold one.
   *
   * An assignment is a decision an officer made and can undo here. A
   * credential link is a standing rule — hold the credential, hold the role
   * — and the people it covers change without anybody touching this page.
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
        where: {
          status: 'ACTIVE',
          member: { active: true },
          type: { linkedRoles: { some: {} } },
        },
        select: {
          member: {
            select: {
              id: true,
              firstName: true,
              preferredFirstName: true,
              lastName: true,
            },
          },
          type: {
            select: {
              id: true,
              name: true,
              key: true,
              linkedRoles: { select: { roleId: true } },
            },
          },
        },
      }),
    ]);

    const byRole = new Map<number, ConferredHolder[]>();
    for (const held of conferred) {
      for (const link of held.type.linkedRoles) {
        const holders = byRole.get(link.roleId) ?? [];
        holders.push({
          member: held.member,
          credentialType: {
            id: held.type.id,
            name: held.type.name,
            key: held.type.key,
          },
        });
        byRole.set(link.roleId, holders);
      }
    }

    return roles.map((role) => ({
      ...role,
      conferred: (byRole.get(role.id) ?? []).sort(
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
