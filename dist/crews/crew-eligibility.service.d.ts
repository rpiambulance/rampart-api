import { CredentialGraphService } from '../credentials/credential-graph.service';
import { SchedulingKnobs } from '../settings/settings.service';
import { NyNow } from '../common/dates';
import { CrewPosition } from '../generated/prisma/enums';
export interface DayContext {
    memberOnThisDate: boolean;
    ccTrainerOn: boolean;
    driverTrainerOn: boolean;
    attendantFilled: boolean;
    observerFilled: boolean;
}
export interface EligibilityInput {
    member: {
        dob: Date | null;
        heldKeys: Set<string>;
    };
    position: CrewPosition;
    dateStr: string;
    now: NyNow;
    knobs: SchedulingKnobs;
    day: DayContext;
    memberDatesInRotation: string[];
}
export interface Eligibility {
    eligible: boolean;
    reason: string;
}
export declare class CrewEligibilityService {
    private readonly graph;
    constructor(graph: CredentialGraphService);
    check(input: EligibilityInput): Promise<Eligibility>;
    private riderEligibility;
}
