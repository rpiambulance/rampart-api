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
exports.PromotionsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const promotions_service_1 = require("./promotions.service");
class VoteDto {
    vote;
    notes;
}
__decorate([
    (0, class_validator_1.IsIn)(['APPROVE', 'DENY']),
    __metadata("design:type", String)
], VoteDto.prototype, "vote", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], VoteDto.prototype, "notes", void 0);
class ProxyDto {
    proxyId;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ProxyDto.prototype, "proxyId", void 0);
class CaptainDto {
    approved;
    notes;
}
__decorate([
    (0, class_validator_1.IsIn)([true, false]),
    __metadata("design:type", Boolean)
], CaptainDto.prototype, "approved", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CaptainDto.prototype, "notes", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let PromotionsController = class PromotionsController {
    promotions;
    constructor(promotions) {
        this.promotions = promotions;
    }
    eligible(auth) {
        return this.promotions.eligibleRequests(requireMember(auth));
    }
    create(auth, body) {
        return this.promotions.createRequest(requireMember(auth), body.credentialTypeId);
    }
    list(status) {
        return this.promotions.listRequests(status);
    }
    review(id) {
        return this.promotions.getReview(id);
    }
    proxy(auth, id, body) {
        return this.promotions.appointProxy(requireMember(auth), id, body.proxyId);
    }
    vote(auth, id, body) {
        return this.promotions.vote(requireMember(auth), id, body.vote, body.notes);
    }
    captain(auth, id, body) {
        requireMember(auth);
        return this.promotions.captainDecision(auth, id, body.approved, body.notes);
    }
    withdraw(auth, id) {
        return this.promotions.withdraw(requireMember(auth), id);
    }
};
exports.PromotionsController = PromotionsController;
__decorate([
    (0, common_1.Get)('eligible'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "eligible", null);
__decorate([
    (0, common_1.Post)('requests'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('requests'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.PROMOTIONS_REVIEW),
    __param(0, (0, common_1.Query)('status')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('requests/:id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.PROMOTIONS_REVIEW),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "review", null);
__decorate([
    (0, common_1.Post)('requests/:id/proxy'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, ProxyDto]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "proxy", null);
__decorate([
    (0, common_1.Post)('requests/:id/vote'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, VoteDto]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "vote", null);
__decorate([
    (0, common_1.Post)('requests/:id/captain-decision'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.PROMOTIONS_CAPTAIN_APPROVE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, CaptainDto]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "captain", null);
__decorate([
    (0, common_1.Delete)('requests/:id'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], PromotionsController.prototype, "withdraw", null);
exports.PromotionsController = PromotionsController = __decorate([
    (0, common_1.Controller)({ path: 'promotions', version: '1' }),
    __metadata("design:paramtypes", [promotions_service_1.PromotionsService])
], PromotionsController);
//# sourceMappingURL=promotions.controller.js.map