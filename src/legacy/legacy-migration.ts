/**
 * Legacy MySQL -> Postgres ETL (spec §8), shared by the CLI script and the
 * admin-triggered endpoint so both run identical logic.
 */
import * as mysql from 'mysql2/promise';
import type { PrismaClient } from '../generated/prisma/client';
import {
  guardRecord,
  writeWithConflictPrompt,
  type ConflictContext,
  type ConflictResolver,
} from './conflicts';

/** Accepts either the Nest PrismaService or a bare client. */
export type LegacyPrisma = PrismaClient;

type Row = Record<string, any>;

const JUNK_DATES = new Set(['0000-00-00', '1000-01-01', '1970-01-01']);

function cleanDate(value: string | null): Date | null {
  if (!value || JUNK_DATES.has(value)) return null;
  return new Date(`${value}T00:00:00Z`);
}

/** Convert an America/New_York wall time to a UTC Date (DST-aware). */
function nyToUtc(dateStr: string, timeStr: string): Date {
  const guess = new Date(`${dateStr}T${timeStr || '00:00:00'}Z`);
  for (const offsetMin of [240, 300]) {
    const candidate = new Date(guess.getTime() + offsetMin * 60_000);
    const fmt = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'America/New_York',
      year: 'numeric', month: '2-digit', day: '2-digit',
      hour: '2-digit', minute: '2-digit', hour12: false,
    });
    const parts = Object.fromEntries(
      fmt.formatToParts(candidate).map((p) => [p.type, p.value]),
    );
    if (
      `${parts.year}-${parts.month}-${parts.day}` === dateStr &&
      Number(parts.hour) % 24 === Number(timeStr.slice(0, 2))
    ) {
      return candidate;
    }
  }
  // Fallback: EST offset
  return new Date(guess.getTime() + 300 * 60_000);
}

// Legacy flag -> credential key (spec §8)
const CREDENTIAL_FLAGS: Array<[string, string]> = [
  ['observer', 'O'],
  ['attendant', 'A'],
  ['cleareddriver', 'A_D'],
  ['clearedcc', 'A_CC'],
  ['backupdriver', 'P_D'],
  ['backupcc', 'P_CC'],
  ['driver', 'D'],
  ['drivertrainer', 'D_T'],
  ['crewchief', 'CC'],
  ['cctrainer', 'CC_T'],
  ['firstresponsecc', 'FR_CC'],
  ['ees', 'EES'],
  ['dutysup', 'DS'],
];

// Legacy officer flag -> role name. Roles are created (permissionless) if missing;
// permissions can be attached later in the roles admin UI.
const ROLE_FLAGS: Array<[string, string]> = [
  ['admin', 'Admin'],
  ['pres', 'President'],
  ['vicepres', 'Vice President'],
  ['captain', 'Captain'],
  ['firstlt', 'First Lieutenant'],
  ['secondlt', 'Second Lieutenant'],
  ['schedco', 'Scheduling Coordinator'],
  ['radioco', 'Radio Coordinator'],
  ['traincommchair', 'Training Committee Chair'],
  ['cprco', 'CPR Coordinator'],
  ['webmaster', 'Webmaster'],
  ['qaco', 'QA Coordinator'],
  ['devco', 'Dev Coordinator'],
];

const CREW_POSITIONS: Array<[string, 'CC' | 'DRIVER' | 'ATTENDANT' | 'OBSERVER' | 'DUTY_SUP']> = [
  ['cc', 'CC'],
  ['driver', 'DRIVER'],
  ['attendant', 'ATTENDANT'],
  ['observer', 'OBSERVER'],
  ['dutysup', 'DUTY_SUP'],
];

export async function runLegacyMigration(
  prisma: LegacyPrisma,
  mysqlUrl: string,
  log: (message: string) => void = () => {},
  /**
   * Called whenever legacy data violates a uniqueness constraint. The import
   * never guesses and never aborts on a conflict — the administrator running
   * it decides. See conflicts.ts.
   */
  resolveConflict: ConflictResolver = () => {
    throw new Error(
      'This legacy data has a uniqueness conflict, but no way to ask how to ' +
        'resolve it was supplied. Run the migration from the admin console.',
    );
  },
): Promise<string[]> {
  const summary: string[] = [];
  const record = (m: string) => {
    summary.push(m);
    log(m);
  };
  const ctx: ConflictContext = { resolve: resolveConflict, record };
  const host = mysqlUrl.replace(/^mysql:\/\/[^@]*@/, '').split('/')[0];
  let db: mysql.Connection;
  try {
    db = await mysql.createConnection({
      uri: mysqlUrl,
      dateStrings: true,
      // Fail fast and legibly instead of hanging: a timeout here is almost
      // always a firewall or an unrouted host, not credentials.
      connectTimeout: 10_000,
    });
  } catch (error) {
    const code = (error as { code?: string }).code ?? '';
    const detail =
      code === 'ETIMEDOUT' || code === 'ECONNREFUSED'
        ? `Could not open a TCP connection to ${host} (${code}). The API ` +
          'container must be able to reach the MySQL port directly — check ' +
          'the host/cloud firewall and that the database is published on a ' +
          'routable address. This is a network problem, not a credentials one.'
        : code === 'ER_ACCESS_DENIED_ERROR' || code === 'ER_HOST_NOT_PRIVILEGED'
          ? `${host} refused the credentials or the connecting host (${code}). ` +
            "The MySQL user must be granted for '%' or the API's egress IP, " +
            "not just 'localhost'."
          : (error as Error).message;
    throw new Error(`Legacy MySQL connection failed: ${detail}`);
  }
  const query = async (sql: string): Promise<Row[]> => {
    const [rows] = await db.query(sql);
    return rows as Row[];
  };

  const credTypes = new Map(
    (await prisma.credentialType.findMany()).map((t) => [t.key, t.id]),
  );
  const certTypes = new Map(
    (await prisma.certificationType.findMany()).map((t) => [t.abbreviation, t.id]),
  );

  // ---------------------------------------------------------------- members
  const legacyMembers = await query('SELECT * FROM members');
  const realMembers = legacyMembers.filter((m) => m.id > 0);
  const placeholders = new Map<number, string>( // negative pseudo-members
    legacyMembers.filter((m) => m.id <= 0).map((m) => [Number(m.id), m.last_name || 'CLOSED']),
  );
  const memberIdByLegacy = new Map<number, number>();
  let skippedMembers = 0;

  for (const m of realMembers) {
    const legacyId = Number(m.id);
    const label = `legacy member ${m.id} (${
      [m.first_name, m.last_name].filter(Boolean).join(' ') || 'unnamed'
    })`;
    // Legacy allowed a blank email; Postgres requires one. There is nothing to
    // preserve and no conflict to resolve, so fill in a placeholder rather
    // than asking the administrator about every address-less member.
    const syntheticEmail = `legacy-${m.id}@rpiambulance.invalid`;
    const email = (m.email || '').trim().toLowerCase() || syntheticEmail;
    if (email === syntheticEmail) {
      record(`  ${label}: no email in legacy data; stored as ${syntheticEmail}`);
    }

    let member = await prisma.member.findUnique({ where: { legacyId } });
    if (!member) {
      member = await writeWithConflictPrompt(ctx, {
        entity: 'Member',
        label,
        data: {
          legacyId,
          firstName: m.first_name,
          lastName: m.last_name,
          dob: cleanDate(m.dob),
          email,
          cellPhone: m.cell_phone || null,
          homePhone: m.home_phone || null,
          localAddress: m.rpi_address || null,
          homeAddress: m.home_address || null,
          rcsId: m.rcs_id || null,
          rin: m.rin ? String(m.rin) : null,
          facilityId: m.facility_id || null,
          cardId: m.card_id || null,
          slackId: m.slackID || null,
          active: m.active === 1 && m.access_revoked !== 1,
        },
        write: (data) =>
          prisma.member.create({ data: data as Parameters<typeof prisma.member.create>[0]['data'] }),
        findExisting: async (field, value) => {
          if (value === null || value === undefined || value === '') return null;
          const row = await prisma.member.findFirst({
            where: { [field]: value } as Record<string, unknown>,
          });
          if (!row) return null;
          return {
            id: row.id,
            summary: `${row.firstName} ${row.lastName} <${row.email}>`,
            // A row already claimed by another legacy member must never be
            // re-pointed, or the earlier import would silently lose its record.
            linkable: row.legacyId === null,
          };
        },
        // Adopt the existing person (typically the bootstrapped administrator,
        // who is the same human as this legacy record) without overwriting
        // anything they have already edited here.
        link: (existingId) =>
          prisma.member.update({ where: { id: existingId }, data: { legacyId } }),
        suggest: (field) => (field === 'email' ? syntheticEmail : undefined),
        clearable: (field) => field !== 'email',
      });
      if (!member) {
        // administrator chose to skip this member
        skippedMembers++;
        continue;
      }
    }
    memberIdByLegacy.set(legacyId, member.id);

    // credentials
    for (const [flag, key] of CREDENTIAL_FLAGS) {
      if (m[flag] !== 1) continue;
      const typeId = credTypes.get(key);
      if (!typeId) continue;
      await prisma.memberCredential.upsert({
        where: { memberId_typeId: { memberId: member.id, typeId } },
        create: { memberId: member.id, typeId },
        update: {},
      });
    }

    // roles (open-ended assignments; historical terms unknown)
    for (const [flag, roleName] of ROLE_FLAGS) {
      if (m[flag] !== 1) continue;
      const role = await prisma.role.upsert({
        where: { name: roleName },
        create: { name: roleName, isOfficer: true },
        update: {},
      });
      const existing = await prisma.memberRole.findFirst({
        where: { memberId: member.id, roleId: role.id },
      });
      if (!existing) {
        await prisma.memberRole.create({
          data: {
            memberId: member.id,
            roleId: role.id,
            startDate: new Date(),
          },
        });
      }
    }

    // certifications (marked VERIFIED — they were on file in the old portal)
    const certRows: Array<{ abbr: string; identifier?: string; issuedAt?: Date | null; expiresAt?: Date | null }> = [];
    if (cleanDate(m.cpr_exp)) {
      certRows.push({ abbr: 'CPR', identifier: m.cpr_assoc || undefined, expiresAt: cleanDate(m.cpr_exp) });
    }
    if (cleanDate(m.emt_exp) || m.emt_num > 0) {
      certRows.push({
        abbr: 'EMT',
        identifier: [m.emt_level, m.emt_num > 0 ? `#${m.emt_num}` : null].filter(Boolean).join(' ') || undefined,
        expiresAt: cleanDate(m.emt_exp),
      });
    }
    if (cleanDate(m.dl_exp)) {
      certRows.push({ abbr: 'DL', identifier: m.dl_state || undefined, expiresAt: cleanDate(m.dl_exp) });
    }
    if (cleanDate(m.cevo_date)) {
      certRows.push({ abbr: 'CEVO', issuedAt: cleanDate(m.cevo_date) });
    }
    for (const nims of ['100', '200', '700', '800']) {
      if (m[`nims${nims}`] === 1) certRows.push({ abbr: `NIMS ${nims}` });
    }
    for (const cert of certRows) {
      const typeId = certTypes.get(cert.abbr);
      if (!typeId) continue;
      const existing = await prisma.memberCertification.findFirst({
        where: { memberId: member.id, typeId },
      });
      if (!existing) {
        await prisma.memberCertification.create({
          data: {
            memberId: member.id,
            typeId,
            identifier: cert.identifier ?? null,
            issuedAt: cert.issuedAt ?? null,
            expiresAt: cert.expiresAt ?? null,
            status: 'VERIFIED',
            verifiedAt: new Date(),
          },
        });
      }
    }
  }
  record(
    `Members: ${realMembers.length - skippedMembers} imported` +
      (skippedMembers ? `, ${skippedMembers} skipped` : '') +
      ` (+${placeholders.size} placeholders)`,
  );

  const slotValue = (legacy: number) => {
    if (!legacy || legacy === 0) return { memberId: null, placeholder: null };
    if (legacy < 0 || placeholders.has(legacy)) {
      return { memberId: null, placeholder: placeholders.get(legacy) ?? 'CLOSED' };
    }
    return { memberId: memberIdByLegacy.get(legacy) ?? null, placeholder: null };
  };

  // ------------------------------------------------------------------ crews
  const crews = await query('SELECT * FROM crews');
  for (const c of crews) {
    const date = cleanDate(c.date);
    if (!date) continue;
    await guardRecord(ctx, 'Crew', `legacy crew ${c.date}`, async () => {
    const crew = await prisma.crew.upsert({
      where: { date },
      create: { date },
      update: {},
    });
    for (const [legacyCol, position] of CREW_POSITIONS) {
      const value = slotValue(Number(c[legacyCol]));
      await prisma.crewSlot.upsert({
        where: { crewId_position: { crewId: crew.id, position } },
        create: { crewId: crew.id, position, ...value },
        update: value,
      });
    }
    });
  }
  record(`Crews: ${crews.length}`);

  const defaults = await query('SELECT * FROM default_crews');
  for (const d of defaults) {
    await guardRecord(ctx, 'DefaultCrewTemplate', `legacy default crew weekday ${d.day}`, async () => {
    for (const [legacyCol, position] of CREW_POSITIONS) {
      const value = slotValue(Number(d[legacyCol]));
      await prisma.defaultCrewTemplate.upsert({
        where: { weekday_position: { weekday: Number(d.day), position } },
        create: { weekday: Number(d.day), position, ...value },
        update: value,
      });
    }
    });
  }
  record(`Default crew template: ${defaults.length} weekdays`);

  // --------------------------------------------------------- games + events
  const gameKind = await prisma.eventKind.upsert({
    where: { name: 'Game' },
    create: { name: 'Game' },
    update: {},
  });
  const generalKind = await prisma.eventKind.upsert({
    where: { name: 'Event' },
    create: { name: 'Event' },
    update: {},
  });

  const games = await query('SELECT * FROM games');
  const gamesCrews = await query('SELECT * FROM games_crews');
  for (const g of games) {
    if (!cleanDate(g.date)) continue;
    await guardRecord(ctx, 'Event', `legacy game ${g.id} (${g.description || 'Game'})`, async () => {
    const signups = gamesCrews.filter((s) => Number(s.gameid) === Number(g.id));
    const positionCounts = new Map<string, number>();
    for (const s of signups) {
      positionCounts.set(s.position, (positionCounts.get(s.position) ?? 0) + 1);
    }
    const standard: Array<[string, number, string | null]> = [
      ['cc', Math.max(1, positionCounts.get('cc') ?? 0), 'P_CC'],
      ['driver', Math.max(1, positionCounts.get('driver') ?? 0), 'P_D'],
      ['attendant', Math.max(2, positionCounts.get('attendant') ?? 0), 'A'],
      ['observer', Math.max(2, positionCounts.get('observer') ?? 0), null],
      ...(g.ees === 1
        ? ([['ees', Math.max(2, positionCounts.get('ees') ?? 0), 'EES']] as Array<[string, number, string | null]>)
        : []),
    ];

    const event = await prisma.event.upsert({
      where: { legacyKey: `game-${g.id}` },
      create: {
        legacyKey: `game-${g.id}`,
        title: g.description || 'Game',
        location: g.location || null,
        startsAt: nyToUtc(g.date, g.start),
        endsAt: nyToUtc(g.date, g.end),
        kindId: gameKind.id,
        locked: g.locked === 1,
        hidden: g.hide === 1,
        attendeeCap: -1, // games had no open-attendee pool
        gcalEventId: g.gcalEventId || null,
        positions: {
          create: standard.map(([position, count, requiredCredentialKey]) => ({
            position,
            count,
            requiredCredentialKey,
          })),
        },
      },
      update: {},
    });
    for (const s of signups) {
      const memberId = memberIdByLegacy.get(Number(s.memberid));
      if (!memberId) continue;
      await prisma.eventSignup.upsert({
        where: { eventId_memberId: { eventId: event.id, memberId } },
        create: { eventId: event.id, memberId, position: s.position },
        update: {},
      });
    }
    });
  }
  record(`Games: ${games.length} (${gamesCrews.length} signups)`);

  const events = await query('SELECT * FROM events');
  const attendees = await query('SELECT * FROM events_attendees');
  for (const e of events) {
    if (!cleanDate(e.date)) continue;
    await guardRecord(ctx, 'Event', `legacy event ${e.id} (${e.description || 'Event'})`, async () => {
    const cap = Number(e.limit);
    const event = await prisma.event.upsert({
      where: { legacyKey: `event-${e.id}` },
      create: {
        legacyKey: `event-${e.id}`,
        title: e.description || 'Event',
        location: e.location || null,
        startsAt: nyToUtc(e.date, e.start),
        endsAt: nyToUtc(e.date, e.end),
        kindId: generalKind.id,
        hidden: e.hide === 1,
        attendeeCap: cap === 0 ? null : cap,
        gcalEventId: e.gcalEventId || null,
      },
      update: {},
    });
    for (const a of attendees.filter((a) => Number(a.eventid) === Number(e.id))) {
      const memberId = memberIdByLegacy.get(Number(a.memberid));
      if (!memberId) continue;
      await prisma.eventSignup.upsert({
        where: { eventId_memberId: { eventId: event.id, memberId } },
        create: { eventId: event.id, memberId, position: null },
        update: {},
      });
    }
    });
  }
  record(`Events: ${events.length} (${attendees.length} attendees)`);

  // -------------------------------------------------------------- ops logs
  const fuel = await query('SELECT * FROM fuel_log');
  for (const f of fuel) {
    if (!cleanDate(f.date)) continue;
    const memberId = memberIdByLegacy.get(Number(f.user));
    if (!memberId) continue;
    await guardRecord(ctx, 'FuelLogEntry', `legacy fuel log ${f.date} ${f.vehicle}`, async () => {
    const loggedAt = nyToUtc(f.date, f.time || '00:00:00');
    const existing = await prisma.fuelLogEntry.findFirst({
      where: { loggedAt, memberId, vehicle: f.vehicle },
    });
    if (!existing) {
      await prisma.fuelLogEntry.create({
        data: {
          loggedAt,
          memberId,
          vehicle: f.vehicle,
          amount: Number(f.amount),
          mileage: Math.round(Number(f.mileage)),
        },
      });
    }
    });
  }
  record(`Fuel log: ${fuel.length}`);

  const radios = await query('SELECT * FROM radios');
  const radioLog = await query('SELECT * FROM radio_log');
  for (const r of radios) {
    await guardRecord(ctx, 'Radio', `legacy radio ${r.id}`, async () => {
    const radio = await prisma.radio.upsert({
      where: { number: String(r.id) },
      create: { number: String(r.id), model: r.model || null, serial: r.serial || null },
      update: {},
    });
    // Historical issues: exact return dates are unknown in the legacy data, so
    // they're recorded as zero-length assignments (issuedAt = returnedAt).
    for (const log of radioLog.filter((l) => Number(l.radio) === Number(r.id))) {
      const memberId = memberIdByLegacy.get(Number(log.issuedto));
      const issuedAt = cleanDate(log.issuedate);
      if (!memberId || !issuedAt) continue;
      const existing = await prisma.radioAssignment.findFirst({
        where: { radioId: radio.id, memberId, issuedAt },
      });
      if (!existing) {
        await prisma.radioAssignment.create({
          data: { radioId: radio.id, memberId, issuedAt, returnedAt: issuedAt },
        });
      }
    }
    // Current holder gets an open assignment.
    const holder = memberIdByLegacy.get(Number(r.issuedto));
    if (holder) {
      const open = await prisma.radioAssignment.findFirst({
        where: { radioId: radio.id, returnedAt: null },
      });
      if (!open) {
        await prisma.radioAssignment.create({
          data: {
            radioId: radio.id,
            memberId: holder,
            issuedAt: cleanDate(r.issuedate) ?? new Date(),
          },
        });
      }
    }
    });
  }
  record(`Radios: ${radios.length} (${radioLog.length} log rows)`);

  await db.end();
  record('Legacy migration complete.');
  return summary;
}
