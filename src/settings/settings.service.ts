import { Injectable } from '@nestjs/common';
import { addDays, nyNow, startOfWeek } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';

export interface SchedulingKnobs {
  minAgeYears: number;
  publicWeeks: number; // rolling window of weeks visible/signable to members
  riderSignupOpen: { weekday: number; time: string }; // weekday 0 = Sunday
  rotationWeeks: number;
  dayOfUnlockTime: string;
  probationaryRequiresTrainer: boolean;
  dropDeadline: { daysBefore: number; time: string };
}

const DEFAULTS: SchedulingKnobs = {
  minAgeYears: 18,
  publicWeeks: 2,
  riderSignupOpen: { weekday: 0, time: '16:00' },
  rotationWeeks: 2,
  dayOfUnlockTime: '12:00',
  probationaryRequiresTrainer: true,
  dropDeadline: { daysBefore: 2, time: '18:00' },
};

@Injectable()
export class SettingsService {
  private cache?: { at: number; knobs: SchedulingKnobs };

  constructor(private readonly prisma: PrismaService) {}

  async scheduling(): Promise<SchedulingKnobs> {
    if (this.cache && Date.now() - this.cache.at < 30_000) {
      return this.cache.knobs;
    }
    const rows = await this.prisma.schedulingSetting.findMany();
    const stored = Object.fromEntries(rows.map((r) => [r.key, r.value]));
    const knobs = { ...DEFAULTS, ...stored } as SchedulingKnobs;
    this.cache = { at: Date.now(), knobs };
    return knobs;
  }

  /**
   * The first date the schedule has not been published for.
   *
   * Everything a member is shown of the schedule stops here — the roster
   * they can look at, the shifts they are told are theirs, the calendar
   * they subscribe to. Beyond it a scheduler is still working: people are
   * pencilled in and moved, and saying otherwise to the person pencilled in
   * promises something nobody has decided.
   */
  async publishedThrough(): Promise<string> {
    const { publicWeeks } = await this.scheduling();
    return addDays(startOfWeek(nyNow().dateStr), 7 * publicWeeks);
  }

  async update(key: keyof SchedulingKnobs, value: unknown) {
    const updated = await this.prisma.schedulingSetting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
    this.cache = undefined;
    return updated;
  }
}
