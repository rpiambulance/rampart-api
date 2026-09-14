import { inflateSync } from 'node:zlib';
import 'dotenv/config';
import {
  CanActivate,
  ExecutionContext,
  INestApplication,
  ValidationPipe,
  VersioningType,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { AirService } from '../src/air/air.service';
import { CredentialGraphService } from '../src/credentials/credential-graph.service';
import { PermissionHoldersService } from '../src/permissions/permission-holders.service';
import { PrismaService } from '../src/prisma/prisma.service';
import { ChoresService } from '../src/chores/chores.service';
import { ChecksheetsService } from '../src/checksheets/checksheets.service';
import { CrewsService } from '../src/crews/crews.service';
import { CredentialsService } from '../src/credentials/credentials.service';
import { PromotionsService } from '../src/promotions/promotions.service';
import { backfillObservers } from '../src/credentials/observer';
import { CertificationGraphService } from '../src/certifications/certification-graph.service';
import { NotificationsService } from '../src/notifications/notifications.service';
import {
  addDays,
  nyNow,
  startOfWeek,
  toDbDate,
  weekdayOf,
} from '../src/common/dates';

/**
 * Exercises the ported night-crew rules end-to-end against the dev Postgres.
 * Auth is stubbed: the x-test-member-id header selects the acting member.
 */
class TestAuthGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const memberId = Number(req.headers['x-test-member-id']);
    req.auth = {
      kind: 'member',
      memberId,
      // Comma-separated, so a test can act with a specific permission.
      permissions: new Set<string>(
        String(req.headers['x-test-permissions'] ?? '')
          .split(',')
          .filter(Boolean),
      ),
    };
    return true;
  }
}

describe('Night crews engine (e2e)', () => {
  let app: INestApplication;
  let prisma: PrismaService;
  const stamp = Date.now();
  let alice: number; // full CC
  let bob: number; // observer only
  let charlie: number; // probationary CC
  let tina: number; // CC trainer

  const nextWeekStart = addDays(startOfWeek(nyNow().dateStr), 7);
  const dayA = addDays(nextWeekStart, 3); // >= 4 days out
  const dayB = addDays(nextWeekStart, 4);
  const dayC = addDays(nextWeekStart, 5);

  async function createMember(name: string, credentialKeys: string[]) {
    const member = await prisma.member.create({
      data: {
        firstName: name,
        lastName: `Test${stamp}`,
        email: `${name.toLowerCase()}-${stamp}@example.com`,
        dob: new Date('2000-01-15'),
      },
    });
    for (const key of credentialKeys) {
      const type = await prisma.credentialType.findUniqueOrThrow({
        where: { key },
      });
      await prisma.memberCredential.create({
        data: { memberId: member.id, typeId: type.id },
      });
    }
    return member.id;
  }

  async function crewIdFor(dateStr: string): Promise<number> {
    const crew = await prisma.crew.findUniqueOrThrow({
      where: { date: toDbDate(dateStr) },
    });
    return crew.id;
  }

  const as = (memberId: number) => ({ 'x-test-member-id': String(memberId) });

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({ imports: [AppModule] })
      .overrideProvider(AuthGuard)
      .useClass(TestAuthGuard)
      .compile();
    app = moduleRef.createNestApplication();
    app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
    app.useGlobalPipes(
      new ValidationPipe({ whitelist: true, transform: true }),
    );
    await app.init();
    prisma = app.get(PrismaService);

    // Neutralize the Sunday-opening rule so tests pass on any weekday/time.
    await prisma.schedulingSetting.upsert({
      where: { key: 'riderSignupOpen' },
      create: { key: 'riderSignupOpen', value: { weekday: 0, time: '00:00' } },
      update: { value: { weekday: 0, time: '00:00' } },
    });

    alice = await createMember('Alice', ['O', 'A', 'A_CC', 'P_CC', 'CC']);
    bob = await createMember('Bob', ['O']);
    charlie = await createMember('Charlie', ['O', 'A', 'A_CC', 'P_CC']);
    tina = await createMember('Tina', ['O', 'A', 'A_CC', 'P_CC', 'CC', 'CC_T']);

    // Materialize the two visible weeks.
    await request(app.getHttpServer())
      .get('/v1/crews')
      .set(as(bob))
      .expect(200);
  });

  afterAll(async () => {
    await prisma.schedulingSetting.upsert({
      where: { key: 'riderSignupOpen' },
      create: { key: 'riderSignupOpen', value: { weekday: 0, time: '16:00' } },
      update: { value: { weekday: 0, time: '16:00' } },
    });
    await prisma.member.deleteMany({ where: { lastName: `Test${stamp}` } });
    await app.close();
  });

  describe('historical weeks', () => {
    // Far enough back that no test ever generates it as a "current" week.
    const pastWeek = addDays(startOfWeek(nyNow().dateStr), -70);

    it('never materializes crews for weeks that have already happened', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/crews?viewDate=${pastWeek}`)
        .set(as(bob))
        .expect(200);
      expect(res.body.weekStart).toBe(pastWeek);
      // The default template must not invent shifts nobody worked.
      const created = await prisma.crew.count({
        where: {
          date: {
            gte: toDbDate(pastWeek),
            lt: toDbDate(addDays(pastWeek, 14)),
          },
        },
      });
      expect(created).toBe(0);
      expect(res.body.currentWeek).toEqual([]);
      expect(res.body.nextWeek).toEqual([]);
    });

    it('shows a past night as a read-only record', async () => {
      const crew = await prisma.crew.create({
        data: {
          date: toDbDate(addDays(pastWeek, 2)),
          slots: { create: [{ position: 'OBSERVER', memberId: bob }] },
        },
      });
      try {
        const res = await request(app.getHttpServer())
          .get(`/v1/crews?viewDate=${pastWeek}`)
          .set(as(bob))
          .expect(200);
        const day = res.body.currentWeek.find(
          (d: { crewId: number }) => d.crewId === crew.id,
        );
        expect(day.historical).toBe(true);
        expect(day.slots.OBSERVER.member).toBeTruthy();
        // Bob holds the slot, but the night is over: no drop, no signup.
        expect(day.slots.OBSERVER.canDrop).toBeUndefined();
        expect(day.slots.CC.eligible).toBe(false);
      } finally {
        await prisma.crew.delete({ where: { id: crew.id } });
      }
    });

    it('lets a member page back but never past the public window', async () => {
      const current = await request(app.getHttpServer())
        .get('/v1/crews')
        .set(as(bob))
        .expect(200);
      // At the edge of the window there is nowhere further forward to go.
      expect(current.body.nextViewDate).toBeNull();
      expect(current.body.prevViewDate).toBe(
        addDays(startOfWeek(nyNow().dateStr), -14),
      );

      const past = await request(app.getHttpServer())
        .get(`/v1/crews?viewDate=${pastWeek}`)
        .set(as(bob))
        .expect(200);
      // Paging forward from history lands on this week, never beyond it.
      expect(past.body.nextViewDate).toBe(addDays(pastWeek, 14));
      const nearPast = await request(app.getHttpServer())
        .get(`/v1/crews?viewDate=${addDays(startOfWeek(nyNow().dateStr), -7)}`)
        .set(as(bob))
        .expect(200);
      expect(nearPast.body.nextViewDate).toBe(startOfWeek(nyNow().dateStr));
    });

    it('ignores a future viewDate from a member', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/crews?viewDate=${addDays(startOfWeek(nyNow().dateStr), 70)}`)
        .set(as(bob))
        .expect(200);
      expect(res.body.weekStart).toBe(startOfWeek(nyNow().dateStr));
    });
  });

  describe('credential backfill', () => {
    // A member of its own: granting credentials changes eligibility, which
    // would quietly alter the scheduling tests that share the fixtures.
    let dana: number;
    beforeAll(async () => {
      dana = await createMember('Dana', ['O']);
    });

    const asGranter = (memberId: number) => ({
      'x-test-member-id': String(memberId),
      'x-test-permissions': 'credentials:grant',
    });

    async function typeId(key: string): Promise<number> {
      const type = await prisma.credentialType.findUniqueOrThrow({
        where: { key },
      });
      return type.id;
    }

    it('backfills a credential with its real promotion date', async () => {
      const type = await typeId('A_D');
      await request(app.getHttpServer())
        .post('/v1/credentials/grant')
        .set(asGranter(alice))
        .send({
          memberId: dana,
          credentialTypeId: type,
          effectiveAt: '2019-04-02',
        })
        .expect(201);
      const held = await prisma.memberCredential.findUniqueOrThrow({
        where: { memberId_typeId: { memberId: dana, typeId: type } },
      });
      expect(held.effectiveAt?.toISOString().slice(0, 10)).toBe('2019-04-02');
      // The row was still created today; only the promotion is backdated.
      expect(held.grantedAt.getFullYear()).toBe(new Date().getFullYear());
    });

    it('records a credential now and dates it later', async () => {
      const type = await typeId('P_D');
      await request(app.getHttpServer())
        .post('/v1/credentials/grant')
        .set(asGranter(alice))
        .send({ memberId: dana, credentialTypeId: type })
        .expect(201);
      const before = await prisma.memberCredential.findUniqueOrThrow({
        where: { memberId_typeId: { memberId: dana, typeId: type } },
      });
      expect(before.effectiveAt).toBeNull();

      await request(app.getHttpServer())
        .patch(`/v1/credentials/${dana}/${type}/effective-date`)
        .set(asGranter(alice))
        .send({ effectiveAt: '2021-09-15' })
        .expect(200);
      const after = await prisma.memberCredential.findUniqueOrThrow({
        where: { memberId_typeId: { memberId: dana, typeId: type } },
      });
      expect(after.effectiveAt?.toISOString().slice(0, 10)).toBe('2021-09-15');

      // And can be cleared back to unknown.
      await request(app.getHttpServer())
        .patch(`/v1/credentials/${dana}/${type}/effective-date`)
        .set(asGranter(alice))
        .send({ effectiveAt: null })
        .expect(200);
      const cleared = await prisma.memberCredential.findUniqueOrThrow({
        where: { memberId_typeId: { memberId: dana, typeId: type } },
      });
      expect(cleared.effectiveAt).toBeNull();
    });

    it('refuses a promotion date in the future', async () => {
      const type = await typeId('D');
      const res = await request(app.getHttpServer())
        .post('/v1/credentials/grant')
        .set(asGranter(alice))
        .send({
          memberId: dana,
          credentialTypeId: type,
          effectiveAt: '2999-01-01',
        })
        .expect(400);
      expect(res.body.message).toContain('future');
    });

    it('requires the grant permission', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/credentials/${dana}/${await typeId('A_D')}/effective-date`)
        .set(as(dana))
        .send({ effectiveAt: '2020-01-01' })
        .expect(403);
    });
  });

  describe('credential ladder ("or above")', () => {
    let sup: number; // Duty Supervisor
    let cc: number; // plain Crew Chief

    beforeAll(async () => {
      // A DS holds the appointment plus its chain, but never FR_CC, which is
      // a CC add-on outside that chain.
      sup = await createMember('Sup', [
        'O',
        'A',
        'A_CC',
        'P_CC',
        'CC',
        'CC_T',
        'A_D',
        'P_D',
        'D',
        'D_T',
        'EES',
        'DS',
      ]);
      // Backfilled straight to CC without the rungs beneath it, which is what
      // an admin-granted or legacy-imported credential looks like.
      cc = await createMember('Casey', ['CC']);
    });

    it('treats a higher credential as satisfying a lower one', async () => {
      const graph = app.get(CredentialGraphService);
      const held = await graph.heldKeys(cc);
      for (const lower of ['P_CC', 'A_CC', 'A', 'O']) {
        expect(await graph.satisfies(held, lower)).toBe(true);
      }
      // ...but not sideways or upward.
      expect(await graph.satisfies(held, 'CC_T')).toBe(false);
      expect(await graph.satisfies(held, 'D')).toBe(false);
    });

    it('lets a Duty Supervisor satisfy every credential, add-ons included', async () => {
      const graph = app.get(CredentialGraphService);
      const held = await graph.heldKeys(sup);
      for (const key of [
        'O',
        'A',
        'A_CC',
        'P_CC',
        'CC',
        'CC_T',
        'A_D',
        'P_D',
        'D',
        'D_T',
        'EES',
        'FR_CC',
        'DS',
      ]) {
        expect([key, await graph.satisfies(held, key)]).toEqual([key, true]);
      }
    });

    it('offers a DS no promotions, and a backfilled CC only what is above it', async () => {
      const promotions = app.get(PromotionsService);
      const forSup = await promotions.eligibleRequests(sup);
      expect(forSup.map((r) => r.key)).toEqual([]);

      // Casey holds CC without P_CC beneath it; CC_T must still be offered.
      const forCasey = await promotions.eligibleRequests(cc);
      expect(forCasey.map((r) => r.key)).toContain('CC_T');
      // Nothing already satisfied should be offered back.
      for (const key of ['P_CC', 'A_CC', 'A', 'O']) {
        expect(forCasey.map((r) => r.key)).not.toContain(key);
      }
    });

    it('counts a prerequisite as met when held via a higher credential', async () => {
      const credentials = app.get(CredentialsService);
      const ccT = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'CC_T' },
      });
      const checklist = await credentials.checklist(cc, ccT.id);
      const prereq = checklist.find((i) => i.kind === 'PREREQUISITE');
      expect(prereq?.satisfied).toBe(true);
    });

    it('lets a Duty Supervisor take every night crew position', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/crews')
        .set(as(sup))
        .expect(200);
      const day = res.body.nextWeek[3];
      // No credential stands between a DS and any seat.
      for (const position of ['CC', 'DRIVER', 'ATTENDANT', 'DUTY_SUP']) {
        expect([position, day.slots[position].eligible]).toEqual([
          position,
          true,
        ]);
      }
      // The second rider seat is held back until the first is taken. That is
      // an ordering rule and applies to everybody, a DS included — it is not
      // the ladder refusing them.
      expect(day.slots.OBSERVER.eligible).toBe(false);
      expect(day.slots.OBSERVER.reason).toBe('Take the first rider seat');
    });
  });

  describe('inactive members and assignable candidates', () => {
    let retired: number;
    let scheduler: number;

    const withPerms = (memberId: number, perms: string) => ({
      'x-test-member-id': String(memberId),
      'x-test-permissions': perms,
    });

    beforeAll(async () => {
      retired = await createMember('Retired', ['O', 'A', 'A_CC', 'P_CC', 'CC']);
      await prisma.member.update({
        where: { id: retired },
        data: { active: false },
      });
      scheduler = await createMember('Sched', ['O']);
    });

    it('never lists inactive members without the permission', async () => {
      const res = await request(app.getHttpServer())
        // Asking for them explicitly must not be enough.
        .get('/v1/members?includeInactive=true')
        .set(withPerms(scheduler, 'members:read'))
        .expect(200);
      expect(res.body.map((m: { id: number }) => m.id)).not.toContain(retired);
    });

    it('lists them for a member who manages activation', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/members?includeInactive=true')
        .set(withPerms(scheduler, 'members:read,members:deactivate'))
        .expect(200);
      expect(res.body.map((m: { id: number }) => m.id)).toContain(retired);

      // ...and still not by default.
      const plain = await request(app.getHttpServer())
        .get('/v1/members')
        .set(withPerms(scheduler, 'members:read,members:deactivate'))
        .expect(200);
      expect(plain.body.map((m: { id: number }) => m.id)).not.toContain(
        retired,
      );
    });

    it('offers only active, suitably credentialed members per position', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/crews/assignable-members')
        .set(withPerms(scheduler, 'schedule:crews:assign'))
        .expect(200);
      const byId = new Map<number, string[]>(
        res.body.map((m: { id: number; positions: string[] }) => [
          m.id,
          m.positions,
        ]),
      );

      // Inactive members are not candidates at all.
      expect(byId.has(retired)).toBe(false);

      // Alice is a full CC with no driver credentials.
      expect(byId.get(alice)).toEqual(
        expect.arrayContaining(['CC', 'ATTENDANT', 'OBSERVER']),
      );
      expect(byId.get(alice)).not.toContain('DRIVER');
      expect(byId.get(alice)).not.toContain('DUTY_SUP');

      // Bob holds nothing: both rider seats are the way in, and neither asks
      // for a credential. The seats a credential does gate stay shut.
      expect(byId.get(bob)).toEqual(['ATTENDANT', 'OBSERVER']);

      // Charlie is probationary CC — schedulable, trainer rule applies on the night.
      expect(byId.get(charlie)).toContain('CC');
    });

    it('requires the scheduling permission', async () => {
      await request(app.getHttpServer())
        .get('/v1/crews/assignable-members')
        .set(as(bob))
        .expect(403);
    });
  });

  describe('inactivity review', () => {
    const cutoff = '2026-01-01';
    const asDeactivator = (memberId: number) => ({
      'x-test-member-id': String(memberId),
      'x-test-permissions': 'members:deactivate',
    });

    let lapsed: number;
    let recentCrew: number;
    let futureEvent: number;
    let newcomer: number;
    let actor: number;
    const created: number[] = [];

    /** Puts a member in the observer seat on a date, idempotently. */
    async function seatOn(dateStr: string, memberId: number): Promise<number> {
      const crew = await prisma.crew.upsert({
        where: { date: toDbDate(dateStr) },
        create: { date: toDbDate(dateStr) },
        update: {},
      });
      await prisma.crewSlot.upsert({
        where: { crewId_position: { crewId: crew.id, position: 'OBSERVER' } },
        create: { crewId: crew.id, position: 'OBSERVER', memberId },
        update: { memberId },
      });
      return crew.id;
    }

    beforeAll(async () => {
      lapsed = await createMember('Lapsed', []);
      recentCrew = await createMember('Recent', []);
      futureEvent = await createMember('Future', []);
      newcomer = await createMember('New', []);
      actor = await createMember('Actor', []);

      // Took a crew shift after the cutoff.
      created.push(await seatOn('2026-03-04', recentCrew));

      // Signed up for an event that has not happened yet.
      const kind = await prisma.eventKind.findFirstOrThrow();
      await prisma.event.create({
        data: {
          title: `Future event ${stamp}`,
          startsAt: new Date('2099-01-01T18:00:00Z'),
          endsAt: new Date('2099-01-01T22:00:00Z'),
          kindId: kind.id,
          signups: { create: [{ memberId: futureEvent }] },
        },
      });

      // Lapsed took part, but only before the cutoff.
      created.push(await seatOn('2025-02-10', lapsed));

      await prisma.member.update({
        where: { id: newcomer },
        data: { createdAt: new Date('2026-06-01T00:00:00Z') },
      });
    });

    afterAll(async () => {
      await prisma.event.deleteMany({
        where: { title: `Future event ${stamp}` },
      });
      await prisma.crew.deleteMany({ where: { id: { in: created } } });
    });

    it('lists only members with no participation since the cutoff', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/members/inactivity-review?since=${cutoff}`)
        .set(asDeactivator(actor))
        .expect(200);
      const ids = res.body.map((c: { id: number }) => c.id);

      expect(ids).toContain(lapsed);
      expect(ids).not.toContain(recentCrew); // crewed after the cutoff
      expect(ids).not.toContain(futureEvent); // scheduled ahead
      expect(ids).not.toContain(actor); // never yourself

      const row = res.body.find((c: { id: number }) => c.id === lapsed);
      expect(row.lastParticipation.slice(0, 10)).toBe('2025-02-10');
    });

    it('flags members who joined after the cutoff', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/members/inactivity-review?since=${cutoff}`)
        .set(asDeactivator(actor))
        .expect(200);
      const row = res.body.find((c: { id: number }) => c.id === newcomer);
      expect(row.joinedAfterCutoff).toBe(true);
      expect(row.lastParticipation).toBeNull();
    });

    it('deactivates only the members handed to it', async () => {
      await request(app.getHttpServer())
        .post('/v1/members/deactivate-many')
        .set(asDeactivator(actor))
        .send({
          memberIds: [lapsed],
          reason: `No participation since ${cutoff}`,
        })
        .expect(201);

      const after = await prisma.member.findMany({
        where: { id: { in: [lapsed, newcomer] } },
        select: { id: true, active: true },
      });
      expect(after.find((m) => m.id === lapsed)?.active).toBe(false);
      // Deselected during review — untouched.
      expect(after.find((m) => m.id === newcomer)?.active).toBe(true);
    });

    it('refuses to deactivate the caller, even if asked', async () => {
      await request(app.getHttpServer())
        .post('/v1/members/deactivate-many')
        .set(asDeactivator(actor))
        .send({ memberIds: [actor], reason: 'test' })
        .expect(201);
      const self = await prisma.member.findUniqueOrThrow({
        where: { id: actor },
      });
      expect(self.active).toBe(true);
    });

    it('requires the deactivate permission and a valid date', async () => {
      await request(app.getHttpServer())
        .get(`/v1/members/inactivity-review?since=${cutoff}`)
        .set({
          'x-test-member-id': String(actor),
          'x-test-permissions': 'members:read',
        })
        .expect(403);
      await request(app.getHttpServer())
        .get('/v1/members/inactivity-review?since=whenever')
        .set(asDeactivator(actor))
        .expect(400);
    });
  });

  describe('duty supervisor seat by permission', () => {
    let officer: number;

    beforeAll(async () => {
      officer = await createMember('Officer', ['O', 'A']);
    });

    it('is closed to a member without the credential or the permission', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/crews')
        .set(as(officer))
        .expect(200);
      const day = res.body.nextWeek[3];
      expect(day.slots.DUTY_SUP.eligible).toBe(false);
      expect(day.slots.DUTY_SUP.reason).toBe(
        'Duty supervisor appointment required',
      );
    });

    it('opens to a member holding schedule:crews:duty-sup', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/crews')
        .set({
          'x-test-member-id': String(officer),
          'x-test-permissions': 'schedule:crews:duty-sup',
        })
        .expect(200);
      const day = res.body.nextWeek[3];
      expect(day.slots.DUTY_SUP.eligible).toBe(true);
    });

    it('lets them actually take the seat', async () => {
      const crewId = await crewIdFor(dayC);
      await request(app.getHttpServer())
        .post(`/v1/crews/${crewId}/slots/DUTY_SUP/signup`)
        .set({
          'x-test-member-id': String(officer),
          'x-test-permissions': 'schedule:crews:duty-sup',
        })
        .expect(201);
      const slot = await prisma.crewSlot.findFirstOrThrow({
        where: { crewId, position: 'DUTY_SUP' },
      });
      expect(slot.memberId).toBe(officer);
      await prisma.crewSlot.update({
        where: { id: slot.id },
        data: { memberId: null },
      });
    });

    it('refuses without the permission', async () => {
      const blocked = await request(app.getHttpServer())
        .post(`/v1/crews/${await crewIdFor(dayB)}/slots/DUTY_SUP/signup`)
        .set(as(officer))
        .expect(403);
      expect(blocked.body.message).toBe('Duty supervisor appointment required');
    });

    it('lists them as a duty supervisor candidate for schedulers', async () => {
      const role = await prisma.role.create({
        data: {
          name: `DS cover ${stamp}`,
          permissions: { create: [{ permission: 'schedule:crews:duty-sup' }] },
        },
      });
      await prisma.memberRole.create({
        data: {
          memberId: officer,
          roleId: role.id,
          startDate: toDbDate(nyNow().dateStr),
        },
      });
      try {
        const res = await request(app.getHttpServer())
          .get('/v1/crews/assignable-members')
          .set({
            'x-test-member-id': String(alice),
            'x-test-permissions': 'schedule:crews:assign',
          })
          .expect(200);
        const row = res.body.find((m: { id: number }) => m.id === officer);
        expect(row.positions).toContain('DUTY_SUP');
      } finally {
        await prisma.memberRole.deleteMany({ where: { roleId: role.id } });
        await prisma.role.delete({ where: { id: role.id } });
      }
    });
  });

  describe('remembered events view', () => {
    it('defaults to the list and remembers a chosen view', async () => {
      const before = await request(app.getHttpServer())
        .get('/v1/members/me')
        .set(as(bob))
        .expect(200);
      expect(before.body.eventView).toBe('list');

      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(bob))
        .send({ eventView: 'month' })
        .expect(200);

      const after = await request(app.getHttpServer())
        .get('/v1/members/me')
        .set(as(bob))
        .expect(200);
      expect(after.body.eventView).toBe('month');
    });

    it('defaults to 24-hour time and accepts a 12-hour preference', async () => {
      const before = await request(app.getHttpServer())
        .get('/v1/members/me')
        .set(as(charlie))
        .expect(200);
      expect(before.body.timeFormat).toBe('24h');

      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(charlie))
        .send({ timeFormat: '12h' })
        .expect(200);
      const after = await request(app.getHttpServer())
        .get('/v1/members/me')
        .set(as(charlie))
        .expect(200);
      expect(after.body.timeFormat).toBe('12h');

      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(charlie))
        .send({ timeFormat: 'sundial' })
        .expect(400);
    });

    it('rejects a view it does not have', async () => {
      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(bob))
        .send({ eventView: 'agenda' })
        .expect(400);
    });

    it('does not let the preference carry other fields in', async () => {
      // SelfEditDto is whitelisted: a member must not flip their own active
      // flag by piggybacking on a preference update.
      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(bob))
        .send({ eventView: 'week', active: false })
        .expect(200);
      const member = await prisma.member.findUniqueOrThrow({
        where: { id: bob },
      });
      expect(member.active).toBe(true);
      expect(member.eventView).toBe('week');
    });
  });

  describe('900 number', () => {
    it('is editable with members:write', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/members/${bob}`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'members:write',
        })
        .send({ nineHundredNumber: '900123456' })
        .expect(200);
      const member = await prisma.member.findUniqueOrThrow({
        where: { id: bob },
      });
      expect(member.nineHundredNumber).toBe('900123456');
    });

    it('is not editable without it', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/members/${bob}`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'members:read',
        })
        .send({ nineHundredNumber: '900999999' })
        .expect(403);
    });

    it('cannot be set by a member on themselves', async () => {
      // SelfEditDto has no such field, and the pipe whitelists.
      await request(app.getHttpServer())
        .patch('/v1/members/me')
        .set(as(bob))
        .send({ nineHundredNumber: '900000000' })
        .expect(200);
      const member = await prisma.member.findUniqueOrThrow({
        where: { id: bob },
      });
      expect(member.nineHundredNumber).toBe('900123456');
    });

    it('is on the roster payload', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/members')
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'members:read',
        })
        .expect(200);
      const row = res.body.find((m: { id: number }) => m.id === bob);
      expect(row.nineHundredNumber).toBe('900123456');
    });
  });

  describe('certifications', () => {
    async function cprTypeId(): Promise<number> {
      const type = await prisma.certificationType.findFirstOrThrow({
        where: { abbreviation: 'CPR' },
      });
      return type.id;
    }

    it('lets a member submit their own, pending verification', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/certifications')
        .set(as(bob))
        .send({ typeId: await cprTypeId(), issuedAt: '2026-01-15' })
        .expect(201);
      expect(res.body.status).toBe('PENDING_VERIFICATION');
      // CPR is valid 24 months, so expiry is derived from the issue date.
      expect(res.body.expiresAt.slice(0, 10)).toBe('2028-01-15');
      await prisma.memberCertification.delete({ where: { id: res.body.id } });
    });

    it('records one for another member, already verified', async () => {
      const res = await request(app.getHttpServer())
        .post(`/v1/certifications/member/${bob}`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'certs:verify',
        })
        .send({ typeId: await cprTypeId(), identifier: 'C-1234' })
        .expect(201);
      expect(res.body.status).toBe('VERIFIED');
      expect(res.body.verifiedById).toBe(alice);
      expect(res.body.verifiedAt).toBeTruthy();
      await prisma.memberCertification.delete({ where: { id: res.body.id } });
    });

    it('refuses to record for others without certs:verify', async () => {
      await request(app.getHttpServer())
        .post(`/v1/certifications/member/${bob}`)
        .set(as(bob))
        .send({ typeId: await cprTypeId() })
        .expect(403);
    });

    it('rejects an unknown certification type', async () => {
      await request(app.getHttpServer())
        .post('/v1/certifications')
        .set(as(bob))
        .send({ typeId: 999999 })
        .expect(404);
    });
  });

  describe('scheduler bulk operations', () => {
    const asScheduler = {
      'x-test-member-id': '0',
      'x-test-permissions': 'schedule:crews:assign',
    };

    it('assigns a single past night without inventing the rest of the week', async () => {
      const backfill = addDays(startOfWeek(nyNow().dateStr), -63);
      await request(app.getHttpServer())
        .put(`/v1/crews/by-date/${backfill}/slots/OBSERVER`)
        .set({ ...asScheduler, 'x-test-member-id': String(alice) })
        .send({ memberId: bob })
        .expect(200);

      const week = await prisma.crew.findMany({
        where: {
          date: { gte: toDbDate(backfill), lt: toDbDate(addDays(backfill, 7)) },
        },
        include: { slots: true },
      });
      // Exactly the night assigned — the other six are untouched.
      expect(week.length).toBe(1);
      const filled = week[0].slots.filter((s) => s.memberId !== null);
      expect(filled.length).toBe(1);
      expect(filled[0].memberId).toBe(bob);

      await prisma.crew.delete({ where: { id: week[0].id } });
    });

    it('clears a week', async () => {
      const week = addDays(startOfWeek(nyNow().dateStr), 7);
      const crewId = await crewIdFor(dayA);
      await prisma.crewSlot.updateMany({
        where: { crewId, position: 'OBSERVER' },
        data: { memberId: bob },
      });

      const res = await request(app.getHttpServer())
        .post('/v1/crews/bulk')
        .set({ ...asScheduler, 'x-test-member-id': String(alice) })
        .send({ weekStart: week, action: 'clear' })
        .expect(201);
      expect(res.body.changed).toBeGreaterThan(0);

      const after = await prisma.crewSlot.findFirst({
        where: { crewId, position: 'OBSERVER' },
      });
      expect(after?.memberId).toBeNull();
    });

    it('refuses to touch a week that has already passed', async () => {
      await request(app.getHttpServer())
        .post('/v1/crews/bulk')
        .set({ ...asScheduler, 'x-test-member-id': String(alice) })
        .send({
          weekStart: addDays(startOfWeek(nyNow().dateStr), -21),
          action: 'clear',
        })
        .expect(409);
    });

    it('requires the scheduling permission', async () => {
      await request(app.getHttpServer())
        .post('/v1/crews/bulk')
        .set(as(bob))
        .send({
          weekStart: addDays(startOfWeek(nyNow().dateStr), 7),
          action: 'clear',
        })
        .expect(403);
    });
  });

  describe('member-managed certifications', () => {
    let certId: number;

    beforeAll(async () => {
      const type = await prisma.certificationType.findFirstOrThrow({
        where: { abbreviation: 'EMT' },
      });
      const cert = await prisma.memberCertification.create({
        data: { memberId: bob, typeId: type.id, status: 'VERIFIED' },
      });
      certId = cert.id;
    });

    it('sends a verified record back for checking when the member edits it', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/certifications/${certId}`)
        .set(as(bob))
        .send({ identifier: 'EMT-999' })
        .expect(200);
      const cert = await prisma.memberCertification.findUniqueOrThrow({
        where: { id: certId },
      });
      expect(cert.identifier).toBe('EMT-999');
      expect(cert.status).toBe('PENDING_VERIFICATION');
    });

    it('keeps it verified when an officer edits it', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/certifications/${certId}`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'certs:verify',
        })
        .send({ identifier: 'EMT-1000' })
        .expect(200);
      const cert = await prisma.memberCertification.findUniqueOrThrow({
        where: { id: certId },
      });
      expect(cert.status).toBe('VERIFIED');
      expect(cert.verifiedById).toBe(alice);
    });

    it("refuses to touch someone else's", async () => {
      await request(app.getHttpServer())
        .patch(`/v1/certifications/${certId}`)
        .set(as(charlie))
        .send({ identifier: 'nope' })
        .expect(403);
      await request(app.getHttpServer())
        .delete(`/v1/certifications/${certId}`)
        .set(as(charlie))
        .expect(403);
    });

    it('lets the member withdraw their own', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/certifications/${certId}`)
        .set(as(bob))
        .expect(200);
      expect(
        await prisma.memberCertification.findUnique({ where: { id: certId } }),
      ).toBeNull();
    });
  });

  describe('every member is an Observer', () => {
    it('grants it when a member is created', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/members')
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'members:write',
        })
        .send({
          firstName: 'Fresh',
          lastName: `Test${stamp}`,
          email: `fresh-${stamp}@example.com`,
          // Required when adding somebody, as of the roster form asking for it.
          dob: '2004-05-01',
        })
        .expect(201);

      const observer = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'O' },
      });
      const held = await prisma.memberCredential.findUnique({
        where: {
          memberId_typeId: { memberId: res.body.id, typeId: observer.id },
        },
      });
      expect(held?.status).toBe('ACTIVE');
    });

    it('brings existing members up to the floor on boot', async () => {
      const observer = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'O' },
      });
      const bare = await prisma.member.create({
        data: {
          firstName: 'Bare',
          lastName: `Test${stamp}`,
          email: `bare-${stamp}@example.com`,
        },
      });
      await backfillObservers(prisma);
      const held = await prisma.memberCredential.findUnique({
        where: { memberId_typeId: { memberId: bare.id, typeId: observer.id } },
      });
      expect(held).toBeTruthy();
    });

    it('does not undo a deliberate revocation', async () => {
      const observer = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'O' },
      });
      const member = await prisma.member.create({
        data: {
          firstName: 'Revoked',
          lastName: `Test${stamp}`,
          email: `revoked-${stamp}@example.com`,
          credentials: {
            create: [
              { typeId: observer.id, status: 'REVOKED', revokedAt: new Date() },
            ],
          },
        },
      });
      await backfillObservers(prisma);
      const held = await prisma.memberCredential.findUniqueOrThrow({
        where: {
          memberId_typeId: { memberId: member.id, typeId: observer.id },
        },
      });
      // A revocation leaves a row behind, and the floor respects it.
      expect(held.status).toBe('REVOKED');
    });
  });

  describe('certification hierarchy', () => {
    async function typeIdFor(name: string): Promise<number> {
      const type = await prisma.certificationType.findUniqueOrThrow({
        where: { name },
      });
      return type.id;
    }

    it('lets a higher certification satisfy a requirement for a lower one', async () => {
      const graph = app.get(CertificationGraphService);
      const [cfr, emt, aemt, medic] = await Promise.all([
        typeIdFor('NYS Certified First Responder'),
        typeIdFor('NYS EMT'),
        typeIdFor('NYS AEMT'),
        typeIdFor('NYS Paramedic'),
      ]);

      // A requirement for EMT is met by EMT, AEMT or Paramedic.
      expect((await graph.satisfying(emt)).sort()).toEqual(
        [emt, aemt, medic].sort(),
      );
      // ...and CFR, at the bottom, is met by everything.
      expect((await graph.satisfying(cfr)).sort()).toEqual(
        [cfr, emt, aemt, medic].sort(),
      );
      // Paramedic is the top: only itself.
      expect(await graph.satisfying(medic)).toEqual([medic]);
      // Ranking does not run downhill: an EMT does not answer for AEMT.
      expect(await graph.satisfying(aemt)).not.toContain(emt);
    });

    it('counts a Paramedic as meeting an EMT requirement on a checklist', async () => {
      const credentials = app.get(CredentialsService);
      const attendant = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'A' },
      });
      const requirement = await prisma.credentialRequirement.create({
        data: {
          credentialTypeId: attendant.id,
          kind: 'CERTIFICATION',
          certificationTypeId: await typeIdFor('NYS EMT'),
        },
      });
      const medic = await prisma.memberCertification.create({
        data: {
          memberId: charlie,
          typeId: await typeIdFor('NYS Paramedic'),
          status: 'VERIFIED',
        },
      });
      try {
        const checklist = await credentials.checklist(charlie, attendant.id);
        const item = checklist.find((i) => i.kind === 'CERTIFICATION');
        expect(item?.satisfied).toBe(true);
      } finally {
        await prisma.memberCertification.delete({ where: { id: medic.id } });
        await prisma.credentialRequirement.delete({
          where: { id: requirement.id },
        });
      }
    });

    // These build ladders out of throwaway types, so they cannot disturb the
    // seeded NYS ladder that the tests around them rely on.
    describe('ladder editing', () => {
      let rungs: number[];
      const asSettings = {
        'x-test-member-id': String(alice),
        'x-test-permissions': 'settings:write',
      };

      beforeAll(async () => {
        rungs = [];
        for (const level of ['Low', 'Mid', 'High']) {
          const type = await prisma.certificationType.create({
            data: {
              name: `${level} Test ${stamp}`,
              abbreviation: `${level[0]}T${stamp}`,
            },
          });
          rungs.push(type.id);
        }
      });

      afterAll(async () => {
        await prisma.certificationType.deleteMany({
          where: { id: { in: rungs } },
        });
      });

      it('stores an ordered ladder as neighboring links only', async () => {
        const [low, mid, high] = rungs;
        const res = await request(app.getHttpServer())
          .put('/v1/certifications/ladder')
          .set(asSettings)
          .send({ typeIds: [high, mid, low] })
          .expect(200);
        // Three rungs, two links — not every pair.
        expect(res.body).toMatchObject({ rungs: 3, links: 2 });

        const graph = app.get(CertificationGraphService);
        graph.invalidate();
        expect((await graph.satisfying(low)).sort()).toEqual(
          [low, mid, high].sort(),
        );
        expect(await graph.satisfying(high)).toEqual([high]);
      });

      it('drops a rung and its links when the ladder is shortened', async () => {
        const [low, mid, high] = rungs;
        await request(app.getHttpServer())
          .put('/v1/certifications/ladder')
          .set(asSettings)
          .send({ typeIds: [high, low] })
          .expect(200);
        const graph = app.get(CertificationGraphService);
        graph.invalidate();
        // Mid is no longer between them, and no longer outranks anything.
        expect((await graph.satisfying(low)).sort()).toEqual(
          [low, high].sort(),
        );
        expect(await graph.satisfying(mid)).toEqual([mid]);
      });

      it('breaks a ladder when asked to unlink', async () => {
        const [low, , high] = rungs;
        await request(app.getHttpServer())
          .put('/v1/certifications/ladder')
          .set(asSettings)
          .send({ typeIds: [high, low], unlink: true })
          .expect(200);
        const graph = app.get(CertificationGraphService);
        graph.invalidate();
        expect(await graph.satisfying(low)).toEqual([low]);
      });
    });

    it('refuses a link that would make a certification outrank itself', async () => {
      const emt = await typeIdFor('NYS EMT');
      const medic = await typeIdFor('NYS Paramedic');
      // Paramedic already outranks EMT through AEMT; the reverse is a cycle.
      await request(app.getHttpServer())
        .put(`/v1/certifications/types/${emt}/supersedes`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'settings:write',
        })
        .send({ lowerTypeIds: [medic] })
        .expect(400);
    });

    it('requires settings:write to change the hierarchy', async () => {
      await request(app.getHttpServer())
        .put(
          `/v1/certifications/types/${await typeIdFor('NYS EMT')}/supersedes`,
        )
        .set(as(bob))
        .send({ lowerTypeIds: [] })
        .expect(403);
    });
  });

  describe('declining a coverage request on receipt', () => {
    const asApprover = {
      'x-test-member-id': String(alice),
      'x-test-permissions': 'events:create,events:approve',
    };

    async function makeRequest(): Promise<number> {
      const created = await prisma.coverageRequest.create({
        data: {
          token: `tok-${stamp}-${Math.round(Number(String(stamp).slice(-5)) + Math.abs(1))}`,
          requesterName: 'Outside Group',
          requesterEmail: `outside-${stamp}@example.invalid`,
          description: 'Something we cannot staff',
        },
      });
      return created.id;
    }

    it('declines before any event exists, and reports it as denied', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .send({ reason: 'No crews available that weekend' })
        .expect(201);

      const row = await prisma.coverageRequest.findUniqueOrThrow({
        where: { id },
      });
      expect(row.declinedAt).toBeTruthy();
      expect(row.declineReason).toBe('No crews available that weekend');

      const listed = await request(app.getHttpServer())
        .get('/v1/coverage-requests')
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'events:create',
        })
        .expect(200);
      expect(listed.body.find((r: { id: number }) => r.id === id).status).toBe(
        'DENIED',
      );
      await prisma.coverageRequest.delete({ where: { id } });
    });

    it('refuses a second decline', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .expect(400);
      await prisma.coverageRequest.delete({ where: { id } });
    });

    it('sends you to the event workflow once an event exists', async () => {
      const id = await makeRequest();
      const kind = await prisma.eventKind.findFirstOrThrow();
      const event = await prisma.event.create({
        data: {
          title: `Drafted ${stamp}`,
          startsAt: new Date('2027-01-01T18:00:00Z'),
          endsAt: new Date('2027-01-01T22:00:00Z'),
          kindId: kind.id,
        },
      });
      await prisma.coverageRequest.update({
        where: { id },
        data: { eventId: event.id },
      });
      const res = await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .expect(400);
      expect(res.body.message).toContain('event workflow');
      await prisma.coverageRequest.delete({ where: { id } });
      await prisma.event.delete({ where: { id: event.id } });
    });

    it('accepts events:decline as well as events:approve', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'events:create,events:decline',
        })
        .expect(201);
      const row = await prisma.coverageRequest.findUniqueOrThrow({
        where: { id },
      });
      expect(row.declinedAt).toBeTruthy();
      await prisma.coverageRequest.delete({ where: { id } });
    });

    it('stays declined, and refuses to draft an event over it', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .expect(201);

      // The path that used to erase the decline: drafting an event.
      const kind = await prisma.eventKind.findFirstOrThrow();
      const blocked = await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/event`)
        .set(asApprover)
        .send({
          title: 'Should not happen',
          startsAt: '2027-05-01T18:00:00.000Z',
          endsAt: '2027-05-01T22:00:00.000Z',
          kindId: kind.id,
        })
        .expect(400);
      expect(blocked.body.message).toContain('reopen');

      const still = await request(app.getHttpServer())
        .get(`/v1/coverage-requests/${id}`)
        .set(asApprover)
        .expect(200);
      expect(still.body.status).toBe('DENIED');
      await prisma.coverageRequest.delete({ where: { id } });
    });

    it('can be reopened, and then drafted', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(asApprover)
        .expect(201);
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/reopen`)
        .set(asApprover)
        .expect(201);

      const reopened = await request(app.getHttpServer())
        .get(`/v1/coverage-requests/${id}`)
        .set(asApprover)
        .expect(200);
      expect(reopened.body.status).toBe('RECEIVED');

      const kind = await prisma.eventKind.findFirstOrThrow();
      const drafted = await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/event`)
        .set(asApprover)
        .send({
          title: `Reopened ${stamp}`,
          startsAt: '2027-05-01T18:00:00.000Z',
          endsAt: '2027-05-01T22:00:00.000Z',
          kindId: kind.id,
        })
        .expect(201);

      await prisma.coverageRequest.delete({ where: { id } });
      await prisma.event.delete({ where: { id: drafted.body.id } });
    });

    it('requires one of them', async () => {
      const id = await makeRequest();
      await request(app.getHttpServer())
        .post(`/v1/coverage-requests/${id}/decline`)
        .set(as(bob))
        .expect(403);
      await prisma.coverageRequest.delete({ where: { id } });
    });
  });

  describe('email settings', () => {
    const asAdmin = {
      'x-test-member-id': String(alice),
      'x-test-permissions': 'settings:write',
    };

    it('saves settings and never returns the password', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/email')
        .set(asAdmin)
        .send({
          host: 'localhost',
          port: 1025,
          secure: false,
          user: 'postmaster',
          pass: 'hunter2',
          from: 'RPI Ambulance <no-reply@rpiambulance.test>',
        })
        .expect(200);

      const res = await request(app.getHttpServer())
        .get('/v1/settings/email')
        .set(asAdmin)
        .expect(200);
      expect(res.body).toMatchObject({
        configured: true,
        host: 'localhost',
        port: 1025,
        user: 'postmaster',
        hasPassword: true,
      });
      expect(JSON.stringify(res.body)).not.toContain('hunter2');
    });

    it('keeps the stored password when the field is omitted', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/email')
        .set(asAdmin)
        .send({
          host: 'mail.example.test',
          port: 587,
          secure: false,
          user: 'postmaster',
          from: 'RPI Ambulance <no-reply@rpiambulance.test>',
        })
        .expect(200);
      const stored = await prisma.appSetting.findUniqueOrThrow({
        where: { key: 'email.smtp' },
      });
      expect((stored.value as { pass?: string }).pass).toBe('hunter2');
    });

    it('reports a failed test send rather than throwing', async () => {
      // Port 1 refuses, so this exercises the failure path deterministically.
      await request(app.getHttpServer())
        .put('/v1/settings/email')
        .set(asAdmin)
        .send({
          host: '127.0.0.1',
          port: 1,
          secure: false,
          pass: '',
          from: 'RPI Ambulance <no-reply@rpiambulance.test>',
        })
        .expect(200);
      const res = await request(app.getHttpServer())
        .post('/v1/settings/email/test')
        .set(asAdmin)
        .send({ to: 'officer@example.test' })
        .expect(201);
      expect(res.body.ok).toBe(false);
      expect(typeof res.body.detail).toBe('string');
    });

    it('delivers a themed test message when a server is reachable', async () => {
      // Skipped unless a local SMTP sink is listening (docker mailpit).
      const reachable = await fetch('http://localhost:8025/api/v1/messages')
        .then((r) => r.ok)
        .catch(() => false);
      if (!reachable) return;

      await request(app.getHttpServer())
        .put('/v1/settings/email')
        .set(asAdmin)
        .send({
          host: 'localhost',
          port: 1025,
          secure: false,
          pass: '',
          from: 'RPI Ambulance <no-reply@rpiambulance.test>',
        })
        .expect(200);
      const res = await request(app.getHttpServer())
        .post('/v1/settings/email/test')
        .set(asAdmin)
        .send({ to: 'officer@example.test' })
        .expect(201);
      expect(res.body.ok).toBe(true);

      const inbox = (await (
        await fetch('http://localhost:8025/api/v1/messages')
      ).json()) as { messages: Array<{ ID: string; Subject: string }> };
      const message = inbox.messages.find((m) =>
        m.Subject.includes('test message'),
      );
      expect(message).toBeTruthy();
      const full = (await (
        await fetch(`http://localhost:8025/api/v1/message/${message!.ID}`)
      ).json()) as { HTML: string; Text: string };
      // Both parts, and the HTML carries the brand rule and the wordmark.
      expect(full.Text).toContain('test from the Rampart admin console');
      expect(full.HTML).toContain('RPI Ambulance');
      expect(full.HTML.toLowerCase()).toContain('#e21f26');
    });

    it('requires settings:write', async () => {
      await request(app.getHttpServer())
        .get('/v1/settings/email')
        .set(as(bob))
        .expect(403);
      await request(app.getHttpServer())
        .post('/v1/settings/email/test')
        .set(as(bob))
        .send({ to: 'x@example.test' })
        .expect(403);
    });

    afterAll(async () => {
      await prisma.appSetting.deleteMany({ where: { key: 'email.smtp' } });
    });
  });

  describe('declining an event from each stage', () => {
    const asApprover = {
      'x-test-member-id': String(alice),
      'x-test-permissions': 'events:create,events:approve',
    };

    async function eventInState(state: string): Promise<number> {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const event = await prisma.event.create({
        data: {
          title: `Workflow ${state} ${stamp}`,
          startsAt: new Date('2027-02-01T18:00:00Z'),
          endsAt: new Date('2027-02-01T22:00:00Z'),
          kindId: kind.id,
          workflowStatus: state as never,
        },
      });
      return event.id;
    }

    for (const state of [
      'DRAFT',
      'AVAILABILITY_REQUESTED',
      'PENDING_APPROVAL',
    ]) {
      it(`declines from ${state}`, async () => {
        const id = await eventInState(state);
        await request(app.getHttpServer())
          .post(`/v1/events/${id}/workflow`)
          .set(asApprover)
          .send({ action: 'DENY', notes: 'Cannot staff' })
          .expect(201);
        const after = await prisma.event.findUniqueOrThrow({ where: { id } });
        expect(after.workflowStatus).toBe('DENIED');
        expect(after.hidden).toBe(true);
        await prisma.event.delete({ where: { id } });
      });
    }

    it('declines with events:decline alone', async () => {
      const id = await eventInState('PENDING_APPROVAL');
      await request(app.getHttpServer())
        .post(`/v1/events/${id}/workflow`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'events:create,events:decline',
        })
        .send({ action: 'DENY' })
        .expect(201);
      const after = await prisma.event.findUniqueOrThrow({ where: { id } });
      expect(after.workflowStatus).toBe('DENIED');
      await prisma.event.delete({ where: { id } });
    });

    it('does not let declining stand in for approving', async () => {
      const id = await eventInState('PENDING_APPROVAL');
      await request(app.getHttpServer())
        .post(`/v1/events/${id}/workflow`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'events:create,events:decline',
        })
        .send({ action: 'APPROVE' })
        .expect(403);
      await prisma.event.delete({ where: { id } });
    });

    it('refuses with neither permission', async () => {
      const id = await eventInState('PENDING_APPROVAL');
      await request(app.getHttpServer())
        .post(`/v1/events/${id}/workflow`)
        .set({
          'x-test-member-id': String(alice),
          'x-test-permissions': 'events:create',
        })
        .send({ action: 'DENY' })
        .expect(403);
      await prisma.event.delete({ where: { id } });
    });
  });

  describe('event positions with no limit', () => {
    const asOrganiser = {
      'x-test-member-id': String(alice),
      'x-test-permissions': 'events:create,events:assign-others',
    };

    it('never fills a position created without a count', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const created = await request(app.getHttpServer())
        .post('/v1/events')
        .set(asOrganiser)
        .send({
          title: `Open roster ${stamp}`,
          startsAt: '2027-03-01T18:00:00.000Z',
          endsAt: '2027-03-01T22:00:00.000Z',
          kindId: kind.id,
          positions: [{ position: 'observer' }, { position: 'cc', count: 1 }],
        })
        .expect(201);
      const eventId = created.body.id;

      const stored = await prisma.eventPosition.findMany({
        where: { eventId },
        orderBy: { position: 'asc' },
      });
      expect(stored.find((p) => p.position === 'observer')?.count).toBeNull();
      expect(stored.find((p) => p.position === 'cc')?.count).toBe(1);

      // Three sign up for the unlimited seat; none is turned away.
      for (const memberId of [alice, bob, charlie]) {
        await request(app.getHttpServer())
          .post(`/v1/events/${eventId}/signup/${memberId}`)
          .set(asOrganiser)
          .send({ position: 'observer' })
          .expect(201);
      }
      const signups = await prisma.eventSignup.count({
        where: { eventId, position: 'observer' },
      });
      expect(signups).toBe(3);

      // The capped seat still fills at its limit.
      await request(app.getHttpServer())
        .post(`/v1/events/${eventId}/signup/${tina}`)
        .set(asOrganiser)
        .send({ position: 'cc' })
        .expect(201);

      await prisma.event.delete({ where: { id: eventId } });
    });
  });

  describe('only approved events reach calendars', () => {
    async function icsFor(memberId: number): Promise<string> {
      const token = `ics-${stamp}-${memberId}`;
      await prisma.icsToken.upsert({
        where: { token },
        create: { memberId, token, scope: 'MY_SCHEDULE' },
        update: {},
      });
      const res = await request(app.getHttpServer())
        .get(`/v1/calendar/feed/${token}.ics`)
        .expect(200);
      return res.text;
    }

    it('leaves an unapproved event out of the feed, and adds it once approved', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const event = await prisma.event.create({
        data: {
          title: `Pending coverage ${stamp}`,
          startsAt: new Date('2027-04-01T18:00:00Z'),
          endsAt: new Date('2027-04-01T22:00:00Z'),
          kindId: kind.id,
          workflowStatus: 'PENDING_APPROVAL',
          hidden: false,
          signups: { create: [{ memberId: bob }] },
        },
      });
      try {
        expect(await icsFor(bob)).not.toContain(`Pending coverage ${stamp}`);

        await request(app.getHttpServer())
          .post(`/v1/events/${event.id}/workflow`)
          .set({
            'x-test-member-id': String(alice),
            'x-test-permissions': 'events:create,events:approve',
          })
          .send({ action: 'APPROVE' })
          .expect(201);

        expect(await icsFor(bob)).toContain(`Pending coverage ${stamp}`);
      } finally {
        await prisma.icsToken.deleteMany({ where: { memberId: bob } });
        await prisma.event.delete({ where: { id: event.id } });
      }
    });

    it('drops an event back out of the feed when it stops being publishable', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const event = await prisma.event.create({
        data: {
          title: `Approved then hidden ${stamp}`,
          startsAt: new Date('2027-04-02T18:00:00Z'),
          endsAt: new Date('2027-04-02T22:00:00Z'),
          kindId: kind.id,
          workflowStatus: 'PENDING_APPROVAL',
          hidden: false,
          signups: { create: [{ memberId: charlie }] },
        },
      });
      try {
        await request(app.getHttpServer())
          .post(`/v1/events/${event.id}/workflow`)
          .set({
            'x-test-member-id': String(alice),
            'x-test-permissions': 'events:create,events:approve',
          })
          .send({ action: 'APPROVE' })
          .expect(201);
        expect(await icsFor(charlie)).toContain(
          `Approved then hidden ${stamp}`,
        );

        // Hiding an approved event takes it back off calendars.
        await request(app.getHttpServer())
          .put(`/v1/events/${event.id}`)
          .set({
            'x-test-member-id': String(alice),
            'x-test-permissions': 'events:create',
          })
          .send({
            title: `Approved then hidden ${stamp}`,
            startsAt: '2027-04-02T18:00:00.000Z',
            endsAt: '2027-04-02T22:00:00.000Z',
            kindId: kind.id,
            hidden: true,
          })
          .expect(200);
        expect(await icsFor(charlie)).not.toContain(
          `Approved then hidden ${stamp}`,
        );
      } finally {
        await prisma.icsToken.deleteMany({ where: { memberId: charlie } });
        await prisma.event.delete({ where: { id: event.id } });
      }
    });
  });

  describe('inbox', () => {
    const asAdmin = {
      'x-test-member-id': String(alice),
      'x-test-permissions': 'settings:write',
    };

    afterEach(async () => {
      await prisma.inboxMessage.deleteMany({ where: { memberId: bob } });
      await prisma.appSetting.deleteMany({
        where: { key: 'notifications.channels' },
      });
    });

    it('writes an inbox copy even when every channel is switched off', async () => {
      await request(app.getHttpServer())
        .put('/v1/settings/notifications')
        .set(asAdmin)
        .send({ channels: { 'cert.decided': { email: false, slack: false } } })
        .expect(200);

      const notifications = app.get(NotificationsService);
      await notifications.notify(bob, {
        type: 'cert.decided',
        subject: 'Certification verified',
        body: 'Your certification was verified.',
      });

      const res = await request(app.getHttpServer())
        .get('/v1/inbox')
        .set(as(bob))
        .expect(200);
      expect(res.body[0]).toMatchObject({
        type: 'cert.decided',
        subject: 'Certification verified',
        isTask: false,
        readAt: null,
      });
    });

    it('carries a task with somewhere to go, and completes it', async () => {
      const notifications = app.get(NotificationsService);
      await notifications.notify(bob, {
        type: 'availability.requested',
        subject: 'Availability requested',
        body: 'Tell us when you can ride.',
        task: { actionLabel: 'Fill it in', actionUrl: '/availability' },
      });

      const summary = await request(app.getHttpServer())
        .get('/v1/inbox/summary')
        .set(as(bob))
        .expect(200);
      expect(summary.body).toEqual({ unread: 1, tasks: 1 });

      const list = await request(app.getHttpServer())
        .get('/v1/inbox?filter=tasks')
        .set(as(bob))
        .expect(200);
      const message = list.body[0];
      expect(message).toMatchObject({
        isTask: true,
        actionLabel: 'Fill it in',
        actionUrl: '/availability',
      });

      await request(app.getHttpServer())
        .post(`/v1/inbox/${message.id}/complete`)
        .set(as(bob))
        .expect(201);
      const after = await request(app.getHttpServer())
        .get('/v1/inbox/summary')
        .set(as(bob))
        .expect(200);
      expect(after.body).toEqual({ unread: 0, tasks: 0 });
    });

    it("will not touch another member's inbox", async () => {
      const notifications = app.get(NotificationsService);
      const mine = await notifications.notify(bob, {
        type: 'cert.decided',
        subject: 'Private',
        body: 'For Bob only.',
      });

      // Charlie cannot read it...
      const listed = await request(app.getHttpServer())
        .get('/v1/inbox')
        .set(as(charlie))
        .expect(200);
      expect(listed.body.map((m: { id: number }) => m.id)).not.toContain(
        mine.id,
      );

      // ...nor mark it read.
      await request(app.getHttpServer())
        .post(`/v1/inbox/${mine.id}/read`)
        .set(as(charlie))
        .expect(201);
      const unchanged = await prisma.inboxMessage.findUniqueOrThrow({
        where: { id: mine.id },
      });
      expect(unchanged.readAt).toBeNull();
    });

    it('reports the settings actually in force, defaults included', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/settings/notifications')
        .set(asAdmin)
        .expect(200);
      const decided = res.body.find(
        (t: { key: string }) => t.key === 'promotion.decided',
      );
      expect(decided.channels).toEqual({ email: true, slack: true });
      const coverage = res.body.find(
        (t: { key: string }) => t.key === 'coverage.received',
      );
      expect(coverage.channels).toEqual({ email: false, slack: true });
    });
  });

  describe('trainers clearing members for calls', () => {
    let student: number;

    beforeAll(async () => {
      student = await createMember('Student', ['O', 'A']);
      // Somebody has to be able to issue the number, or the task has nobody
      // to go to — which is itself the correct behavior, just not the case
      // under test here.
      const captain = await prisma.role.findUniqueOrThrow({
        where: { name: 'Captain' },
      });
      await prisma.memberRole.create({
        data: {
          memberId: alice,
          roleId: captain.id,
          startDate: toDbDate(nyNow().dateStr),
        },
      });
    });

    afterAll(async () => {
      await prisma.memberRole.deleteMany({ where: { memberId: alice } });
    });

    it('lets a crew chief trainer clear A-CC, and raises the 900 number', async () => {
      // tina holds CC_T; alice can edit members, so the task lands with her.
      await request(app.getHttpServer())
        .post('/v1/credentials/trainer-grant')
        .set(as(tina))
        .send({ memberId: student, credentialKey: 'A_CC' })
        .expect(201);

      const type = await prisma.credentialType.findUniqueOrThrow({
        where: { key: 'A_CC' },
      });
      const held = await prisma.memberCredential.findUnique({
        where: { memberId_typeId: { memberId: student, typeId: type.id } },
      });
      expect(held?.status).toBe('ACTIVE');

      // The student is told...
      const theirs = await prisma.inboxMessage.findMany({
        where: { memberId: student },
      });
      expect(theirs.some((m) => m.subject.includes('cleared for calls'))).toBe(
        true,
      );

      // ...and somebody who can edit members is asked for the number.
      const task = await prisma.inboxMessage.findFirst({
        where: { type: 'promotion.number', isTask: true, memberId: alice },
      });
      expect(task).toBeTruthy();
      expect(task!.actionUrl).toBe(`/admin/members/${student}`);
    });

    it('refuses a track the trainer does not train', async () => {
      // tina is a CC trainer, not a driver trainer.
      const res = await request(app.getHttpServer())
        .post('/v1/credentials/trainer-grant')
        .set(as(tina))
        .send({ memberId: student, credentialKey: 'A_D' })
        .expect(403);
      expect(res.body.message).toContain('A-D');
    });

    it('refuses a member who is not a trainer at all', async () => {
      await request(app.getHttpServer())
        .post('/v1/credentials/trainer-grant')
        .set(as(bob))
        .send({ memberId: student, credentialKey: 'A_CC' })
        .expect(403);
    });

    it('will not let a trainer clear themselves', async () => {
      await request(app.getHttpServer())
        .post('/v1/credentials/trainer-grant')
        .set(as(tina))
        .send({ memberId: tina, credentialKey: 'A_CC' })
        .expect(403);
    });

    it('reports what the caller may clear', async () => {
      const trainer = await request(app.getHttpServer())
        .get('/v1/credentials/trainer-grants')
        .set(as(tina))
        .expect(200);
      expect(trainer.body).toEqual(['A_CC']);

      const plain = await request(app.getHttpServer())
        .get('/v1/credentials/trainer-grants')
        .set(as(bob))
        .expect(200);
      expect(plain.body).toEqual([]);
    });
  });

  describe('evaluations', () => {
    // A function, not a constant: the fixture ids are assigned in beforeAll,
    // after the describe body has already run.
    const asAuthor = () => ({
      'x-test-member-id': String(tina),
      'x-test-permissions': 'evals:manage-forms,evals:write',
    });

    // Evaluations reference members without a cascade, so they have to go
    // before the fixture members do.
    afterAll(async () => {
      await prisma.evaluation.deleteMany({
        where: { OR: [{ subjectId: bob }, { evaluatorId: tina }] },
      });
      await prisma.evalFormTemplate.deleteMany({
        where: { name: { contains: String(stamp) } },
      });
      await prisma.inboxMessage.deleteMany({ where: { memberId: bob } });
    });

    it('stores option lists, headings and free text on a template', async () => {
      const created = await request(app.getHttpServer())
        .post('/v1/evals/templates')
        .set(asAuthor())
        .send({
          name: `Rich form ${stamp}`,
          items: [
            { order: 1, prompt: 'Patient care', scoreType: 'HEADING' },
            { order: 2, prompt: 'Scene size-up', scoreType: 'SCALE_1_5' },
            {
              order: 3,
              prompt: 'Radio discipline',
              scoreType: 'OPTIONS',
              options: [
                { value: 'poor', label: 'Needs work' },
                { value: 'ok', label: 'Adequate' },
                { value: 'good', label: 'Strong' },
              ],
            },
            { order: 4, prompt: 'Anything else?', scoreType: 'TEXT' },
          ],
        })
        .expect(201);

      const options = created.body.items.find(
        (i: { scoreType: string }) => i.scoreType === 'OPTIONS',
      );
      expect(options.options).toEqual([
        { value: 'poor', label: 'Needs work' },
        { value: 'ok', label: 'Adequate' },
        { value: 'good', label: 'Strong' },
      ]);
      // Items that are not option lists carry none.
      expect(
        created.body.items.find(
          (i: { scoreType: string }) => i.scoreType === 'TEXT',
        ).options,
      ).toBeNull();
      expect(created.body.items.length).toBe(4);
    });

    it('takes more than ten items', async () => {
      const items = Array.from({ length: 24 }, (_, i) => ({
        order: i + 1,
        prompt: `Question ${i + 1}`,
        scoreType: 'SCALE_1_5' as const,
      }));
      const created = await request(app.getHttpServer())
        .post('/v1/evals/templates')
        .set(asAuthor())
        .send({ name: `Long form ${stamp}`, items })
        .expect(201);
      expect(created.body.items.length).toBe(24);
    });

    it('records a verdict and asks the trainee to sign', async () => {
      const template = await request(app.getHttpServer())
        .post('/v1/evals/templates')
        .set(asAuthor())
        .send({
          name: `Verdict form ${stamp}`,
          items: [
            {
              order: 1,
              prompt: 'Overall handling',
              scoreType: 'OPTIONS',
              options: [
                { value: 'ok', label: 'Adequate' },
                { value: 'good', label: 'Strong' },
              ],
            },
          ],
        })
        .expect(201);

      const created = await request(app.getHttpServer())
        .post('/v1/evals')
        .set(asAuthor())
        .send({ subjectId: bob, templateId: template.body.id })
        .expect(201);

      const saved = await request(app.getHttpServer())
        .put(`/v1/evals/${created.body.id}/scores`)
        .set(asAuthor())
        .send({
          scores: [{ itemId: template.body.items[0].id, optionValue: 'good' }],
          notes: 'Handled a difficult call well.',
          outcome: 'PASSED',
          readyForPromotion: true,
          submit: true,
        })
        .expect(200);
      expect(saved.body.outcome).toBe('PASSED');
      expect(saved.body.readyForPromotion).toBe(true);
      expect(saved.body.scores[0].optionValue).toBe('good');

      // The trainee is asked to acknowledge it.
      const task = await prisma.inboxMessage.findFirst({
        where: { memberId: bob, type: 'eval.received', isTask: true },
        orderBy: { id: 'desc' },
      });
      expect(task).toBeTruthy();
      expect(task!.actionUrl).toBe(`/evals/${created.body.id}`);

      // Signing it off completes the acknowledgment.
      await request(app.getHttpServer())
        .post(`/v1/evals/${created.body.id}/sign`)
        .set(as(bob))
        .expect(201);
      const signed = await prisma.evaluation.findUniqueOrThrow({
        where: { id: created.body.id },
      });
      expect(signed.signedBySubject).toBeTruthy();

      await prisma.inboxMessage.deleteMany({ where: { memberId: bob } });
    });

    it('holds draft and completed deletion as separate permissions', async () => {
      const template = await request(app.getHttpServer())
        .post('/v1/evals/templates')
        .set(asAuthor())
        .send({
          name: `Deletable form ${stamp}`,
          items: [{ order: 1, prompt: 'Overall', scoreType: 'SCALE_1_5' }],
        })
        .expect(201);

      const newEval = async () =>
        (
          await request(app.getHttpServer())
            .post('/v1/evals')
            .set(asAuthor())
            .send({ subjectId: bob, templateId: template.body.id })
            .expect(201)
        ).body.id as number;

      // A draft: the completed permission does not reach it, the draft one does.
      const draft = await newEval();
      await request(app.getHttpServer())
        .delete(`/v1/evals/${draft}`)
        .set({
          'x-test-member-id': String(tina),
          'x-test-permissions': 'evals:delete-completed',
        })
        .expect(403);
      await request(app.getHttpServer())
        .delete(`/v1/evals/${draft}`)
        .set({
          'x-test-member-id': String(tina),
          'x-test-permissions': 'evals:delete-draft',
        })
        .expect(200);
      expect(
        await prisma.evaluation.findUnique({ where: { id: draft } }),
      ).toBeNull();

      // Once submitted it is the other way round.
      const submitted = await newEval();
      await request(app.getHttpServer())
        .put(`/v1/evals/${submitted}/scores`)
        .set(asAuthor())
        .send({
          scores: [{ itemId: template.body.items[0].id, scaleValue: 4 }],
          submit: true,
        })
        .expect(200);
      await request(app.getHttpServer())
        .delete(`/v1/evals/${submitted}`)
        .set({
          'x-test-member-id': String(tina),
          'x-test-permissions': 'evals:delete-draft',
        })
        .expect(403);
      await request(app.getHttpServer())
        .delete(`/v1/evals/${submitted}`)
        .set({
          'x-test-member-id': String(tina),
          'x-test-permissions': 'evals:delete-completed',
        })
        .expect(200);
      expect(
        await prisma.evaluation.findUnique({ where: { id: submitted } }),
      ).toBeNull();
      // The trainee is no longer asked to sign something that is gone.
      expect(
        await prisma.inboxMessage.findFirst({
          where: { memberId: bob, actionUrl: `/evals/${submitted}` },
        }),
      ).toBeNull();
    });
  });

  it('returns two weeks with slot eligibility', async () => {
    const res = await request(app.getHttpServer())
      .get('/v1/crews')
      .set(as(bob))
      .expect(200);
    expect(res.body.currentWeek.length).toBeGreaterThan(0);
    expect(res.body.nextWeek.length).toBe(7);
    const day = res.body.nextWeek[3];
    expect(day.slots.OBSERVER).toBeDefined();
    expect(day.slots.DUTY_SUP.eligible).toBe(false); // bob is not a DS
  });

  it('lets a rider take one slot, then enforces the fairness limit', async () => {
    await request(app.getHttpServer())
      .post(`/v1/crews/${await crewIdFor(dayA)}/slots/ATTENDANT/signup`)
      .set(as(bob))
      .expect(201);

    const second = await request(app.getHttpServer())
      .post(`/v1/crews/${await crewIdFor(dayB)}/slots/ATTENDANT/signup`)
      .set(as(bob))
      .expect(403);
    expect(second.body.message).toContain('one rider shift');
  });

  it('blocks a probationary CC without a trainer, allows with one', async () => {
    const crewId = await crewIdFor(dayC);
    const blocked = await request(app.getHttpServer())
      .post(`/v1/crews/${crewId}/slots/CC/signup`)
      .set(as(charlie))
      .expect(403);
    expect(blocked.body.message).toBe('No CC-T on this crew');

    // Put a CC-T on the crew (driver seat), then retry.
    await prisma.crewSlot.update({
      where: { crewId_position: { crewId, position: 'DRIVER' } },
      data: { memberId: tina },
    });
    await request(app.getHttpServer())
      .post(`/v1/crews/${crewId}/slots/CC/signup`)
      .set(as(charlie))
      .expect(201);
  });

  it('allows a full CC to take a CC slot and blocks double-booking', async () => {
    const crewId = await crewIdFor(dayB);
    await request(app.getHttpServer())
      .post(`/v1/crews/${crewId}/slots/CC/signup`)
      .set(as(alice))
      .expect(201);

    const double = await request(app.getHttpServer())
      .post(`/v1/crews/${crewId}/slots/DRIVER/signup`)
      .set(as(alice))
      .expect(403);
    expect(double.body.message).toBe('Already on this crew');
  });

  it('rejects signup for an occupied slot with a conflict', async () => {
    const crewId = await crewIdFor(dayB);
    await request(app.getHttpServer())
      .post(`/v1/crews/${crewId}/slots/CC/signup`)
      .set(as(tina))
      .expect(409); // alice already holds it
  });

  it('enforces the drop deadline', async () => {
    // Alice signs up for today's crew, then tries to drop — the 18:00/T-2
    // deadline has necessarily passed for a same-day shift.
    const today = nyNow().dateStr;
    const crew = await prisma.crew.findUnique({
      where: { date: toDbDate(today) },
    });
    if (!crew) return; // current week may not include today if generated late-week
    await prisma.crewSlot.update({
      where: { crewId_position: { crewId: crew.id, position: 'CC' } },
      data: { memberId: alice, placeholder: null },
    });
    const res = await request(app.getHttpServer())
      .delete(`/v1/crews/${crew.id}/slots/CC/signup`)
      .set(as(alice))
      .expect(403);
    expect(res.body.message).toContain('Drops close');
  });

  it('far-future drops succeed', async () => {
    const crewId = await crewIdFor(dayA);
    await request(app.getHttpServer())
      .delete(`/v1/crews/${crewId}/slots/ATTENDANT/signup`)
      .set(as(bob))
      .expect(200);
  });

  describe('asking for an account', () => {
    // The request form asks for what the profile holds. If any of it is
    // dropped on the way in, an officer has to chase for it by email —
    // which is the whole thing this was meant to avoid.
    it('keeps the profile details it was given', async () => {
      const code = `E2E${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `wants-in-${stamp}@example.com`;

      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Daniel',
          preferredFirstName: 'Alex',
          lastName: `Test${stamp}`,
          email,
          personalEmail: `alex-${stamp}@example.com`,
          cellPhone: '518-555-0101',
          homePhone: '518-555-0102',
          localAddress: '110 8th St',
          homeAddress: '1 Elsewhere Ave',
          dob: '2004-03-09',
          note: 'Already an EMT.',
        })
        .expect(201);

      const saved = await prisma.accountRequest.findFirstOrThrow({
        where: { email },
      });
      expect(saved).toMatchObject({
        firstName: 'Daniel',
        preferredFirstName: 'Alex',
        personalEmail: `alex-${stamp}@example.com`,
        cellPhone: '518-555-0101',
        homePhone: '518-555-0102',
        localAddress: '110 8th St',
        homeAddress: '1 Elsewhere Ave',
        note: 'Already an EMT.',
      });
      // Stored as a calendar day, not shifted by whatever zone the box is in.
      expect(saved.dob?.toISOString().slice(0, 10)).toBe('2004-03-09');

      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.inviteCode.delete({ where: { code } });
    });

    it('leaves out what was not filled in, rather than storing blanks', async () => {
      const code = `E2EB${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `sparse-${stamp}@example.com`;

      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Sam',
          lastName: `Test${stamp}`,
          email,
        })
        .expect(201);

      const saved = await prisma.accountRequest.findFirstOrThrow({
        where: { email },
      });
      expect(saved.preferredFirstName).toBeNull();
      expect(saved.cellPhone).toBeNull();
      expect(saved.dob).toBeNull();

      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.inviteCode.delete({ where: { code } });
    });

    // The officer's review page renders straight from this payload, so if a
    // field is not in it, it is not on the page however well it was stored.
    it('hands the review page every detail it was given', async () => {
      const code = `E2EP${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `review-${stamp}@example.com`;
      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Daniel',
          preferredFirstName: 'Alex',
          lastName: `Test${stamp}`,
          email,
          cellPhone: '518-555-0101',
          personalEmail: `alex-${stamp}@example.com`,
          localAddress: '110 8th St',
          dob: '2004-03-09',
        })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get('/v1/requests/account/pending')
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .expect(200);

      const mine = (res.body as Array<Record<string, unknown>>).find(
        (row) => row.email === email,
      );
      expect(mine).toMatchObject({
        firstName: 'Daniel',
        preferredFirstName: 'Alex',
        cellPhone: '518-555-0101',
        personalEmail: `alex-${stamp}@example.com`,
        localAddress: '110 8th St',
      });
      expect(String(mine?.dob)).toContain('2004-03-09');

      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.inviteCode.delete({ where: { code } });
    });

    // The whole point of asking for the details on the form: approving is
    // supposed to end with a member, not with an officer retyping them.
    it('creates the member from the request when approved', async () => {
      const code = `E2EA${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `joins-${stamp}@example.com`;
      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Daniel',
          preferredFirstName: 'Alex',
          lastName: `Test${stamp}`,
          email,
          cellPhone: '518-555-0101',
          homePhone: '518-555-0102',
          personalEmail: `alex-${stamp}@example.com`,
          localAddress: '110 8th St',
          homeAddress: '1 Elsewhere Ave',
          dob: '2004-03-09',
        })
        .expect(201);
      const asked = await prisma.accountRequest.findFirstOrThrow({
        where: { email },
      });

      const res = await request(app.getHttpServer())
        .post(`/v1/requests/account/${asked.id}/decide`)
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .send({ approve: true })
        .expect(201);

      const madeId = (res.body as { memberId: number }).memberId;
      expect(madeId).toBeTruthy();
      const made = await prisma.member.findUniqueOrThrow({
        where: { id: madeId },
      });
      // Every field they filled in survives the trip.
      expect(made).toMatchObject({
        firstName: 'Daniel',
        preferredFirstName: 'Alex',
        email,
        personalEmail: `alex-${stamp}@example.com`,
        homePhone: '518-555-0102',
        localAddress: '110 8th St',
        homeAddress: '1 Elsewhere Ave',
      });
      expect(made.dob?.toISOString().slice(0, 10)).toBe('2004-03-09');

      await prisma.memberCredential.deleteMany({ where: { memberId: madeId } });
      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.member.delete({ where: { id: madeId } });
      await prisma.inviteCode.delete({ where: { code } });
    });

    it('refuses to invent a date of birth it was never given', async () => {
      const code = `E2ED${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `nodob-${stamp}@example.com`;
      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Sam',
          lastName: `Test${stamp}`,
          email,
        })
        .expect(201);
      const asked = await prisma.accountRequest.findFirstOrThrow({
        where: { email },
      });

      const refused = await request(app.getHttpServer())
        .post(`/v1/requests/account/${asked.id}/decide`)
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .send({ approve: true })
        .expect(400);
      expect(refused.body.message).toContain('date of birth');
      // Still pending, so the officer can answer and try again.
      expect(
        (
          await prisma.accountRequest.findUniqueOrThrow({
            where: { id: asked.id },
          })
        ).status,
      ).toBe('PENDING');

      const ok = await request(app.getHttpServer())
        .post(`/v1/requests/account/${asked.id}/decide`)
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .send({ approve: true, dob: '2003-01-15' })
        .expect(201);
      const madeId = (ok.body as { memberId: number }).memberId;
      expect(
        (await prisma.member.findUniqueOrThrow({ where: { id: madeId } })).dob
          ?.toISOString()
          .slice(0, 10),
      ).toBe('2003-01-15');

      await prisma.memberCredential.deleteMany({ where: { memberId: madeId } });
      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.member.delete({ where: { id: madeId } });
      await prisma.inviteCode.delete({ where: { code } });
    });
  });

  describe('the station whiteboard', () => {
    // A display is a television, not a person: the token in its URL is the
    // whole credential, so what that token does and does not open is the
    // security boundary worth testing.
    it('opens the board with a live link and nothing without one', async () => {
      const made = await prisma.headsupLink.create({
        data: { token: `tok${stamp}`, label: 'Bay screen' },
      });

      await request(app.getHttpServer()).get('/v1/headsup/board').expect(403);
      await request(app.getHttpServer())
        .get('/v1/headsup/board?token=nonsense')
        .expect(403);
      const ok = await request(app.getHttpServer())
        .get(`/v1/headsup/board?token=${made.token}`)
        .expect(200);
      expect(ok.body.crew).toHaveLength(5);
      expect(ok.body).toHaveProperty('calls');
      expect(ok.body).toHaveProperty('notes');

      // Revoking darkens that screen and only that screen.
      await prisma.headsupLink.update({
        where: { id: made.id },
        data: { revokedAt: new Date() },
      });
      await request(app.getHttpServer())
        .get(`/v1/headsup/board?token=${made.token}`)
        .expect(403);
      await prisma.headsupLink.delete({ where: { id: made.id } });
    });

    it('lets anybody signed in write on it, and records who', async () => {
      const posted = await request(app.getHttpServer())
        .post('/v1/headsup/notes')
        .set(as(bob))
        .send({ body: `Fridge is broken ${stamp}` })
        .expect(201);
      const id = posted.body.id;
      expect(posted.body.createdById).toBe(bob);

      const link = await prisma.headsupLink.create({
        data: { token: `tok2${stamp}` },
      });
      const board = await request(app.getHttpServer())
        .get(`/v1/headsup/board?token=${link.token}`)
        .expect(200);
      expect(
        (board.body.notes as Array<{ body: string }>).some((n) =>
          n.body.includes(`Fridge is broken ${stamp}`),
        ),
      ).toBe(true);

      // Taking it down leaves a record rather than a hole.
      await request(app.getHttpServer())
        .delete(`/v1/headsup/notes/${id}`)
        .set(as(alice))
        .expect(200);
      const gone = await prisma.headsupNote.findUniqueOrThrow({
        where: { id },
      });
      expect(gone.removedAt).not.toBeNull();
      expect(gone.removedById).toBe(alice);

      await prisma.headsupNote.delete({ where: { id } });
      await prisma.headsupLink.delete({ where: { id: link.id } });
    });

    // The point of a reset that keeps its data: the number starts again, and
    // what it counted is still there to be counted from another point.
    it('starts a counter again without losing what it counted', async () => {
      const before = await prisma.dispatchMishap.count({
        where: { removedAt: null },
      });
      await request(app.getHttpServer())
        .post('/v1/headsup/mishaps')
        .set(as(bob))
        .send({ note: `Sent us to the wrong campus ${stamp}` })
        .expect(201);

      const counted = await request(app.getHttpServer())
        .get('/v1/headsup/counters')
        .set(as(bob))
        .expect(200);
      expect(counted.body.mishaps).toBeGreaterThan(0);

      // Clearing needs the permission; writing on the board does not.
      await request(app.getHttpServer())
        .post('/v1/headsup/counters/mishaps/reset')
        .set(as(bob))
        .set('x-test-permissions', '')
        .expect(403);

      const reset = await request(app.getHttpServer())
        .post('/v1/headsup/counters/mishaps/reset')
        .set(as(alice))
        .set('x-test-permissions', 'headsup:manage')
        .expect(201);
      expect(reset.body.previousCount).toBe(counted.body.mishaps);

      const after = await request(app.getHttpServer())
        .get('/v1/headsup/counters')
        .set(as(bob))
        .expect(200);
      expect(after.body.mishaps).toBe(0);

      // Nothing was deleted to get that zero.
      expect(
        await prisma.dispatchMishap.count({ where: { removedAt: null } }),
      ).toBe(before + 1);

      await prisma.dispatchMishap.deleteMany({
        where: { note: { contains: String(stamp) } },
      });
      await prisma.headsupCounterReset.deleteMany({
        where: { counter: 'mishaps' },
      });
    });

    it('keeps the display links to those who may hand them out', async () => {
      await request(app.getHttpServer())
        .get('/v1/headsup/links')
        .set(as(bob))
        .set('x-test-permissions', '')
        .expect(403);
      const made = await request(app.getHttpServer())
        .post('/v1/headsup/links')
        .set(as(alice))
        .set('x-test-permissions', 'headsup:manage')
        .send({ label: `Bay ${stamp}` })
        .expect(201);
      expect(made.body.token).toMatch(/^[a-z2-9]{24}$/);
      await prisma.headsupLink.delete({ where: { id: made.body.id } });
    });
  });

  describe('the audit log', () => {
    // Decisions and traffic are stored apart so they can be pruned apart,
    // but "what did this person do" is one question. The log has to answer
    // it without the reader knowing there are two tables.
    it('shows decisions, page loads and API calls in one timeline', async () => {
      await prisma.auditLog.create({
        data: {
          actorType: 'MEMBER',
          actorId: alice,
          action: `test.decision.${stamp}`,
          entity: 'Thing',
        },
      });
      await prisma.accessLog.createMany({
        data: [
          {
            kind: 'PAGE',
            memberId: alice,
            method: 'GET',
            path: `/members?s=${stamp}`,
          },
          {
            kind: 'API',
            memberId: alice,
            method: 'POST',
            path: `/v1/things?s=${stamp}`,
            status: 201,
          },
        ],
      });

      const res = await request(app.getHttpServer())
        .get('/v1/audit?limit=500')
        .set(as(alice))
        .set('x-test-permissions', 'audit:read')
        .expect(200);

      const rows = res.body as Array<{
        kind: string;
        action: string;
        entityId: string | null;
        actorName: string;
      }>;
      const kinds = new Set(
        rows
          .filter(
            (r) =>
              r.action === `test.decision.${stamp}` ||
              r.entityId?.includes(String(stamp)),
          )
          .map((r) => r.kind),
      );
      expect(kinds).toEqual(new Set(['DECISION', 'PAGE', 'API']));

      // Newest first, whichever record each row came from.
      const times = rows.map((r) =>
        new Date((r as unknown as { at: string }).at).getTime(),
      );
      expect([...times].sort((a, b) => b - a)).toEqual(times);

      // An actor is named, not left as a bare id, on traffic rows too.
      const page = rows.find(
        (r) => r.kind === 'PAGE' && r.entityId?.includes(String(stamp)),
      );
      expect(page?.actorName).not.toMatch(/^member #/);
    });

    it('can be narrowed to the decision record alone', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/audit?kind=decision&limit=200')
        .set(as(alice))
        .set('x-test-permissions', 'audit:read')
        .expect(200);
      const kinds = new Set(
        (res.body as Array<{ kind: string }>).map((r) => r.kind),
      );
      expect(kinds.has('PAGE')).toBe(false);
      expect(kinds.has('API')).toBe(false);
    });

    it('is closed to those without the permission', async () => {
      await request(app.getHttpServer())
        .get('/v1/audit')
        .set(as(bob))
        .set('x-test-permissions', '')
        .expect(403);
    });

    it('counts both kinds of request for the nav badge', async () => {
      const before = await request(app.getHttpServer())
        .get('/v1/requests/pending/count')
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .expect(200);

      const code = `E2EC${stamp}`.slice(0, 20).toUpperCase();
      await prisma.inviteCode.create({ data: { code, maxUses: 1 } });
      const email = `badge-${stamp}@example.com`;
      await request(app.getHttpServer())
        .post('/v1/requests/account')
        .send({
          inviteCode: code,
          firstName: 'Bo',
          lastName: `Test${stamp}`,
          email,
        })
        .expect(201);

      const after = await request(app.getHttpServer())
        .get('/v1/requests/pending/count')
        .set(as(alice))
        .set('x-test-permissions', 'members:write')
        .expect(200);
      expect(after.body.count).toBe(before.body.count + 1);

      await prisma.accountRequest.deleteMany({ where: { email } });
      await prisma.inviteCode.delete({ where: { code } });
    });

    afterAll(async () => {
      await prisma.auditLog.deleteMany({
        where: { action: { contains: String(stamp) } },
      });
      await prisma.accessLog.deleteMany({
        where: { path: { contains: String(stamp) } },
      });
    });
  });

  describe('what is due tonight', () => {
    // The reported fault: a night whose only chore is a one-off. Nothing
    // recurring falls on it, so the job used to answer "no chores" while the
    // portal — reading the occurrences — listed it.
    it('sees a one-off that no recurrence rule would find', async () => {
      const today = nyNow().dateStr;
      const chore = await prisma.chore.create({
        data: { name: `One-off ${stamp}`, cadence: 'ONCE', active: true },
      });
      await prisma.choreOccurrence.create({
        data: { choreId: chore.id, dueOn: toDbDate(today) },
      });

      const service = app.get(ChoresService);
      const due = await service.ensureOccurrences(today);
      expect(due.map((o) => o.chore.name)).toContain(`One-off ${stamp}`);

      await prisma.choreOccurrence.deleteMany({ where: { choreId: chore.id } });
      await prisma.chore.delete({ where: { id: chore.id } });
    });

    // The same hole from the other side: a chore retired or rescheduled after
    // its occurrence was made still has to be announced, or somebody is left
    // holding a job nobody mentioned.
    it('still sees an occurrence whose chore has since been retired', async () => {
      const today = nyNow().dateStr;
      const chore = await prisma.chore.create({
        data: { name: `Retired ${stamp}`, cadence: 'DAILY', active: true },
      });
      await prisma.choreOccurrence.create({
        data: { choreId: chore.id, dueOn: toDbDate(today) },
      });
      await prisma.chore.update({
        where: { id: chore.id },
        data: { active: false },
      });

      const service = app.get(ChoresService);
      const due = await service.ensureOccurrences(today);
      expect(due.map((o) => o.chore.name)).toContain(`Retired ${stamp}`);

      await prisma.choreOccurrence.deleteMany({ where: { choreId: chore.id } });
      await prisma.chore.delete({ where: { id: chore.id } });
    });

    it('says nothing is due when nothing is', async () => {
      // A day far enough out that no seeded chore reaches it, and no
      // occurrence has been made for it.
      const empty = addDays(nyNow().dateStr, 400);
      const service = app.get(ChoresService);
      expect(await service.ensureOccurrences(empty)).toEqual([]);
    });
  });

  describe('expired checksheet items', () => {
    // Both lists have to agree. "Expiring soon" computes from the date, so it
    // shows an expired item the moment it turns; deficiencies only ever
    // learned at check time, so the same item was a job on one screen and
    // invisible on the other.
    let templateId: number;
    let itemId: number;
    let assetId: number;
    let runId: number;

    beforeAll(async () => {
      const kind = await prisma.assetKind.create({
        data: { name: `Bag ${stamp}` },
      });
      const asset = await prisma.asset.create({
        data: { name: `Bag ${stamp}`, kindId: kind.id },
      });
      assetId = asset.id;
      const template = await prisma.checksheetTemplate.create({
        data: { name: `Sheet ${stamp}`, assetKindId: kind.id, active: true },
      });
      templateId = template.id;
      const item = await prisma.checksheetItem.create({
        data: {
          templateId: template.id,
          label: `Epi ${stamp}`,
          kind: 'PAR',
          parLevel: 1,
          expiryTracking: 'SINGLE',
          order: 0,
        },
      });
      itemId = item.id;

      // A check done a while ago that recorded a date since passed: in date
      // when it was written down, expired now, and nothing has looked since.
      const run = await prisma.checksheetRun.create({
        data: {
          templateId: template.id,
          assetId: asset.id,
          completedAt: new Date(Date.now() - 30 * 86_400_000),
          entries: {
            create: [
              {
                itemId: item.id,
                countPresent: 1,
                expiries: {
                  create: [
                    {
                      position: 0,
                      expiresAt: toDbDate(addDays(nyNow().dateStr, -3)),
                    },
                  ],
                },
              },
            ],
          },
        },
      });
      runId = run.id;
    });

    afterAll(async () => {
      await prisma.checksheetDeficiency.deleteMany({ where: { templateId } });
      await prisma.checksheetRun.deleteMany({ where: { templateId } });
      await prisma.checksheetItem.deleteMany({ where: { templateId } });
      await prisma.checksheetTemplate.deleteMany({ where: { id: templateId } });
      await prisma.asset.deleteMany({ where: { id: assetId } });
      await prisma.assetKind.deleteMany({ where: { name: `Bag ${stamp}` } });
    });

    it('shows it as expired on the expiry report', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/checksheets/expiring?withinDays=30')
        .set(as(alice))
        .set('x-test-permissions', 'checksheets:read-all')
        .expect(200);
      const mine = (
        res.body as Array<{ item: { id: number }; expired: boolean }>
      ).find((row) => row.item.id === itemId);
      expect(mine?.expired).toBe(true);
    });

    it('raises it as a deficiency without waiting for the next check', async () => {
      const service = app.get(ChecksheetsService);
      expect(await service.openExpiredDeficiencies()).toBeGreaterThan(0);

      const open = await prisma.checksheetDeficiency.findMany({
        where: { templateId, resolvedAt: null },
      });
      expect(open).toHaveLength(1);
      expect(open[0].detail).toContain('expired');
      expect(open[0].openedRunId).toBe(runId);
    });

    it('does not raise a second one on the next sweep', async () => {
      const service = app.get(ChecksheetsService);
      expect(await service.openExpiredDeficiencies()).toBe(0);
      expect(
        await prisma.checksheetDeficiency.count({
          where: { templateId, resolvedAt: null },
        }),
      ).toBe(1);
    });

    it('closes it when a check records a date that has not passed', async () => {
      const service = app.get(ChecksheetsService);
      await service.complete(
        {
          kind: 'member',
          memberId: alice,
          permissions: new Set<string>(),
        } as never,
        {
          templateId,
          assetId,
          entries: [
            {
              itemId,
              countPresent: 1,
              expiries: [addDays(nyNow().dateStr, 200)],
            },
          ],
        },
      );
      expect(
        await prisma.checksheetDeficiency.count({
          where: { templateId, resolvedAt: null },
        }),
      ).toBe(0);
    });

    // The headline: somebody checking the bag writes down a date that has
    // already passed. That is a job, and it belongs on the job list.
    it('raises one from a check that records a date already passed', async () => {
      const service = app.get(ChecksheetsService);
      await service.complete(
        {
          kind: 'member',
          memberId: alice,
          permissions: new Set<string>(),
        } as never,
        {
          templateId,
          assetId,
          entries: [
            {
              itemId,
              countPresent: 1,
              expiries: [addDays(nyNow().dateStr, -1)],
            },
          ],
        },
      );
      const open = await prisma.checksheetDeficiency.findMany({
        where: { templateId, resolvedAt: null },
      });
      expect(open).toHaveLength(1);
      expect(open[0].detail).toContain('expired');
      // Full par, so nothing is missing — the date alone is the problem.
      expect(open[0].found).toBeNull();

      // And the same item is on the expiry report, which is the whole point.
      const res = await request(app.getHttpServer())
        .get('/v1/checksheets/expiring?withinDays=1')
        .set(as(alice))
        .set('x-test-permissions', 'checksheets:read-all')
        .expect(200);
      expect(
        (res.body as Array<{ item: { id: number }; expired: boolean }>).find(
          (row) => row.item.id === itemId,
        )?.expired,
      ).toBe(true);
    });
  });

  describe('a weekday the agency does not run', () => {
    // The standing arrangement: no crew on that night, but somebody still
    // carries the phone, so the duty supervisor seat is filled as usual.
    it('generates the night out of service with only the duty sup placed', async () => {
      const far = addDays(nyNow().dateStr, 120);
      const weekday = weekdayOf(far);
      const sup = await prisma.member.create({
        data: {
          firstName: 'Sup',
          lastName: `Test${stamp}`,
          email: `oos-sup-${stamp}@example.com`,
          active: true,
        },
      });
      const cc = await prisma.member.create({
        data: {
          firstName: 'Chief',
          lastName: `Test${stamp}`,
          email: `oos-cc-${stamp}@example.com`,
          active: true,
        },
      });
      await prisma.defaultCrewTemplate.createMany({
        data: [
          { weekday, position: 'DUTY_SUP', memberId: sup.id },
          { weekday, position: 'CC', memberId: cc.id },
        ],
        skipDuplicates: true,
      });
      await prisma.defaultCrewOutOfService.create({
        data: { weekday, reason: 'No crew on this night' },
      });
      await prisma.crew.deleteMany({ where: { date: toDbDate(far) } });

      const service = app.get(CrewsService);
      await service.ensureCrewsExist(far, 1);

      const crew = await prisma.crew.findUniqueOrThrow({
        where: { date: toDbDate(far) },
        include: { slots: true },
      });
      expect(crew.outOfService).toBe(true);
      expect(crew.outOfServiceReason).toBe('No crew on this night');

      const seat = (position: string) =>
        crew.slots.find((s) => s.position === position);
      // The phone is still carried.
      expect(seat('DUTY_SUP')?.memberId).toBe(sup.id);
      // Nobody is put on a crew that is not going out.
      expect(seat('CC')?.memberId).toBeNull();

      await prisma.crew.deleteMany({ where: { date: toDbDate(far) } });
      await prisma.defaultCrewOutOfService.deleteMany({ where: { weekday } });
      await prisma.defaultCrewTemplate.deleteMany({ where: { weekday } });
      await prisma.member.deleteMany({
        where: { id: { in: [sup.id, cc.id] } },
      });
    });

    it('places everybody as usual once the weekday is back in service', async () => {
      const far = addDays(nyNow().dateStr, 121);
      const weekday = weekdayOf(far);
      const cc = await prisma.member.create({
        data: {
          firstName: 'Chief',
          lastName: `Back${stamp}`,
          email: `oos-back-${stamp}@example.com`,
          active: true,
        },
      });
      await prisma.defaultCrewTemplate.createMany({
        data: [{ weekday, position: 'CC', memberId: cc.id }],
        skipDuplicates: true,
      });
      await prisma.defaultCrewOutOfService.deleteMany({ where: { weekday } });
      await prisma.crew.deleteMany({ where: { date: toDbDate(far) } });

      await app.get(CrewsService).ensureCrewsExist(far, 1);
      const crew = await prisma.crew.findUniqueOrThrow({
        where: { date: toDbDate(far) },
        include: { slots: true },
      });
      expect(crew.outOfService).toBe(false);
      expect(crew.slots.find((s) => s.position === 'CC')?.memberId).toBe(cc.id);

      await prisma.crew.deleteMany({ where: { date: toDbDate(far) } });
      await prisma.defaultCrewTemplate.deleteMany({ where: { weekday } });
      await prisma.member.delete({ where: { id: cc.id } });
    });
  });

  // AIR: the page asks who is coming, Herald says what the call is, and
  // neither reliably arrives first.
  describe('am I responding', () => {
    let air: AirService;
    const pageSecret = `page-secret-${stamp}`;

    beforeAll(() => {
      air = app.get(AirService);
      process.env.AIR_PAGE_SECRET = pageSecret;
    });

    afterEach(async () => {
      // Each of these is its own call; without this the match window would
      // fold the next one into the last.
      await prisma.callout.deleteMany({});
    });

    afterAll(async () => {
      delete process.env.AIR_PAGE_SECRET;
      await prisma.callout.deleteMany({});
    });

    it('turns a page away without the secret', async () => {
      await request(app.getHttpServer())
        .post('/v1/air/page')
        .send({ verification: 'wrong', dispatch: 'Anything at all' })
        .expect(401);
      expect(await prisma.callout.count()).toBe(0);
    });

    // AIR's own payload, unchanged, so the pager needs no rewriting.
    it('takes the page the old gateway sends', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/air/page')
        .send({
          verification: pageSecret,
          dispatch: `Sick person, 1999 Burdett Ave ${stamp}`,
        })
        .expect(201);
      const callout = await prisma.callout.findUniqueOrThrow({
        where: { id: res.body.id },
      });
      expect(callout.pageText).toContain('1999 Burdett Ave');
      expect(callout.dispatchId).toBeNull();
    });

    it('joins the page and the dispatch, whichever came first', async () => {
      const pageFirst = await air.page(`Page first ${stamp}`);
      expect(pageFirst.dispatchId).toBeNull();
      const dispatch = await prisma.dispatch.create({
        data: { complaint: `Chest pain ${stamp}`, raw: { source: 'test' } },
      });
      const joined = await air.dispatched({
        id: dispatch.id,
        determinant: 'Charlie',
        complaint: dispatch.complaint,
        location: null,
        units: null,
        receivedAt: dispatch.receivedAt,
      });
      // One call, not two.
      expect(joined.id).toBe(pageFirst.id);
      expect(joined.dispatchId).toBe(dispatch.id);
      expect(await prisma.callout.count()).toBe(1);
      await prisma.dispatch.delete({ where: { id: dispatch.id } });
    });

    it('joins them in the other order too', async () => {
      const dispatch = await prisma.dispatch.create({
        data: { complaint: `Fall ${stamp}`, raw: { source: 'test' } },
      });
      const heraldFirst = await air.dispatched({
        id: dispatch.id,
        determinant: 'Bravo',
        complaint: dispatch.complaint,
        location: null,
        units: null,
        receivedAt: dispatch.receivedAt,
      });
      const paged = await air.page(`Late page ${stamp}`);
      expect(paged.id).toBe(heraldFirst.id);
      expect(paged.pageText).toContain('Late page');
      expect(await prisma.callout.count()).toBe(1);
      await prisma.dispatch.delete({ where: { id: dispatch.id } });
    });

    it('keeps two calls an hour apart apart', async () => {
      const now = new Date();
      await air.page(`First ${stamp}`, 'DISPATCH', now);
      await air.page(
        `Second ${stamp}`,
        'DISPATCH',
        new Date(now.getTime() + 60 * 60_000),
      );
      expect(await prisma.callout.count()).toBe(2);
    });

    // The rule the clock used to stand in for.
    it('asks by day and not when a crew is on the road', async () => {
      const byDay = await air.page(
        `Daytime ${stamp}`,
        'DISPATCH',
        new Date('2026-09-13T17:00:00.000Z'), // 13:00 New York
      );
      expect(byDay.asked).toBe(true);
      await prisma.callout.deleteMany({});

      // A crew filed for tonight, with the two seats that can roll.
      const night = toDbDate('2026-09-13');
      const crew = await prisma.crew.upsert({
        where: { date: night },
        create: { date: night },
        update: {},
      });
      await prisma.crewSlot.deleteMany({ where: { crewId: crew.id } });
      await prisma.crewSlot.createMany({
        data: [
          { crewId: crew.id, position: 'CC', memberId: alice },
          { crewId: crew.id, position: 'DRIVER', memberId: bob },
        ],
      });
      const atNight = await air.page(
        `Night ${stamp}`,
        'DISPATCH',
        new Date('2026-09-14T03:00:00.000Z'), // 23:00 New York
      );
      expect(atNight.asked).toBe(false);

      await prisma.crewSlot.deleteMany({ where: { crewId: crew.id } });
      await prisma.crew.delete({ where: { id: crew.id } });
    });

    it('records who answered, and lets them change their mind', async () => {
      const callout = await air.page(
        `Answers ${stamp}`,
        'DISPATCH',
        new Date('2026-09-13T17:00:00.000Z'),
      );
      await prisma.member.update({
        where: { id: alice },
        data: { slackId: `U${stamp}`.slice(0, 11) },
      });

      const yes = await air.respond({
        calloutId: callout.id,
        slackUserId: `U${stamp}`.slice(0, 11),
        responding: true,
        now: new Date(callout.openedAt.getTime() + 60_000),
      });
      expect(yes.ok).toBe(true);

      const changed = await air.respond({
        calloutId: callout.id,
        slackUserId: `U${stamp}`.slice(0, 11),
        responding: false,
        now: new Date(callout.openedAt.getTime() + 120_000),
      });
      expect(changed.ok).toBe(true);

      // One answer per person, attributed to the member behind the Slack id.
      const responses = await prisma.calloutResponse.findMany({
        where: { calloutId: callout.id },
      });
      expect(responses).toHaveLength(1);
      expect(responses[0].responding).toBe(false);
      expect(responses[0].memberId).toBe(alice);

      // And after the window, the same kindness AIR showed.
      const late = await air.respond({
        calloutId: callout.id,
        slackUserId: `U${stamp}`.slice(0, 11),
        responding: true,
        now: new Date(callout.openedAt.getTime() + 30 * 60_000),
      });
      expect(late.ok).toBe(false);
      expect(late.reason).toContain('too long after');
      await prisma.member.update({
        where: { id: alice },
        data: { slackId: null },
      });
    });

    it('never asks about a longtone', async () => {
      const callout = await air.page(
        `Longtone ${stamp}`,
        'LONGTONE',
        new Date('2026-09-13T17:00:00.000Z'),
      );
      expect(callout.asked).toBe(false);
      const refused = await air.respond({
        calloutId: callout.id,
        slackUserId: 'U-anyone',
        responding: true,
      });
      expect(refused.ok).toBe(false);
    });
  });

  describe('a dispatch entered by hand', () => {
    // Herald misses calls. A missing one is a gap in the log and a call
    // absent from the count on the board, so somebody has to be able to
    // put it in.
    it('records the call, who typed it, and when it came in', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/dispatches')
        .set(as(alice))
        .set('x-test-permissions', 'dispatches:write')
        .send({
          receivedAt: '2026-09-06T02:14:00.000Z',
          determinant: 'Delta',
          complaint: `Cardiac arrest ${stamp}`,
          location: '1999 Burdett Ave',
          units: 'E59',
        })
        .expect(201);

      const saved = await prisma.dispatch.findUniqueOrThrow({
        where: { id: res.body.id },
      });
      expect(saved).toMatchObject({
        determinant: 'Delta',
        complaint: `Cardiac arrest ${stamp}`,
        location: '1999 Burdett Ave',
        units: 'E59',
        enteredById: alice,
      });
      // Backdated as given, not stamped with now.
      expect(saved.receivedAt.toISOString()).toBe('2026-09-06T02:14:00.000Z');
      // An ingested dispatch keeps Herald's payload; this one says what it is.
      expect(saved.raw).toMatchObject({ source: 'manual' });

      await prisma.dispatch.delete({ where: { id: saved.id } });
    });

    it('defaults to now when no time is given', async () => {
      const before = Date.now();
      const res = await request(app.getHttpServer())
        .post('/v1/dispatches')
        .set(as(alice))
        .set('x-test-permissions', 'dispatches:write')
        .send({ complaint: `Sick person ${stamp}` })
        .expect(201);
      const saved = await prisma.dispatch.findUniqueOrThrow({
        where: { id: res.body.id },
      });
      expect(saved.receivedAt.getTime()).toBeGreaterThanOrEqual(before - 1000);
      await prisma.dispatch.delete({ where: { id: saved.id } });
    });

    it('counts on the board like any other call', async () => {
      const link = await prisma.headsupLink.create({
        data: { token: `disp${stamp}`.slice(0, 24) },
      });
      const before = await request(app.getHttpServer())
        .get(`/v1/headsup/board?token=${link.token}`)
        .expect(200);

      const res = await request(app.getHttpServer())
        .post('/v1/dispatches')
        .set(as(alice))
        .set('x-test-permissions', 'dispatches:write')
        .send({ complaint: `Counted ${stamp}` })
        .expect(201);

      const after = await request(app.getHttpServer())
        .get(`/v1/headsup/board?token=${link.token}`)
        .expect(200);
      expect(after.body.calls).toBe(before.body.calls + 1);

      await prisma.dispatch.delete({ where: { id: res.body.id } });
      await prisma.headsupLink.delete({ where: { id: link.id } });
    });

    it('is closed to those without the permission', async () => {
      await request(app.getHttpServer())
        .post('/v1/dispatches')
        .set(as(bob))
        .set('x-test-permissions', 'dispatches:read')
        .send({ complaint: 'nope' })
        .expect(403);
    });

    it('refuses a determinant that is not one', async () => {
      await request(app.getHttpServer())
        .post('/v1/dispatches')
        .set(as(alice))
        .set('x-test-permissions', 'dispatches:write')
        .send({ determinant: 'Zulu', complaint: 'nope' })
        .expect(400);
    });
  });

  // A role is held two ways, and only one of them is a decision somebody
  // made. The page that hands out permissions has to show both.
  describe('roles conferred by a credential', () => {
    let roleId: number;
    let typeId: number;
    let higherTypeId: number;
    let holder: number;
    let suspended: number;
    let above: number;

    beforeAll(async () => {
      // Its own credential type rather than EES, which the fixtures already
      // hand out: linking a role to it would grant permissions to members
      // the other tests assume have none.
      const type = await prisma.credentialType.create({
        data: { key: `TC${stamp}`.slice(0, 16), name: `Test Cred ${stamp}` },
      });
      typeId = type.id;
      // A rung above it, the way the ladder is built everywhere else.
      const higher = await prisma.credentialType.create({
        data: {
          key: `TX${stamp}`.slice(0, 16),
          name: `Test Cred Senior ${stamp}`,
          prerequisites: { create: [{ requiresTypeId: type.id }] },
        },
      });
      higherTypeId = higher.id;
      const role = await prisma.role.create({
        data: {
          name: `Standby Officer ${stamp}`,
          permissions: { create: [{ permission: 'standbys:manage' }] },
          credentialLinks: { create: [{ credentialTypeId: type.id }] },
        },
      });
      roleId = role.id;
      // The ladder is read once and cached; these rungs are newer than it.
      app.get(CredentialGraphService).invalidate();

      holder = await createMember('Holder', []);
      suspended = await createMember('Susp', []);
      // Holds only the top rung, which is what an officer-granted or
      // legacy-imported credential looks like.
      above = await createMember('Above', []);
      await prisma.memberCredential.createMany({
        data: [
          { memberId: holder, typeId: type.id },
          { memberId: suspended, typeId: type.id, status: 'SUSPENDED' },
          { memberId: above, typeId: higher.id },
        ],
      });
    });

    afterAll(async () => {
      await prisma.memberCredential.deleteMany({
        where: { typeId: { in: [typeId, higherTypeId] } },
      });
      await prisma.role.deleteMany({ where: { id: roleId } });
      await prisma.credentialPrerequisite.deleteMany({
        where: { credentialTypeId: higherTypeId },
      });
      await prisma.credentialType.deleteMany({
        where: { id: { in: [typeId, higherTypeId] } },
      });
    });

    it('lists who holds a role by credential, and says which one', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/roles')
        .set(as(alice))
        .expect(200);
      const role = (
        res.body as Array<{
          id: number;
          credentialLinks: Array<{ credentialType: { name: string } }>;
          conferred: Array<{
            member: { id: number };
            credentialType: { key: string };
            inherited: boolean;
          }>;
        }>
      ).find((row) => row.id === roleId);
      expect(role?.credentialLinks.map((l) => l.credentialType.name)).toEqual([
        `Test Cred ${stamp}`,
      ]);
      const listed = role?.conferred.map((c) => c.member.id) ?? [];
      expect(listed).toContain(holder);
      expect(listed).toContain(above);
      expect(listed).not.toContain(suspended);
      // A Duty Supervisor outranks the whole ladder, which is the rule this
      // system applies to every other question about a credential. It
      // follows that a DS holds every role a credential confers.
      const supervisors = await prisma.memberCredential.findMany({
        where: {
          status: 'ACTIVE',
          member: { active: true },
          type: { key: 'DS' },
        },
        select: { memberId: true },
      });
      for (const supervisor of supervisors) {
        expect(listed).toContain(supervisor.memberId);
      }
      // Listed under what they actually hold, and marked as coming from
      // above rather than from the link itself.
      const inherited = role?.conferred.find((c) => c.member.id === above);
      expect(inherited?.inherited).toBe(true);
      expect(inherited?.credentialType.key).toBe(`TX${stamp}`.slice(0, 16));
      expect(
        role?.conferred.find((c) => c.member.id === holder)?.inherited,
      ).toBe(false);
      // Suspension takes the permissions away, so it takes the name off
      // this list too, or the list is a lie about who can do the thing.
      expect(role?.conferred.map((c) => c.member.id)).not.toContain(suspended);
      // Listed under the credential they actually hold.
      expect(
        role?.conferred.find((c) => c.member.id === holder)?.credentialType.key,
      ).toBe(`TC${stamp}`.slice(0, 16));
    });

    // The list is only worth reading if it agrees with what actually
    // happens, so the inheritance is real: the permission, not just the
    // name on a page. Asked of the service the rest of the system asks,
    // since this suite replaces the guard itself.
    it('counts the rung above as holding the permission', async () => {
      const holders = app.get(PermissionHoldersService);
      const ids = await holders.idsWith('standbys:manage');
      expect([...ids]).toContain(holder);
      expect([...ids]).toContain(above);
      expect([...ids]).not.toContain(suspended);
    });

    it('leaves out a member who is no longer active', async () => {
      await prisma.member.update({
        where: { id: holder },
        data: { active: false },
      });
      const res = await request(app.getHttpServer())
        .get('/v1/roles')
        .set(as(alice))
        .expect(200);
      const role = (
        res.body as Array<{
          id: number;
          conferred: Array<{ member: { id: number } }>;
        }>
      ).find((row) => row.id === roleId);
      expect(role?.conferred.map((c) => c.member.id)).not.toContain(holder);
      await prisma.member.update({
        where: { id: holder },
        data: { active: true },
      });
    });
  });

  describe('event medical standbys', () => {
    let standbyId: number;
    let eventId: number;
    let venueId: number;
    let locationId: number;
    let runLocationId: number;
    let voidedEncounterId: number;

    const sup = () => ({ ...as(alice), 'x-test-permissions': 'standbys:manage,standbys:read-all' });
    // Throwing a standby away is a separate permission from running one.
    const canDelete = () => ({
      ...as(alice),
      'x-test-permissions': 'standbys:manage,standbys:read-all,standbys:delete',
    });

    beforeAll(async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const event = await prisma.event.create({
        data: {
          title: `Standby ${stamp}`,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 6 * 3600_000),
          kindId: kind.id,
          signups: { create: [{ memberId: alice }, { memberId: bob, position: 'ees' }] },
        },
      });
      eventId = event.id;
      const venue = await prisma.venue.create({
        data: {
          name: `Venue ${stamp}`,
          locations: { create: [{ name: 'Gate 1' }] },
        },
      });
      venueId = venue.id;
      locationId = (await prisma.venueLocation.findFirstOrThrow({ where: { venueId } })).id;
      runLocationId = (
        await prisma.runNumberLocation.upsert({
          where: { abbr: 'T' },
          create: { name: 'Troy', abbr: 'T' },
          update: {},
        })
      ).id;
    });

    afterAll(async () => {
      await prisma.standbyLog.deleteMany({ where: { eventId } });
      await prisma.runNumber.deleteMany({ where: { eventId } });
      await prisma.event.deleteMany({ where: { id: eventId } });
      await prisma.venue.deleteMany({ where: { id: venueId } });
    });

    // The signups are a starting point. From there the standby keeps its own
    // list, because people turn up who never signed up.
    it('opens seeded from who signed up', async () => {
      const res = await request(app.getHttpServer())
        .post('/v1/standbys')
        .set(sup())
        .send({ eventId, venueId })
        .expect(201);
      standbyId = res.body.id;
      const roles = (res.body.personnel as Array<{ role: string; fromSignup: boolean }>);
      expect(roles).toHaveLength(2);
      expect(roles.every((p) => p.fromSignup)).toBe(true);
      // An explicit event-supervisor signup carries over as one; a crew
      // position is a plan, not a role on the day.
      expect(roles.filter((p) => p.role === 'EES')).toHaveLength(1);
    });

    // Something nobody put on the calendar, recorded after the fact. It
    // needs an event to hang off — run numbers tag to one, and both exports
    // read its title — but it is not a calendar event and must not turn up
    // as one.
    it('records an event that is not on the calendar, and keeps it off', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const started = new Date(Date.now() - 2 * 3600_000);
      const opened = await request(app.getHttpServer())
        .post('/v1/standbys')
        // Running a standby is the whole permission. What this makes is not
        // a calendar event, and the case it exists for is the one that
        // cannot wait for somebody with events:create to be found.
        .set({ ...sup(), 'x-test-permissions': 'standbys:manage' })
        .send({
          event: {
            title: `Unplanned 5K ${stamp}`,
            startsAt: started.toISOString(),
            endsAt: new Date(started.getTime() + 3600_000).toISOString(),
            kindId: kind.id,
          },
        })
        .expect(201);
      const adHocEventId = opened.body.eventId as number;

      const event = await prisma.event.findUniqueOrThrow({
        where: { id: adHocEventId },
      });
      expect(event.hidden).toBe(true);
      // Never published anywhere either.
      expect(event.gcalEventId).toBeNull();

      const listed = await request(app.getHttpServer())
        .get('/v1/events')
        .set(as(alice))
        .expect(200);
      expect(
        (listed.body as Array<{ id: number }>).map((e) => e.id),
      ).not.toContain(adHocEventId);

      // And it is not offered as an event to open a standby for, which it
      // already has.
      const openable = await request(app.getHttpServer())
        .get('/v1/standbys/openable')
        .set(sup())
        .expect(200);
      expect(
        (openable.body as Array<{ id: number }>).map((e) => e.id),
      ).not.toContain(adHocEventId);

      await prisma.standbyLog.deleteMany({ where: { eventId: adHocEventId } });
      await prisma.event.delete({ where: { id: adHocEventId } });
    });

    it('is the same standby if opened twice', async () => {
      const again = await request(app.getHttpServer())
        .post('/v1/standbys')
        .set(sup())
        .send({ eventId })
        .expect(201);
      expect(again.body.id).toBe(standbyId);
      expect(again.body.personnel).toHaveLength(2);
    });

    // The thing EventSignup structurally cannot express.
    it('puts one person on two units at once', async () => {
      const unitA = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/units`)
        .set(sup())
        .send({ name: `M-${stamp}`.slice(0, 20) })
        .expect(201);
      const unitB = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/units`)
        .set(sup())
        .send({ name: `G-${stamp}`.slice(0, 20) })
        .expect(201);

      const person = await prisma.standbyPersonnel.findFirstOrThrow({
        where: { standbyId, memberId: alice },
      });
      for (const [unit, position] of [
        [unitA.body.id, 'Crew Chief'],
        [unitB.body.id, 'Attendant'],
      ] as const) {
        await request(app.getHttpServer())
          .post(`/v1/standbys/${standbyId}/units/${unit}/crew`)
          .set(sup())
          .send({ personnelId: person.id, position })
          .expect(201);
      }
      const live = await prisma.unitAssignment.count({
        where: { personnelId: person.id, removedAt: null },
      });
      expect(live).toBe(2);
    });

    it('keeps one supervisor in charge', async () => {
      const [a, b] = await prisma.standbyPersonnel.findMany({
        where: { standbyId },
        orderBy: { id: 'asc' },
      });
      for (const p of [a, b]) {
        await request(app.getHttpServer())
          .patch(`/v1/standbys/${standbyId}/personnel/${p.id}`)
          .set(sup())
          .send({ role: 'EES_IC' })
          .expect(200);
      }
      const inCharge = await prisma.standbyPersonnel.findMany({
        where: { standbyId, role: 'EES_IC', removedAt: null },
      });
      expect(inCharge).toHaveLength(1);
      expect(inCharge[0].id).toBe(b.id);
    });

    // The run-number rule, end to end.
    it('lets an ice pack close with no run number', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${opened.body.id}`)
        .set(sup())
        .send({ firstAidOnly: true, chiefComplaint: 'Blister', patientInitials: 'JD' })
        .expect(200);
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${opened.body.id}/close`)
        .set(sup())
        .expect(201);
    });

    it('refuses to close a transport without a run number, then a PRID', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({ locationId })
        .expect(201);
      const id = opened.body.id;
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ category: 'MAJOR_ILLNESS', disposition: 'TRANSPORTED', patientInitials: 'AB' })
        .expect(200);

      const noRun = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/close`)
        .set(sup())
        .expect(400);
      expect(JSON.stringify(noRun.body)).toContain('run number');

      // Issued inline, from the same pool, tagged to the event.
      const issued = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/run-number`)
        .set({ ...sup(), 'x-test-permissions': 'standbys:manage,run-numbers:manage' })
        .send({ locationId: runLocationId })
        .expect(201);
      expect(issued.body.eventId).toBe(eventId);

      const noPrid = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/close`)
        .set(sup())
        .expect(400);
      expect(JSON.stringify(noPrid.body)).toContain('PRID');

      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ prid: 'PR-1' })
        .expect(200);
      const closed = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/close`)
        .set(sup())
        .expect(201);
      // The county number is worth saying and not worth blocking on.
      expect(JSON.stringify(closed.body.advisories)).toContain('county');
    });

    it('will not hold anything longer than initials', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${opened.body.id}`)
        .set(sup())
        .send({ patientInitials: 'Jonathan Doe' })
        .expect(400);
    });

    it('shows a crew member only what they wrote', async () => {
      // Both of the seeded two are supervisors by now, and supervisors see
      // the whole standby. This needs somebody who is only crew.
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/personnel`)
        .set(sup())
        .send({ memberId: charlie, role: 'CREW' })
        .expect(201);

      const mine = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/encounters`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(200);
      expect(mine.body).toHaveLength(0);

      const supervisor = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .expect(200);
      expect(supervisor.body.length).toBeGreaterThan(0);
    });

    it('will not close the standby while an encounter is open', async () => {
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      const refused = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/close`)
        .set(sup())
        .expect(400);
      expect(refused.body.message).toContain('still open');
    });

    // Two things that turn out not to be patient encounters, and they are
    // not owed the same visibility.
    it('keeps a voided encounter off the state forms and out of the counts', async () => {
      const before = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}`)
        .set(sup())
        .expect(200);
      const treatedBefore = before.body.counts.totalTreated as number;

      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      const id = opened.body.id as number;
      // Typed into before anybody realised there was nobody there.
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ patientInitials: 'ZZ', chiefComplaint: 'Reported down' })
        .expect(200);

      const voided = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/void`)
        .set(sup())
        .send({ as: 'UNFOUNDED', note: 'Searched the north lawn, nobody there' })
        .expect(201);
      // No patient, so nothing about one is kept.
      expect(voided.body.patientInitials).toBeNull();
      expect(voided.body.chiefComplaint).toBeNull();
      // And nothing left to fill in, so it is finished.
      expect(voided.body.closedAt).not.toBeNull();

      const after = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}`)
        .set(sup())
        .expect(200);
      expect(after.body.counts.totalTreated).toBe(treatedBefore);

      // A patch cannot put the patient back while it is voided.
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ patientInitials: 'ZZ' })
        .expect(200);
      const stillVoid = await prisma.encounter.findUniqueOrThrow({
        where: { id },
      });
      expect(stillVoid.patientInitials).toBeNull();

      voidedEncounterId = id;
    });

    it('will not hold a voided encounter to the run-number rule', async () => {
      // It was closed by the void itself; reopening and closing again is
      // the path that runs the rules.
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${voidedEncounterId}/reopen`)
        .set(sup())
        .expect(201);
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${voidedEncounterId}/close`)
        .set(sup())
        .expect(201);
    });

    it('shows an unfounded call in the detailed report but not on DOH-2342', async () => {
      const pdfText = async (route: string) => {
        const res = await request(app.getHttpServer())
          .get(`/v1/standbys/${standbyId}/${route}`)
          .set(sup())
          .expect(200);
        const pdf = res.body as Buffer;
        const streams = [...pdf.toString('latin1').matchAll(/stream\r?\n/g)]
          .map((match) => {
            const start = (match.index ?? 0) + match[0].length;
            const end = pdf.indexOf('endstream', start, 'latin1');
            try {
              return inflateSync(pdf.subarray(start, end)).toString('latin1');
            } catch {
              return '';
            }
          })
          .join('\n');
        return [...streams.matchAll(/<([0-9a-fA-F]+)>/g)]
          .map((match) => Buffer.from(match[1], 'hex').toString('latin1'))
          .join('');
      };

      const detailed = await pdfText('export/event.pdf?detail=1');
      expect(detailed).toContain('Unfounded');
      expect(detailed).toContain('north lawn');

      const log2342 = await pdfText('export/doh-2342.pdf');
      expect(log2342).not.toContain('Unfounded');
      expect(log2342).not.toContain('north lawn');
    });

    // A row that should not exist is not something that happened, so it is
    // not in the list of what happened to people — only in the record of
    // everything that was done.
    it('keeps one created in error out of the patient list, and in the timeline', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      const id = opened.body.id as number;
      const sequence = opened.body.sequence as number;
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/void`)
        .set(sup())
        .send({ as: 'CREATED_IN_ERROR' })
        .expect(201);

      const res = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/export/event.pdf?detail=1`)
        .set(sup())
        .expect(200);
      const pdf = res.body as Buffer;
      const streams = [...pdf.toString('latin1').matchAll(/stream\r?\n/g)]
        .map((match) => {
          const start = (match.index ?? 0) + match[0].length;
          const end = pdf.indexOf('endstream', start, 'latin1');
          try {
            return inflateSync(pdf.subarray(start, end)).toString('latin1');
          } catch {
            return '';
          }
        })
        .join('\n');
      const text = [...streams.matchAll(/<([0-9a-fA-F]+)>/g)]
        .map((match) => Buffer.from(match[1], 'hex').toString('latin1'))
        .join('');
      expect(text).not.toContain('Created in error');
      // The timeline underneath still says it was opened and voided.
      expect(text).toContain(`Encounter #${sequence} marked created in error`);
    });

    it('lets the mark come off again', async () => {
      const restored = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${voidedEncounterId}/void`)
        .set(sup())
        .send({ as: null })
        .expect(201);
      expect(restored.body.voidedAs).toBeNull();
      expect(restored.body.closedAt).toBeNull();
      // Put back the way it was found, so the run-number test above still
      // describes the standby the later tests inherit.
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${voidedEncounterId}/void`)
        .set(sup())
        .send({ as: 'UNFOUNDED' })
        .expect(201);
    });

    // The duplicate, or the one opened on the wrong standby. Held on the
    // same permission as throwing the standby away, and for the same
    // reason: an event supervisor runs the standby, and this is the one
    // thing on it that loses a record.
    it('will not let a supervisor delete an encounter', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      await request(app.getHttpServer())
        .delete(`/v1/standbys/${standbyId}/encounters/${opened.body.id}`)
        .set(sup())
        .expect(403);
      expect(
        await prisma.encounter.count({ where: { id: opened.body.id } }),
      ).toBe(1);

      // And with the permission it goes, leaving the record of what went.
      await request(app.getHttpServer())
        .delete(`/v1/standbys/${standbyId}/encounters/${opened.body.id}`)
        .set(canDelete())
        .expect(200);
      expect(
        await prisma.encounter.count({ where: { id: opened.body.id } }),
      ).toBe(0);

      const timeline = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/timeline`)
        .set(sup())
        .expect(200);
      const entries = timeline.body as Array<{ kind: string; text: string }>;
      expect(entries.map((e) => e.kind)).toContain('encounter.deleted');
      const audited = await prisma.auditLog.findFirst({
        where: {
          action: 'standby.encounter.delete',
          entityId: String(opened.body.id),
        },
      });
      // The row itself is in the audit log, because after this there is
      // nowhere else it survives.
      expect(JSON.stringify(audited?.diff)).toContain('sequence');
    });

    // A form that runs onto a second page is a form somebody has to explain
    // at the filing window, so the page count is part of being correct.
    it.each([
      ['doh-2332', 1, 'portrait'],
      ['doh-2342', 1, 'landscape'],
      ['event', 1, 'portrait'],
    ] as const)('renders %s as a %i-page %s PDF', async (form, pages, orientation) => {
      const route =
        form === 'event' ? 'export/event.pdf' : `export/${form}.pdf`;
      const res = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/${route}`)
        .set(sup())
        .expect(200)
        .expect('Content-Type', 'application/pdf');
      const pdf = res.body as Buffer;
      expect(pdf.subarray(0, 4).toString()).toBe('%PDF');
      const text = pdf.toString('latin1');
      const count =
        (text.match(/\/Type \/Page[^s]/g) ?? []).length;
      expect(count).toBe(pages);
      const box = /\/MediaBox\s*\[([^\]]*)\]/.exec(text)?.[1] ?? '';
      const [, , w, h] = box.trim().split(/\s+/).map(Number);
      expect(w > h ? 'landscape' : 'portrait').toBe(orientation);
    });

    // The detailed report is the one somebody reads months later, so the
    // timeline in it has to say what happened rather than name the kind of
    // thing that happened.
    it('prints a timeline that reads as sentences', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/export/event.pdf?detail=1`)
        .set(sup())
        .expect(200);
      const pdf = res.body as Buffer;
      // pdfkit deflates its content streams; the words are in there.
      const streams = [...pdf.toString('latin1').matchAll(/stream\r?\n/g)]
        .map((match) => {
          const start = (match.index ?? 0) + match[0].length;
          const end = pdf.indexOf('endstream', start, 'latin1');
          try {
            return inflateSync(pdf.subarray(start, end)).toString('latin1');
          } catch {
            return '';
          }
        })
        .join('\n');
      // The words are drawn as hex glyph runs, one per positioned piece.
      const text = [...streams.matchAll(/<([0-9a-fA-F]+)>/g)]
        .map((match) => Buffer.from(match[1], 'hex').toString('latin1'))
        .join('');
      // PDF text is drawn glyph run by glyph run, so look for the words
      // rather than the whole line.
      expect(text).toContain('Standby opened');
      expect(text).toContain('is now ');
      expect(text).toContain('Crew Chief');
    });

    it('refuses an export to somebody who cannot see the whole record', async () => {
      await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/export/doh-2332.pdf`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(403);
    });

    it('lets a crew member export only what they wrote', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(201);
      await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/encounters/${opened.body.id}/export.pdf`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(200);

      const someoneElses = await prisma.encounter.findFirstOrThrow({
        where: { standbyId, createdById: alice },
      });
      await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/encounters/${someoneElses.id}/export.pdf`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(403);
    });

    // A standby opened against the wrong event has to be removable, or the
    // mistake is permanent. Once there are encounters on it, it is not.
    // An event supervisor holds standbys:manage for the day they are
    // working. Nothing about running a standby is destroying one.
    it('will not let somebody who only runs standbys throw one away', async () => {
      await request(app.getHttpServer())
        .delete(`/v1/standbys/${standbyId}`)
        .set(sup())
        .expect(403);
      expect(await prisma.standbyLog.count({ where: { id: standbyId } })).toBe(1);
    });

    it('refuses to discard a standby that has encounters', async () => {
      const refused = await request(app.getHttpServer())
        .delete(`/v1/standbys/${standbyId}`)
        .set(canDelete())
        .expect(400);
      expect(refused.body.message).toContain('encounter');
      expect(await prisma.standbyLog.count({ where: { id: standbyId } })).toBe(1);
    });

    it('discards an empty one, and leaves the event alone', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const spare = await prisma.event.create({
        data: {
          title: `Spare ${stamp}`,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 3600_000),
          kindId: kind.id,
        },
      });
      const opened = await request(app.getHttpServer())
        .post('/v1/standbys')
        .set(sup())
        .send({ eventId: spare.id })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/v1/standbys/${opened.body.id}`)
        .set(canDelete())
        .expect(200);

      expect(await prisma.standbyLog.count({ where: { id: opened.body.id } })).toBe(0);
      // The event is still there: it may be a real one somebody wants.
      expect(await prisma.event.count({ where: { id: spare.id } })).toBe(1);
      await prisma.event.delete({ where: { id: spare.id } });
    });

    // Deleting an event cascades its standby away. Keeping the calendar
    // tidy is not a way to destroy the record of a standby, so the standby
    // itself is what refuses — not the encounters on it.
    it('refuses to delete an event that has a standby', async () => {
      const refused = await request(app.getHttpServer())
        .delete(`/v1/events/${eventId}`)
        .set(sup())
        .set('x-test-permissions', 'events:create')
        .expect(400);
      expect(refused.body.message).toContain('standbys:delete');
      // Still there, with everything on it.
      expect(await prisma.standbyLog.count({ where: { eventId } })).toBe(1);
    });

    it('refuses even when the standby has nothing on it', async () => {
      const kind = await prisma.eventKind.findFirstOrThrow();
      const spare = await prisma.event.create({
        data: {
          title: `Mistake ${stamp}`,
          startsAt: new Date(),
          endsAt: new Date(Date.now() + 3600_000),
          kindId: kind.id,
        },
      });
      const opened = await request(app.getHttpServer())
        .post('/v1/standbys')
        .set(sup())
        .send({ eventId: spare.id })
        .expect(201);

      await request(app.getHttpServer())
        .delete(`/v1/events/${spare.id}`)
        .set(sup())
        .set('x-test-permissions', 'events:create')
        .expect(400);

      // Discard the standby, which is its own permission, and the event
      // goes the way any other event goes.
      await request(app.getHttpServer())
        .delete(`/v1/standbys/${opened.body.id}`)
        .set(canDelete())
        .expect(200);
      await request(app.getHttpServer())
        .delete(`/v1/events/${spare.id}`)
        .set(sup())
        .set('x-test-permissions', 'events:create')
        .expect(200);
      expect(await prisma.event.count({ where: { id: spare.id } })).toBe(0);
    });

    it('keeps a timeline of what happened', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/timeline`)
        .set(sup())
        .expect(200);
      const entries = res.body as Array<{ kind: string; text: string }>;
      const kinds = entries.map((e) => e.kind);
      expect(kinds).toContain('standby.opened');
      expect(kinds).toContain('unit.created');
      expect(kinds).toContain('crew.assigned');
      expect(kinds).toContain('encounter.opened');

      // Every line says what it was about. "Unit status changed" with
      // nothing after it is not a record of anything.
      const assigned = entries.find((e) => e.kind === 'crew.assigned');
      expect(assigned?.text).toContain('Crew Chief');
      expect(assigned?.text).toContain(`M-${stamp}`.slice(0, 20));
      const runNumber = entries.find((e) => e.kind === 'encounter.run-number');
      expect(runNumber?.text).toMatch(/Run number .+ issued for encounter #\d/);
      const closed = entries.filter((e) => e.kind === 'encounter.closed');
      expect(closed.map((e) => e.text)).toContainEqual(
        expect.stringContaining('major illness, transported'),
      );
    });

    // A crew member reads the timeline of the standby they are working, and
    // it must not tell them what was wrong with somebody else's patient.
    it('does not spell out an encounter the reader may not read', async () => {
      const res = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/timeline`)
        .set(as(charlie))
        .set('x-test-permissions', '')
        .expect(200);
      const entries = res.body as Array<{ kind: string; text: string }>;
      const closed = entries.filter((e) => e.kind === 'encounter.closed');
      expect(closed.length).toBeGreaterThan(0);
      for (const entry of closed) {
        expect(entry.text).toMatch(/^Encounter #\d+ closed$/);
      }
      // The operational half is still there: who was where, on what.
      expect(entries.some((e) => e.kind === 'unit.created')).toBe(true);
    });

    // Something was missed. The alternative to reopening is a second
    // encounter for one patient, which is worse for the record.
    it('reopens a closed encounter', async () => {
      const opened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters`)
        .set(sup())
        .send({})
        .expect(201);
      const id = opened.body.id as number;
      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ firstAidOnly: true, chiefComplaint: 'Blister', patientInitials: 'KL' })
        .expect(200);
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/close`)
        .set(sup())
        .expect(201);

      const reopened = await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/reopen`)
        .set(sup())
        .expect(201);
      expect(reopened.body.closedAt).toBeNull();

      await request(app.getHttpServer())
        .patch(`/v1/standbys/${standbyId}/encounters/${id}`)
        .set(sup())
        .send({ chiefComplaint: 'Blister, left heel' })
        .expect(200);
      await request(app.getHttpServer())
        .post(`/v1/standbys/${standbyId}/encounters/${id}/close`)
        .set(sup())
        .expect(201);

      const timeline = await request(app.getHttpServer())
        .get(`/v1/standbys/${standbyId}/timeline`)
        .set(sup())
        .expect(200);
      const entries = timeline.body as Array<{ kind: string; text: string }>;
      const entry = entries.find((e) => e.kind === 'encounter.reopened');
      expect(entry?.text).toMatch(/^Encounter #\d+ reopened$/);
    });
  });
});
