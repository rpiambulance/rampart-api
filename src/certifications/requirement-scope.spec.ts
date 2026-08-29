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
  /** Credential holders, and whether each holds a current certification. */
  holders: Array<{
    id: number;
    memberId: number;
    status: string;
    holdsCert: boolean;
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
    memberCredential: {
      findMany: () => {
        // Stands in for the nested `where` Prisma would apply to requirements.
        const now = nyToday();
        return Promise.resolve(
          options.holders.map((holder) => ({
            ...holder,
            typeId: 1,
            type: {
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
      findFirst: ({ where }: { where: { memberId: number } }) => {
        const holder = options.holders.find(
          (h) => h.memberId === where.memberId,
        );
        return Promise.resolve(holder?.holdsCert ? { id: 1 } : null);
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
  const service = new CertificationsService(
    {} as never,
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
});
