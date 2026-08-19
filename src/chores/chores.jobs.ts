import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ, nyNow } from '../common/dates';
import { ChoresService } from './chores.service';

/**
 * The evening chore post, at the hour ChoreBot used.
 *
 * Occurrences are created here even when Slack is not configured, so the
 * portal still shows what is due — Slack is where chores are announced, not
 * where they live.
 */
@Injectable()
export class ChoresJobs {
  private readonly logger = new Logger(ChoresJobs.name);

  constructor(private readonly chores: ChoresService) {}

  @Cron('0 18 * * *', { timeZone: AGENCY_TZ })
  async postTonight() {
    const today = nyNow().dateStr;
    await this.chores.ensureOccurrences(today);
    const posted = await this.chores.postToSlack(today);
    if (!posted) {
      this.logger.debug('chores: Slack not configured, or the post failed');
    }
  }
}
