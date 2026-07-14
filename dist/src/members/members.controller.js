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
exports.MembersController = void 0;
const common_1 = require("@nestjs/common");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const members_service_1 = require("./members.service");
let MembersController = class MembersController {
    members;
    constructor(members) {
        this.members = members;
    }
    list(includeInactive) {
        return this.members.list(includeInactive === 'true');
    }
    me(auth) {
        if (auth.kind !== 'member')
            return null;
        return this.members.get(auth.memberId);
    }
    get(id) {
        return this.members.get(id);
    }
};
exports.MembersController = MembersController;
__decorate([
    (0, common_1.Get)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.MEMBERS_READ),
    __param(0, (0, common_1.Query)('includeInactive')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('me'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "me", null);
__decorate([
    (0, common_1.Get)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.MEMBERS_READ),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], MembersController.prototype, "get", null);
exports.MembersController = MembersController = __decorate([
    (0, common_1.Controller)({ path: 'members', version: '1' }),
    __metadata("design:paramtypes", [members_service_1.MembersService])
], MembersController);
//# sourceMappingURL=members.controller.js.map