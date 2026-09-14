import { Module } from '@nestjs/common';
import { AirController } from './air.controller';
import { AirService } from './air.service';

/**
 * AIR — "am I responding".
 *
 * Slack plumbing (posting, editing, signature checks) lives in the global
 * notifications service; the display channel and the database live in the
 * global modules too, so this holds only the callout itself.
 */
@Module({
  controllers: [AirController],
  providers: [AirService],
  exports: [AirService],
})
export class AirModule {}
