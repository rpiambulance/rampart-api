import { Global, Module } from '@nestjs/common';
import { AccessLogService } from '../audit/access-log.service';
import { AuditService } from '../audit/audit.service';
import { CredentialGraphService } from '../credentials/credential-graph.service';
import { GoogleCalendarService } from '../integrations/google-calendar.service';
import { KeycloakAdminService } from '../integrations/keycloak-admin.service';
import { NotificationsService } from '../notifications/notifications.service';
import { PermissionHoldersService } from '../permissions/permission-holders.service';
import { ServiceStatusService } from '../service-status/service-status.service';
import { SettingsService } from '../settings/settings.service';
import { SlackLinkService } from '../notifications/slack-link.service';
import { SlackService } from '../notifications/slack.service';
import { StorageService } from '../storage/storage.service';
import { TurnstileService } from './turnstile.service';

@Global()
@Module({
  providers: [
    AccessLogService,
    AuditService,
    CredentialGraphService,
    GoogleCalendarService,
    KeycloakAdminService,
    NotificationsService,
    PermissionHoldersService,
    ServiceStatusService,
    SettingsService,
    SlackLinkService,
    SlackService,
    StorageService,
    TurnstileService,
  ],
  exports: [
    AccessLogService,
    AuditService,
    CredentialGraphService,
    GoogleCalendarService,
    KeycloakAdminService,
    NotificationsService,
    PermissionHoldersService,
    ServiceStatusService,
    SettingsService,
    SlackLinkService,
    SlackService,
    StorageService,
    TurnstileService,
  ],
})
export class CommonModule {}
