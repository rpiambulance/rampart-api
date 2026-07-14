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
exports.CrewEligibilityService = void 0;
const common_1 = require("@nestjs/common");
const credential_graph_service_1 = require("../credentials/credential-graph.service");
const dates_1 = require("../common/dates");
let CrewEligibilityService = class CrewEligibilityService {
    graph;
    constructor(graph) {
        this.graph = graph;
    }
    async check(input) {
        const { member, position, dateStr, now, knobs, day } = input;
        const held = member.heldKeys;
        if (dateStr < now.dateStr) {
            return { eligible: false, reason: 'Date is in the past' };
        }
        if (!member.dob) {
            return { eligible: false, reason: 'Date of birth not on file' };
        }
        if ((0, dates_1.ageInYears)(member.dob, dateStr) < knobs.minAgeYears) {
            return { eligible: false, reason: `Must be ${knobs.minAgeYears}+` };
        }
        if (day.memberOnThisDate) {
            return { eligible: false, reason: 'Already on this crew' };
        }
        switch (position) {
            case 'CC': {
                if (await this.graph.satisfies(held, 'CC')) {
                    return { eligible: true, reason: '' };
                }
                if (held.has('P_CC')) {
                    if (!knobs.probationaryRequiresTrainer || day.ccTrainerOn) {
                        return { eligible: true, reason: '' };
                    }
                    return { eligible: false, reason: 'No CC-Trainer on' };
                }
                return { eligible: false, reason: 'CC credential required' };
            }
            case 'DRIVER': {
                if (await this.graph.satisfies(held, 'D')) {
                    return { eligible: true, reason: '' };
                }
                if (held.has('P_D')) {
                    if (!knobs.probationaryRequiresTrainer || day.driverTrainerOn) {
                        return { eligible: true, reason: '' };
                    }
                    return { eligible: false, reason: 'No Driver-Trainer on' };
                }
                return { eligible: false, reason: 'Driver credential required' };
            }
            case 'DUTY_SUP': {
                return held.has('DS')
                    ? { eligible: true, reason: '' }
                    : { eligible: false, reason: 'Duty Supervisor appointment required' };
            }
            case 'ATTENDANT':
            case 'OBSERVER': {
                return this.riderEligibility(input);
            }
        }
    }
    async riderEligibility(input) {
        const { member, position, dateStr, now, knobs, day } = input;
        const held = member.heldKeys;
        const open = knobs.riderSignupOpen;
        const nextWeekStart = (0, dates_1.addDays)((0, dates_1.startOfWeek)(now.dateStr), 7);
        if (now.weekday === open.weekday &&
            now.minutes < (0, dates_1.parseHm)(open.time) &&
            dateStr >= nextWeekStart) {
            const hhmm = open.time.replace(':', '');
            return { eligible: false, reason: `Signups open at ${hhmm} Sunday` };
        }
        const credentialed = (await this.graph.satisfies(held, 'P_D')) ||
            (await this.graph.satisfies(held, 'P_CC')) ||
            held.has('DS');
        if (!credentialed) {
            const timesOn = input.memberDatesInRotation.filter((d) => d !== dateStr).length;
            const dayOfUnlocked = now.dateStr === dateStr && now.minutes >= (0, dates_1.parseHm)(knobs.dayOfUnlockTime);
            if (timesOn > 0 && !dayOfUnlocked) {
                return {
                    eligible: false,
                    reason: `Limited to one rider shift per ${knobs.rotationWeeks}-week rotation until ${knobs.dayOfUnlockTime} day-of`,
                };
            }
        }
        const isAttendantCredentialed = await this.graph.satisfies(held, 'A');
        if (position === 'ATTENDANT') {
            if (isAttendantCredentialed || day.observerFilled) {
                return { eligible: true, reason: '' };
            }
            return { eligible: false, reason: 'Attendant credential required' };
        }
        if (!isAttendantCredentialed || day.attendantFilled) {
            return { eligible: true, reason: '' };
        }
        return { eligible: false, reason: 'Please take the attendant slot' };
    }
};
exports.CrewEligibilityService = CrewEligibilityService;
exports.CrewEligibilityService = CrewEligibilityService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [credential_graph_service_1.CredentialGraphService])
], CrewEligibilityService);
//# sourceMappingURL=crew-eligibility.service.js.map