import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface AccessEntry {
  kind: 'API' | 'PAGE';
  memberId?: number | null;
  apiTokenId?: number | null;
  method: string;
  path: string;
  status?: number | null;
  durationMs?: number | null;
  ip?: string | null;
  userAgent?: string | null;
}

/**
 * Records traffic: every request the API serves, and every page the portals
 * render.
 *
 * Writes are queued and flushed in batches rather than awaited inline. A row
 * per request is a lot of rows, and the point of the log is to have a record
 * afterwards — not to make every response wait on an insert, nor to fail a
 * request because the log could not be written.
 */
@Injectable()
export class AccessLogService {
  private readonly logger = new Logger(AccessLogService.name);
  private queue: AccessEntry[] = [];
  private timer?: NodeJS.Timeout;

  /** Beyond this the queue is dropped rather than grown without limit. */
  private static readonly MAX_QUEUED = 5_000;
  private static readonly FLUSH_MS = 2_000;

  constructor(private readonly prisma: PrismaService) {}

  record(entry: AccessEntry): void {
    if (process.env.ACCESS_LOG === 'off') return;
    if (this.queue.length >= AccessLogService.MAX_QUEUED) {
      // Losing traffic records is bad; running the API out of memory holding
      // them is worse.
      this.logger.warn('Access log queue full; dropping entries');
      return;
    }
    this.queue.push(entry);
    this.timer ??= setTimeout(() => {
      void this.flush();
    }, AccessLogService.FLUSH_MS).unref();
  }

  async flush(): Promise<void> {
    clearTimeout(this.timer);
    this.timer = undefined;
    const batch = this.queue;
    if (!batch.length) return;
    this.queue = [];
    try {
      await this.prisma.accessLog.createMany({
        data: batch.map((entry) => ({
          kind: entry.kind,
          memberId: entry.memberId ?? null,
          apiTokenId: entry.apiTokenId ?? null,
          method: entry.method,
          // Long query strings and stray unicode are the caller's, not ours.
          path: entry.path.slice(0, 1024),
          status: entry.status ?? null,
          durationMs: entry.durationMs ?? null,
          ip: entry.ip ?? null,
          userAgent: entry.userAgent?.slice(0, 512) ?? null,
        })),
      });
    } catch (error) {
      this.logger.error(
        `Could not write ${batch.length} access log row(s): ${
          error instanceof Error ? error.message : String(error)
        }`,
      );
    }
  }

  /**
   * Drops entries older than ACCESS_LOG_RETENTION_DAYS (default 90).
   *
   * Traffic logs grow without bound and answer questions about the recent
   * past; the audit log, which answers questions about decisions, is never
   * touched by this.
   */
  async prune(now = new Date()): Promise<number> {
    const days = Number(process.env.ACCESS_LOG_RETENTION_DAYS ?? 90);
    if (!Number.isFinite(days) || days <= 0) return 0;
    const cutoff = new Date(now.getTime() - days * 86_400_000);
    const { count } = await this.prisma.accessLog.deleteMany({
      where: { at: { lt: cutoff } },
    });
    return count;
  }
}
