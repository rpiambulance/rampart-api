import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import { CertificationsService } from './certifications.service';
export declare class CertificationsJobs {
    private readonly prisma;
    private readonly certs;
    private readonly notifications;
    private readonly logger;
    constructor(prisma: PrismaService, certs: CertificationsService, notifications: NotificationsService);
    dailySweep(): Promise<void>;
}
