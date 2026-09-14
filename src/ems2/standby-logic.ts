import type {
  EncounterCategory,
  EncounterDisposition,
  EncounterVoid,
  StandbyRole,
} from '../generated/prisma/enums';

/**
 * The rules a standby record has to hold to, kept apart from the database so
 * they can be read and tested as rules.
 */

/** Dispositions that mean the patient left in somebody else's care. */
const HANDED_OVER: EncounterDisposition[] = ['TRANSPORTED', 'TURNOVER'];

export interface EncounterShape {
  /** Set when this turned out not to be a patient encounter at all. */
  voidedAs?: EncounterVoid | null;
  category: EncounterCategory;
  disposition: EncounterDisposition;
  firstAidOnly: boolean;
  died: boolean;
  intoxicationSigns: boolean;
  runNumberId?: number | null;
  /** A number that did not come from our pool — the county's, usually. */
  runNumberText?: string | null;
  countyRunNumber?: string | null;
  prid?: string | null;
  patientInitials?: string | null;
}

/** A run number, from our own pool or written down from somebody else's. */
export function hasRunNumber(encounter: EncounterShape): boolean {
  return Boolean(encounter.runNumberId || encounter.runNumberText?.trim());
}

export interface Problem {
  field: string;
  message: string;
}

/**
 * What is wrong with an encounter, in the words somebody would want to read.
 *
 * Returned as a list rather than thrown one at a time, so a crew filling
 * this in on a phone is told everything that is missing at once instead of
 * discovering it a field at a time.
 */
export function encounterProblems(encounter: EncounterShape): Problem[] {
  const problems: Problem[] = [];

  // A voided encounter is not a patient record and is not held to one: no
  // run number for a patient who was never found, no PRID for a care report
  // nobody wrote. The one rule that still applies is the hard limit on what
  // may be stored about a person, checked below.
  if (encounter.voidedAs) {
    return (encounter.patientInitials ?? '').trim().length > 4
      ? [{ field: 'patientInitials', message: 'Initials only — no names.' }]
      : [];
  }

  // The rule you asked for: everything past an ice pack gets a run number,
  // and the exemption is a deliberate tick rather than a blank nobody filled.
  //
  // Either kind counts. A transport often carries the county's number and
  // nothing of ours, and an encounter written up against it is not missing
  // anything.
  if (!encounter.firstAidOnly && !hasRunNumber(encounter)) {
    problems.push({
      field: 'runNumberId',
      message:
        'This needs a run number, or mark it first aid only if it was an ' +
        'ice pack or a bandaid.',
    });
  }

  // First aid only is a claim about how small it was, and these say otherwise.
  if (encounter.firstAidOnly) {
    if (HANDED_OVER.includes(encounter.disposition)) {
      problems.push({
        field: 'firstAidOnly',
        message:
          'A patient who was transported or handed over was more than first ' +
          'aid. Give it a run number.',
      });
    }
    if (encounter.died) {
      problems.push({
        field: 'firstAidOnly',
        message: 'A death is not first aid only.',
      });
    }
  }

  // A run number of any kind means a patient record exists somewhere.
  if (hasRunNumber(encounter) && !encounter.prid?.trim()) {
    problems.push({
      field: 'prid',
      message:
        'An encounter with a run number needs the PRID from the patient ' +
        'care report.',
    });
  }

  // The county issues its own number for anything that leaves with another
  // agency. Warned about rather than refused — it often arrives later.
  if (
    HANDED_OVER.includes(encounter.disposition) &&
    !encounter.countyRunNumber?.trim()
  ) {
    problems.push({
      field: 'countyRunNumber',
      message:
        'Transports and turnovers usually carry a county run number. Add it ' +
        'when you have it.',
    });
  }

  if (encounter.disposition === 'DECEASED' && !encounter.died) {
    problems.push({
      field: 'died',
      message: 'A disposition of deceased should have the death ticked too.',
    });
  }

  // The one hard limit on what may be stored about a person.
  if ((encounter.patientInitials ?? '').trim().length > 4) {
    problems.push({
      field: 'patientInitials',
      message: 'Initials only — no names.',
    });
  }

  return problems;
}

/** Which problems stop a save, as opposed to being worth saying. */
const ADVISORY = new Set(['countyRunNumber']);

export function blockingProblems(encounter: EncounterShape): Problem[] {
  return encounterProblems(encounter).filter((p) => !ADVISORY.has(p.field));
}

export function advisoryProblems(encounter: EncounterShape): Problem[] {
  return encounterProblems(encounter).filter((p) => ADVISORY.has(p.field));
}

/**
 * Where a voided encounter is still shown.
 *
 * Three audiences, and they are not owed the same thing. The state's forms
 * are a count of people treated, so nothing voided reaches them. The event
 * report's patient list is what the agency answers questions from, so an
 * unfounded call belongs there — it happened, a unit went, there was no
 * patient. A row created by mistake is not an event that happened at all,
 * so it survives only in the timeline, where everything that was done is
 * recorded whether it turned out to mean anything or not.
 */
export function onDohForms(encounter: {
  voidedAs?: EncounterVoid | null;
}): boolean {
  return !encounter.voidedAs;
}

export function inPatientList(encounter: {
  voidedAs?: EncounterVoid | null;
}): boolean {
  return encounter.voidedAs !== 'CREATED_IN_ERROR';
}

/**
 * The counts DOH-2332 asks for, derived from the log.
 *
 * Derived and never typed: a filed form that disagrees with the records it
 * came from is the thing that goes wrong when somebody asks about it a year
 * later.
 */
export interface FormCounts {
  minorInjury: number;
  majorInjury: number;
  minorIllness: number;
  majorIllness: number;
  deaths: number;
  totalTreated: number;
  intoxication: number;
  transports: number;
}

export function formCounts(
  encounters: Array<
    Pick<
      EncounterShape,
      'category' | 'disposition' | 'died' | 'intoxicationSigns' | 'voidedAs'
    >
  >,
): FormCounts {
  const counts: FormCounts = {
    minorInjury: 0,
    majorInjury: 0,
    minorIllness: 0,
    majorIllness: 0,
    deaths: 0,
    totalTreated: 0,
    intoxication: 0,
    transports: 0,
  };
  for (const e of encounters) {
    // Nobody was treated, so nothing is counted. The form asks how many
    // people were seen, and a voided encounter is the answer "none of
    // these" to that question.
    if (!onDohForms(e)) continue;
    counts.totalTreated += 1;
    if (e.category === 'MINOR_INJURY') counts.minorInjury += 1;
    if (e.category === 'MAJOR_INJURY') counts.majorInjury += 1;
    if (e.category === 'MINOR_ILLNESS') counts.minorIllness += 1;
    if (e.category === 'MAJOR_ILLNESS') counts.majorIllness += 1;
    if (e.died) counts.deaths += 1;
    if (e.intoxicationSigns) counts.intoxication += 1;
    // The form asks how many were taken from the site to a hospital, which
    // is transports only — a turnover left with somebody else.
    if (e.disposition === 'TRANSPORTED') counts.transports += 1;
  }
  return counts;
}

/**
 * Who may read the encounters on a standby.
 *
 * Supervisors on the standby see all of it, because that is the job.
 * Everybody else working it sees what they wrote. The permission is for
 * whoever has to answer for a standby they did not work.
 */
export function mayReadAllEncounters(input: {
  role: StandbyRole | null;
  hasReadAllPermission: boolean;
}): boolean {
  if (input.hasReadAllPermission) return true;
  return input.role === 'EES_IC' || input.role === 'EES';
}

/** One supervisor is in charge. Promoting a second stands the first down. */
export function inChargeConflict(
  personnel: Array<{ id: number; role: StandbyRole; removedAt: Date | null }>,
  promoting: number,
): number[] {
  return personnel
    .filter((p) => p.role === 'EES_IC' && !p.removedAt && p.id !== promoting)
    .map((p) => p.id);
}
