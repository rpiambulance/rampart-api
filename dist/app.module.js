"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const schedule_1 = require("@nestjs/schedule");
const auth_guard_1 = require("./auth/auth.guard");
const permissions_guard_1 = require("./auth/permissions.guard");
const calendar_controller_1 = require("./calendar/calendar.controller");
const certifications_module_1 = require("./certifications/certifications.module");
const common_module_1 = require("./common/common.module");
const credentials_module_1 = require("./credentials/credentials.module");
const crews_module_1 = require("./crews/crews.module");
const evals_module_1 = require("./evals/evals.module");
const events_module_1 = require("./events/events.module");
const health_controller_1 = require("./health/health.controller");
const members_module_1 = require("./members/members.module");
const ops_controller_1 = require("./ops/ops.controller");
const prisma_module_1 = require("./prisma/prisma.module");
const promotions_module_1 = require("./promotions/promotions.module");
const roles_module_1 = require("./roles/roles.module");
const tokens_controller_1 = require("./tokens/tokens.controller");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            schedule_1.ScheduleModule.forRoot(),
            prisma_module_1.PrismaModule,
            common_module_1.CommonModule,
            members_module_1.MembersModule,
            roles_module_1.RolesModule,
            crews_module_1.CrewsModule,
            events_module_1.EventsModule,
            credentials_module_1.CredentialsModule,
            certifications_module_1.CertificationsModule,
            evals_module_1.EvalsModule,
            promotions_module_1.PromotionsModule,
        ],
        controllers: [
            health_controller_1.HealthController,
            calendar_controller_1.CalendarController,
            tokens_controller_1.TokensController,
            ops_controller_1.OpsController,
        ],
        providers: [
            auth_guard_1.AuthGuard,
            permissions_guard_1.PermissionsGuard,
            { provide: core_1.APP_GUARD, useExisting: auth_guard_1.AuthGuard },
            { provide: core_1.APP_GUARD, useExisting: permissions_guard_1.PermissionsGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map