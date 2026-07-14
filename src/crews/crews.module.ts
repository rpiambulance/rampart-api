import { Module } from '@nestjs/common';
import { CrewEligibilityService } from './crew-eligibility.service';
import { CrewsController } from './crews.controller';
import { CrewsService } from './crews.service';
import { CrewsJobs } from './crews.jobs';

@Module({
  controllers: [CrewsController],
  providers: [CrewsService, CrewEligibilityService, CrewsJobs],
  exports: [CrewsService],
})
export class CrewsModule {}
