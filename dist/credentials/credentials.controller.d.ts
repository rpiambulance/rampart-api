import type { AuthContext } from '../auth/auth-context';
import { CredentialsService } from './credentials.service';
declare class GrantDto {
    memberId: number;
    credentialTypeId: number;
    title?: string;
}
declare class AppointDto {
    memberId: number;
    credentialKey: string;
    senior?: boolean;
}
export declare class CredentialsController {
    private readonly credentials;
    constructor(credentials: CredentialsService);
    types(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    checklist(memberId: number, credentialTypeId: number): Promise<import("./credentials.service").ChecklistItem[]>;
    myChecklist(auth: AuthContext, credentialTypeId: number): never[] | Promise<import("./credentials.service").ChecklistItem[]>;
    grant(auth: AuthContext, body: GrantDto): Promise<{
        id: number;
        memberId: number;
        typeId: number;
        status: import("../generated/prisma/enums").CredentialStatus;
        title: string | null;
        grantedAt: Date;
        grantedViaId: number | null;
        revokedAt: Date | null;
    }>;
    appoint(auth: AuthContext, body: AppointDto): Promise<{
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
export {};
