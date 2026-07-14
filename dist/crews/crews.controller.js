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
exports.CrewsController = void 0;
const common_1 = require("@nestjs/common");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
const enums_1 = require("../generated/prisma/enums");
const crews_service_1 = require("./crews.service");
class AssignDto {
    memberId;
    placeholder;
}
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], AssignDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], AssignDto.prototype, "placeholder", void 0);
class DefaultSlotDto {
    weekday;
    position;
    memberId;
    placeholder;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    (0, class_validator_1.Min)(0),
    (0, class_validator_1.Max)(6),
    __metadata("design:type", Number)
], DefaultSlotDto.prototype, "weekday", void 0);
__decorate([
    (0, class_validator_1.IsIn)(crews_service_1.CREW_POSITIONS),
    __metadata("design:type", String)
], DefaultSlotDto.prototype, "position", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], DefaultSlotDto.prototype, "memberId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], DefaultSlotDto.prototype, "placeholder", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let CrewsController = class CrewsController {
    crews;
    settings;
    prisma;
    constructor(crews, settings, prisma) {
        this.crews = crews;
        this.settings = settings;
        this.prisma = prisma;
    }
    getWeeks(auth, viewDate) {
        if (viewDate && !/^\d{4}-\d{2}-\d{2}$/.test(viewDate)) {
            viewDate = undefined;
        }
        return this.crews.getWeeks(requireMember(auth), viewDate);
    }
    signup(auth, crewId, position) {
        return this.crews.signup(requireMember(auth), crewId, position);
    }
    drop(auth, crewId, position) {
        return this.crews.drop(requireMember(auth), crewId, position);
    }
    assign(auth, crewId, position, body) {
        return this.crews.assign(auth, crewId, position, body);
    }
    getDefaults() {
        return this.prisma.defaultCrewTemplate.findMany({
            orderBy: [{ weekday: 'asc' }, { position: 'asc' }],
        });
    }
    async putDefault(body) {
        return this.prisma.defaultCrewTemplate.upsert({
            where: {
                weekday_position: { weekday: body.weekday, position: body.position },
            },
            create: body,
            update: { memberId: body.memberId ?? null, placeholder: body.placeholder ?? null },
        });
    }
    getSettings() {
        return this.settings.scheduling();
    }
    putSetting(key, body) {
        return this.settings.update(key, body.value);
    }
};
exports.CrewsController = CrewsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Query)('viewDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "getWeeks", null);
__decorate([
    (0, common_1.Post)(':crewId/slots/:position/signup'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('crewId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "signup", null);
__decorate([
    (0, common_1.Delete)(':crewId/slots/:position/signup'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('crewId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('position')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String]),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "drop", null);
__decorate([
    (0, common_1.Put)(':crewId/slots/:position'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.SCHEDULE_CREWS_ASSIGN),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('crewId', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Param)('position')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, String, AssignDto]),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "assign", null);
__decorate([
    (0, common_1.Get)('defaults'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "getDefaults", null);
__decorate([
    (0, common_1.Put)('defaults'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.SCHEDULE_CREWS_MANAGE_DEFAULTS),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [DefaultSlotDto]),
    __metadata("design:returntype", Promise)
], CrewsController.prototype, "putDefault", null);
__decorate([
    (0, common_1.Get)('settings'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "getSettings", null);
__decorate([
    (0, common_1.Put)('settings/:key'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.SCHEDULE_SETTINGS),
    __param(0, (0, common_1.Param)('key')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], CrewsController.prototype, "putSetting", null);
exports.CrewsController = CrewsController = __decorate([
    (0, common_1.Controller)({ path: 'crews', version: '1' }),
    __metadata("design:paramtypes", [crews_service_1.CrewsService,
        settings_service_1.SettingsService,
        prisma_service_1.PrismaService])
], CrewsController);
//# sourceMappingURL=crews.controller.js.map