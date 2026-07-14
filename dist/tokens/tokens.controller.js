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
exports.TokensController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const class_validator_1 = require("class-validator");
const audit_service_1 = require("../audit/audit.service");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
class CreateTokenDto {
    name;
    permissions;
    expiresAt;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTokenDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.IsString)({ each: true }),
    __metadata("design:type", Array)
], CreateTokenDto.prototype, "permissions", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateTokenDto.prototype, "expiresAt", void 0);
let TokensController = class TokensController {
    prisma;
    audit;
    constructor(prisma, audit) {
        this.prisma = prisma;
        this.audit = audit;
    }
    list() {
        return this.prisma.apiToken.findMany({
            select: {
                id: true,
                name: true,
                permissions: true,
                expiresAt: true,
                revokedAt: true,
                lastUsedAt: true,
                createdAt: true,
                owner: { select: { id: true, firstName: true, lastName: true } },
            },
            orderBy: { createdAt: 'desc' },
        });
    }
    async create(auth, body) {
        if (auth.kind !== 'member') {
            throw new common_1.ForbiddenException('Tokens must be created by a member');
        }
        const invalid = body.permissions.filter((p) => !catalog_1.ALL_PERMISSIONS.includes(p));
        if (invalid.length) {
            throw new common_1.ForbiddenException(`Unknown permissions: ${invalid.join(', ')}`);
        }
        const secret = `rpa_${(0, crypto_1.randomBytes)(32).toString('hex')}`;
        const token = await this.prisma.apiToken.create({
            data: {
                name: body.name,
                tokenHash: (0, crypto_1.createHash)('sha256').update(secret).digest('hex'),
                ownerId: auth.memberId,
                permissions: body.permissions,
                expiresAt: body.expiresAt ? new Date(body.expiresAt) : null,
            },
        });
        await this.audit.log(auth, 'tokens.create', 'ApiToken', token.id, {
            name: body.name,
            permissions: body.permissions,
        });
        return { id: token.id, name: token.name, secret };
    }
    async revoke(auth, id) {
        await this.prisma.apiToken.update({
            where: { id },
            data: { revokedAt: new Date() },
        });
        await this.audit.log(auth, 'tokens.revoke', 'ApiToken', id);
        return { ok: true };
    }
};
exports.TokensController = TokensController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.TOKENS_MANAGE),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], TokensController.prototype, "list", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.TOKENS_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateTokenDto]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "create", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.TOKENS_MANAGE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", Promise)
], TokensController.prototype, "revoke", null);
exports.TokensController = TokensController = __decorate([
    (0, common_1.Controller)({ path: 'tokens', version: '1' }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        audit_service_1.AuditService])
], TokensController);
//# sourceMappingURL=tokens.controller.js.map