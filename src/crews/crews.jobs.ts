import { Injectable, Logger } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { addDays, nyNow, startOfWeek } from '../common/dates';
import { AGENCY_TZ } from '../common/dates';
import { CrewsService } from './crews.service';

/**
 * Weekly crew generation — replaces the legacy processTurnover() page-view
 * side effect. Every Sunday shortly after midnight, materialize the following
 * week's crews from the default template.
 */
@Injectable()
export class CrewsJobs {
  private readonly logger = new Logger(CrewsJobs.name);

  constructor(private readonly crews: CrewsService) {}

  @Cron('5 0 * * 0', { timeZone: AGENCY_TZ })
  async generateNextWeek() {
    const nextWeekStart = addDays(startOfWeek(nyNow().dateStr), 7);
    await this.crews.ensureCrewsExist(nextWeekStart, 7);
    this.logger.log(`Ensured crews exist for week of ${nextWeekStart}`);
  }
}
