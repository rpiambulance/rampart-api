import { Module } from '@nestjs/common';
import { RunNumbersController } from './run-numbers.controller';
import { RunNumbersService } from './run-numbers.service';

@Module({
  controllers: [RunNumbersController],
  providers: [RunNumbersService],
})
export class RunNumbersModule {}
