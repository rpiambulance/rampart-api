import { Global, Module } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { StorageService } from '../storage/storage.service';

@Global()
@Module({
  providers: [
    AuditService,
    CredentialGraphService,
    NotificationsService,
    SettingsService,
    StorageService,
  ],
  exports: [
    AuditService,
    CredentialGraphService,
    NotificationsService,
    SettingsService,
    StorageService,
  ],
})
export class CommonModule {}
