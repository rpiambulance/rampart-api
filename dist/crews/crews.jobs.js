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
var CrewsJobs_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewsJobs = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dates_1 = require("../common/dates");
const dates_2 = require("../common/dates");
const crews_service_1 = require("./crews.service");
let CrewsJobs = CrewsJobs_1 = class CrewsJobs {
    crews;
    logger = new common_1.Logger(CrewsJobs_1.name);
    constructor(crews) {
        this.crews = crews;
    }
    async generateNextWeek() {
        const nextWeekStart = (0, dates_1.addDays)((0, dates_1.startOfWeek)((0, dates_1.nyNow)().dateStr), 7);
        await this.crews.ensureCrewsExist(nextWeekStart, 7);
        this.logger.log(`Ensured crews exist for week of ${nextWeekStart}`);
    }
};
exports.CrewsJobs = CrewsJobs;
__decorate([
    (0, schedule_1.Cron)('5 0 * * 0', { timeZone: dates_2.AGENCY_TZ }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CrewsJobs.prototype, "generateNextWeek", null);
exports.CrewsJobs = CrewsJobs = CrewsJobs_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [crews_service_1.CrewsService])
], CrewsJobs);
//# sourceMappingURL=crews.jobs.js.map