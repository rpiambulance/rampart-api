import { PrismaService } from '../prisma/prisma.service';
export declare class NotificationsService {
    private readonly prisma;
    private readonly logger;
    constructor(prisma: PrismaService);
    notifyMember(memberId: number, subject: string, body: string): Promise<void>;
    notifyOfficers(subject: string, body: string): Promise<void>;
}
