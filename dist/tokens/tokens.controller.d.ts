import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
declare class CreateTokenDto {
    name: string;
    permissions: string[];
    expiresAt?: string;
}
export declare class TokensController {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    list(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        createdAt: Date;
        name: string;
        expiresAt: Date | null;
        revokedAt: Date | null;
        permissions: string[];
        lastUsedAt: Date | null;
        owner: {
            id: number;
            firstName: string;
            lastName: string;
        };
    }[]>;
    create(auth: AuthContext, body: CreateTokenDto): Promise<{
        id: number;
        name: string;
        secret: string;
    }>;
    revoke(auth: AuthContext, id: number): Promise<{
        ok: boolean;
    }>;
}
export {};
