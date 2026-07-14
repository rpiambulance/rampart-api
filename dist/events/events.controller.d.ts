import type { AuthContext } from '../auth/auth-context';
import { EventsService } from './events.service';
declare class PositionDto {
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
}
declare class CreateEventDto {
    title: string;
    description?: string;
    location?: string;
    startsAt: string;
    endsAt: string;
    kindId: number;
    attendeeCap?: number | null;
    hidden?: boolean;
    positions?: PositionDto[];
}
declare class UpdateEventDto extends CreateEventDto {
}
declare class SignupDto {
    position?: string | null;
}
export declare class EventsController {
    private readonly events;
    constructor(events: EventsService);
    list(from?: string, to?: string): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    kinds(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        active: boolean;
        name: string;
        defaults: import("@prisma/client/runtime/client").JsonValue | null;
    }[]>;
    get(auth: AuthContext, id: number): Promise<{
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
    create(auth: AuthContext, body: CreateEventDto): Promise<{
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
    update(auth: AuthContext, id: number, body: UpdateEventDto): Promise<{
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
    lock(auth: AuthContext, id: number, body: {
        locked: boolean;
    }): Promise<{
        ok: boolean;
    }>;
    remove(auth: AuthContext, id: number): Promise<{
        ok: boolean;
    }>;
    signup(auth: AuthContext, id: number, body: SignupDto): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        position: string | null;
        eventId: number;
    }>;
    drop(auth: AuthContext, id: number): Promise<{
        ok: boolean;
    }>;
    signupOther(auth: AuthContext, id: number, memberId: number, body: SignupDto): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        position: string | null;
        eventId: number;
    }>;
    dropOther(auth: AuthContext, id: number, memberId: number): Promise<{
        ok: boolean;
    }>;
}
export {};
