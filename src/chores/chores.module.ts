import { Module } from '@nestjs/common';
import { ChoresController } from './chores.controller';
import { ChoresJobs } from './chores.jobs';
import { ChoresService } from './chores.service';

@Module({
  controllers: [ChoresController],
  providers: [ChoresService, ChoresJobs],
  exports: [ChoresService],
})
export class ChoresModule {}
