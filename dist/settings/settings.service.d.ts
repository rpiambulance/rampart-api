import { PrismaService } from '../prisma/prisma.service';
export interface SchedulingKnobs {
    minAgeYears: number;
    riderSignupOpen: {
        weekday: number;
        time: string;
    };
    rotationWeeks: number;
    dayOfUnlockTime: string;
    probationaryRequiresTrainer: boolean;
    dropDeadline: {
        daysBefore: number;
        time: string;
    };
}
export declare class SettingsService {
    private readonly prisma;
    private cache?;
    constructor(prisma: PrismaService);
    scheduling(): Promise<SchedulingKnobs>;
    update(key: keyof SchedulingKnobs, value: unknown): Promise<{
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
