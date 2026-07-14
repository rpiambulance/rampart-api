import { PrismaService } from '../prisma/prisma.service';
import type { AuthContext } from '../auth/auth-context';
export declare class AuditService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    log(auth: AuthContext | 'system', action: string, entity: string, entityId?: string | number, diff?: unknown): Promise<void>;
}
