import { Module } from '@nestjs/common';
import { TrainingsController } from './trainings.controller';
import { TrainingsJobs } from './trainings.jobs';

@Module({
  controllers: [TrainingsController],
  providers: [TrainingsJobs],
})
export class TrainingsModule {}
