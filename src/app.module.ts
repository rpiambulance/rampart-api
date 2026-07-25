import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ScheduleModule } from '@nestjs/schedule';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AuthGuard } from './auth/auth.guard';
import { AvailabilityController } from './availability/availability.controller';
import { CoverageController } from './coverage/coverage.controller';
import { DispatchesController } from './dispatches/dispatches.controller';
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
    CalendarController,
    TokensController,
    OpsController,
  ],
  providers: [
    // Registered useExisting (not useClass) so tests can override AuthGuard.
    AuthGuard,
    PermissionsGuard,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_GUARD, useExisting: AuthGuard },
    { provide: APP_GUARD, useExisting: PermissionsGuard },
  ],
})
export class AppModule {}
