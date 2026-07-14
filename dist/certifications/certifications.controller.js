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
exports.CertificationsController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const certifications_service_1 = require("./certifications.service");
class SubmitCertDto {
    typeId;
    identifier;
    issuedAt;
    expiresAt;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], SubmitCertDto.prototype, "typeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SubmitCertDto.prototype, "identifier", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SubmitCertDto.prototype, "issuedAt", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], SubmitCertDto.prototype, "expiresAt", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let CertificationsController = class CertificationsController {
    certs;
    constructor(certs) {
        this.certs = certs;
    }
    types() {
        return this.certs.listTypes();
    }
    mine(auth) {
        return this.certs.listForMember(requireMember(auth));
    }
    forMember(memberId) {
        return this.certs.listForMember(memberId);
    }
    pending() {
        return this.certs.listPending();
    }
    expiring(withinDays) {
        return this.certs.expiring(withinDays ? Number(withinDays) : 30);
    }
    submit(auth, body) {
        return this.certs.submit(requireMember(auth), body);
    }
    upload(auth, id, file) {
        return this.certs.attachDocument(requireMember(auth), id, file);
    }
    async document(documentId, res) {
        const { doc, object } = await this.certs.getDocument(documentId);
        res.setHeader('Content-Type', object.contentType);
        res.setHeader('Content-Disposition', `inline; filename="${doc.fileName.replace(/"/g, '')}"`);
        res.send(object.body);
    }
    verify(auth, id, body) {
        return this.certs.verify(auth, id, body);
    }
};
exports.CertificationsController = CertificationsController;
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "types", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('member/:memberId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CERTS_READ_ALL),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "forMember", null);
__decorate([
    (0, common_1.Get)('pending'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CERTS_VERIFY),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "pending", null);
__decorate([
    (0, common_1.Get)('expiring'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CERTS_READ_ALL),
    __param(0, (0, common_1.Query)('withinDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "expiring", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, SubmitCertDto]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "submit", null);
__decorate([
    (0, common_1.Post)(':id/documents'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', { limits: { fileSize: 10 * 1024 * 1024 } })),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.UploadedFile)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "upload", null);
__decorate([
    (0, common_1.Get)('documents/:documentId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CERTS_VERIFY),
    __param(0, (0, common_1.Param)('documentId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Object]),
    __metadata("design:returntype", Promise)
], CertificationsController.prototype, "document", null);
__decorate([
    (0, common_1.Post)(':id/verify'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CERTS_VERIFY),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], CertificationsController.prototype, "verify", null);
exports.CertificationsController = CertificationsController = __decorate([
    (0, common_1.Controller)({ path: 'certifications', version: '1' }),
    __metadata("design:paramtypes", [certifications_service_1.CertificationsService])
], CertificationsController);
//# sourceMappingURL=certifications.controller.js.map