/**
 * Turning a timeline row into a sentence.
 *
 * The timeline is the record of what happened on a standby, and it is read
 * back by people — on the board, and in the event report months later. A row
 * that says "Unit status changed" is not a record of anything, so every kind
 * here resolves the thing it happened to and says what changed.
 *
 * Pure, and separate from the service, so the board and the PDF cannot drift
 * into describing the same row two different ways.
 */

import { displayName, type Named } from '../common/name';

export interface TimelineEntryShape {
  kind: string;
  unitId?: number | null;
  encounterId?: number | null;
  memberId?: number | null;
  detail?: unknown;
  actor?: Named | null;
}

/**
 * Names for the ids a row carries.
 *
 * Each returns undefined when it cannot resolve — a unit deleted with its
 * standby, a member no longer on the roster — and the describer falls back
 * to what was written into `detail` at the time, then to something neutral.
 */
export interface TimelineNames {
  unit?: (id: number) => string | undefined;
  /** The encounter's sequence number within the standby, not its id. */
  encounter?: (id: number) => number | undefined;
  member?: (id: number) => string | undefined;
  location?: (id: number) => string | undefined;
}

const ROLE_LABEL: Record<string, string> = {
  EES_IC: 'EES in charge',
  EES: 'supervisor',
  CREW: 'crew',
  SUPPORT: 'support',
};

const STATUS_LABEL: Record<string, string> = {
  AVAILABLE: 'Available',
  ASSIGNED: 'Assigned',
  AT_PATIENT: 'At patient',
  TRANSPORTING: 'Transporting',
  OUT_OF_SERVICE: 'Out of service',
};

const CATEGORY_LABEL: Record<string, string> = {
  MINOR_INJURY: 'minor injury',
  MAJOR_INJURY: 'major injury',
  MINOR_ILLNESS: 'minor illness',
  MAJOR_ILLNESS: 'major illness',
};

const DISPOSITION_LABEL: Record<string, string> = {
  RMA: 'RMA',
  TRANSPORTED: 'transported',
  TURNOVER: 'turnover',
  TREATED_RELEASED: 'treated and released',
  NO_PATIENT_FOUND: 'no patient found',
  DECEASED: 'deceased',
};

function label(map: Record<string, string>, key: unknown): string | null {
  if (typeof key !== 'string') return null;
  return map[key] ?? key.toLowerCase().replace(/_/g, ' ');
}

function detailOf(entry: TimelineEntryShape): Record<string, unknown> {
  const { detail } = entry;
  return detail && typeof detail === 'object' && !Array.isArray(detail)
    ? (detail as Record<string, unknown>)
    : {};
}

function str(value: unknown): string | null {
  return typeof value === 'string' && value.trim() ? value.trim() : null;
}

function num(value: unknown): number | null {
  return typeof value === 'number' && Number.isFinite(value) ? value : null;
}

function count(n: number, one: string, many = `${one}s`): string {
  return `${n} ${n === 1 ? one : many}`;
}

/**
 * The unit a row is about.
 *
 * Prefers the name written into `detail` when the row was made: a unit
 * renamed afterwards was not called that at the time, and the log should say
 * what was on the radio.
 */
function unitOf(entry: TimelineEntryShape, names: TimelineNames): string {
  const stored = str(detailOf(entry).name ?? detailOf(entry).unitName);
  const looked = entry.unitId != null ? names.unit?.(entry.unitId) : undefined;
  return stored ?? looked ?? 'a unit';
}

function memberOf(entry: TimelineEntryShape, names: TimelineNames): string {
  const stored = str(detailOf(entry).memberName);
  const looked =
    entry.memberId != null ? names.member?.(entry.memberId) : undefined;
  return stored ?? looked ?? 'somebody';
}

/** "#3", or nothing when the encounter is gone and nothing was stored. */
function encounterOf(entry: TimelineEntryShape, names: TimelineNames): string {
  const stored = num(detailOf(entry).sequence);
  const looked =
    entry.encounterId != null
      ? names.encounter?.(entry.encounterId)
      : undefined;
  const sequence = stored ?? looked;
  return sequence != null ? `Encounter #${sequence}` : 'an encounter';
}

function placeOf(
  detail: Record<string, unknown>,
  names: TimelineNames,
): string | null {
  const id = num(detail.locationId);
  const fromId = id != null ? names.location?.(id) : undefined;
  return str(detail.locationName) ?? fromId ?? str(detail.locationText);
}

/** A kind nobody has written words for, made readable rather than hidden. */
function fallback(kind: string): string {
  const words = kind.replace(/[.\-_]/g, ' ');
  return words.charAt(0).toUpperCase() + words.slice(1);
}

/**
 * What happened, in one line, without the actor — who did it is rendered
 * beside the sentence rather than inside it.
 */
export function describeTimelineEntry(
  entry: TimelineEntryShape,
  names: TimelineNames = {},
): string {
  const text = sentence(entry, names);
  // The subject is usually a name and already capitalised; it is only the
  // unresolved fallbacks ("a unit", "somebody") that would start a line in
  // lower case.
  return text.charAt(0).toUpperCase() + text.slice(1);
}

function sentence(entry: TimelineEntryShape, names: TimelineNames): string {
  const detail = detailOf(entry);

  switch (entry.kind) {
    case 'standby.opened': {
      const seeded = num(detail.seeded) ?? 0;
      return seeded > 0
        ? `Standby opened with ${count(seeded, 'person', 'people')} from the event signups`
        : 'Standby opened';
    }
    case 'standby.closed': {
      const encounters = num(detail.encounters);
      const personnel = num(detail.personnel);
      if (encounters == null) return 'Standby closed';
      const parts = [count(encounters, 'encounter')];
      if (personnel != null) parts.push(count(personnel, 'person', 'people'));
      return `Standby closed — ${parts.join(', ')}`;
    }
    case 'standby.reopened':
      return 'Standby reopened';

    case 'personnel.added':
    case 'personnel.returned': {
      const role = label(ROLE_LABEL, detail.role);
      const verb =
        entry.kind === 'personnel.added' ? 'joined the standby' : 'came back';
      return role
        ? `${memberOf(entry, names)} ${verb} as ${role}`
        : `${memberOf(entry, names)} ${verb}`;
    }
    case 'personnel.removed':
      return `${memberOf(entry, names)} left the standby`;
    case 'personnel.role': {
      const role = label(ROLE_LABEL, detail.role);
      return role
        ? `${memberOf(entry, names)} is now ${role}`
        : `${memberOf(entry, names)} changed role`;
    }
    case 'personnel.stood-down': {
      const ids = Array.isArray(detail.memberIds) ? detail.memberIds : [];
      const who = ids
        .map((id) => (typeof id === 'number' ? names.member?.(id) : undefined))
        .filter((name): name is string => Boolean(name));
      if (who.length) {
        return `${who.join(', ')} stood down from in charge`;
      }
      const n = Array.isArray(detail.personnelIds)
        ? detail.personnelIds.length
        : 0;
      return n
        ? `${count(n, 'supervisor')} stood down from in charge`
        : 'Stood down from in charge';
    }

    case 'unit.created':
      return `${unitOf(entry, names)} put in service`;
    case 'unit.retired':
      return `${unitOf(entry, names)} stood down`;
    case 'unit.status': {
      const from = label(STATUS_LABEL, detail.from);
      const to = label(STATUS_LABEL, detail.to);
      if (!to) return `${unitOf(entry, names)} status changed`;
      // Spelled out rather than "Available -> Transporting": this line is
      // read on a phone at a gate and printed on a filed report, and an
      // arrow is a character the report's fonts cannot draw.
      return from
        ? `${unitOf(entry, names)} is now ${to} (was ${from})`
        : `${unitOf(entry, names)} is now ${to}`;
    }
    case 'unit.moved': {
      const place = placeOf(detail, names);
      return place
        ? `${unitOf(entry, names)} moved to ${place}`
        : `${unitOf(entry, names)} is no longer posted anywhere`;
    }

    case 'crew.assigned': {
      const position = str(detail.position);
      const line = `${memberOf(entry, names)} assigned to ${unitOf(entry, names)}`;
      return position ? `${line} as ${position}` : line;
    }
    case 'crew.unassigned':
      return `${memberOf(entry, names)} taken off ${unitOf(entry, names)}`;

    case 'encounter.opened': {
      const place = placeOf(detail, names);
      const unit =
        entry.unitId != null || str(detail.name)
          ? ` on ${unitOf(entry, names)}`
          : '';
      return `${encounterOf(entry, names)} opened${unit}${place ? ` at ${place}` : ''}`;
    }
    case 'encounter.closed': {
      const category = label(CATEGORY_LABEL, detail.category);
      const disposition = label(DISPOSITION_LABEL, detail.disposition);
      const said = [category, disposition].filter(Boolean).join(', ');
      return said
        ? `${encounterOf(entry, names)} closed — ${said}`
        : `${encounterOf(entry, names)} closed`;
    }
    case 'encounter.reopened':
      return `${encounterOf(entry, names)} reopened`;
    case 'encounter.run-number': {
      const number = str(detail.number) ?? num(detail.number);
      return number
        ? `Run number ${number} issued for ${encounterOf(entry, names).toLowerCase()}`
        : `Run number issued for ${encounterOf(entry, names).toLowerCase()}`;
    }

    default:
      return fallback(entry.kind);
  }
}

/** The sentence with the actor on the end, which is how the PDF reads it. */
export function timelineLine(
  entry: TimelineEntryShape,
  names: TimelineNames = {},
): string {
  const text = describeTimelineEntry(entry, names);
  return entry.actor ? `${text} — ${displayName(entry.actor)}` : text;
}
