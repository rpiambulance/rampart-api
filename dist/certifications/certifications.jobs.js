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
var CertificationsJobs_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.CertificationsJobs = void 0;
const common_1 = require("@nestjs/common");
const schedule_1 = require("@nestjs/schedule");
const dates_1 = require("../common/dates");
const notifications_service_1 = require("../notifications/notifications.service");
const prisma_service_1 = require("../prisma/prisma.service");
const certifications_service_1 = require("./certifications.service");
const REMINDER_DAYS = [60, 30, 7];
let CertificationsJobs = CertificationsJobs_1 = class CertificationsJobs {
    prisma;
    certs;
    notifications;
    logger = new common_1.Logger(CertificationsJobs_1.name);
    constructor(prisma, certs, notifications) {
        this.prisma = prisma;
        this.certs = certs;
        this.notifications = notifications;
    }
    async dailySweep() {
        const { changed } = await this.certs.recomputeSuspensions();
        this.logger.log(`Suspension recompute: ${changed} credential(s) changed`);
        for (const days of REMINDER_DAYS) {
            const target = new Date();
            target.setDate(target.getDate() + days);
            const start = new Date(target.toISOString().slice(0, 10));
            const end = new Date(start.getTime() + 86_400_000);
            const expiring = await this.prisma.memberCertification.findMany({
                where: {
                    status: 'VERIFIED',
                    expiresAt: { gte: start, lt: end },
                    member: { active: true },
                },
                include: { type: true, member: { select: { id: true } } },
            });
            for (const cert of expiring) {
                await this.notifications.notifyMember(cert.member.id, `${cert.type.name} expires in ${days} days`, `Your ${cert.type.name} expires on ${cert.expiresAt.toISOString().slice(0, 10)}. Upload your renewal to keep your credentials active.`);
            }
        }
    }
};
exports.CertificationsJobs = CertificationsJobs;
__decorate([
    (0, schedule_1.Cron)('0 7 * * *', { timeZone: dates_1.AGENCY_TZ }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], CertificationsJobs.prototype, "dailySweep", null);
exports.CertificationsJobs = CertificationsJobs = CertificationsJobs_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        certifications_service_1.CertificationsService,
        notifications_service_1.NotificationsService])
], CertificationsJobs);
//# sourceMappingURL=certifications.jobs.js.map