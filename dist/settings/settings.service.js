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
exports.SettingsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const DEFAULTS = {
    minAgeYears: 18,
    riderSignupOpen: { weekday: 0, time: '16:00' },
    rotationWeeks: 2,
    dayOfUnlockTime: '12:00',
    probationaryRequiresTrainer: true,
    dropDeadline: { daysBefore: 2, time: '18:00' },
};
let SettingsService = class SettingsService {
    prisma;
    cache;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async scheduling() {
        if (this.cache && Date.now() - this.cache.at < 30_000) {
            return this.cache.knobs;
        }
        const rows = await this.prisma.schedulingSetting.findMany();
        const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
        const knobs = { ...DEFAULTS, ...stored };
        this.cache = { at: Date.now(), knobs };
        return knobs;
    }
    async update(key, value) {
        const updated = await this.prisma.schedulingSetting.upsert({
            where: { key },
            create: { key, value: value },
            update: { value: value },
        });
        this.cache = undefined;
        return updated;
    }
};
exports.SettingsService = SettingsService;
exports.SettingsService = SettingsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], SettingsService);
//# sourceMappingURL=settings.service.js.map