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
exports.OpsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const audit_service_1 = require("../audit/audit.service");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
class FuelEntryDto {
    loggedAt;
    vehicle;
    amount;
    mileage;
}
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "loggedAt", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], FuelEntryDto.prototype, "vehicle", void 0);
__decorate([
    (0, class_validator_1.IsNumber)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "amount", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], FuelEntryDto.prototype, "mileage", void 0);
class RadioDto {
    number;
    model;
    serial;
    accessories;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RadioDto.prototype, "number", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RadioDto.prototype, "model", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], RadioDto.prototype, "serial", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    __metadata("design:type", Object)
], RadioDto.prototype, "accessories", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let OpsController = class OpsController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    fuelEntries(limit) {
        return this.prisma.fuelLogEntry.findMany({
            include: {
                member: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { loggedAt: 'desc' },
            take: limit ? Number(limit) : 100,
        });
    }
    addFuel(auth, body) {
        return this.prisma.fuelLogEntry.create({
            data: {
                loggedAt: new Date(body.loggedAt),
                memberId: requireMember(auth),
                vehicle: body.vehicle,
                amount: body.amount,
                mileage: body.mileage,
            },
        });
    }
    radios() {
        return this.prisma.radio.findMany({
            include: {
                assignments: {
                    where: { returnedAt: null },
                    include: {
                        member: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
            },
            orderBy: { number: 'asc' },
        });
    }
    addRadio(body) {
        return this.prisma.radio.create({ data: body });
    }
    async issue(auth, radioId, memberId) {
        const open = await this.prisma.radioAssignment.findFirst({
            where: { radioId, returnedAt: null },
        });
        if (open)
            throw new common_1.ForbiddenException('Radio is already issued');
        const assignment = await this.prisma.radioAssignment.create({
            data: { radioId, memberId },
        });
        await this.audit.log(auth, 'radios.issue', 'RadioAssignment', assignment.id);
        return assignment;
    }
    async returnRadio(auth, radioId) {
        await this.prisma.radioAssignment.updateMany({
            where: { radioId, returnedAt: null },
            data: { returnedAt: new Date() },
        });
        await this.audit.log(auth, 'radios.return', 'Radio', radioId);
        return { ok: true };
    }
    auditLog(limit) {
        return this.prisma.auditLog.findMany({
            orderBy: { at: 'desc' },
            take: limit ? Math.min(Number(limit), 500) : 100,
        });
    }
};
exports.OpsController = OpsController;
__decorate([
    (0, common_1.Get)('fuel'),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "fuelEntries", null);
__decorate([
    (0, common_1.Post)('fuel'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, FuelEntryDto]),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "addFuel", null);
__decorate([
    (0, common_1.Get)('radios'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "radios", null);
__decorate([
    (0, common_1.Post)('radios'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.RADIOS_MANAGE),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RadioDto]),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "addRadio", null);
__decorate([
    (0, common_1.Post)('radios/:id/issue/:memberId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.RADIOS_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", Promise)
], OpsController.prototype, "issue", null);
__decorate([
    (0, common_1.Delete)('radios/:id/issue'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.RADIOS_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], OpsController.prototype, "returnRadio", null);
__decorate([
    (0, common_1.Get)('audit'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.AUDIT_READ),
    __param(0, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], OpsController.prototype, "auditLog", null);
exports.OpsController = OpsController = __decorate([
    (0, common_1.Controller)({ version: '1' }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], OpsController);
//# sourceMappingURL=ops.controller.js.map