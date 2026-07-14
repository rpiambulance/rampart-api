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
exports.CalendarController = void 0;
const common_1 = require("@nestjs/common");
const crypto_1 = require("crypto");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const public_decorator_1 = require("../auth/public.decorator");
const dates_1 = require("../common/dates");
const prisma_service_1 = require("../prisma/prisma.service");
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
function icsEscape(text) {
    return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}
function fmtUtc(date) {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}
let CalendarController = class CalendarController {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    listTokens(auth) {
        return this.prisma.icsToken.findMany({
            where: { memberId: requireMember(auth) },
            select: { id: true, token: true, scope: true, createdAt: true },
        });
    }
    async createToken(auth, scope) {
        const memberId = requireMember(auth);
        if (!['MY_SCHEDULE', 'MY_SCHEDULE_AND_ALL_EVENTS'].includes(scope)) {
            throw new common_1.NotFoundException('Unknown scope');
        }
        await this.prisma.icsToken.deleteMany({
            where: { memberId, scope: scope },
        });
        return this.prisma.icsToken.create({
            data: {
                memberId,
                scope: scope,
                token: (0, crypto_1.randomBytes)(24).toString('hex'),
            },
        });
    }
    async deleteToken(auth, id) {
        await this.prisma.icsToken.deleteMany({
            where: { id: Number(id), memberId: requireMember(auth) },
        });
        return { ok: true };
    }
    async feed(token) {
        const icsToken = await this.prisma.icsToken.findUnique({
            where: { token },
            include: { member: { select: { id: true, firstName: true } } },
        });
        if (!icsToken)
            throw new common_1.NotFoundException();
        const memberId = icsToken.member.id;
        const lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//RPI Ambulance//Rampart//EN',
            'CALSCALE:GREGORIAN',
            `X-WR-CALNAME:RPIA — ${icsToken.scope === 'MY_SCHEDULE' ? 'My Schedule' : 'My Schedule + Events'}`,
        ];
        const slots = await this.prisma.crewSlot.findMany({
            where: { memberId },
            include: { crew: true },
        });
        for (const slot of slots) {
            const date = (0, dates_1.fromDbDate)(slot.crew.date).replace(/-/g, '');
            lines.push('BEGIN:VEVENT', `UID:crew-${slot.crew.id}-${slot.position}@rampart.rpiambulance.com`, `DTSTART;VALUE=DATE:${date}`, `SUMMARY:${icsEscape(`Night Crew — ${slot.position}`)}`, 'END:VEVENT');
        }
        const events = icsToken.scope === 'MY_SCHEDULE'
            ? await this.prisma.event.findMany({
                where: { signups: { some: { memberId } }, hidden: false },
            })
            : await this.prisma.event.findMany({ where: { hidden: false } });
        for (const event of events) {
            lines.push('BEGIN:VEVENT', `UID:event-${event.id}@rampart.rpiambulance.com`, `DTSTART:${fmtUtc(event.startsAt)}`, `DTEND:${fmtUtc(event.endsAt)}`, `SUMMARY:${icsEscape(event.title)}`, ...(event.location ? [`LOCATION:${icsEscape(event.location)}`] : []), 'END:VEVENT');
        }
        lines.push('END:VCALENDAR');
        return lines.join('\r\n');
    }
};
exports.CalendarController = CalendarController;
__decorate([
    (0, common_1.Get)('tokens'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], CalendarController.prototype, "listTokens", null);
__decorate([
    (0, common_1.Post)('tokens/:scope'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('scope')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "createToken", null);
__decorate([
    (0, common_1.Delete)('tokens/:id'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "deleteToken", null);
__decorate([
    (0, public_decorator_1.Public)(),
    (0, common_1.Get)('feed/:token.ics'),
    (0, common_1.Header)('Content-Type', 'text/calendar; charset=utf-8'),
    __param(0, (0, common_1.Param)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], CalendarController.prototype, "feed", null);
exports.CalendarController = CalendarController = __decorate([
    (0, common_1.Controller)({ path: 'calendar', version: '1' }),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CalendarController);
//# sourceMappingURL=calendar.controller.js.map