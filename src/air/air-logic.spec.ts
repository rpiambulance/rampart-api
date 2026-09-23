import {
  crewIsOnTheRoad,
  rosterLines,
  shouldAsk,
  withinMatchWindow,
  withinWindow,
  fullCrewAmong,
  fullCrewLine,
  type ResponderSkills,
} from './air-logic';

/** A New York wall-clock time, as an instant. */
const at = (hhmm: string, date = '2026-09-13') =>
  new Date(`${date}T${hhmm}:00-04:00`);

const crewed = {
  outOfService: false,
  slots: [
    { position: 'CC', memberId: 1 },
    { position: 'DRIVER', memberId: 2 },
  ],
};

describe('crewIsOnTheRoad', () => {
  it('is true in the small hours with a crew chief and a driver', () => {
    expect(crewIsOnTheRoad(crewed, at('02:00'))).toBe(true);
    expect(crewIsOnTheRoad(crewed, at('19:30'))).toBe(true);
  });

  it('is false in the middle of the day, crew or no crew', () => {
    expect(crewIsOnTheRoad(crewed, at('13:00'))).toBe(false);
    // The handover hours themselves: nobody is out there at 06:00 or 17:59.
    expect(crewIsOnTheRoad(crewed, at('06:00'))).toBe(false);
    expect(crewIsOnTheRoad(crewed, at('17:59'))).toBe(false);
    expect(crewIsOnTheRoad(crewed, at('18:00'))).toBe(true);
  });

  it('is false on a night the agency is not running', () => {
    expect(
      crewIsOnTheRoad({ ...crewed, outOfService: true }, at('22:00')),
    ).toBe(false);
  });

  // The case the clock could never see: a night nobody signed up for.
  it('is false when the seats that matter are empty', () => {
    expect(
      crewIsOnTheRoad({ outOfService: false, slots: [] }, at('22:00')),
    ).toBe(false);
    expect(
      crewIsOnTheRoad(
        {
          outOfService: false,
          slots: [
            { position: 'CC', memberId: 1 },
            { position: 'DRIVER', memberId: null },
          ],
        },
        at('22:00'),
      ),
    ).toBe(false);
    // A rider and a duty supervisor are not an ambulance.
    expect(
      crewIsOnTheRoad(
        {
          outOfService: false,
          slots: [
            { position: 'ATTENDANT', memberId: 3 },
            { position: 'DUTY_SUP', memberId: 4 },
          ],
        },
        at('22:00'),
      ),
    ).toBe(false);
  });

  it('does not count a placeholder as somebody', () => {
    expect(
      crewIsOnTheRoad(
        {
          outOfService: false,
          slots: [
            { position: 'CC', memberId: null },
            { position: 'DRIVER', memberId: null },
          ],
        },
        at('22:00'),
      ),
    ).toBe(false);
  });

  it('is false when there is no crew at all', () => {
    expect(crewIsOnTheRoad(null, at('22:00'))).toBe(false);
  });
});

describe('shouldAsk', () => {
  it('asks by day', () => {
    expect(
      shouldAsk({ kind: 'DISPATCH', crew: crewed, now: at('13:00') }),
    ).toBe(true);
  });

  it('does not ask when a crew is out there', () => {
    expect(
      shouldAsk({ kind: 'DISPATCH', crew: crewed, now: at('23:00') }),
    ).toBe(false);
  });

  it('asks at night when nobody signed up', () => {
    expect(
      shouldAsk({
        kind: 'DISPATCH',
        crew: { outOfService: false, slots: [] },
        now: at('23:00'),
      }),
    ).toBe(true);
  });

  it('never asks about a longtone', () => {
    expect(shouldAsk({ kind: 'LONGTONE', crew: null, now: at('13:00') })).toBe(
      false,
    );
  });
});

describe('withinWindow', () => {
  it('takes a press up to the closing moment and not after', () => {
    const closes = at('13:12');
    expect(withinWindow(closes, at('13:11'))).toBe(true);
    expect(withinWindow(closes, at('13:12'))).toBe(true);
    expect(withinWindow(closes, at('13:13'))).toBe(false);
  });
});

describe('withinMatchWindow', () => {
  it('joins two signals minutes apart, in either order', () => {
    expect(withinMatchWindow(at('13:00'), at('13:07'))).toBe(true);
    expect(withinMatchWindow(at('13:07'), at('13:00'))).toBe(true);
  });

  it('leaves a later call as its own', () => {
    expect(withinMatchWindow(at('13:00'), at('13:20'))).toBe(false);
  });
});

describe('rosterLines', () => {
  it('says nobody rather than nothing', () => {
    expect(rosterLines([])).toEqual(['*Responding:* nobody yet']);
  });

  it('counts the yesses and lists the nos', () => {
    expect(
      rosterLines([
        { name: 'A. Rivera', responding: true },
        { name: 'C. Okonkwo', responding: false },
        { name: 'D. Wu', responding: true },
      ]),
    ).toEqual([
      '*Responding (2):* A. Rivera, D. Wu',
      '*Not responding:* C. Okonkwo',
    ]);
  });
});

describe('whether the people who answered can take a truck out', () => {
  const who = (
    name: string,
    skills: Partial<Omit<ResponderSkills, 'name'>> = {},
  ): ResponderSkills => ({
    name,
    cc: false,
    driver: false,
    probCC: false,
    probDriver: false,
    ccTrainer: false,
    driverTrainer: false,
    ...skills,
  });

  it('is a crew chief and a driver', () => {
    const crew = fullCrewAmong([
      who('Alice', { cc: true }),
      who('Bob', { driver: true }),
    ]);
    expect(crew?.cc.name).toBe('Alice');
    expect(crew?.driver.name).toBe('Bob');
    expect(fullCrewLine(crew)).toBe(
      '*Full crew responding* — Alice (CC), Bob (driver)',
    );
  });

  it('is not one person who could do both', () => {
    expect(
      fullCrewAmong([who('Alice', { cc: true, driver: true })]),
    ).toBeNull();
  });

  it('is not a chief with nobody to drive', () => {
    expect(fullCrewAmong([who('Alice', { cc: true }), who('Bob')])).toBeNull();
  });

  it('takes somebody who is both when a second person can drive', () => {
    const crew = fullCrewAmong([
      who('Alice', { cc: true, driver: true }),
      who('Bob', { driver: true }),
    ]);
    expect(crew?.cc.name).toBe('Alice');
    expect(crew?.driver.name).toBe('Bob');
  });

  // The way probationary crew chiefs get their hours.
  it('lets a trainer take the other seat', () => {
    const crew = fullCrewAmong([
      who('Alice', { probCC: true }),
      who('Bob', { driver: true, cc: true, ccTrainer: true }),
    ]);
    expect(crew?.cc.name).toBe('Alice');
    expect(crew?.driver.name).toBe('Bob');
    expect(crew?.ccTrainer?.name).toBe('Bob');
    expect(fullCrewLine(crew)).toBe(
      '*Full crew responding* — Alice (probationary CC, with Bob), Bob (driver)',
    );
  });

  it('refuses a probationary chief with no trainer anywhere', () => {
    expect(
      fullCrewAmong([
        who('Alice', { probCC: true }),
        who('Bob', { driver: true }),
      ]),
    ).toBeNull();
  });

  it('refuses a probationary driver with no trainer anywhere', () => {
    expect(
      fullCrewAmong([
        who('Alice', { cc: true }),
        who('Bob', { probDriver: true }),
      ]),
    ).toBeNull();
  });

  it('takes a third person as the trainer', () => {
    const crew = fullCrewAmong([
      who('Alice', { probCC: true }),
      who('Bob', { driver: true }),
      who('Carol', { cc: true, ccTrainer: true }),
    ]);
    expect(crew?.cc.name).toBe('Carol');
    expect(crew?.driver.name).toBe('Bob');
  });

  it('nobody supervises themselves', () => {
    expect(
      fullCrewAmong([
        who('Alice', { probCC: true, ccTrainer: true }),
        who('Bob', { driver: true }),
      ]),
    ).toBeNull();
  });

  it('covers two probationary seats with the trainers for each', () => {
    const crew = fullCrewAmong([
      who('Alice', { probCC: true }),
      who('Bob', { probDriver: true }),
      who('Carol', { cc: true, ccTrainer: true, driverTrainer: true }),
    ]);
    // Carol holds the chief's credential outright, so she takes that seat
    // and only the driver is riding probationary.
    expect(crew?.cc.name).toBe('Carol');
    expect(crew?.driver.name).toBe('Bob');
    expect(crew?.driverTrainer?.name).toBe('Carol');
  });

  it('lets an agency that does not require trainers run without one', () => {
    const crew = fullCrewAmong(
      [who('Alice', { probCC: true }), who('Bob', { probDriver: true })],
      false,
    );
    expect(crew?.cc.name).toBe('Alice');
    expect(crew?.driver.name).toBe('Bob');
  });

  it('says nothing when there is no crew', () => {
    expect(fullCrewLine(null)).toBeNull();
  });
});
