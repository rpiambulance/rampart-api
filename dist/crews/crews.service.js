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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CrewsService = exports.CREW_POSITIONS = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const credential_graph_service_1 = require("../credentials/credential-graph.service");
const dates_1 = require("../common/dates");
const catalog_1 = require("../permissions/catalog");
const prisma_service_1 = require("../prisma/prisma.service");
const settings_service_1 = require("../settings/settings.service");
const crew_eligibility_service_1 = require("./crew-eligibility.service");
exports.CREW_POSITIONS = [
    'CC',
    'DRIVER',
    'ATTENDANT',
    'OBSERVER',
    'DUTY_SUP',
];
const WEEKDAY_NAMES = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
let CrewsService = class CrewsService {
    prisma;
    settings;
    graph;
    eligibility;
    audit;
    constructor(prisma, settings, graph, eligibility, audit) {
        this.prisma = prisma;
        this.settings = settings;
        this.graph = graph;
        this.eligibility = eligibility;
        this.audit = audit;
    }
    async getWeeks(memberId, viewDate) {
        const now = (0, dates_1.nyNow)();
        const knobs = await this.settings.scheduling();
        const weekStart = (0, dates_1.startOfWeek)(viewDate ?? now.dateStr);
        await this.ensureCrewsExist(weekStart, 14);
        const windowStart = (0, dates_1.addDays)(weekStart, -7 * (knobs.rotationWeeks - 1));
        const crews = await this.loadWindow(windowStart, (0, dates_1.addDays)(weekStart, 13));
        const byDate = new Map(crews.map((c) => [(0, dates_1.fromDbDate)(c.date), c]));
        const member = await this.prisma.member.findUniqueOrThrow({
            where: { id: memberId },
            select: { dob: true },
        });
        const heldKeys = await this.graph.heldKeys(memberId);
        const weeks = [[], []];
        for (let i = 0; i < 14; i++) {
            const dateStr = (0, dates_1.addDays)(weekStart, i);
            const crew = byDate.get(dateStr);
            if (!crew)
                continue;
            const day = this.dayContext(crew, memberId);
            const rotationDates = this.memberDatesInRotation(crews, memberId, dateStr, knobs.rotationWeeks);
            const slots = {};
            for (const position of exports.CREW_POSITIONS) {
                const slot = crew.slots.find((s) => s.position === position);
                const view = { position, vacant: true };
                if (slot?.member) {
                    view.vacant = false;
                    view.member = {
                        id: slot.member.id,
                        name: `${slot.member.firstName.charAt(0)}. ${slot.member.lastName}`,
                    };
                    if (slot.member.id === memberId) {
                        view.canDrop = (0, dates_1.isBeforeDeadline)(now, dateStr, knobs.dropDeadline.daysBefore, knobs.dropDeadline.time);
                    }
                }
                else if (slot?.placeholder) {
                    view.vacant = false;
                    view.placeholder = slot.placeholder;
                }
                else {
                    const result = await this.eligibility.check({
                        member: { dob: member.dob, heldKeys },
                        position,
                        dateStr,
                        now,
                        knobs,
                        day,
                        memberDatesInRotation: rotationDates,
                    });
                    view.eligible = result.eligible;
                    view.reason = result.reason;
                }
                slots[position] = view;
            }
            weeks[i < 7 ? 0 : 1].push({
                crewId: crew.id,
                date: dateStr,
                weekday: WEEKDAY_NAMES[(0, dates_1.weekdayOf)(dateStr)],
                slots,
            });
        }
        return { weekStart, currentWeek: weeks[0], nextWeek: weeks[1] };
    }
    async signup(memberId, crewId, position) {
        const crew = await this.prisma.crew.findUnique({
            where: { id: crewId },
            include: {
                slots: {
                    include: {
                        member: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                credentials: {
                                    where: { status: 'ACTIVE' },
                                    include: { type: { select: { key: true } } },
                                },
                            },
                        },
                    },
                },
            },
        });
        if (!crew)
            throw new common_1.NotFoundException('Crew not found');
        const dateStr = (0, dates_1.fromDbDate)(crew.date);
        const now = (0, dates_1.nyNow)();
        const knobs = await this.settings.scheduling();
        const member = await this.prisma.member.findUniqueOrThrow({
            where: { id: memberId },
            select: { dob: true },
        });
        const heldKeys = await this.graph.heldKeys(memberId);
        const windowStart = (0, dates_1.addDays)((0, dates_1.startOfWeek)(dateStr), -7 * (knobs.rotationWeeks - 1));
        const windowCrews = await this.loadWindow(windowStart, (0, dates_1.addDays)((0, dates_1.startOfWeek)(dateStr), 6));
        const result = await this.eligibility.check({
            member: { dob: member.dob, heldKeys },
            position,
            dateStr,
            now,
            knobs,
            day: this.dayContext(crew, memberId),
            memberDatesInRotation: this.memberDatesInRotation(windowCrews, memberId, dateStr, knobs.rotationWeeks),
        });
        if (!result.eligible) {
            throw new common_1.ForbiddenException(result.reason || 'Not eligible');
        }
        const updated = await this.prisma.crewSlot.updateMany({
            where: { crewId, position, memberId: null, placeholder: null },
            data: { memberId },
        });
        if (updated.count === 0) {
            throw new common_1.ConflictException('That spot was just taken');
        }
        return { ok: true };
    }
    async drop(memberId, crewId, position) {
        const slot = await this.prisma.crewSlot.findUnique({
            where: { crewId_position: { crewId, position } },
            include: { crew: true },
        });
        if (!slot || slot.memberId !== memberId) {
            throw new common_1.ForbiddenException('You are not in that spot');
        }
        const knobs = await this.settings.scheduling();
        const dateStr = (0, dates_1.fromDbDate)(slot.crew.date);
        if (!(0, dates_1.isBeforeDeadline)((0, dates_1.nyNow)(), dateStr, knobs.dropDeadline.daysBefore, knobs.dropDeadline.time)) {
            throw new common_1.ForbiddenException(`Drops close at ${knobs.dropDeadline.time}, ${knobs.dropDeadline.daysBefore} days before the shift. Contact the scheduling coordinator.`);
        }
        await this.prisma.crewSlot.update({
            where: { id: slot.id },
            data: { memberId: null },
        });
        return { ok: true };
    }
    async assign(auth, crewId, position, target) {
        const slot = await this.prisma.crewSlot.findUnique({
            where: { crewId_position: { crewId, position } },
        });
        if (!slot)
            throw new common_1.NotFoundException('Slot not found');
        const before = { memberId: slot.memberId, placeholder: slot.placeholder };
        await this.prisma.crewSlot.update({
            where: { id: slot.id },
            data: {
                memberId: target.memberId ?? null,
                placeholder: target.placeholder ?? null,
            },
        });
        await this.audit.log(auth, catalog_1.PERMISSIONS.SCHEDULE_CREWS_ASSIGN, 'CrewSlot', slot.id, { before, after: target, crewId, position });
        return { ok: true };
    }
    async ensureCrewsExist(fromDate, days) {
        const existing = await this.prisma.crew.findMany({
            where: {
                date: { gte: (0, dates_1.toDbDate)(fromDate), lt: (0, dates_1.toDbDate)((0, dates_1.addDays)(fromDate, days)) },
            },
            select: { date: true },
        });
        const have = new Set(existing.map((c) => (0, dates_1.fromDbDate)(c.date)));
        const template = await this.prisma.defaultCrewTemplate.findMany();
        for (let i = 0; i < days; i++) {
            const dateStr = (0, dates_1.addDays)(fromDate, i);
            if (have.has(dateStr))
                continue;
            const weekday = (0, dates_1.weekdayOf)(dateStr);
            await this.prisma.crew.create({
                data: {
                    date: (0, dates_1.toDbDate)(dateStr),
                    slots: {
                        create: exports.CREW_POSITIONS.map((position) => {
                            const dflt = template.find((t) => t.weekday === weekday && t.position === position);
                            return {
                                position,
                                memberId: dflt?.memberId ?? null,
                                placeholder: dflt?.placeholder ?? null,
                            };
                        }),
                    },
                },
            });
        }
    }
    loadWindow(fromDate, toDate) {
        return this.prisma.crew.findMany({
            where: { date: { gte: (0, dates_1.toDbDate)(fromDate), lte: (0, dates_1.toDbDate)(toDate) } },
            include: {
                slots: {
                    include: {
                        member: {
                            select: {
                                id: true,
                                firstName: true,
                                lastName: true,
                                credentials: {
                                    where: { status: 'ACTIVE' },
                                    include: { type: { select: { key: true } } },
                                },
                            },
                        },
                    },
                },
            },
            orderBy: { date: 'asc' },
        });
    }
    dayContext(crew, memberId) {
        let memberOnThisDate = false;
        let ccTrainerOn = false;
        let driverTrainerOn = false;
        let attendantFilled = false;
        let observerFilled = false;
        for (const slot of crew.slots) {
            if (slot.memberId === memberId)
                memberOnThisDate = true;
            if (slot.position === 'ATTENDANT' && (slot.memberId || slot.placeholder))
                attendantFilled = true;
            if (slot.position === 'OBSERVER' && (slot.memberId || slot.placeholder))
                observerFilled = true;
            if (slot.position === 'DUTY_SUP')
                continue;
            const keys = new Set(slot.member?.credentials?.map((c) => c.type.key) ?? []);
            if (keys.has('CC_T'))
                ccTrainerOn = true;
            if (keys.has('D_T'))
                driverTrainerOn = true;
        }
        return {
            memberOnThisDate,
            ccTrainerOn,
            driverTrainerOn,
            attendantFilled,
            observerFilled,
        };
    }
    memberDatesInRotation(crews, memberId, targetDate, rotationWeeks) {
        const windowStart = (0, dates_1.addDays)((0, dates_1.startOfWeek)(targetDate), -7 * (rotationWeeks - 1));
        const windowEnd = (0, dates_1.addDays)((0, dates_1.startOfWeek)(targetDate), 6);
        return crews
            .filter((c) => {
            const d = (0, dates_1.fromDbDate)(c.date);
            return (d >= windowStart &&
                d <= windowEnd &&
                c.slots.some((s) => s.memberId === memberId && s.position !== 'DUTY_SUP'));
        })
            .map((c) => (0, dates_1.fromDbDate)(c.date));
    }
};
exports.CrewsService = CrewsService;
exports.CrewsService = CrewsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        settings_service_1.SettingsService,
        credential_graph_service_1.CredentialGraphService,
        crew_eligibility_service_1.CrewEligibilityService,
        audit_service_1.AuditService])
], CrewsService);
//# sourceMappingURL=crews.service.js.map