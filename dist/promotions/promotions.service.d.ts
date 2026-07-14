import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { CredentialsService } from '../credentials/credentials.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class PromotionsService {
    private readonly prisma;
    private readonly graph;
    private readonly credentials;
    private readonly audit;
    private readonly notifications;
    constructor(prisma: PrismaService, graph: CredentialGraphService, credentials: CredentialsService, audit: AuditService, notifications: NotificationsService);
    trainingCommittee(): Promise<number[]>;
    eligibleRequests(memberId: number): Promise<{
        credentialTypeId: number;
        key: string;
        name: string;
        checklist: Awaited<ReturnType<CredentialsService["checklist"]>>;
        requestable: boolean;
    }[]>;
    createRequest(memberId: number, credentialTypeId: number): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        status: import("../generated/prisma/enums").PromoStatus;
        credentialTypeId: number;
        resolvedAt: Date | null;
    }>;
    listRequests(status?: string): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    getReview(requestId: number): Promise<{
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
    appointProxy(principalId: number, requestId: number, proxyId: number): Promise<{
        requestId: number;
        principalId: number;
        proxyId: number;
    }>;
    vote(voterId: number, requestId: number, choice: 'APPROVE' | 'DENY', notes?: string): Promise<{
        status: string;
        votesRemaining?: undefined;
    } | {
        status: string;
        votesRemaining: number;
    }>;
    private tally;
    captainDecision(auth: AuthContext & {
        kind: 'member';
    }, requestId: number, approved: boolean, notes?: string): Promise<{
        ok: boolean;
        status: string;
    }>;
    withdraw(memberId: number, requestId: number): Promise<{
        ok: boolean;
    }>;
}
