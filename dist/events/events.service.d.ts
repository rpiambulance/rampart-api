import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { PrismaService } from '../prisma/prisma.service';
export interface EventPositionInput {
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
}
export interface EventInput {
    title: string;
    description?: string;
    location?: string;
    startsAt: string;
    endsAt: string;
    kindId: number;
    attendeeCap?: number | null;
    hidden?: boolean;
    positions?: EventPositionInput[];
}
export declare class EventsService {
    private readonly prisma;
    private readonly graph;
    private readonly audit;
    constructor(prisma: PrismaService, graph: CredentialGraphService, audit: AuditService);
    list(opts: {
        from?: string;
        to?: string;
        includeHidden?: boolean;
    }): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        kind: {
            id: number;
            active: boolean;
            name: string;
            defaults: import("@prisma/client/runtime/client").JsonValue | null;
        };
        _count: {
            signups: number;
        };
        positions: {
            id: number;
            count: number;
            position: string;
            eventId: number;
            requiredCredentialKey: string | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        location: string | null;
        startsAt: Date;
        endsAt: Date;
        kindId: number;
        locked: boolean;
        attendeeCap: number | null;
        hidden: boolean;
        gcalEventId: string | null;
    })[]>;
    get(eventId: number, viewerId?: number): Promise<{
        eligiblePositions: string[];
        myPosition: string | null | undefined;
        kind: {
            id: number;
            active: boolean;
            name: string;
            defaults: import("@prisma/client/runtime/client").JsonValue | null;
        };
        positions: {
            id: number;
            count: number;
            position: string;
            eventId: number;
            requiredCredentialKey: string | null;
        }[];
        signups: ({
            member: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            memberId: number;
            position: string | null;
            eventId: number;
        })[];
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        location: string | null;
        startsAt: Date;
        endsAt: Date;
        kindId: number;
        locked: boolean;
        attendeeCap: number | null;
        hidden: boolean;
        gcalEventId: string | null;
    }>;
    create(auth: AuthContext, input: EventInput): Promise<{
        positions: {
            id: number;
            count: number;
            position: string;
            eventId: number;
            requiredCredentialKey: string | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        location: string | null;
        startsAt: Date;
        endsAt: Date;
        kindId: number;
        locked: boolean;
        attendeeCap: number | null;
        hidden: boolean;
        gcalEventId: string | null;
    }>;
    update(auth: AuthContext, eventId: number, input: Partial<EventInput>): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        title: string;
        location: string | null;
        startsAt: Date;
        endsAt: Date;
        kindId: number;
        locked: boolean;
        attendeeCap: number | null;
        hidden: boolean;
        gcalEventId: string | null;
    }>;
    setLocked(auth: AuthContext, eventId: number, locked: boolean): Promise<{
        ok: boolean;
    }>;
    remove(auth: AuthContext, eventId: number): Promise<{
        ok: boolean;
    }>;
    signup(memberId: number, eventId: number, position: string | null, opts?: {
        override?: boolean;
    }): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        position: string | null;
        eventId: number;
    }>;
    drop(memberId: number, eventId: number): Promise<{
        ok: boolean;
    }>;
    dropOther(auth: AuthContext, eventId: number, memberId: number): Promise<{
        ok: boolean;
    }>;
    listKinds(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        active: boolean;
        name: string;
        defaults: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
}
