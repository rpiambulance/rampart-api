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
exports.EventsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const class_transformer_1 = require("class-transformer");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const events_service_1 = require("./events.service");
class PositionDto {
    position;
    count;
    requiredCredentialKey;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], PositionDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(1),
    __metadata("design:type", Number)
], PositionDto.prototype, "count", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], PositionDto.prototype, "requiredCredentialKey", void 0);
class CreateEventDto {
    title;
    description;
    location;
    startsAt;
    endsAt;
    kindId;
    attendeeCap;
    hidden;
    positions;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "title", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "description", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "location", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "startsAt", void 0);
__decorate([
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEventDto.prototype, "endsAt", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEventDto.prototype, "kindId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], CreateEventDto.prototype, "attendeeCap", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], CreateEventDto.prototype, "hidden", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => PositionDto),
    __metadata("design:type", Array)
], CreateEventDto.prototype, "positions", void 0);
class UpdateEventDto extends CreateEventDto {
}
class SignupDto {
    position;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], SignupDto.prototype, "position", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let EventsController = class EventsController {
    events;
    constructor(events) {
        this.events = events;
    }
    list(from, to) {
        return this.events.list({ from, to });
    }
    kinds() {
        return this.events.listKinds();
    }
    get(auth, id) {
        return this.events.get(id, auth.kind === 'member' ? auth.memberId : undefined);
    }
    create(auth, body) {
        return this.events.create(auth, body);
    }
    update(auth, id, body) {
        return this.events.update(auth, id, body);
    }
    lock(auth, id, body) {
        return this.events.setLocked(auth, id, !!body.locked);
    }
    remove(auth, id) {
        return this.events.remove(auth, id);
    }
    signup(auth, id, body) {
        return this.events.signup(requireMember(auth), id, body.position ?? null);
    }
    drop(auth, id) {
        return this.events.drop(requireMember(auth), id);
    }
    signupOther(auth, id, memberId, body) {
        return this.events.signup(memberId, id, body.position ?? null, {
            override: true,
        });
    }
    dropOther(auth, id, memberId) {
        return this.events.dropOther(auth, id, memberId);
    }
};
exports.EventsController = EventsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('from')),
    __param(1, (0, common_1.Query)('to')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "list", null);
__decorate([
    (0, common_1.Get)('kinds'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "kinds", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "get", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_CREATE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "create", null);
__decorate([
    (0, common_1.Put)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_CREATE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, UpdateEventDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "update", null);
__decorate([
    (0, common_1.Patch)(':id/lock'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_LOCK),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Object]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "lock", null);
__decorate([
    (0, common_1.Delete)(':id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_CREATE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "remove", null);
__decorate([
    (0, common_1.Post)(':id/signup'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, SignupDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "signup", null);
__decorate([
    (0, common_1.Delete)(':id/signup'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "drop", null);
__decorate([
    (0, common_1.Post)(':id/signup/:memberId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_ASSIGN_OTHERS),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number, SignupDto]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "signupOther", null);
__decorate([
    (0, common_1.Delete)(':id/signup/:memberId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVENTS_ASSIGN_OTHERS),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, Number]),
    __metadata("design:returntype", void 0)
], EventsController.prototype, "dropOther", null);
exports.EventsController = EventsController = __decorate([
    (0, common_1.Controller)({ path: 'events', version: '1' }),
    __metadata("design:paramtypes", [events_service_1.EventsService])
], EventsController);
//# sourceMappingURL=events.controller.js.map