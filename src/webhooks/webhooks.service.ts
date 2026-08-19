import { Injectable, Logger } from '@nestjs/common';
import { createHmac, randomBytes } from 'crypto';
import type { Prisma } from '../generated/prisma/client';
import { PrismaService } from '../prisma/prisma.service';

/** Attempts, and how long to wait before each retry. */
const RETRY_DELAYS_MS = [0, 30_000, 5 * 60_000];

@Injectable()
export class WebhooksService {
  private readonly logger = new Logger(WebhooksService.name);

  constructor(private readonly prisma: PrismaService) {}

  static newSecret(): string {
    return `whsec_${randomBytes(24).toString('hex')}`;
  }

  /**
   * Signs a delivery the way Stripe and GitHub do: the timestamp is inside
   * the signed string, so a captured body cannot be replayed later against a
   * receiver that checks it.
   */
  static sign(secret: string, timestamp: number, body: string): string {
    return (
      'v1=' +
      createHmac('sha256', secret).update(`${timestamp}.${body}`).digest('hex')
    );
  }

  /**
   * Tells every endpoint that asked about this event.
   *
   * Deliberately not awaited by callers: a webhook endpoint being slow or
   * down must never slow down or fail the thing that triggered it. Failures
   * are recorded against the delivery and the endpoint rather than thrown.
   */
  emit(event: string, payload: Record<string, unknown>): void {
    void this.deliver(event, payload).catch((error) => {
      this.logger.error(
        `webhook emit ${event} failed: ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    });
  }

  private async deliver(event: string, payload: Record<string, unknown>) {
    const hooks = await this.prisma.webhook.findMany({
      where: { active: true },
    });
    // An endpoint subscribing to nothing gets everything: the common case is
    // "tell me about all of it", and an empty list is how that is written.
    const wanted = hooks.filter(
      (hook) => hook.events.length === 0 || hook.events.includes(event),
    );
    if (!wanted.length) return;

    const body = JSON.stringify({
      event,
      at: new Date().toISOString(),
      data: payload,
    });

    await Promise.all(
      wanted.map(async (hook) => {
        const delivery = await this.prisma.webhookDelivery.create({
          // Through `unknown`: a plain `as object` is stripped by the lint
          // rule for unnecessary assertions, which leaves it uncompilable.
          data: {
            webhookId: hook.id,
            event,
            payload: payload as unknown as Prisma.InputJsonObject,
          },
        });
        await this.attempt(
          hook.id,
          hook.url,
          hook.secret,
          delivery.id,
          event,
          body,
        );
      }),
    );
  }

  private async attempt(
    webhookId: number,
    url: string,
    secret: string,
    deliveryId: bigint,
    event: string,
    body: string,
  ): Promise<void> {
    let lastError: string | null = null;
    let lastStatus: number | null = null;

    for (const [index, delay] of RETRY_DELAYS_MS.entries()) {
      if (delay) await new Promise((resolve) => setTimeout(resolve, delay));
      const timestamp = Math.floor(Date.now() / 1000);
      try {
        const res = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Rampart-Event': event,
            'X-Rampart-Timestamp': String(timestamp),
            'X-Rampart-Signature': WebhooksService.sign(
              secret,
              timestamp,
              body,
            ),
          },
          body,
          signal: AbortSignal.timeout(10_000),
        });
        lastStatus = res.status;
        lastError = res.ok ? null : `HTTP ${res.status}`;
        if (res.ok) {
          await this.finish(
            webhookId,
            deliveryId,
            index + 1,
            res.status,
            null,
            true,
          );
          return;
        }
        // 4xx other than 429 means the receiver understood and refused;
        // repeating it will not change their mind.
        if (res.status >= 400 && res.status < 500 && res.status !== 429) break;
      } catch (error) {
        lastError = error instanceof Error ? error.message : String(error);
        lastStatus = null;
      }
    }
    await this.finish(
      webhookId,
      deliveryId,
      RETRY_DELAYS_MS.length,
      lastStatus,
      lastError,
      false,
    );
  }

  private async finish(
    webhookId: number,
    deliveryId: bigint,
    attempts: number,
    status: number | null,
    error: string | null,
    delivered: boolean,
  ) {
    await this.prisma.webhookDelivery.update({
      where: { id: deliveryId },
      data: {
        attempts,
        status,
        error,
        deliveredAt: delivered ? new Date() : null,
      },
    });
    await this.prisma.webhook.update({
      where: { id: webhookId },
      data: { lastStatus: status, lastAt: new Date(), lastError: error },
    });
  }
}
