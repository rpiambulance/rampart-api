import { CertificationsService } from './certifications.service';
import { RequirementEvidenceService } from './requirement-evidence.service';
import { nyToday } from '../common/dates';

/**
 * Which requirements can take a credential away from somebody.
 *
 * The distinction exists because of people whose records predate the rules:
 * members migrated in from the old system, and members force-promoted before a
 * requirement was written. A promotion requirement judges them once, at a
 * moment that has already passed; an ongoing one judges them every night
 * forever, and will happily strip a crew chief over a card nobody asked them
 * for when they were promoted.
 */

type Req = {
  id: number;
  credentialTypeId: number;
  kind: string;
  scope: string;
  effectiveFrom: Date | null;
  effectiveUntil: Date | null;
  countsFrom: Date | null;
  validThrough: Date | null;
  announcedAt: Date | null;
  alternativeGroup: string | null;
  certificationTypeId: number;
  evalTemplateId: null;
  classId: null;
  classSeriesId: null;
  count: null;
};

function serviceWith(options: {
  requirements: Req[];
  /** typeId -> ids that satisfy it, mirroring CertificationGraphService. */
  ladder?: Record<number, number[]>;
  /** Credential holders, and whether each holds a current certification. */
  holders: Array<{
    id: number;
    memberId: number;
    status: string;
    /** True, or the certification type ids actually held. */
    holdsCert: boolean | number[];
    /** When what they hold was issued, for requirements that ask. */
    issuedAt?: Date;
  }>;
  waivers?: Array<{ memberId: number; requirementId: number }>;
}) {
  const updates: Array<{ id: number; status: string }> = [];
  const notified: Array<{ type: string }> = [];

  const matches = (req: Req, now: Date) =>
    ['ONGOING', 'BOTH'].includes(req.scope) &&
    (req.effectiveFrom === null || req.effectiveFrom <= now) &&
    (req.effectiveUntil === null || req.effectiveUntil >= now);

  const prisma = {
    // Names for the reasons shown on a proposed suspension.
    certificationType: {
      findMany: () => Promise.resolve([{ id: 5, name: 'CPR — BLS Provider' }]),
    },
    appSetting: {
      findUnique: () => Promise.resolve(null),
      upsert: () => Promise.resolve({}),
      delete: () => Promise.resolve({}),
    },
    memberCredential: {
      findMany: () => {
        // Stands in for the nested `where` Prisma would apply to requirements.
        const now = nyToday();
        return Promise.resolve(
          options.holders.map((holder) => ({
            ...holder,
            typeId: 1,
            member: { firstName: 'Test', lastName: 'Member' },
            type: {
              name: 'Crew Chief',
              requirements: options.requirements.filter((r) => matches(r, now)),
            },
          })),
        );
      },
      update: ({
        where,
        data,
      }: {
        where: { id: number };
        data: { status: string };
      }) => {
        updates.push({ id: where.id, status: data.status });
        return Promise.resolve({});
      },
    },
    memberCertification: {
      findMany: ({
        where,
      }: {
        where: {
          memberId: number;
          typeId?: { in: number[] };
          issuedAt?: { gte: Date };
        };
      }) => {
        const holder = options.holders.find(
          (h) => h.memberId === where.memberId,
        );
        if (!holder) return Promise.resolve([]);
        const held = [{ expiresAt: null }];
        if (
          where.issuedAt &&
          (!holder.issuedAt || holder.issuedAt < where.issuedAt.gte)
        ) {
          return Promise.resolve([]);
        }
        // A list means "these are the type ids they actually hold", and the
        // query's accepted set decides — which is what makes the ladder
        // testable rather than assumed.
        if (Array.isArray(holder.holdsCert)) {
          const accepted = where.typeId?.in ?? [];
          const match = holder.holdsCert.some((id) => accepted.includes(id));
          return Promise.resolve(match ? held : []);
        }
        return Promise.resolve(holder.holdsCert ? held : []);
      },
    },
    promotionRequirementAdjustment: {
      findMany: ({ where }: { where: { memberId: number } }) =>
        Promise.resolve(
          (options.waivers ?? [])
            .filter((w) => w.memberId === where.memberId)
            .map((w) => ({ requirementId: w.requirementId })),
        ),
    },
  };
  const audit = { log: () => Promise.resolve() };
  const notifications = {
    notifyPermissionHolders: (_p: string, message: { type: string }) => {
      notified.push(message);
      return Promise.resolve();
    },
  };
  const graph = {
    satisfying: (id: number) => Promise.resolve(options.ladder?.[id] ?? [id]),
  };
  const service = new CertificationsService(
    graph as never,
    // The credential graph: no ladder in these tests, so nothing is
    // inherited and each credential is judged on its own requirements.
    { idsBelow: () => Promise.resolve([]) } as never,
    prisma as never,
    {} as never,
    audit as never,
    notifications as never,
    new RequirementEvidenceService(
      prisma as never,
      graph as never,
      {} as never,
    ),
  );
  return { service, updates, notified };
}

const ongoing: Req = {
  id: 10,
  credentialTypeId: 1,
  kind: 'CERTIFICATION',
  scope: 'ONGOING',
  effectiveFrom: null,
  effectiveUntil: null,
  countsFrom: null,
  validThrough: null,
  announcedAt: null,
  alternativeGroup: null,
  certificationTypeId: 5,
  evalTemplateId: null,
  classId: null,
  classSeriesId: null,
  count: null,
};

describe('ongoing vs promotion requirements', () => {
  it('leaves a lapsed member alone when the rule is only about promotion', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, scope: 'PROMOTION' }],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  it('suspends a lapsed member when the rule is ongoing', async () => {
    const { service, updates } = serviceWith({
      requirements: [ongoing],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });

  it('honors a waiver, which is what grandfathering writes', async () => {
    const { service, updates } = serviceWith({
      requirements: [ongoing],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
      waivers: [{ memberId: 7, requirementId: 10 }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  it('does not bite before the date it comes into force', async () => {
    const future = new Date(Date.UTC(2999, 0, 1));
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, effectiveFrom: future }],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  it('gives a credential back when the rule is relaxed', async () => {
    const { service, updates } = serviceWith({
      requirements: [],
      holders: [{ id: 1, memberId: 7, status: 'SUSPENDED', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'ACTIVE' }]);
  });

  it('refuses to suspend a crowd, and says so', async () => {
    // Twelve members failing the same rule on the same night is a rule that
    // was just switched on, not twelve people who all let a card lapse.
    const holders = Array.from({ length: 12 }, (_, i) => ({
      id: i + 1,
      memberId: i + 1,
      status: 'ACTIVE',
      holdsCert: false,
    }));
    const { service, updates, notified } = serviceWith({
      requirements: [ongoing],
      holders,
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
    expect(notified.map((n) => n.type)).toEqual(['credential.mass-suspension']);
  });

  it('still weighs one member on their own merits', async () => {
    // The crowd guard is about a bad rule, so it must not stop an officer
    // recomputing a single member.
    const { service, updates } = serviceWith({
      requirements: [ongoing],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions(7);
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });

  it('accepts a certification that outranks the one required', async () => {
    // The requirement names EMT (5). The member holds Paramedic (7), which
    // outranks it. Matching the exact type would suspend every medic on the
    // roster for not holding the card they outrank.
    const { service, updates } = serviceWith({
      requirements: [ongoing],
      ladder: { 5: [5, 6, 7] },
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: [7] }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  it('still suspends somebody holding only something lower', async () => {
    // CFR (4) is below EMT (5) and does not answer it.
    const { service, updates } = serviceWith({
      requirements: [ongoing],
      ladder: { 5: [5, 6, 7] },
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: [4] }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });
});

describe('requirements with dates', () => {
  const day = (offset: number) => {
    const d = nyToday();
    d.setUTCDate(d.getUTCDate() + offset);
    return d;
  };
  const crowd = (n: number) =>
    Array.from({ length: n }, (_, i) => ({
      id: i + 1,
      memberId: i + 1,
      status: 'ACTIVE',
      holdsCert: false,
    }));

  it('stops applying once its season is over', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, effectiveUntil: day(-1) }],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  it('applies through the last day of its season', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, effectiveUntil: day(0) }],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });

  it('gives the credential back when the season ends', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, effectiveUntil: day(-1) }],
      holders: [{ id: 1, memberId: 7, status: 'SUSPENDED', holdsCert: false }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'ACTIVE' }]);
  });

  // Last season's flu shot is on file and verified, but it is not this
  // season's.
  it('does not count something from before the date it counts from', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, countsFrom: day(-30) }],
      holders: [
        {
          id: 1,
          memberId: 7,
          status: 'ACTIVE',
          holdsCert: true,
          issuedAt: day(-400),
        },
      ],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });

  it('counts something from on or after it', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, countsFrom: day(-30) }],
      holders: [
        {
          id: 1,
          memberId: 7,
          status: 'ACTIVE',
          holdsCert: true,
          issuedAt: day(-30),
        },
      ],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  // A renewal cycle that ended without the next one being set: everything
  // on record is last cycle's.
  it('counts nothing once the cycle has ended', async () => {
    const { service, updates } = serviceWith({
      requirements: [{ ...ongoing, validThrough: day(-1) }],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: true }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([{ id: 1, status: 'SUSPENDED' }]);
  });

  it('is met by either of two alternatives', async () => {
    const { service, updates } = serviceWith({
      requirements: [
        { ...ongoing, alternativeGroup: 'Vaccination' },
        {
          ...ongoing,
          id: 11,
          certificationTypeId: 6,
          alternativeGroup: 'Vaccination',
        },
      ],
      holders: [{ id: 1, memberId: 7, status: 'ACTIVE', holdsCert: [6] }],
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
  });

  // Everybody was told, twice. Holding it back would leave every seasonal
  // rule needing an officer to push it through by hand.
  it('lets a crowd through when the rule was announced', async () => {
    const { service, updates, notified } = serviceWith({
      requirements: [
        { ...ongoing, effectiveFrom: day(0), announcedAt: day(-14) },
      ],
      holders: crowd(12),
    });
    await service.recomputeSuspensions();
    expect(updates).toHaveLength(12);
    expect(notified).toEqual([]);
  });

  // A cut-off nobody moved is the likeliest way for a whole roster to fail
  // at once, and nobody was warned it would cost them anything.
  it('holds a crowd back when a cycle ended, even if announced', async () => {
    const { service, updates, notified } = serviceWith({
      requirements: [
        { ...ongoing, validThrough: day(-1), announcedAt: day(-60) },
      ],
      holders: crowd(12).map((h) => ({ ...h, holdsCert: true })),
    });
    await service.recomputeSuspensions();
    expect(updates).toEqual([]);
    expect(notified.map((n) => n.type)).toEqual(['credential.mass-suspension']);
  });
});
