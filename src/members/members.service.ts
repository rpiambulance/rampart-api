import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class MembersService {
  constructor(private readonly prisma: PrismaService) {}

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
      },
    });
  }

  async get(id: number) {
    const member = await this.prisma.member.findUnique({
      where: { id },
      include: {
        roles: { include: { role: true } },
        credentials: { include: { type: true } },
        certifications: { include: { type: true } },
      },
    });
    if (!member) throw new NotFoundException(`Member ${id} not found`);
    return member;
  }
}
