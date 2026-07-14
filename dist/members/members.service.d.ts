import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { PrismaService } from '../prisma/prisma.service';
export declare class MembersService {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    list(includeInactive?: boolean): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        cellPhone: string | null;
        active: boolean;
        credentials: {
            title: string | null;
            type: {
                name: string;
                key: string;
            };
        }[];
    }[]>;
    get(id: number): Promise<{
        roles: ({
            role: {
                id: number;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                isOfficer: boolean;
            };
        } & {
            id: number;
            roleId: number;
            memberId: number;
            startDate: Date;
            endDate: Date | null;
        })[];
        credentials: ({
            type: {
                id: number;
                active: boolean;
                name: string;
                key: string;
                grantMethod: import("../generated/prisma/enums").GrantMethod;
                isAddOn: boolean;
            };
        } & {
            id: number;
            memberId: number;
            typeId: number;
            status: import("../generated/prisma/enums").CredentialStatus;
            title: string | null;
            grantedAt: Date;
            grantedViaId: number | null;
            revokedAt: Date | null;
        })[];
        certifications: ({
            type: {
                id: number;
                active: boolean;
                name: string;
                abbreviation: string;
                issuingOrg: string | null;
                defaultValidityMonths: number | null;
            };
            documents: {
                id: number;
                certificationId: number;
                storageKey: string;
                fileName: string;
                contentType: string;
                sizeBytes: number;
                uploadedAt: Date;
            }[];
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            memberId: number;
            typeId: number;
            identifier: string | null;
            issuedAt: Date | null;
            expiresAt: Date | null;
            status: import("../generated/prisma/enums").CertStatus;
            verifiedById: number | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
        })[];
    } & {
        id: number;
        legacyId: number | null;
        keycloakSubject: string | null;
        firstName: string;
        lastName: string;
        dob: Date | null;
        email: string;
        personalEmail: string | null;
        cellPhone: string | null;
        homePhone: string | null;
        localAddress: string | null;
        homeAddress: string | null;
        rcsId: string | null;
        rin: string | null;
        facilityId: string | null;
        cardId: string | null;
        slackId: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(auth: AuthContext, data: {
        firstName: string;
        lastName: string;
        email: string;
        dob?: string;
        personalEmail?: string;
        cellPhone?: string;
        localAddress?: string;
        homeAddress?: string;
        rcsId?: string;
        rin?: string;
        keycloakSubject?: string;
    }): Promise<{
        id: number;
        legacyId: number | null;
        keycloakSubject: string | null;
        firstName: string;
        lastName: string;
        dob: Date | null;
        email: string;
        personalEmail: string | null;
        cellPhone: string | null;
        homePhone: string | null;
        localAddress: string | null;
        homeAddress: string | null;
        rcsId: string | null;
        rin: string | null;
        facilityId: string | null;
        cardId: string | null;
        slackId: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: number, data: Partial<{
        firstName: string;
        lastName: string;
        email: string;
        dob: string;
        personalEmail: string;
        cellPhone: string;
        homePhone: string;
        localAddress: string;
        homeAddress: string;
        rcsId: string;
        rin: string;
        keycloakSubject: string;
        active: boolean;
    }>, auth?: AuthContext): Promise<{
        id: number;
        legacyId: number | null;
        keycloakSubject: string | null;
        firstName: string;
        lastName: string;
        dob: Date | null;
        email: string;
        personalEmail: string | null;
        cellPhone: string | null;
        homePhone: string | null;
        localAddress: string | null;
        homeAddress: string | null;
        rcsId: string | null;
        rin: string | null;
        facilityId: string | null;
        cardId: string | null;
        slackId: string | null;
        active: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
