import type { AuthContext } from '../auth/auth-context';
import { PromotionsService } from './promotions.service';
declare class VoteDto {
    vote: 'APPROVE' | 'DENY';
    notes?: string;
}
declare class ProxyDto {
    proxyId: number;
}
declare class CaptainDto {
    approved: boolean;
    notes?: string;
}
export declare class PromotionsController {
    private readonly promotions;
    constructor(promotions: PromotionsService);
    eligible(auth: AuthContext): Promise<{
        credentialTypeId: number;
        key: string;
        name: string;
        checklist: Awaited<ReturnType<import("../credentials/credentials.service").CredentialsService["checklist"]>>;
        requestable: boolean;
    }[]>;
    create(auth: AuthContext, body: {
        credentialTypeId: number;
    }): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        status: import("../generated/prisma/enums").PromoStatus;
        credentialTypeId: number;
        resolvedAt: Date | null;
    }>;
    list(status?: string): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        member: {
            id: number;
            firstName: string;
            lastName: string;
        };
        credentialType: {
            id: number;
            active: boolean;
            name: string;
            key: string;
            grantMethod: import("../generated/prisma/enums").GrantMethod;
            isAddOn: boolean;
        };
        votes: {
            id: number;
            notes: string | null;
            requestId: number;
            voterId: number;
            proxyForId: number | null;
            vote: import("../generated/prisma/enums").VoteChoice;
            castAt: Date;
        }[];
        proxies: {
            requestId: number;
            principalId: number;
            proxyId: number;
        }[];
        captainApproval: {
            notes: string | null;
            requestId: number;
            approvedById: number;
            approved: boolean;
            decidedAt: Date;
        } | null;
    } & {
        id: number;
        createdAt: Date;
        memberId: number;
        status: import("../generated/prisma/enums").PromoStatus;
        credentialTypeId: number;
        resolvedAt: Date | null;
    })[]>;
    review(id: number): Promise<{
        checklist: import("../credentials/credentials.service").ChecklistItem[];
        evaluations: ({
            template: {
                id: number;
                name: string;
            };
            evaluator: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            status: import("../generated/prisma/enums").EvalStatus;
            templateId: number;
            evaluatorId: number;
            subjectId: number;
            shiftDate: Date | null;
            notes: string | null;
            signedByEvaluator: Date | null;
            signedBySubject: Date | null;
        })[];
        committee: number[];
        member: {
            id: number;
            firstName: string;
            lastName: string;
        };
        credentialType: {
            id: number;
            active: boolean;
            name: string;
            key: string;
            grantMethod: import("../generated/prisma/enums").GrantMethod;
            isAddOn: boolean;
        };
        votes: ({
            voter: {
                id: number;
                firstName: string;
                lastName: string;
            };
            proxyFor: {
                id: number;
                firstName: string;
                lastName: string;
            } | null;
        } & {
            id: number;
            notes: string | null;
            requestId: number;
            voterId: number;
            proxyForId: number | null;
            vote: import("../generated/prisma/enums").VoteChoice;
            castAt: Date;
        })[];
        proxies: ({
            principal: {
                id: number;
                firstName: string;
                lastName: string;
            };
            proxy: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            requestId: number;
            principalId: number;
            proxyId: number;
        })[];
        captainApproval: {
            notes: string | null;
            requestId: number;
            approvedById: number;
            approved: boolean;
            decidedAt: Date;
        } | null;
        id: number;
        createdAt: Date;
        memberId: number;
        status: import("../generated/prisma/enums").PromoStatus;
        credentialTypeId: number;
        resolvedAt: Date | null;
    }>;
    proxy(auth: AuthContext, id: number, body: ProxyDto): Promise<{
        requestId: number;
        principalId: number;
        proxyId: number;
    }>;
    vote(auth: AuthContext, id: number, body: VoteDto): Promise<{
        status: string;
        votesRemaining?: undefined;
    } | {
        status: string;
        votesRemaining: number;
    }>;
    captain(auth: AuthContext, id: number, body: CaptainDto): Promise<{
        ok: boolean;
        status: string;
    }>;
    withdraw(auth: AuthContext, id: number): Promise<{
        ok: boolean;
    }>;
}
export {};
