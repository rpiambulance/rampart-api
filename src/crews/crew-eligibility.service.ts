import { Injectable } from '@nestjs/common';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { SchedulingKnobs } from '../settings/settings.service';
import {
  addDays,
  ageInYears,
  NyNow,
  parseHm,
  startOfWeek,
} from '../common/dates';
import { CrewPosition } from '../generated/prisma/enums';

export interface DayContext {
  memberOnThisDate: boolean;
  ccTrainerOn: boolean; // a CC_T holder is on the crew (excluding duty sup slot)
  driverTrainerOn: boolean;
  attendantFilled: boolean;
  observerFilled: boolean;
}

export interface EligibilityInput {
  member: {
    dob: Date | null;
    heldKeys: Set<string>;
    /**
     * Holds schedule:crews:duty-sup — may take the duty supervisor seat
     * without the DS credential (an officer covering, say).
     */
    mayActAsDutySup?: boolean;
  };
  position: CrewPosition;
  dateStr: string;
  now: NyNow;
  knobs: SchedulingKnobs;
  day: DayContext;
  /** Dates in the rotation window (target week + previous rotationWeeks-1 weeks) the member is already on. */
  memberDatesInRotation: string[];
  /** Name of an outstanding blocksScheduling annual training, if any. */
  outstandingTraining?: string | null;
}

export interface Eligibility {
  eligible: boolean;
  reason: string;
}

/**
 * Port of the night-crew rules from the legacy .crews.php determineEligibility(),
 * with credential-flag checks replaced by ladder lookups and hardcoded values
 * replaced by SchedulingSetting knobs. Spec §5.1.
 */
@Injectable()
export class CrewEligibilityService {
  constructor(private readonly graph: CredentialGraphService) {}

  async check(input: EligibilityInput): Promise<Eligibility> {
    const { member, position, dateStr, now, knobs, day } = input;
    const held = member.heldKeys;

    // Global gates
    if (dateStr < now.dateStr) {
      return { eligible: false, reason: 'Date is in the past' };
    }
    if (!member.dob) {
      return { eligible: false, reason: 'Date of birth not on file' };
    }
    if (ageInYears(member.dob, dateStr) < knobs.minAgeYears) {
      return { eligible: false, reason: `Must be ${knobs.minAgeYears}+` };
    }
    if (day.memberOnThisDate) {
      return { eligible: false, reason: 'Already on this crew' };
    }
    if (input.outstandingTraining) {
      return {
        eligible: false,
        reason: `Outstanding required training: ${input.outstandingTraining}`,
      };
    }
    const publicWindowEnd = addDays(
      startOfWeek(now.dateStr),
      7 * knobs.publicWeeks,
    );
    if (dateStr >= publicWindowEnd) {
      return { eligible: false, reason: 'Signups not yet open' };
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
          return { eligible: false, reason: 'No CC-T on this crew' };
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
          return { eligible: false, reason: 'No D-T on this crew' };
        }
        return { eligible: false, reason: 'Driver credential required' };
      }
      case 'DUTY_SUP': {
        return held.has('DS') || member.mayActAsDutySup
          ? { eligible: true, reason: '' }
          : {
              eligible: false,
              reason: 'Duty supervisor appointment required',
            };
      }
      case 'ATTENDANT':
      case 'OBSERVER': {
        return this.riderEligibility(input);
      }
    }
  }

  private async riderEligibility(
    input: EligibilityInput,
  ): Promise<Eligibility> {
    const { member, position, dateStr, now, knobs, day } = input;
    const held = member.heldKeys;

    // Signup-opening rule: on opening day, before the opening time, dates in
    // the following week (or later) are not yet open.
    const open = knobs.riderSignupOpen;
    const nextWeekStart = addDays(startOfWeek(now.dateStr), 7);
    if (
      now.weekday === open.weekday &&
      now.minutes < parseHm(open.time) &&
      dateStr >= nextWeekStart
    ) {
      const hhmm = open.time.replace(':', '');
      return { eligible: false, reason: `Signups open at ${hhmm} Sunday` };
    }

    // Rider fairness: credentialed members (P-D/P-CC or above, or a Duty
    // Supervisor) ride freely; others get one rider shift per rotation window
    // until the day-of unlock time.
    const outranksAll = await this.graph.outranksEverything(held);
    const credentialed =
      (await this.graph.satisfies(held, 'P_D')) ||
      (await this.graph.satisfies(held, 'P_CC')) ||
      outranksAll;
    if (!credentialed) {
      const timesOn = input.memberDatesInRotation.filter(
        (d) => d !== dateStr,
      ).length;
      const dayOfUnlocked =
        now.dateStr === dateStr &&
        now.minutes >= parseHm(knobs.dayOfUnlockTime);
      if (timesOn > 0 && !dayOfUnlocked) {
        return {
          eligible: false,
          reason: `Limited to one rider shift per ${knobs.rotationWeeks}-week rotation until ${knobs.dayOfUnlockTime} day-of`,
        };
      }
    }

    // The two rider seats are the same seat twice. Nothing distinguishes
    // them — no credential, no different duty — so the only rule left is
    // that they fill in order: while the first is empty the second is not
    // offered. Both showing "sign up" at once produces a crew with a gap in
    // the middle, and a schedule that reads as though somebody skipped a
    // seat rather than as one with two places left.
    //
    // Previously the first seat asked for an attendant credential and the
    // second steered credentialed attendants away from it. That steered
    // rather than guaranteed anything — once either seat was taken the other
    // opened to anyone — while making two seats labeled "Rider" behave
    // differently for reasons the schedule never showed.
    if (position === 'OBSERVER' && !day.attendantFilled) {
      return { eligible: false, reason: 'Take the first rider seat' };
    }
    return { eligible: true, reason: '' };
  }
}
