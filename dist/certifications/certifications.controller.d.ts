import type { Response } from 'express';
import type { AuthContext } from '../auth/auth-context';
import { CertificationsService } from './certifications.service';
declare class SubmitCertDto {
    typeId: number;
    identifier?: string;
    issuedAt?: string;
    expiresAt?: string;
}
export declare class CertificationsController {
    private readonly certs;
    constructor(certs: CertificationsService);
    types(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        active: boolean;
        name: string;
        abbreviation: string;
        issuingOrg: string | null;
        defaultValidityMonths: number | null;
    }[]>;
    mine(auth: AuthContext): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    })[]>;
    forMember(memberId: number): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    })[]>;
    pending(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        member: {
            id: number;
            firstName: string;
            lastName: string;
        };
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
    })[]>;
    expiring(withinDays?: string): Promise<({
        member: {
            id: number;
            firstName: string;
            lastName: string;
            email: string;
        };
        type: {
            id: number;
            active: boolean;
            name: string;
            abbreviation: string;
            issuingOrg: string | null;
            defaultValidityMonths: number | null;
        };
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
    })[]>;
    submit(auth: AuthContext, body: SubmitCertDto): Promise<{
        type: {
            id: number;
            active: boolean;
            name: string;
            abbreviation: string;
            issuingOrg: string | null;
            defaultValidityMonths: number | null;
        };
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
    }>;
    upload(auth: AuthContext, id: number, file: Express.Multer.File): Promise<{
        id: number;
        certificationId: number;
        storageKey: string;
        fileName: string;
        contentType: string;
        sizeBytes: number;
        uploadedAt: Date;
    }>;
    document(documentId: number, res: Response): Promise<void>;
    verify(auth: AuthContext, id: number, body: {
        approve: boolean;
        reason?: string;
    }): Promise<{
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
    }>;
}
export {};
