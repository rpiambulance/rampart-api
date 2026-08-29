import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { AccessLogController } from './audit/access-log.controller';
import { ServiceStatusController } from './service-status/service-status.controller';
import { SlackController } from './slack/slack.controller';
import { SlackSettingsController } from './notifications/slack-settings.controller';
import { ChoresModule } from './chores/chores.module';
import { RunNumbersModule } from './run-numbers/run-numbers.module';
import { WebhooksModule } from './webhooks/webhooks.module';
import { RequestContextMiddleware } from './common/request-context.middleware';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './auth/auth.guard';
import { BootstrapService } from './bootstrap/bootstrap.service';
import { AvailabilityController } from './availability/availability.controller';
import { CoverageController } from './coverage/coverage.controller';
import { EmailSettingsController } from './notifications/email-settings.controller';
import {
  InboxController,
  NotificationSettingsController,
} from './notifications/inbox.controller';
import { DialertController } from './integrations/dialert.controller';
import { ChecksheetsController } from './checksheets/checksheets.controller';
import { ChecksheetsJobs } from './checksheets/checksheets.jobs';
import { ChecksheetsService } from './checksheets/checksheets.service';
import { ResourcesController } from './resources/resources.controller';
import { DispatchesController } from './dispatches/dispatches.controller';
import {
  LegacyMigrationController,
  LegacyMigrationRunner,
} from './legacy/legacy-migration.controller';
import { PermissionsGuard } from './auth/permissions.guard';
import { CalendarController } from './calendar/calendar.controller';
import { CertificationsModule } from './certifications/certifications.module';
import { CommonModule } from './common/common.module';
import { CredentialsModule } from './credentials/credentials.module';
import { CrewsModule } from './crews/crews.module';
import { ChecklistsModule } from './checklists/checklists.module';
import { EvalsModule } from './evals/evals.module';
import { EventsModule } from './events/events.module';
import { HealthController } from './health/health.controller';
import { MembersModule } from './members/members.module';
import { OpsController } from './ops/ops.controller';
import { PrismaModule } from './prisma/prisma.module';
import { PromotionsModule } from './promotions/promotions.module';
import { RolesModule } from './roles/roles.module';
import { TokensController } from './tokens/tokens.controller';
import { TrainingsModule } from './trainings/trainings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    PrismaModule,
    CommonModule,
    MembersModule,
    RolesModule,
    CrewsModule,
    EventsModule,
    CredentialsModule,
    CertificationsModule,
    ChoresModule,
    RunNumbersModule,
    WebhooksModule,
    ChecklistsModule,
    EvalsModule,
    PromotionsModule,
    TrainingsModule,
  ],
  controllers: [
    HealthController,
    AvailabilityController,
    CoverageController,
    DialertController,
    ResourcesController,
    ChecksheetsController,
    DispatchesController,
    LegacyMigrationController,
    CalendarController,
    TokensController,
    OpsController,
    EmailSettingsController,
    InboxController,
    NotificationSettingsController,
    AccessLogController,
    ServiceStatusController,
    SlackController,
    SlackSettingsController,
  ],
  providers: [
    // Registered useExisting (not useClass) so tests can override AuthGuard.
    AuthGuard,
    PermissionsGuard,
    BootstrapService,
    ChecksheetsService,
    ChecksheetsJobs,
    LegacyMigrationRunner,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: PermissionsGuard },
  ],
})
export class AppModule implements NestModule {
  /**
   * Everything goes through here: the request context has to be in place
   * before the guards run, and the access log records requests that never
   * reach a handler as readily as those that do.
   */
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestContextMiddleware).forRoutes('*splat');
  }
}
