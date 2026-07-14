import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { StorageService } from '../storage/storage.service';
export declare class CertificationsService {
    private readonly prisma;
    private readonly storage;
    private readonly audit;
    private readonly notifications;
    constructor(prisma: PrismaService, storage: StorageService, audit: AuditService, notifications: NotificationsService);
    listTypes(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        active: boolean;
        name: string;
        abbreviation: string;
        issuingOrg: string | null;
        defaultValidityMonths: number | null;
    }[]>;
    listForMember(memberId: number): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    listPending(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    expiring(withinDays?: number): Promise<({
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
    submit(memberId: number, input: {
        typeId: number;
        identifier?: string;
        issuedAt?: string;
        expiresAt?: string;
    }): Promise<{
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
    attachDocument(memberId: number, certificationId: number, file: {
        originalname: string;
        mimetype: string;
        buffer: Buffer;
    }, opts?: {
        asOfficer?: boolean;
    }): Promise<{
        id: number;
        certificationId: number;
        storageKey: string;
        fileName: string;
        contentType: string;
        sizeBytes: number;
        uploadedAt: Date;
    }>;
    getDocument(documentId: number): Promise<{
        doc: {
            id: number;
            certificationId: number;
            storageKey: string;
            fileName: string;
            contentType: string;
            sizeBytes: number;
            uploadedAt: Date;
        };
        object: import("../storage/storage.service").StoredObject;
    }>;
    verify(auth: AuthContext, certificationId: number, decision: {
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
    recomputeSuspensions(memberId?: number): Promise<{
        changed: number;
    }>;
}
