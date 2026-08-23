import { currentCrewNight } from './crew-night';

/** The UTC instant for a wall-clock time in New York, in August (EDT, -4). */
const edt = (day: number, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(2026, 7, day, h + 4, m));
};

/** And in January (EST, -5), to catch anything that assumed one offset. */
const est = (day: number, hhmm: string) => {
  const [h, m] = hhmm.split(':').map(Number);
  return new Date(Date.UTC(2026, 0, day, h + 5, m));
};

describe('which crew night is on', () => {
  it('is tonight once the crew has come on', () => {
    expect(currentCrewNight(edt(20, '18:00'))).toBe('2026-08-20');
    expect(currentCrewNight(edt(20, '23:59'))).toBe('2026-08-20');
  });

  it('is still last night after midnight', () => {
    // The crew on the road at 0200 signed up for the 20th, and that is who
    // the supervisor question is about.
    expect(currentCrewNight(edt(21, '00:01'))).toBe('2026-08-20');
    expect(currentCrewNight(edt(21, '05:59'))).toBe('2026-08-20');
  });

  it('rolls over at 0600, when the crew goes off', () => {
    expect(currentCrewNight(edt(21, '06:00'))).toBe('2026-08-21');
  });

  it('names the night about to start during the day', () => {
    // Nobody is on the road at noon. Tonight's supervisor is the only
    // answer anyone could act on.
    expect(currentCrewNight(edt(21, '12:00'))).toBe('2026-08-21');
  });

  it('works either side of the daylight-saving change', () => {
    expect(currentCrewNight(est(15, '02:00'))).toBe('2026-01-14');
    expect(currentCrewNight(est(15, '20:00'))).toBe('2026-01-15');
  });

  it('crosses a month boundary backwards', () => {
    expect(currentCrewNight(edt(1, '03:00'))).toBe('2026-07-31');
  });
});
