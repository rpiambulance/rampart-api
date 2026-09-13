import {
  advisoryProblems,
  blockingProblems,
  encounterProblems,
  formCounts,
  inChargeConflict,
  inPatientList,
  onDohForms,
  mayReadAllEncounters,
  type EncounterShape,
} from './standby-logic';

const encounter = (over: Partial<EncounterShape> = {}): EncounterShape => ({
  category: 'MINOR_INJURY',
  disposition: 'TREATED_RELEASED',
  firstAidOnly: false,
  died: false,
  intoxicationSigns: false,
  runNumberId: 1,
  prid: 'P-123',
  ...over,
});

const fields = (problems: { field: string }[]) => problems.map((p) => p.field);

describe('what an encounter has to say before it is finished', () => {
  it('is content with a run number and a PRID', () => {
    expect(encounterProblems(encounter())).toEqual([]);
  });

  // The rule: everything past an ice pack gets a run number.
  it('asks for a run number when it is not first aid only', () => {
    expect(
      fields(encounterProblems(encounter({ runNumberId: null, prid: null }))),
    ).toContain('runNumberId');
  });

  it('lets an ice pack through with neither', () => {
    expect(
      encounterProblems(
        encounter({ firstAidOnly: true, runNumberId: null, prid: null }),
      ),
    ).toEqual([]);
  });

  // "First aid only" is a claim about how small it was. These say otherwise.
  it.each(['TRANSPORTED', 'TURNOVER'] as const)(
    'refuses first aid only on a %s',
    (disposition) => {
      expect(
        fields(
          encounterProblems(
            encounter({
              firstAidOnly: true,
              runNumberId: null,
              prid: null,
              disposition,
            }),
          ),
        ),
      ).toContain('firstAidOnly');
    },
  );

  it('refuses first aid only on a death', () => {
    expect(
      fields(
        encounterProblems(
          encounter({
            firstAidOnly: true,
            runNumberId: null,
            prid: null,
            died: true,
          }),
        ),
      ),
    ).toContain('firstAidOnly');
  });

  // A run number means a patient record exists somewhere with a PRID on it.
  it('asks for the PRID once there is a run number', () => {
    expect(fields(encounterProblems(encounter({ prid: '  ' })))).toContain(
      'prid',
    );
  });

  // The county number often arrives after the patient has gone, so it is
  // worth saying and not worth blocking on.
  it('mentions a missing county number without blocking the save', () => {
    const handed = encounter({
      disposition: 'TRANSPORTED',
      countyRunNumber: null,
    });
    expect(fields(advisoryProblems(handed))).toEqual(['countyRunNumber']);
    expect(fields(blockingProblems(handed))).toEqual([]);
  });

  it('notices a deceased disposition without the death ticked', () => {
    expect(
      fields(encounterProblems(encounter({ disposition: 'DECEASED' }))),
    ).toContain('died');
  });

  // The one hard limit on what may be held about a person.
  it('refuses anything longer than initials', () => {
    expect(
      fields(encounterProblems(encounter({ patientInitials: 'Jonathan' }))),
    ).toContain('patientInitials');
    expect(encounterProblems(encounter({ patientInitials: 'J.D.' }))).toEqual(
      [],
    );
  });

  it('reports everything wrong at once, not one thing at a time', () => {
    const bad = encounter({
      runNumberId: null,
      prid: null,
      disposition: 'DECEASED',
      patientInitials: 'Jonathan Doe',
    });
    expect(fields(encounterProblems(bad)).length).toBeGreaterThan(2);
  });
});

describe('the counts DOH-2332 asks for', () => {
  it('counts each bucket, and the total across all of them', () => {
    const counts = formCounts([
      {
        category: 'MINOR_INJURY',
        disposition: 'TREATED_RELEASED',
        died: false,
        intoxicationSigns: false,
      },
      {
        category: 'MAJOR_INJURY',
        disposition: 'TRANSPORTED',
        died: false,
        intoxicationSigns: false,
      },
      {
        category: 'MINOR_ILLNESS',
        disposition: 'RMA',
        died: false,
        intoxicationSigns: true,
      },
      {
        category: 'MAJOR_ILLNESS',
        disposition: 'TRANSPORTED',
        died: true,
        intoxicationSigns: false,
      },
    ]);
    expect(counts).toEqual({
      minorInjury: 1,
      majorInjury: 1,
      minorIllness: 1,
      majorIllness: 1,
      deaths: 1,
      totalTreated: 4,
      intoxication: 1,
      transports: 2,
    });
  });

  // A death keeps its illness or injury category, so it is counted in both
  // places — which is what the form's own layout expects.
  it('counts a death in its category as well as in deaths', () => {
    const counts = formCounts([
      {
        category: 'MAJOR_ILLNESS',
        disposition: 'DECEASED',
        died: true,
        intoxicationSigns: false,
      },
    ]);
    expect(counts.majorIllness).toBe(1);
    expect(counts.deaths).toBe(1);
    expect(counts.totalTreated).toBe(1);
  });

  // The form asks how many were taken from the site to a hospital. Somebody
  // handed to another agency was not.
  it('counts transports but not turnovers', () => {
    const counts = formCounts([
      {
        category: 'MINOR_INJURY',
        disposition: 'TURNOVER',
        died: false,
        intoxicationSigns: false,
      },
      {
        category: 'MINOR_INJURY',
        disposition: 'TRANSPORTED',
        died: false,
        intoxicationSigns: false,
      },
    ]);
    expect(counts.transports).toBe(1);
  });

  it('counts nothing when nothing happened', () => {
    expect(formCounts([]).totalTreated).toBe(0);
  });
});

describe('who may read the encounters', () => {
  it.each(['EES_IC', 'EES'] as const)(
    'lets a %s on the standby read them',
    (role) => {
      expect(mayReadAllEncounters({ role, hasReadAllPermission: false })).toBe(
        true,
      );
    },
  );

  it('does not let a crew member read everybody else’s', () => {
    expect(
      mayReadAllEncounters({ role: 'CREW', hasReadAllPermission: false }),
    ).toBe(false);
    expect(
      mayReadAllEncounters({ role: 'SUPPORT', hasReadAllPermission: false }),
    ).toBe(false);
  });

  it('lets the permission stand in for having worked it', () => {
    expect(
      mayReadAllEncounters({ role: null, hasReadAllPermission: true }),
    ).toBe(true);
  });
});

describe('one supervisor in charge', () => {
  it('names who has to stand down when somebody else takes charge', () => {
    const people = [
      { id: 1, role: 'EES_IC' as const, removedAt: null },
      { id: 2, role: 'EES' as const, removedAt: null },
      { id: 3, role: 'EES_IC' as const, removedAt: new Date() },
    ];
    // The one who left is already not in charge of anything.
    expect(inChargeConflict(people, 2)).toEqual([1]);
  });

  it('has nothing to say when the same person is reconfirmed', () => {
    expect(
      inChargeConflict([{ id: 1, role: 'EES_IC', removedAt: null }], 1),
    ).toEqual([]);
  });
});

describe('voided encounters', () => {
  const base = {
    category: 'MINOR_INJURY' as const,
    disposition: 'TREATED_RELEASED' as const,
    died: false,
    intoxicationSigns: false,
    firstAidOnly: false,
  };

  // Three audiences, and they are not owed the same thing.
  it('keeps everything voided off the state’s forms', () => {
    expect(onDohForms({ voidedAs: null })).toBe(true);
    expect(onDohForms({ voidedAs: 'UNFOUNDED' })).toBe(false);
    expect(onDohForms({ voidedAs: 'CREATED_IN_ERROR' })).toBe(false);
  });

  it('keeps an unfounded call in the agency’s own list, but not a mistake', () => {
    expect(inPatientList({ voidedAs: null })).toBe(true);
    expect(inPatientList({ voidedAs: 'UNFOUNDED' })).toBe(true);
    expect(inPatientList({ voidedAs: 'CREATED_IN_ERROR' })).toBe(false);
  });

  it('counts nobody from a voided encounter', () => {
    const counts = formCounts([
      { ...base, voidedAs: null },
      {
        ...base,
        category: 'MAJOR_INJURY',
        disposition: 'TRANSPORTED',
        voidedAs: 'UNFOUNDED',
      },
      { ...base, voidedAs: 'CREATED_IN_ERROR' },
    ]);
    expect(counts.totalTreated).toBe(1);
    expect(counts.minorInjury).toBe(1);
    expect(counts.majorInjury).toBe(0);
    expect(counts.transports).toBe(0);
  });

  // No run number for a patient who was never found, no PRID for a care
  // report nobody wrote.
  it('holds a voided encounter to none of the rules for a patient', () => {
    expect(blockingProblems({ ...base, voidedAs: 'UNFOUNDED' })).toEqual([]);
    expect(blockingProblems({ ...base })).not.toEqual([]);
  });

  it('still refuses a name on one', () => {
    expect(
      blockingProblems({
        ...base,
        voidedAs: 'UNFOUNDED',
        patientInitials: 'Jonathan Doe',
      }).map((p) => p.field),
    ).toEqual(['patientInitials']);
  });
});
