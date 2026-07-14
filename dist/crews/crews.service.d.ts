import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { PrismaService } from '../prisma/prisma.service';
import { SettingsService } from '../settings/settings.service';
import { CrewPosition } from '../generated/prisma/enums';
import { CrewEligibilityService } from './crew-eligibility.service';
export declare const CREW_POSITIONS: CrewPosition[];
export declare class CrewsService {
    private readonly prisma;
    private readonly settings;
    private readonly graph;
    private readonly eligibility;
    private readonly audit;
    constructor(prisma: PrismaService, settings: SettingsService, graph: CredentialGraphService, eligibility: CrewEligibilityService, audit: AuditService);
    getWeeks(memberId: number, viewDate?: string): Promise<{
        weekStart: string;
        currentWeek: Record<string, unknown>[];
        nextWeek: Record<string, unknown>[];
    }>;
    signup(memberId: number, crewId: number, position: CrewPosition): Promise<{
        ok: boolean;
    }>;
    drop(memberId: number, crewId: number, position: CrewPosition): Promise<{
        ok: boolean;
    }>;
    assign(auth: AuthContext, crewId: number, position: CrewPosition, target: {
        memberId?: number | null;
        placeholder?: string | null;
    }): Promise<{
        ok: boolean;
    }>;
    ensureCrewsExist(fromDate: string, days: number): Promise<void>;
    private loadWindow;
    private dayContext;
    private memberDatesInRotation;
}
