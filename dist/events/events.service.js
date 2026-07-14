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
exports.EventsService = void 0;
const common_1 = require("@nestjs/common");
const audit_service_1 = require("../audit/audit.service");
const credential_graph_service_1 = require("../credentials/credential-graph.service");
const prisma_service_1 = require("../prisma/prisma.service");
let EventsService = class EventsService {
    prisma;
    graph;
    audit;
    constructor(prisma, graph, audit) {
        this.prisma = prisma;
        this.graph = graph;
        this.audit = audit;
    }
    list(opts) {
        return this.prisma.event.findMany({
            where: {
                ...(opts.includeHidden ? {} : { hidden: false }),
                startsAt: {
                    ...(opts.from ? { gte: new Date(opts.from) } : {}),
                    ...(opts.to ? { lte: new Date(opts.to) } : {}),
                },
            },
            include: {
                kind: true,
                positions: true,
                _count: { select: { signups: true } },
            },
            orderBy: { startsAt: 'asc' },
        });
    }
    async get(eventId, viewerId) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: {
                kind: true,
                positions: true,
                signups: {
                    include: {
                        member: { select: { id: true, firstName: true, lastName: true } },
                    },
                },
            },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        let eligiblePositions = [];
        let myPosition;
        if (viewerId) {
            const held = await this.graph.heldKeys(viewerId);
            eligiblePositions = (await Promise.all(event.positions.map(async (p) => {
                const filled = event.signups.filter((s) => s.position === p.position).length;
                if (filled >= p.count)
                    return null;
                if (p.requiredCredentialKey &&
                    !(await this.graph.satisfies(held, p.requiredCredentialKey))) {
                    return null;
                }
                return p.position;
            }))).filter((p) => !!p);
            myPosition = event.signups.find((s) => s.member.id === viewerId)
                ?.position;
        }
        return { ...event, eligiblePositions, myPosition };
    }
    async create(auth, input) {
        const event = await this.prisma.event.create({
            data: {
                title: input.title,
                description: input.description,
                location: input.location,
                startsAt: new Date(input.startsAt),
                endsAt: new Date(input.endsAt),
                kindId: input.kindId,
                attendeeCap: input.attendeeCap ?? null,
                hidden: input.hidden ?? false,
                positions: {
                    create: (input.positions ?? []).map((p) => ({
                        position: p.position,
                        count: p.count,
                        requiredCredentialKey: p.requiredCredentialKey ?? null,
                    })),
                },
            },
            include: { positions: true },
        });
        await this.audit.log(auth, 'events.create', 'Event', event.id);
        return event;
    }
    async update(auth, eventId, input) {
        const existing = await this.prisma.event.findUnique({
            where: { id: eventId },
        });
        if (!existing)
            throw new common_1.NotFoundException('Event not found');
        const event = await this.prisma.event.update({
            where: { id: eventId },
            data: {
                ...(input.title !== undefined ? { title: input.title } : {}),
                ...(input.description !== undefined
                    ? { description: input.description }
                    : {}),
                ...(input.location !== undefined ? { location: input.location } : {}),
                ...(input.startsAt ? { startsAt: new Date(input.startsAt) } : {}),
                ...(input.endsAt ? { endsAt: new Date(input.endsAt) } : {}),
                ...(input.kindId !== undefined ? { kindId: input.kindId } : {}),
                ...(input.attendeeCap !== undefined
                    ? { attendeeCap: input.attendeeCap }
                    : {}),
                ...(input.hidden !== undefined ? { hidden: input.hidden } : {}),
            },
        });
        if (input.positions) {
            await this.prisma.eventPosition.deleteMany({ where: { eventId } });
            await this.prisma.eventPosition.createMany({
                data: input.positions.map((p) => ({
                    eventId,
                    position: p.position,
                    count: p.count,
                    requiredCredentialKey: p.requiredCredentialKey ?? null,
                })),
            });
        }
        await this.audit.log(auth, 'events.update', 'Event', eventId);
        return event;
    }
    async setLocked(auth, eventId, locked) {
        await this.prisma.event.update({ where: { id: eventId }, data: { locked } });
        await this.audit.log(auth, 'events.lock', 'Event', eventId, { locked });
        return { ok: true };
    }
    async remove(auth, eventId) {
        await this.prisma.event.delete({ where: { id: eventId } });
        await this.audit.log(auth, 'events.delete', 'Event', eventId);
        return { ok: true };
    }
    async signup(memberId, eventId, position, opts = {}) {
        const event = await this.prisma.event.findUnique({
            where: { id: eventId },
            include: { positions: true, signups: true },
        });
        if (!event)
            throw new common_1.NotFoundException('Event not found');
        if (event.locked && !opts.override) {
            throw new common_1.ForbiddenException('Signups for this event are locked');
        }
        if (position) {
            const posDef = event.positions.find((p) => p.position === position);
            if (!posDef)
                throw new common_1.BadRequestException('No such position');
            const filled = event.signups.filter((s) => s.position === position && s.memberId !== memberId).length;
            if (filled >= posDef.count) {
                throw new common_1.ConflictException('That position is full');
            }
            if (posDef.requiredCredentialKey && !opts.override) {
                const held = await this.graph.heldKeys(memberId);
                if (!(await this.graph.satisfies(held, posDef.requiredCredentialKey))) {
                    throw new common_1.ForbiddenException(`Requires ${posDef.requiredCredentialKey} credential`);
                }
            }
        }
        else {
            if (event.attendeeCap === -1) {
                throw new common_1.ForbiddenException('This event is closed to signups');
            }
            const attendees = event.signups.filter((s) => !s.position && s.memberId !== memberId).length;
            if (event.attendeeCap != null &&
                event.attendeeCap > 0 &&
                attendees >= event.attendeeCap &&
                !opts.override) {
                throw new common_1.ConflictException('Event is full');
            }
        }
        return this.prisma.eventSignup.upsert({
            where: { eventId_memberId: { eventId, memberId } },
            create: { eventId, memberId, position },
            update: { position },
        });
    }
    async drop(memberId, eventId) {
        await this.prisma.eventSignup.deleteMany({
            where: { eventId, memberId },
        });
        return { ok: true };
    }
    async dropOther(auth, eventId, memberId) {
        await this.prisma.eventSignup.deleteMany({ where: { eventId, memberId } });
        await this.audit.log(auth, 'events.drop-other', 'EventSignup', undefined, {
            eventId,
            memberId,
        });
        return { ok: true };
    }
    listKinds() {
        return this.prisma.eventKind.findMany({ where: { active: true } });
    }
};
exports.EventsService = EventsService;
exports.EventsService = EventsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        credential_graph_service_1.CredentialGraphService,
        audit_service_1.AuditService])
], EventsService);
//# sourceMappingURL=events.service.js.map