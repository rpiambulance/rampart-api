import type { AuthContext } from '../auth/auth-context';
import { MembersService } from './members.service';
export declare class MembersController {
    private readonly members;
    constructor(members: MembersService);
    list(includeInactive?: string): import("@prisma/client").Prisma.PrismaPromise<{
        id: number;
        active: boolean;
        email: string;
        firstName: string;
        lastName: string;
        cellPhone: string | null;
    }[]>;
    me(auth: AuthContext): Promise<{
        roles: ({
            role: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isOfficer: boolean;
            };
        } & {
            id: number;
            memberId: number;
            roleId: number;
            startDate: Date;
            endDate: Date | null;
        })[];
        credentials: ({
            type: {
                grantMethod: import("@prisma/client").$Enums.GrantMethod;
                isAddOn: boolean;
                id: number;
                key: string;
                name: string;
                active: boolean;
            };
        } & {
            id: number;
            memberId: number;
            revokedAt: Date | null;
            typeId: number;
            status: import("@prisma/client").$Enums.CredentialStatus;
            title: string | null;
            grantedAt: Date;
            grantedViaId: number | null;
        })[];
        certifications: ({
            type: {
                id: number;
                name: string;
                active: boolean;
                abbreviation: string;
                issuingOrg: string | null;
                defaultValidityMonths: number | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            memberId: number;
            expiresAt: Date | null;
            typeId: number;
            status: import("@prisma/client").$Enums.CertStatus;
            identifier: string | null;
            issuedAt: Date | null;
            verifiedById: number | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
        })[];
    } & {
        id: number;
        active: boolean;
        legacyId: number | null;
        keycloakSubject: string | null;
        email: string;
        slackId: string | null;
        firstName: string;
        lastName: string;
        dob: Date | null;
        personalEmail: string | null;
        cellPhone: string | null;
        homePhone: string | null;
        localAddress: string | null;
        homeAddress: string | null;
        rcsId: string | null;
        rin: string | null;
        facilityId: string | null;
        cardId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }> | null;
    get(id: number): Promise<{
        roles: ({
            role: {
                id: number;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                isOfficer: boolean;
            };
        } & {
            id: number;
            memberId: number;
            roleId: number;
            startDate: Date;
            endDate: Date | null;
        })[];
        credentials: ({
            type: {
                grantMethod: import("@prisma/client").$Enums.GrantMethod;
                isAddOn: boolean;
                id: number;
                key: string;
                name: string;
                active: boolean;
            };
        } & {
            id: number;
            memberId: number;
            revokedAt: Date | null;
            typeId: number;
            status: import("@prisma/client").$Enums.CredentialStatus;
            title: string | null;
            grantedAt: Date;
            grantedViaId: number | null;
        })[];
        certifications: ({
            type: {
                id: number;
                name: string;
                active: boolean;
                abbreviation: string;
                issuingOrg: string | null;
                defaultValidityMonths: number | null;
            };
        } & {
            id: number;
            createdAt: Date;
            updatedAt: Date;
            memberId: number;
            expiresAt: Date | null;
            typeId: number;
            status: import("@prisma/client").$Enums.CertStatus;
            identifier: string | null;
            issuedAt: Date | null;
            verifiedById: number | null;
            verifiedAt: Date | null;
            rejectionReason: string | null;
        })[];
    } & {
        id: number;
        active: boolean;
        legacyId: number | null;
        keycloakSubject: string | null;
        email: string;
        slackId: string | null;
        firstName: string;
        lastName: string;
        dob: Date | null;
        personalEmail: string | null;
        cellPhone: string | null;
        homePhone: string | null;
        localAddress: string | null;
        homeAddress: string | null;
        rcsId: string | null;
        rin: string | null;
        facilityId: string | null;
        cardId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
