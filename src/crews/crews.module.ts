import { Module } from '@nestjs/common';
import { CrewEligibilityService } from './crew-eligibility.service';
import { CrewsController } from './crews.controller';
import { CrewsService } from './crews.service';
import { CrewsJobs } from './crews.jobs';
import { WhosOnJobs } from './whoson.jobs';

@Module({
  controllers: [CrewsController],
  providers: [CrewsService, CrewEligibilityService, CrewsJobs, WhosOnJobs],
  exports: [CrewsService],
})
export class CrewsModule {}
