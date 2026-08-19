import { Global, Module } from '@nestjs/common';
import { WebhooksController } from './webhooks.controller';
import { WebhooksService } from './webhooks.service';

/**
 * Global: anything that happens is potentially worth telling somebody about,
 * so the emitter has to be reachable from any service without every module
 * declaring an import for it.
 */
@Global()
@Module({
  controllers: [WebhooksController],
  providers: [WebhooksService],
  exports: [WebhooksService],
})
export class WebhooksModule {}
