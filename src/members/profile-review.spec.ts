import { ProfileReviewService } from './profile-review.service';

const at = (iso: string) => new Date(iso);

/**
 * Whether a member still owes anybody an answer about their own details.
 *
 * Held as two timestamps rather than a flag, so the question is always
 * "asked more recently than answered?" — which cannot drift out of step, and
 * cannot lose an answer given between two asks.
 */
describe('outstanding profile review', () => {
  it('is nothing to do when nobody has asked', () => {
    expect(
      ProfileReviewService.isOutstanding({
        profileReviewRequestedAt: null,
        profileConfirmedAt: null,
      }),
    ).toBe(false);
  });

  it('is outstanding when asked and never answered', () => {
    expect(
      ProfileReviewService.isOutstanding({
        profileReviewRequestedAt: at('2026-08-01T12:00:00Z'),
        profileConfirmedAt: null,
      }),
    ).toBe(true);
  });

  it('is settled once confirmed after the request', () => {
    expect(
      ProfileReviewService.isOutstanding({
        profileReviewRequestedAt: at('2026-08-01T12:00:00Z'),
        profileConfirmedAt: at('2026-08-02T09:00:00Z'),
      }),
    ).toBe(false);
  });

  it('is outstanding again when asked afresh', () => {
    // A member who confirmed in March is asked again in August, and owes an
    // answer again — the old confirmation does not cover the new request.
    expect(
      ProfileReviewService.isOutstanding({
        profileReviewRequestedAt: at('2026-08-01T12:00:00Z'),
        profileConfirmedAt: at('2026-03-02T09:00:00Z'),
      }),
    ).toBe(true);
  });

  it('does not lose an answer given moments after the ask', () => {
    expect(
      ProfileReviewService.isOutstanding({
        profileReviewRequestedAt: at('2026-08-01T12:00:00Z'),
        profileConfirmedAt: at('2026-08-01T12:00:01Z'),
      }),
    ).toBe(false);
  });
});
