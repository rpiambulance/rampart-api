import { nyNow } from '../common/dates';
import type { CredentialGraphService } from '../credentials/credential-graph.service';
import type { SchedulingKnobs } from '../settings/settings.service';
import {
  CrewEligibilityService,
  type DayContext,
  type EligibilityInput,
} from './crew-eligibility.service';

const KNOBS: SchedulingKnobs = {
  minAgeYears: 18,
  publicWeeks: 2,
  riderSignupOpen: { weekday: 0, time: '16:00' },
  rotationWeeks: 2,
  dayOfUnlockTime: '12:00',
  probationaryRequiresTrainer: true,
  dropDeadline: { daysBefore: 2, time: '18:00' },
};

/** A graph that knows nothing: the plainest possible member. */
const graph = {
  satisfies: (held: Set<string>, key: string) => Promise.resolve(held.has(key)),
  outranksEverything: () => Promise.resolve(false),
} as unknown as CredentialGraphService;

const day = (over: Partial<DayContext> = {}): DayContext => ({
  memberOnThisDate: false,
  ccTrainerOn: false,
  driverTrainerOn: false,
  attendantFilled: false,
  observerFilled: false,
  ...over,
});

// A Wednesday, well inside the public window, asked about on the Monday
// before — so none of the global gates or the Sunday opening rule apply.
const NOW = nyNow(new Date('2026-09-07T12:00:00-04:00'));

const ask = (
  position: 'ATTENDANT' | 'OBSERVER',
  over: Partial<EligibilityInput> = {},
): EligibilityInput => ({
  member: { dob: new Date('2000-01-01'), heldKeys: new Set<string>() },
  position,
  dateStr: '2026-09-09',
  now: NOW,
  knobs: KNOBS,
  day: day(),
  memberDatesInRotation: [],
  ...over,
});

describe('the two rider seats', () => {
  const service = new CrewEligibilityService(graph);

  // The fault reported: the first rider seat asked for a credential the
  // second did not, while the schedule labeled both of them "Rider".
  it('asks nothing of the first seat that it does not ask of the second', async () => {
    const first = await service.check(ask('ATTENDANT'));
    expect(first).toEqual({ eligible: true, reason: '' });
  });

  it('offers only the first seat while both are open', async () => {
    const second = await service.check(ask('OBSERVER'));
    expect(second.eligible).toBe(false);
    expect(second.reason).toBe('Take the first rider seat');
  });

  it('offers the second once the first is taken', async () => {
    const second = await service.check(
      ask('OBSERVER', { day: day({ attendantFilled: true }) }),
    );
    expect(second).toEqual({ eligible: true, reason: '' });
  });

  // An officer can assign somebody straight into the second seat, which
  // bypasses all of this. The first seat must still be offered afterward.
  it('still offers the first seat when only the second is filled', async () => {
    const first = await service.check(
      ask('ATTENDANT', { day: day({ observerFilled: true }) }),
    );
    expect(first).toEqual({ eligible: true, reason: '' });
  });

  // Holding the attendant credential used to decide which seat you were
  // pushed toward. It decides nothing now.
  it('treats a credentialed attendant the same as anybody else', async () => {
    const held = new Set(['A']);
    expect(
      await service.check(
        ask('ATTENDANT', {
          member: { dob: new Date('2000-01-01'), heldKeys: held },
        }),
      ),
    ).toEqual({ eligible: true, reason: '' });
    expect(
      (
        await service.check(
          ask('OBSERVER', {
            member: { dob: new Date('2000-01-01'), heldKeys: held },
          }),
        )
      ).reason,
    ).toBe('Take the first rider seat');
  });

  // The rules that were never about which seat it is still apply to both.
  it('still holds both seats to the rotation limit', async () => {
    const over = { memberDatesInRotation: ['2026-09-07'] };
    for (const position of ['ATTENDANT', 'OBSERVER'] as const) {
      const result = await service.check(
        ask(position, { ...over, day: day({ attendantFilled: true }) }),
      );
      expect(result.eligible).toBe(false);
      expect(result.reason).toContain('one rider shift');
    }
  });
});
