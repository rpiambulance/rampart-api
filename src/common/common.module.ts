import { Global, Module } from '@nestjs/common';
import { AccessLogService } from '../audit/access-log.service';
import { AuditService } from '../audit/audit.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { GoogleCalendarService } from '../integrations/google-calendar.service';
import { KeycloakAdminService } from '../integrations/keycloak-admin.service';
import { NotificationsService } from '../notifications/notifications.service';
import { SettingsService } from '../settings/settings.service';
import { SlackService } from '../notifications/slack.service';
import { StorageService } from '../storage/storage.service';

@Global()
@Module({
  providers: [
    AccessLogService,
    AuditService,
    CredentialGraphService,
    GoogleCalendarService,
    KeycloakAdminService,
    NotificationsService,
    SettingsService,
    SlackService,
    StorageService,
  ],
  exports: [
    AccessLogService,
    AuditService,
    CredentialGraphService,
    GoogleCalendarService,
    KeycloakAdminService,
    NotificationsService,
    SettingsService,
    SlackService,
    StorageService,
  ],
})
export class CommonModule {}
