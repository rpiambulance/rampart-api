import { CertificationsService } from './certifications.service';
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
  kind: string;
  scope: string;
  effectiveFrom: Date | null;
  certificationTypeId: number;
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
  }>;
  waivers?: Array<{ memberId: number; requirementId: number }>;
}) {
  const updates: Array<{ id: number; status: string }> = [];
  const notified: Array<{ type: string }> = [];

  const matches = (req: Req, now: Date) =>
    req.kind === 'CERTIFICATION' &&
    ['ONGOING', 'BOTH'].includes(req.scope) &&
    (req.effectiveFrom === null || req.effectiveFrom <= now);

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
      findFirst: ({
        where,
      }: {
        where: { memberId: number; typeId?: { in: number[] } };
      }) => {
        const holder = options.holders.find(
          (h) => h.memberId === where.memberId,
        );
        if (!holder) return Promise.resolve(null);
        // A list means "these are the type ids they actually hold", and the
        // query's accepted set decides — which is what makes the ladder
        // testable rather than assumed.
        if (Array.isArray(holder.holdsCert)) {
          const accepted = where.typeId?.in ?? [];
          const match = holder.holdsCert.some((id) => accepted.includes(id));
          return Promise.resolve(match ? { id: 1 } : null);
        }
        return Promise.resolve(holder.holdsCert ? { id: 1 } : null);
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
  );
  return { service, updates, notified };
}

const ongoing: Req = {
  id: 10,
  kind: 'CERTIFICATION',
  scope: 'ONGOING',
  effectiveFrom: null,
  certificationTypeId: 5,
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

  it('honours a waiver, which is what grandfathering writes', async () => {
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
