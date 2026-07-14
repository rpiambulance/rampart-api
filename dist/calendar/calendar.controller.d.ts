import type { AuthContext } from '../auth/auth-context';
import { PrismaService } from '../prisma/prisma.service';
import { IcsScope } from '../generated/prisma/enums';
export declare class CalendarController {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listTokens(auth: AuthContext): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<{
        id: number;
        createdAt: Date;
        token: string;
        scope: IcsScope;
    }[]>;
    createToken(auth: AuthContext, scope: string): Promise<{
        id: number;
        createdAt: Date;
        memberId: number;
        token: string;
        scope: IcsScope;
    }>;
    deleteToken(auth: AuthContext, id: string): Promise<{
        ok: boolean;
    }>;
    feed(token: string): Promise<string>;
}
