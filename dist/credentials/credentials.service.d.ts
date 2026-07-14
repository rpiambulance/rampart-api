import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CredentialGraphService } from './credential-graph.service';
export declare const SDS_TITLE = "Senior Duty Supervisor";
export interface ChecklistItem {
    kind: 'CERTIFICATION' | 'EVALUATION_COUNT' | 'CLASS' | 'PREREQUISITE';
    label: string;
    satisfied: boolean;
    detail?: string;
}
export declare class CredentialsService {
    private readonly prisma;
    private readonly graph;
    private readonly audit;
    private readonly notifications;
    constructor(prisma: PrismaService, graph: CredentialGraphService, audit: AuditService, notifications: NotificationsService);
    listTypes(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        prerequisites: ({
            requiresType: {
                key: string;
            };
        } & {
            credentialTypeId: number;
            requiresTypeId: number;
        })[];
        requirements: ({
            certificationType: {
                id: number;
                active: boolean;
                name: string;
                abbreviation: string;
                issuingOrg: string | null;
                defaultValidityMonths: number | null;
            } | null;
            evalTemplate: {
                id: number;
                name: string;
            } | null;
            class: {
                id: number;
                name: string;
            } | null;
        } & {
            id: number;
            credentialTypeId: number;
            kind: import("../generated/prisma/enums").RequirementKind;
            certificationTypeId: number | null;
            evalTemplateId: number | null;
            count: number | null;
            classId: number | null;
        })[];
    } & {
        id: number;
        active: boolean;
        name: string;
        key: string;
        grantMethod: import("../generated/prisma/enums").GrantMethod;
        isAddOn: boolean;
    })[]>;
    checklist(memberId: number, credentialTypeId: number): Promise<ChecklistItem[]>;
    grant(auth: AuthContext, memberId: number, credentialTypeId: number, opts?: {
        title?: string;
        grantedViaId?: number;
    }): Promise<{
        id: number;
        memberId: number;
        typeId: number;
        status: import("../generated/prisma/enums").CredentialStatus;
        title: string | null;
        grantedAt: Date;
        grantedViaId: number | null;
        revokedAt: Date | null;
    }>;
    appoint(auth: AuthContext, memberId: number, credentialKey: string, opts?: {
        senior?: boolean;
    }): Promise<{
        id: number;
        memberId: number;
        typeId: number;
        status: import("../generated/prisma/enums").CredentialStatus;
        title: string | null;
        grantedAt: Date;
        grantedViaId: number | null;
        revokedAt: Date | null;
    }>;
    revoke(auth: AuthContext, memberId: number, credentialTypeId: number): Promise<{
        ok: boolean;
    }>;
}
