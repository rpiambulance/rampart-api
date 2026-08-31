import { generateInviteCode, inviteProblem } from './requests.service';

const now = new Date('2026-08-31T12:00:00Z');
const open = {
  closedAt: null,
  expiresAt: null,
  maxUses: null,
  uses: 0,
};

/**
 * An invite code is the only unauthenticated way to reach the roster, so
 * every reason one stops working matters more than the reason it starts.
 */
describe('invite codes', () => {
  it('accepts an open one', () => {
    expect(inviteProblem(open, now)).toBeNull();
  });

  it('refuses a code nobody issued', () => {
    // Says "not one of ours" rather than "no such code": the answer must not
    // tell somebody guessing whether they are getting warmer.
    expect(inviteProblem(null, now)).toMatch(/not one of ours/);
  });

  it('refuses one that has been closed', () => {
    expect(inviteProblem({ ...open, closedAt: now }, now)).toMatch(/closed/);
  });

  it('refuses one whose date has passed', () => {
    expect(
      inviteProblem(
        { ...open, expiresAt: new Date('2026-08-30T00:00:00Z') },
        now,
      ),
    ).toMatch(/expired/);
  });

  it('accepts one whose date is still ahead', () => {
    expect(
      inviteProblem(
        { ...open, expiresAt: new Date('2026-09-30T00:00:00Z') },
        now,
      ),
    ).toBeNull();
  });

  it('counts uses against a limit, and stops at it', () => {
    expect(inviteProblem({ ...open, maxUses: 3, uses: 2 }, now)).toBeNull();
    expect(inviteProblem({ ...open, maxUses: 3, uses: 3 }, now)).toMatch(
      /as many times/,
    );
    // Over the limit as well as at it — a race that let two through at once
    // must not leave the code open afterwards.
    expect(inviteProblem({ ...open, maxUses: 3, uses: 4 }, now)).toMatch(
      /as many times/,
    );
  });

  it('treats no limit as no limit', () => {
    expect(
      inviteProblem({ ...open, maxUses: null, uses: 900 }, now),
    ).toBeNull();
  });
});

describe('the generated code', () => {
  it('avoids characters that are read wrong aloud or on paper', () => {
    // These get printed on posters and read down a phone. O/0 and I/1 are
    // the ones that come back as a code that does not work.
    const code = generateInviteCode(
      Buffer.from(Array.from({ length: 64 }, (_, i) => i)),
    );
    expect(code).not.toMatch(/[O0I1]/);
    expect(code).toMatch(/^[A-Z2-9]+$/);
  });

  it('is as long as the bytes it was given', () => {
    expect(generateInviteCode(Buffer.from([1, 2, 3, 4]))).toHaveLength(4);
  });
});
