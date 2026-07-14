import type { AuthContext } from '../auth/auth-context';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { CrewPosition } from '../generated/prisma/enums';
import { CrewsService } from './crews.service';
declare class AssignDto {
    memberId?: number | null;
    placeholder?: string | null;
}
declare class DefaultSlotDto {
    weekday: number;
    position: CrewPosition;
    memberId?: number | null;
    placeholder?: string | null;
}
export declare class CrewsController {
    private readonly crews;
    private readonly settings;
    private readonly prisma;
    constructor(crews: CrewsService, settings: SettingsService, prisma: PrismaService);
    getWeeks(auth: AuthContext, viewDate?: string): Promise<{
        weekStart: string;
        currentWeek: Record<string, unknown>[];
        nextWeek: Record<string, unknown>[];
    }>;
    signup(auth: AuthContext, crewId: number, position: CrewPosition): Promise<{
        ok: boolean;
    }>;
    drop(auth: AuthContext, crewId: number, position: CrewPosition): Promise<{
        ok: boolean;
    }>;
    assign(auth: AuthContext, crewId: number, position: CrewPosition, body: AssignDto): Promise<{
        ok: boolean;
    }>;
    getDefaults(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        memberId: number | null;
        position: CrewPosition;
        placeholder: string | null;
        weekday: number;
    }[]>;
    putDefault(body: DefaultSlotDto): Promise<{
        id: number;
        memberId: number | null;
        position: CrewPosition;
        placeholder: string | null;
        weekday: number;
    }>;
    getSettings(): Promise<import("../settings/settings.service").SchedulingKnobs>;
    putSetting(key: string, body: {
        value: unknown;
    }): Promise<{
        key: string;
        value: import("@prisma/client/runtime/client").JsonValue;
    }>;
}
export {};
