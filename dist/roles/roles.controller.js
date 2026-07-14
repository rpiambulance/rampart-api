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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RolesController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const audit_service_1 = require("../audit/audit.service");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
class RoleDto {
    name;
    description;
    isOfficer;
    permissions;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoleDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RoleDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], RoleDto.prototype, "isOfficer", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], RoleDto.prototype, "permissions", void 0);
class AssignDto {
    memberId;
    startDate;
    endDate;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AssignDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignDto.prototype, "startDate", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], AssignDto.prototype, "endDate", void 0);
let RolesController = class RolesController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    permissionCatalog() {
        return catalog_1.ALL_PERMISSIONS;
    }
    list() {
        return this.prisma.role.findMany({
            include: {
                permissions: true,
                members: {
                    include: {
                        member: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
            },
            orderBy: { name: 'asc' },
        });
    }
    async create(auth, body) {
        const role = await this.prisma.role.create({
            data: {
                name: body.name,
                description: body.description,
                isOfficer: body.isOfficer ?? false,
                permissions: {
                    create: body.permissions
                        .filter((p) => catalog_1.ALL_PERMISSIONS.includes(p))
                        .map((permission) => ({ permission })),
                },
            },
            include: { permissions: true },
        });
        await this.audit.log(auth, 'roles.create', 'Role', role.id);
        return role;
    }
    async update(auth, id, body) {
        await this.prisma.rolePermission.deleteMany({ where: { roleId: id } });
        const role = await this.prisma.role.update({
            where: { id },
            data: {
                name: body.name,
                description: body.description,
                isOfficer: body.isOfficer ?? false,
                permissions: {
                    create: body.permissions
                        .filter((p) => catalog_1.ALL_PERMISSIONS.includes(p))
                        .map((permission) => ({ permission })),
                },
            },
            include: { permissions: true },
        });
        await this.audit.log(auth, 'roles.update', 'Role', id);
        return role;
    }
    async assign(auth, roleId, body) {
        const assignment = await this.prisma.memberRole.create({
            data: {
                roleId,
                memberId: body.memberId,
                startDate: new Date(body.startDate),
                endDate: body.endDate ? new Date(body.endDate) : null,
            },
        });
        await this.audit.log(auth, 'roles.assign', 'MemberRole', assignment.id, body);
        return assignment;
    }
    async unassign(auth, assignmentId) {
        await this.prisma.memberRole.delete({ where: { id: assignmentId } });
        await this.audit.log(auth, 'roles.unassign', 'MemberRole', assignmentId);
        return { ok: true };
    }
};
exports.RolesController = RolesController;
__decorate([
    (0, common_1.Get)('permissions'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "permissionCatalog", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], RolesController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.ROLES_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, RoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.ROLES_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, RoleDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "update", null);
__decorate([
    (0, common_1.Post)(':id/assignments'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.ROLES_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, AssignDto]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "assign", null);
__decorate([
    (0, common_1.Delete)('assignments/:assignmentId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.ROLES_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('assignmentId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], RolesController.prototype, "unassign", null);
exports.RolesController = RolesController = __decorate([
    (0, common_1.Controller)({ path: 'roles', version: '1' }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], RolesController);
//# sourceMappingURL=roles.controller.js.map