import { describeTimelineEntry, timelineLine } from './timeline-text';

const names = {
  unit: (id: number) => ({ 1: 'M-1', 2: 'Gator 2' })[id],
  member: (id: number) => ({ 10: 'Alex Rivera', 11: 'Casey Okonkwo' })[id],
  encounter: (id: number) => ({ 100: 3 })[id],
  location: (id: number) => ({ 7: 'Gate 1' })[id],
};

function entry(kind: string, extra: Record<string, unknown> = {}) {
  return { kind, ...extra };
}

describe('describeTimelineEntry', () => {
  it('says what a unit status changed from and to', () => {
    expect(
      describeTimelineEntry(
        entry('unit.status', {
          unitId: 1,
          detail: { from: 'AVAILABLE', to: 'TRANSPORTING' },
        }),
        names,
      ),
    ).toBe('M-1 is now Transporting (was Available)');
  });

  it('falls back to the unit it points at when no name was stored', () => {
    expect(
      describeTimelineEntry(entry('unit.retired', { unitId: 2 }), names),
    ).toBe('Gator 2 stood down');
  });

  it('prefers the name recorded at the time over the name now', () => {
    expect(
      describeTimelineEntry(
        entry('unit.created', { unitId: 1, detail: { name: 'M-9' } }),
        names,
      ),
    ).toBe('M-9 put in service');
  });

  it('names the place a unit moved to', () => {
    expect(
      describeTimelineEntry(
        entry('unit.moved', {
          unitId: 1,
          detail: { locationId: 7, locationName: 'Gate 1' },
        }),
        names,
      ),
    ).toBe('M-1 moved to Gate 1');
  });

  it('resolves a location id for rows written before the name was stored', () => {
    expect(
      describeTimelineEntry(
        entry('unit.moved', { unitId: 1, detail: { locationId: 7 } }),
        names,
      ),
    ).toBe('M-1 moved to Gate 1');
  });

  it('handles a unit sent nowhere in particular', () => {
    expect(
      describeTimelineEntry(entry('unit.moved', { unitId: 1 }), names),
    ).toBe('M-1 is no longer posted anywhere');
  });

  it('says who was put on which unit, doing what', () => {
    expect(
      describeTimelineEntry(
        entry('crew.assigned', {
          unitId: 1,
          memberId: 11,
          detail: { position: 'Crew Chief' },
        }),
        names,
      ),
    ).toBe('Casey Okonkwo assigned to M-1 as Crew Chief');
  });

  it('says who came off a unit', () => {
    expect(
      describeTimelineEntry(
        entry('crew.unassigned', { unitId: 1, memberId: 11 }),
        names,
      ),
    ).toBe('Casey Okonkwo taken off M-1');
  });

  it('numbers an encounter and says where it was', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.opened', {
          encounterId: 100,
          unitId: 1,
          detail: { sequence: 3, locationText: 'the beer garden' },
        }),
        names,
      ),
    ).toBe('Encounter #3 opened on M-1 at the beer garden');
  });

  it('says how an encounter ended', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.closed', {
          encounterId: 100,
          detail: {
            sequence: 3,
            category: 'MINOR_INJURY',
            disposition: 'RMA',
          },
        }),
        names,
      ),
    ).toBe('Encounter #3 closed — minor injury, RMA');
  });

  it('says what a deleted encounter was, and that its number stands', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.deleted', {
          detail: {
            sequence: 4,
            category: 'MINOR_INJURY',
            disposition: 'RMA',
            runNumber: 'T26-0412',
          },
        }),
        names,
      ),
    ).toBe(
      'Encounter #4 deleted — minor injury, RMA; run number T26-0412 stands',
    );
  });

  it('describes a deleted encounter that had no number', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.deleted', { detail: { sequence: 4 } }),
        names,
      ),
    ).toBe('Encounter #4 deleted');
  });

  it('says how an encounter was voided, and why', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.voided', {
          encounterId: 100,
          detail: {
            sequence: 3,
            as: 'UNFOUNDED',
            note: 'Searched the north lawn, nobody there',
          },
        }),
        names,
      ),
    ).toBe(
      'Encounter #3 marked unfounded — Searched the north lawn, nobody there',
    );
    expect(
      describeTimelineEntry(
        entry('encounter.voided', {
          encounterId: 100,
          detail: { sequence: 3, as: 'CREATED_IN_ERROR' },
        }),
        names,
      ),
    ).toBe('Encounter #3 marked created in error');
  });

  it('describes taking the mark off again', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.unvoided', {
          encounterId: 100,
          detail: { sequence: 3, from: 'UNFOUNDED' },
        }),
        names,
      ),
    ).toBe('Encounter #3 is a patient encounter again (was unfounded)');
  });

  it('lets a note speak for itself', () => {
    expect(
      describeTimelineEntry(
        entry('note', { detail: { text: 'Crowd building at the north gate' } }),
      ),
    ).toBe('Crowd building at the north gate');
  });

  it('hangs an encounter note off its encounter', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.note', {
          encounterId: 100,
          detail: { sequence: 3, text: 'Walked to the aid station' },
        }),
        names,
      ),
    ).toBe('Encounter #3 note — Walked to the aid station');
  });

  // What a reader who may not read the encounter sees: that a note exists.
  it('says a note exists when its words are not theirs to read', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.note', { encounterId: 100, detail: { sequence: 3 } }),
        names,
      ),
    ).toBe('Encounter #3 note');
  });

  it('marks an encounter with the words that were on the button', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.action', {
          encounterId: 100,
          detail: { sequence: 3, label: 'Moving to FAR' },
        }),
        names,
      ),
    ).toBe('Encounter #3 — Moving to FAR');
  });

  it('describes reopening one', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.reopened', { encounterId: 100 }),
        names,
      ),
    ).toBe('Encounter #3 reopened');
  });

  it('ties a run number to its encounter', () => {
    expect(
      describeTimelineEntry(
        entry('encounter.run-number', {
          encounterId: 100,
          detail: { sequence: 3, number: '25-0412' },
        }),
        names,
      ),
    ).toBe('Run number 25-0412 issued for encounter #3');
  });

  it('says who joined and in what role', () => {
    expect(
      describeTimelineEntry(
        entry('personnel.added', { memberId: 10, detail: { role: 'EES_IC' } }),
        names,
      ),
    ).toBe('Alex Rivera joined the standby as EES in charge');
  });

  it('says who left', () => {
    expect(
      describeTimelineEntry(
        entry('personnel.removed', { memberId: 10 }),
        names,
      ),
    ).toBe('Alex Rivera left the standby');
  });

  it('names the supervisors a promotion stood down', () => {
    expect(
      describeTimelineEntry(
        entry('personnel.stood-down', {
          detail: { personnelIds: [5], memberIds: [10] },
        }),
        names,
      ),
    ).toBe('Alex Rivera stood down from in charge');
  });

  it('counts them when the names are gone', () => {
    expect(
      describeTimelineEntry(
        entry('personnel.stood-down', { detail: { personnelIds: [5, 6] } }),
        names,
      ),
    ).toBe('2 supervisors stood down from in charge');
  });

  it('counts what a standby was seeded with, and what it closed on', () => {
    expect(
      describeTimelineEntry(entry('standby.opened', { detail: { seeded: 4 } })),
    ).toBe('Standby opened with 4 people from the event signups');
    expect(describeTimelineEntry(entry('standby.opened'))).toBe(
      'Standby opened',
    );
    expect(
      describeTimelineEntry(
        entry('standby.closed', { detail: { encounters: 1, personnel: 6 } }),
      ),
    ).toBe('Standby closed — 1 encounter, 6 people');
  });

  it('still reads as something when nothing can be resolved', () => {
    expect(describeTimelineEntry(entry('unit.status', { unitId: 99 }))).toBe(
      'A unit status changed',
    );
    expect(describeTimelineEntry(entry('crew.assigned'))).toBe(
      'Somebody assigned to a unit',
    );
  });

  it('makes a kind it has never seen readable', () => {
    expect(describeTimelineEntry(entry('unit.repainted'))).toBe(
      'Unit repainted',
    );
  });

  it('puts the actor on the end for the report', () => {
    expect(
      timelineLine(
        entry('standby.reopened', {
          actor: { firstName: 'Dana', lastName: 'Wu' },
        }),
      ),
    ).toBe('Standby reopened — Dana Wu');
  });
});
