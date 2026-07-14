import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { KeycloakAdminService } from '../integrations/keycloak-admin.service';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly audit: AuditService,
    private readonly keycloak: KeycloakAdminService,
  ) {}

  list(includeInactive = false) {
    return this.prisma.member.findMany({
      where: includeInactive ? {} : { active: true },
      orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        cellPhone: true,
        active: true,
        credentials: {
          where: { status: 'ACTIVE' },
          select: { title: true, type: { select: { key: true, name: true } } },
        },
      },
    });
  }

  async get(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        credentials: { include: { type: true } },
        certifications: { include: { type: true, documents: true } },
      },
    });
    if (!member) throw new NotFoundException(`Member ${id} not found`);
    return member;
  }

  async create(
    auth: AuthContext,
    data: {
      firstName: string;
      lastName: string;
      email: string;
      dob?: string;
      personalEmail?: string;
      cellPhone?: string;
      localAddress?: string;
      homeAddress?: string;
      rcsId?: string;
      rin?: string;
      keycloakSubject?: string;
    },
  ) {
    let keycloakSubject = data.keycloakSubject ?? null;
    if (!keycloakSubject) {
      keycloakSubject = await this.keycloak.provisionUser({
        email: data.email,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    }
    const member = await this.prisma.member.create({
      data: {
        ...data,
        keycloakSubject,
        dob: data.dob ? new Date(data.dob) : null,
      },
    });
    await this.audit.log(auth, 'members.create', 'Member', member.id);
    return member;
  }

  async update(
    id: number,
    data: Partial<{
      firstName: string;
      lastName: string;
      email: string;
      dob: string;
      personalEmail: string;
      cellPhone: string;
      homePhone: string;
      localAddress: string;
      homeAddress: string;
      rcsId: string;
      rin: string;
      keycloakSubject: string;
      active: boolean;
    }>,
    auth?: AuthContext,
  ) {
    const member = await this.prisma.member.update({
      where: { id },
      data: { ...data, dob: data.dob ? new Date(data.dob) : undefined },
    });
    if (auth) {
      await this.audit.log(auth, 'members.update', 'Member', id, data);
    }
    return member;
  }
}
