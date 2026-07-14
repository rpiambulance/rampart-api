import { PrismaService } from '../prisma/prisma.service';
export declare class CredentialGraphService {
    private readonly prisma;
    private cache?;
    constructor(prisma: PrismaService);
    private graph;
    satisfies(heldKeys: Set<string>, requiredKey: string): Promise<boolean>;
    holdsExactly(heldKeys: Set<string>, key: string): boolean;
    heldKeys(memberId: number): Promise<Set<string>>;
    typeIdForKey(key: string): Promise<number | undefined>;
}
