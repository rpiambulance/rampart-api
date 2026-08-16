import {
  Body,
  ConflictException,
  Controller,
  Get,
  Injectable,
  Logger,
  Post,
} from '@nestjs/common';
import { IsString, Matches } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PrismaService } from '../prisma/prisma.service';
import { runLegacyMigration } from './legacy-migration';

class StartMigrationDto {
  /** e.g. mysql://user:pass@host:3306/ambulanc_web */
  @IsString()
  @Matches(/^mysql:\/\/.+@.+\/.+$/, {
    message: 'mysqlUrl must look like mysql://user:pass@host:3306/database',
  })
  mysqlUrl!: string;
}

type RunState = {
  status: 'idle' | 'running' | 'succeeded' | 'failed';
  startedAt?: string;
  finishedAt?: string;
  startedBy?: string;
  progress: string[];
  error?: string;
};

/**
 * Runs the legacy ETL in the background so it survives proxy timeouts — the
 * job can take minutes and Coolify/Traefik will cut the request long before
 * it finishes. Start it, then poll for status.
 *
 * State is in-memory: an API restart loses the record of a run, not the work.
 * The ETL is idempotent, so re-running after a restart is always safe.
 */
@Injectable()
class LegacyMigrationRunner {
  private readonly logger = new Logger('LegacyMigration');
  state: RunState = { status: 'idle', progress: [] };

  constructor(private readonly prisma: PrismaService) {}

  isRunning(): boolean {
    return this.state.status === 'running';
  }

  start(mysqlUrl: string, startedBy: string): void {
    this.state = {
      status: 'running',
      startedAt: new Date().toISOString(),
      startedBy,
      progress: [],
    };
    // Deliberately not awaited: the HTTP request returns immediately.
    void this.run(mysqlUrl);
  }

  private async run(mysqlUrl: string): Promise<void> {
    try {
      await runLegacyMigration(this.prisma, mysqlUrl, (message) => {
        this.logger.log(message);
        this.state.progress.push(message);
      });
      this.state.status = 'succeeded';
      this.logger.log('Legacy migration finished.');
    } catch (error) {
      this.state.status = 'failed';
      this.state.error = error instanceof Error ? error.message : String(error);
      this.logger.error(`Legacy migration failed: ${this.state.error}`);
    } finally {
      this.state.finishedAt = new Date().toISOString();
    }
  }
}

@Controller({ path: 'admin/legacy-migration', version: '1' })
export class LegacyMigrationController {
  constructor(
    private readonly runner: LegacyMigrationRunner,
    private readonly audit: AuditService,
  ) {}

  @Get()
  @RequirePermissions(PERMISSIONS.SYSTEM_MIGRATE_LEGACY)
  status(): RunState {
    return this.runner.state;
  }

  @Post()
  @RequirePermissions(PERMISSIONS.SYSTEM_MIGRATE_LEGACY)
  async start(
    @CurrentAuth() auth: AuthContext,
    @Body() body: StartMigrationDto,
  ): Promise<{ ok: true; status: string }> {
    if (this.runner.isRunning()) {
      throw new ConflictException('A migration is already running');
    }
    const startedBy =
      auth.kind === 'member' ? `member ${auth.memberId}` : `token ${auth.apiTokenId}`;
    // The connection string carries a password — record that a run happened,
    // never the credential itself.
    await this.audit.log(auth, 'legacy.migration.start', 'System', undefined, {
      host: body.mysqlUrl.replace(/\/\/[^@]*@/, '//***@'),
    });
    this.runner.start(body.mysqlUrl, startedBy);
    return { ok: true, status: 'running' };
  }
}

export { LegacyMigrationRunner };
