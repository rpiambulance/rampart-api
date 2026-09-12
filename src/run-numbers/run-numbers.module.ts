import { Module } from '@nestjs/common';
import { RunNumbersController } from './run-numbers.controller';
import { RunNumbersService } from './run-numbers.service';

@Module({
  controllers: [RunNumbersController],
  providers: [RunNumbersService],
  // ems2 issues run numbers inline when an encounter needs one.
  exports: [RunNumbersService],
})
export class RunNumbersModule {}
