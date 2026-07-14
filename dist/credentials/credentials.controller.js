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
exports.CredentialsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const credentials_service_1 = require("./credentials.service");
class GrantDto {
    memberId;
    credentialTypeId;
    title;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], GrantDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], GrantDto.prototype, "credentialTypeId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], GrantDto.prototype, "title", void 0);
class AppointDto {
    memberId;
    credentialKey;
    senior;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], AppointDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], AppointDto.prototype, "credentialKey", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], AppointDto.prototype, "senior", void 0);
let CredentialsController = class CredentialsController {
    credentials;
    constructor(credentials) {
        this.credentials = credentials;
    }
    types() {
        return this.credentials.listTypes();
    }
    checklist(memberId, credentialTypeId) {
        return this.credentials.checklist(memberId, credentialTypeId);
    }
    myChecklist(auth, credentialTypeId) {
        if (auth.kind !== 'member')
            return [];
        return this.credentials.checklist(auth.memberId, credentialTypeId);
    }
    grant(auth, body) {
        return this.credentials.grant(auth, body.memberId, body.credentialTypeId, {
            title: body.title,
        });
    }
    appoint(auth, body) {
        return this.credentials.appoint(auth, body.memberId, body.credentialKey, {
            senior: body.senior,
        });
    }
    revoke(auth, memberId, credentialTypeId) {
        return this.credentials.revoke(auth, memberId, credentialTypeId);
    }
};
exports.CredentialsController = CredentialsController;
__decorate([
    (0, common_1.Get)('types'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "types", null);
__decorate([
    (0, common_1.Get)('checklist/:memberId/:credentialTypeId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.PROMOTIONS_REVIEW),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Param)('credentialTypeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "checklist", null);
__decorate([
    (0, common_1.Get)('my-checklist/:credentialTypeId'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('credentialTypeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "myChecklist", null);
__decorate([
    (0, common_1.Post)('grant'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CREDENTIALS_GRANT),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, GrantDto]),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "grant", null);
__decorate([
    (0, common_1.Post)('appoint'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CREDENTIALS_APPOINT),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, AppointDto]),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "appoint", null);
__decorate([
    (0, common_1.Delete)(':memberId/:credentialTypeId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.CREDENTIALS_GRANT),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('credentialTypeId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], CredentialsController.prototype, "revoke", null);
exports.CredentialsController = CredentialsController = __decorate([
    (0, common_1.Controller)({ path: 'credentials', version: '1' }),
    __metadata("design:paramtypes", [credentials_service_1.CredentialsService])
], CredentialsController);
//# sourceMappingURL=credentials.controller.js.map