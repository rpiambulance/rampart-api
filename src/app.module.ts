import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
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
    EvalsModule,
    PromotionsModule,
    TrainingsModule,
  ],
  controllers: [
    HealthController,
    AvailabilityController,
    CoverageController,
    DispatchesController,
    LegacyMigrationController,
    CalendarController,
    TokensController,
    OpsController,
    EmailSettingsController,
    InboxController,
    NotificationSettingsController,
  ],
  providers: [
    // Registered useExisting (not useClass) so tests can override AuthGuard.
    AuthGuard,
    PermissionsGuard,
    BootstrapService,
    LegacyMigrationRunner,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: PermissionsGuard },
  ],
})
export class AppModule {}
