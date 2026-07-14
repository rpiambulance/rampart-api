"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MembersService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const prisma_service_1 = require("../prisma/prisma.service");
let MembersService = class MembersService {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
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
    async get(id) {
        const member = await this.prisma.member.findUnique({
            where: { id },
            include: {
                roles: { include: { role: true } },
                credentials: { include: { type: true } },
                certifications: { include: { type: true, documents: true } },
            },
        });
        if (!member)
            throw new common_1.NotFoundException(`Member ${id} not found`);
        return member;
    }
    async create(auth, data) {
        const member = await this.prisma.member.create({
            data: { ...data, dob: data.dob ? new Date(data.dob) : null },
        });
        await this.audit.log(auth, 'members.create', 'Member', member.id);
        return member;
    }
    async update(id, data, auth) {
        const member = await this.prisma.member.update({
            where: { id },
            data: { ...data, dob: data.dob ? new Date(data.dob) : undefined },
        });
        if (auth) {
            await this.audit.log(auth, 'members.update', 'Member', id, data);
        }
        return member;
    }
};
exports.MembersService = MembersService;
exports.MembersService = MembersService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], MembersService);
//# sourceMappingURL=members.service.js.map