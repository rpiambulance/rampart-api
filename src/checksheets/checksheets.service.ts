import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { addDays, isDateOnly, nyToday, toDbDate } from '../common/dates';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';
import {
  dueState,
  expirySlots,
  sealsNeedingBreak,
  shortfalls,
  type EntryInput,
  type ItemShape,
  type SectionEntryInput,
} from './checksheet-logic';
import { displayName } from '../common/name';

/** Warn this far ahead of an expiry unless the template says otherwise. */
export const DEFAULT_EXPIRY_WARNING_DAYS = 30;

const TEMPLATE_SHAPE = {
  sections: { orderBy: { order: 'asc' as const } },
  items: { orderBy: { order: 'asc' as const } },
  notifyRoles: { select: { id: true, name: true } },
  assetKind: true,
};

@Injectable()
export class ChecksheetsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  // ------------------------------------------------------------- templates

  listTemplates(includeInactive = false) {
    return this.prisma.checksheetTemplate.findMany({
      where: includeInactive ? {} : { active: true },
      include: TEMPLATE_SHAPE,
      orderBy: { name: 'asc' },
    });
  }

  async template(id: number) {
    const template = await this.prisma.checksheetTemplate.findUnique({
      where: { id },
      include: TEMPLATE_SHAPE,
    });
    if (!template) throw new NotFoundException('No such checksheet');
    return template;
  }

  /**
   * Applies a new layout: section order, item order, and which section each
   * item belongs to.
   *
   * In one transaction, and only over rows that belong to this sheet — an id
   * from somewhere else would otherwise let a reorder move another sheet's
   * item into this one.
   */
  async reorder(
    auth: AuthContext,
    templateId: number,
    layout: {
      sectionIds?: number[];
      items?: Array<{ id: number; sectionId?: number | null; order: number }>;
    },
  ) {
    const template = await this.prisma.checksheetTemplate.findUnique({
      where: { id: templateId },
      include: {
        sections: { select: { id: true } },
        items: { select: { id: true } },
      },
    });
    if (!template) throw new NotFoundException('No such checksheet');

    const ownSections = new Set(template.sections.map((section) => section.id));
    const ownItems = new Set(template.items.map((item) => item.id));

    for (const sectionId of layout.sectionIds ?? []) {
      if (!ownSections.has(sectionId)) {
        throw new BadRequestException(
          `Section ${sectionId} is not on this checksheet`,
        );
      }
    }
    for (const item of layout.items ?? []) {
      if (!ownItems.has(item.id)) {
        throw new BadRequestException(
          `Item ${item.id} is not on this checksheet`,
        );
      }
      if (
        item.sectionId !== undefined &&
        item.sectionId !== null &&
        !ownSections.has(item.sectionId)
      ) {
        throw new BadRequestException(
          `Section ${item.sectionId} is not on this checksheet`,
        );
      }
    }

    await this.prisma.$transaction([
      ...(layout.sectionIds ?? []).map((sectionId, order) =>
        this.prisma.checksheetSection.update({
          where: { id: sectionId },
          data: { order },
        }),
      ),
      ...(layout.items ?? []).map((item) =>
        this.prisma.checksheetItem.update({
          where: { id: item.id },
          data: {
            order: item.order,
            ...(item.sectionId === undefined
              ? {}
              : { sectionId: item.sectionId }),
          },
        }),
      ),
    ]);
    await this.audit.log(
      auth,
      'checksheets.template.reorder',
      'ChecksheetTemplate',
      templateId,
      {
        sections: layout.sectionIds?.length ?? 0,
        items: layout.items?.length ?? 0,
      },
    );
    return { ok: true };
  }

  // ------------------------------------------------------------ completing

  /**
   * What somebody needs in front of them to fill a sheet in.
   *
   * Carries last time's expiry dates forward. Dates on a truck do not change
   * between checks, and retyping eight of them nightly is how a check becomes
   * a thing people click through without reading.
   */
  async blank(templateId: number, assetId?: number) {
    const template = await this.template(templateId);
    const previous = await this.prisma.checksheetRun.findFirst({
      where: { templateId, ...(assetId ? { assetId } : {}) },
      orderBy: { completedAt: 'desc' },
      include: {
        entries: { include: { expiries: true } },
        sectionEntries: true,
      },
    });

    const lastByItem = new Map(
      (previous?.entries ?? []).map((entry) => [entry.itemId, entry]),
    );
    // The last time each seal was actually looked at, which is not
    // necessarily the last run: a check that skipped the seal has nothing to
    // say about it, and showing null there would lose the number somebody
    // recorded the week before.
    const sealed = template.sections.filter((section) => section.hasSeal);
    const lastSeal = new Map(
      await Promise.all(
        sealed.map(async (section) => {
          const entry = await this.prisma.checksheetSectionEntry.findFirst({
            where: {
              sectionId: section.id,
              ...(assetId ? { run: { assetId } } : {}),
            },
            orderBy: { run: { completedAt: 'desc' } },
          });
          return [section.id, entry] as const;
        }),
      ),
    );
    return {
      template,
      previousRunAt: previous?.completedAt ?? null,
      // What the seal said last time, so the person checking is confirming a
      // number rather than transcribing one into a void. A seal that has
      // changed since is the thing worth noticing.
      sections: sealed.map((section) => ({
        sectionId: section.id,
        heading: section.heading,
        lastSealNumber: lastSeal.get(section.id)?.sealNumber ?? null,
        lastSealPresent: lastSeal.get(section.id)?.sealPresent ?? null,
      })),
      items: template.items.map((item) => {
        const last = lastByItem.get(item.id);
        return {
          itemId: item.id,
          expirySlots: expirySlots(item),
          lastExpiries: (last?.expiries ?? [])
            .sort((a, b) => a.position - b.position)
            .map((row) => row.expiresAt.toISOString().slice(0, 10)),
        };
      }),
    };
  }

  /**
   * Records a completed sheet.
   *
   * Anyone may do this: a check is worth more done by whoever is standing at
   * the truck than gated behind a permission and therefore not done.
   */
  async complete(
    auth: AuthContext,
    input: {
      templateId: number;
      assetId?: number;
      comment?: string;
      entries: EntryInput[];
      sections?: SectionEntryInput[];
    },
  ) {
    const template = await this.template(input.templateId);
    if (template.assetKindId && !input.assetId) {
      throw new BadRequestException(
        `${template.name} is filled in against a particular ${template.assetKind?.name ?? 'asset'} — pick one.`,
      );
    }
    if (input.assetId) {
      const asset = await this.prisma.asset.findUnique({
        where: { id: input.assetId },
      });
      if (!asset) throw new NotFoundException('No such asset');
      if (template.assetKindId && asset.kindId !== template.assetKindId) {
        throw new BadRequestException(
          `${asset.name} is not the kind of thing ${template.name} checks.`,
        );
      }
    }

    const items = template.items as ItemShape[];
    const known = new Map(items.map((item) => [item.id, item]));
    for (const entry of input.entries) {
      const item = known.get(entry.itemId);
      if (!item) {
        throw new BadRequestException(
          `Item ${entry.itemId} is not on this checksheet`,
        );
      }
      for (const date of entry.expiries ?? []) {
        if (!isDateOnly(date)) {
          throw new BadRequestException(`${date} is not a date`);
        }
      }
      if (
        item.kind === 'PAR' &&
        entry.countPresent !== undefined &&
        entry.countPresent < 0
      ) {
        throw new BadRequestException(
          `${item.label}: a count cannot be negative`,
        );
      }
    }

    // A sealed section is a claim that what is inside is good. Something in
    // there having expired makes that claim false, so the seal has to come
    // off before the sheet can be filed — the sheet is not the place to
    // record a problem and leave it sealed in.
    const unbroken = sealsNeedingBreak(
      template.sections,
      items,
      input.entries,
      input.sections ?? [],
      nyToday().toISOString().slice(0, 10),
    );
    if (unbroken.length) {
      throw new BadRequestException(
        `${unbroken.map((section) => section.heading).join(' and ')}: something in ` +
          `${unbroken.length > 1 ? 'these sections has' : 'this section has'} expired, so the ` +
          'seal has to be broken and the item dealt with before this can be filed.',
      );
    }

    const memberId = auth.kind === 'member' ? auth.memberId : null;
    const run = await this.prisma.checksheetRun.create({
      data: {
        templateId: template.id,
        assetId: input.assetId ?? null,
        completedById: memberId,
        comment: input.comment?.trim() || null,
        sectionEntries: {
          // Only the sections that actually carry a seal; anything else sent
          // is ignored rather than stored as a row meaning nothing.
          create: (input.sections ?? [])
            .filter((entry) =>
              template.sections.some(
                (section) => section.id === entry.sectionId && section.hasSeal,
              ),
            )
            .map((entry) => ({
              sectionId: entry.sectionId,
              sealPresent: entry.sealPresent ?? false,
              sealNumber: entry.sealNumber?.trim() || null,
              sealBroken: entry.sealBroken ?? false,
              note: entry.note?.trim() || null,
            })),
        },
        entries: {
          create: input.entries.map((entry) => {
            const item = known.get(entry.itemId)!;
            const slots = expirySlots(item);
            return {
              itemId: entry.itemId,
              present:
                item.kind === 'PRESENCE' ? (entry.present ?? null) : null,
              countPresent:
                item.kind === 'PAR' ? (entry.countPresent ?? null) : null,
              note: entry.note?.trim() || null,
              expiries: {
                // Extra dates are dropped rather than stored: an item that
                // logs one date has one, whatever the client sent.
                create: (entry.expiries ?? [])
                  .slice(0, slots)
                  .map((date, position) => ({
                    position,
                    expiresAt: toDbDate(date),
                  })),
              },
            };
          }),
        },
      },
      include: { entries: true },
    });

    const found = shortfalls(items, input.entries);
    const { opened, resolved } = await this.reconcileDeficiencies(
      template.id,
      input.assetId ?? null,
      run.id,
      found,
      memberId,
    );

    await this.notifyCompleted(template, run.id, input.assetId ?? null, {
      shortfalls: found.length,
      opened,
      resolved,
      comment: input.comment?.trim() || null,
      by: memberId,
    });

    return { runId: run.id, shortfalls: found.length, opened, resolved };
  }

  /**
   * Brings the open deficiency list into line with what this check found.
   *
   * Something still short keeps its original deficiency and gets a fresh
   * sighting rather than a second entry; something no longer short is closed
   * by this run, so the list is what is wrong now rather than a diary of
   * everything that was ever wrong.
   */
  private async reconcileDeficiencies(
    templateId: number,
    assetId: number | null,
    runId: number,
    found: ReturnType<typeof shortfalls>,
    memberId: number | null,
  ) {
    const open = await this.prisma.checksheetDeficiency.findMany({
      where: { templateId, assetId, resolvedAt: null },
    });
    const openByItem = new Map(open.map((row) => [row.itemId, row]));
    const foundIds = new Set(found.map((row) => row.itemId));
    const now = new Date();

    let opened = 0;
    for (const shortfall of found) {
      const existing = openByItem.get(shortfall.itemId);
      if (existing) {
        await this.prisma.checksheetDeficiency.update({
          where: { id: existing.id },
          data: {
            lastSeenAt: now,
            detail: shortfall.detail,
            expected: shortfall.expected,
            found: shortfall.found,
          },
        });
        continue;
      }
      await this.prisma.checksheetDeficiency.create({
        data: {
          templateId,
          assetId,
          itemId: shortfall.itemId,
          openedRunId: runId,
          detail: shortfall.detail,
          expected: shortfall.expected,
          found: shortfall.found,
          lastSeenAt: now,
        },
      });
      opened += 1;
    }

    const fixed = open.filter((row) => !foundIds.has(row.itemId));
    if (fixed.length) {
      await this.prisma.checksheetDeficiency.updateMany({
        where: { id: { in: fixed.map((row) => row.id) } },
        data: {
          resolvedAt: now,
          resolvedById: memberId,
          resolvedRunId: runId,
          resolutionNote: 'Found in place on a later check',
        },
      });
    }
    return { opened, resolved: fixed.length };
  }

  private async notifyCompleted(
    template: { id: number; name: string; notifyRoles: Array<{ id: number }> },
    runId: number,
    assetId: number | null,
    summary: {
      shortfalls: number;
      opened: number;
      resolved: number;
      comment: string | null;
      by: number | null;
    },
  ) {
    if (!template.notifyRoles.length) return;
    const asset = assetId
      ? await this.prisma.asset.findUnique({ where: { id: assetId } })
      : null;
    const who = summary.by
      ? await this.prisma.member.findUnique({
          where: { id: summary.by },
          select: { firstName: true, preferredFirstName: true, lastName: true },
        })
      : null;

    const recipients = await this.prisma.memberRole.findMany({
      where: {
        roleId: { in: template.notifyRoles.map((role) => role.id) },
        startDate: { lte: nyToday() },
        OR: [{ endDate: null }, { endDate: { gte: nyToday() } }],
        member: { active: true },
      },
      select: { memberId: true },
      distinct: ['memberId'],
    });

    const subject = `${template.name}${asset ? ` — ${asset.name}` : ''} checked${
      summary.shortfalls ? `: ${summary.shortfalls} short` : ''
    }`;
    const lines = [
      `${who ? displayName(who) : 'Somebody'} completed ${template.name}${asset ? ` for ${asset.name}` : ''}.`,
      summary.shortfalls
        ? `${summary.shortfalls} item${summary.shortfalls === 1 ? '' : 's'} short or missing.`
        : 'Everything present.',
      summary.resolved
        ? `${summary.resolved} earlier problem${summary.resolved === 1 ? '' : 's'} now resolved.`
        : '',
      summary.comment ? `\n"${summary.comment}"` : '',
    ].filter(Boolean);

    for (const recipient of recipients) {
      await this.notifications.notify(recipient.memberId, {
        type: 'checksheet.completed',
        subject,
        body: lines.join(' '),
        // Not a task: it is news. Something needing action becomes a
        // deficiency, which has its own list and its own life.
        task: undefined,
        about: { type: 'ChecksheetRun', id: runId },
      });
    }
  }

  // ---------------------------------------------------------- deficiencies

  openDeficiencies(assetId?: number) {
    return this.prisma.checksheetDeficiency.findMany({
      where: { resolvedAt: null, ...(assetId ? { assetId } : {}) },
      include: {
        asset: true,
        item: { select: { id: true, label: true } },
        template: { select: { id: true, name: true } },
      },
      orderBy: [{ openedAt: 'asc' }],
    });
  }

  async resolveDeficiency(auth: AuthContext, id: number, note?: string) {
    const deficiency = await this.prisma.checksheetDeficiency.findUnique({
      where: { id },
    });
    if (!deficiency) throw new NotFoundException('No such deficiency');
    if (deficiency.resolvedAt) {
      throw new BadRequestException('That one is already resolved');
    }
    const updated = await this.prisma.checksheetDeficiency.update({
      where: { id },
      data: {
        resolvedAt: new Date(),
        resolvedById: auth.kind === 'member' ? auth.memberId : null,
        resolutionNote: note?.trim() || null,
      },
    });
    await this.audit.log(
      auth,
      'checksheets.deficiency.resolve',
      'ChecksheetDeficiency',
      id,
      {
        note,
      },
    );
    return updated;
  }

  // -------------------------------------------------------------- expiries

  /**
   * What is expiring, as of the most recent check of each thing.
   *
   * Read from the latest run per item rather than from every run, or a date
   * corrected on Tuesday would go on being reported from Monday's sheet.
   */
  async expiring(withinDays = DEFAULT_EXPIRY_WARNING_DAYS) {
    const cutoff = toDbDate(
      addDays(nyToday().toISOString().slice(0, 10), withinDays),
    );
    const rows = await this.prisma.checksheetExpiry.findMany({
      where: { expiresAt: { lte: cutoff } },
      include: {
        entry: {
          include: {
            item: { select: { id: true, label: true, templateId: true } },
            run: {
              select: {
                id: true,
                completedAt: true,
                assetId: true,
                templateId: true,
                asset: { select: { id: true, name: true } },
                template: { select: { id: true, name: true } },
              },
            },
          },
        },
      },
      orderBy: { expiresAt: 'asc' },
    });

    // Only the newest sighting of each (asset, item, position).
    const newest = new Map<string, (typeof rows)[number]>();
    for (const row of rows) {
      const key = `${row.entry.run.assetId ?? 0}:${row.entry.itemId}:${row.position}`;
      const held = newest.get(key);
      if (!held || held.entry.run.completedAt < row.entry.run.completedAt) {
        newest.set(key, row);
      }
    }
    const today = nyToday();
    return [...newest.values()]
      .map((row) => ({
        expiresAt: row.expiresAt,
        expired: row.expiresAt < today,
        item: row.entry.item,
        asset: row.entry.run.asset,
        template: row.entry.run.template,
        lastCheckedAt: row.entry.run.completedAt,
        // The check that recorded this date, so a deficiency raised from it
        // can point at where the date came from.
        runId: row.entry.run.id,
        templateId: row.entry.run.templateId,
        assetId: row.entry.run.assetId,
        itemId: row.entry.itemId,
      }))
      .sort((a, b) => a.expiresAt.getTime() - b.expiresAt.getTime());
  }

  /**
   * Opens a deficiency for anything already expired that has not got one.
   *
   * A completed check finds what had expired on the day it was done. A date
   * passes on its own afterwards, and nothing was noticing: the expiry report
   * computes from the date and showed the item, while the deficiency list —
   * which only ever learned at check time — said the asset was fine until
   * somebody happened to check it again. On a bag checked monthly that is
   * weeks of an expired drug on the shelf and nothing asking for it.
   *
   * Keyed the same way reconciliation keys them, so the next completed check
   * either finds it still expired and keeps it, or finds a fresh date and
   * closes it. Nothing here resolves anything — a sweep can see that
   * something is wrong, but only a check can see that it has been put right.
   */
  async openExpiredDeficiencies(): Promise<number> {
    const expired = (await this.expiring(0)).filter((row) => row.expired);
    if (!expired.length) return 0;

    const open = await this.prisma.checksheetDeficiency.findMany({
      where: { resolvedAt: null },
      select: { templateId: true, itemId: true, assetId: true },
    });
    const key = (row: {
      templateId: number;
      itemId: number;
      assetId: number | null;
    }) => `${row.templateId}:${row.itemId}:${row.assetId ?? 0}`;
    const already = new Set(open.map(key));

    // One deficiency per item however many of its units have gone off: the
    // list is jobs to do, and replacing them is one job.
    const wanted = new Map<string, (typeof expired)[number]>();
    for (const row of expired) {
      const id = key(row);
      if (already.has(id)) continue;
      const held = wanted.get(id);
      if (!held || row.expiresAt < held.expiresAt) wanted.set(id, row);
    }
    if (!wanted.size) return 0;

    const now = new Date();
    await this.prisma.checksheetDeficiency.createMany({
      data: [...wanted.values()].map((row) => ({
        templateId: row.templateId,
        itemId: row.itemId,
        assetId: row.assetId,
        openedRunId: row.runId,
        // Worded as the check-time path words it, so the list reads the same
        // whether a person or the sweep noticed.
        detail: `${row.item.label} — expired ${row.expiresAt.toISOString().slice(0, 10)}`,
        expected: null,
        found: null,
        lastSeenAt: now,
      })),
    });
    return wanted.size;
  }

  // ------------------------------------------------------------------- due

  /**
   * What is due or overdue: every active template, against every asset of the
   * kind it applies to.
   */
  async dueList() {
    const templates = await this.prisma.checksheetTemplate.findMany({
      where: { active: true },
      include: {
        assetKind: { include: { assets: { where: { active: true } } } },
      },
    });

    const out: Array<{
      template: { id: number; name: string; cadence: string };
      asset: { id: number; name: string } | null;
      lastCompletedAt: Date | null;
      dueInDays: number | null;
      overdue: boolean;
      neverCompleted: boolean;
    }> = [];

    for (const template of templates) {
      const targets = template.assetKind
        ? template.assetKind.assets.map((asset) => ({
            id: asset.id,
            name: asset.name,
          }))
        : [null];
      for (const asset of targets) {
        const last = await this.prisma.checksheetRun.findFirst({
          where: { templateId: template.id, assetId: asset?.id ?? null },
          orderBy: { completedAt: 'desc' },
          select: { completedAt: true },
        });
        const state = dueState(template.cadence, last?.completedAt ?? null);
        out.push({
          template: {
            id: template.id,
            name: template.name,
            cadence: template.cadence,
          },
          asset,
          lastCompletedAt: last?.completedAt ?? null,
          ...state,
        });
      }
    }
    // Overdue first, then soonest due; the rest by name.
    return out.sort((a, b) => {
      if (a.overdue !== b.overdue) return a.overdue ? -1 : 1;
      if (a.dueInDays !== null && b.dueInDays !== null) {
        return a.dueInDays - b.dueInDays;
      }
      return a.template.name.localeCompare(b.template.name);
    });
  }

  // ------------------------------------------------------------------ runs

  async runs(filter: { templateId?: number; assetId?: number; take?: number }) {
    return this.prisma.checksheetRun.findMany({
      where: {
        ...(filter.templateId ? { templateId: filter.templateId } : {}),
        ...(filter.assetId ? { assetId: filter.assetId } : {}),
      },
      include: {
        template: { select: { id: true, name: true } },
        asset: { select: { id: true, name: true } },
        completedBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { completedAt: 'desc' },
      take: Math.min(filter.take ?? 100, 500),
    });
  }

  async run(id: number) {
    const run = await this.prisma.checksheetRun.findUnique({
      where: { id },
      include: {
        template: { include: TEMPLATE_SHAPE },
        asset: true,
        completedBy: {
          select: {
            id: true,
            firstName: true,
            preferredFirstName: true,
            lastName: true,
          },
        },
        entries: { include: { expiries: { orderBy: { position: 'asc' } } } },
      },
    });
    if (!run) throw new NotFoundException('No such checksheet run');
    return run;
  }

  /** A member may always read their own; anything else needs the permission. */
  async runFor(auth: AuthContext, id: number) {
    const run = await this.run(id);
    const mine = auth.kind === 'member' && run.completedById === auth.memberId;
    if (!mine && !auth.permissions.has('checksheets:read-all')) {
      throw new ForbiddenException('Not your checksheet');
    }
    return run;
  }
}
