import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
declare class FuelEntryDto {
    loggedAt: string;
    vehicle: string;
    amount: number;
    mileage: number;
}
declare class RadioDto {
    number: string;
    model?: string;
    serial?: string;
    accessories?: Record<string, boolean>;
}
export declare class OpsController {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    fuelEntries(limit?: string): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        member: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        memberId: number;
        loggedAt: Date;
        vehicle: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        mileage: number;
    })[]>;
    addFuel(auth: AuthContext, body: FuelEntryDto): import("../generated/prisma/models").Prisma__FuelLogEntryClient<{
        id: number;
        memberId: number;
        loggedAt: Date;
        vehicle: string;
        amount: import("@prisma/client-runtime-utils").Decimal;
        mileage: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    radios(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        assignments: ({
            member: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            memberId: number;
            issuedAt: Date;
            radioId: number;
            returnedAt: Date | null;
        })[];
    } & {
        number: string;
        id: number;
        model: string | null;
        serial: string | null;
        accessories: import("@prisma/client/runtime/client").JsonValue | null;
        retired: boolean;
    })[]>;
    addRadio(body: RadioDto): import("../generated/prisma/models").Prisma__RadioClient<{
        number: string;
        id: number;
        model: string | null;
        serial: string | null;
        accessories: import("@prisma/client/runtime/client").JsonValue | null;
        retired: boolean;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    issue(auth: AuthContext, radioId: number, memberId: number): Promise<{
        id: number;
        memberId: number;
        issuedAt: Date;
        radioId: number;
        returnedAt: Date | null;
    }>;
    returnRadio(auth: AuthContext, radioId: number): Promise<{
        ok: boolean;
    }>;
    auditLog(limit?: string): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: bigint;
        actorType: import("../generated/prisma/enums").ActorType;
        actorId: number | null;
        action: string;
        entity: string;
        entityId: string | null;
        diff: import("@prisma/client/runtime/client").JsonValue | null;
        at: Date;
    }[]>;
}
export {};
