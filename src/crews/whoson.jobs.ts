import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { AGENCY_TZ, nyNow } from '../common/dates';
import { SlackService } from '../notifications/slack.service';
import { PrismaService } from '../prisma/prisma.service';
import { whosOnText } from './whoson';

/**
 * Nightly "who's on tonight" Slack post — replaces slack-whoson.php. Where it
 * posts is configured in the admin console.
 */
@Injectable()
export class WhosOnJobs {
  private readonly logger = new Logger(WhosOnJobs.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly slack: SlackService,
  ) {}

  @Cron('0 17 * * *', { timeZone: AGENCY_TZ })
  async postWhosOn() {
    const text = await whosOnText(this.prisma, nyNow().dateStr);
    const posted = await this.slack.post('whoson', text);
    if (!posted)
      this.logger.debug('whoson: Slack not configured, or post failed');
  }
}
