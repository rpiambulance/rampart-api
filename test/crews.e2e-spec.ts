import 'dotenv/config';
import { CanActivate, ExecutionContext, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
import { CredentialGraphService } from '../src/credentials/credential-graph.service';
import { CredentialsService } from '../src/credentials/credentials.service';
import { PromotionsService } from '../src/promotions/promotions.service';
import { backfillObservers } from '../src/credentials/observer';
import { CertificationGraphService } from '../src/certifications/certification-graph.service';
import { addDays, nyNow, startOfWeek, toDbDate, weekdayOf } from '../src/common/dates';

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
      const type = await prisma.credentialType.findUniqueOrThrow({ where: { key } });
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
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
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
    await request(app.getHttpServer()).get('/v1/crews').set(as(bob)).expect(200);
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
      const type = await prisma.credentialType.findUniqueOrThrow({ where: { key } });
      return type.id;
    }

    it('backfills a credential with its real promotion date', async () => {
      const type = await typeId('A_D');
      await request(app.getHttpServer())
        .post('/v1/credentials/grant')
        .set(asGranter(alice))
        .send({ memberId: dana, credentialTypeId: type, effectiveAt: '2019-04-02' })
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
        .send({ memberId: dana, credentialTypeId: type, effectiveAt: '2999-01-01' })
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
        'O', 'A', 'A_CC', 'P_CC', 'CC', 'CC_T',
        'A_D', 'P_D', 'D', 'D_T', 'EES', 'DS',
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
        'O', 'A', 'A_CC', 'P_CC', 'CC', 'CC_T', 'A_D', 'P_D', 'D', 'D_T',
        'EES', 'FR_CC', 'DS',
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
      for (const position of ['CC', 'DRIVER', 'ATTENDANT', 'OBSERVER', 'DUTY_SUP']) {
        expect([position, day.slots[position].eligible]).toEqual([position, true]);
      }
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
      expect(plain.body.map((m: { id: number }) => m.id)).not.toContain(retired);
    });

    it('offers only active, suitably credentialed members per position', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/crews/assignable-members')
        .set(withPerms(scheduler, 'schedule:crews:assign'))
        .expect(200);
      const byId = new Map<number, string[]>(
        res.body.map((m: { id: number; positions: string[] }) => [m.id, m.positions]),
      );

      // Inactive members are not candidates at all.
      expect(byId.has(retired)).toBe(false);

      // Alice is a full CC with no driver credentials.
      expect(byId.get(alice)).toEqual(
        expect.arrayContaining(['CC', 'ATTENDANT', 'OBSERVER']),
      );
      expect(byId.get(alice)).not.toContain('DRIVER');
      expect(byId.get(alice)).not.toContain('DUTY_SUP');

      // Bob is an observer only: the rider seat is the way in.
      expect(byId.get(bob)).toEqual(['OBSERVER']);

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
      await prisma.event.deleteMany({ where: { title: `Future event ${stamp}` } });
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
        .send({ memberIds: [lapsed], reason: `No participation since ${cutoff}` })
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
      const self = await prisma.member.findUniqueOrThrow({ where: { id: actor } });
      expect(self.active).toBe(true);
    });

    it('requires the deactivate permission and a valid date', async () => {
      await request(app.getHttpServer())
        .get(`/v1/members/inactivity-review?since=${cutoff}`)
        .set({ 'x-test-member-id': String(actor), 'x-test-permissions': 'members:read' })
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
        data: { memberId: officer, roleId: role.id, startDate: new Date() },
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
      const member = await prisma.member.findUniqueOrThrow({ where: { id: bob } });
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
      const member = await prisma.member.findUniqueOrThrow({ where: { id: bob } });
      expect(member.nineHundredNumber).toBe('900123456');
    });

    it('is not editable without it', async () => {
      await request(app.getHttpServer())
        .patch(`/v1/members/${bob}`)
        .set({ 'x-test-member-id': String(alice), 'x-test-permissions': 'members:read' })
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
      const member = await prisma.member.findUniqueOrThrow({ where: { id: bob } });
      expect(member.nineHundredNumber).toBe('900123456');
    });

    it('is on the roster payload', async () => {
      const res = await request(app.getHttpServer())
        .get('/v1/members')
        .set({ 'x-test-member-id': String(alice), 'x-test-permissions': 'members:read' })
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
        .send({ weekStart: addDays(startOfWeek(nyNow().dateStr), 7), action: 'clear' })
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
            create: [{ typeId: observer.id, status: 'REVOKED', revokedAt: new Date() }],
          },
        },
      });
      await backfillObservers(prisma);
      const held = await prisma.memberCredential.findUniqueOrThrow({
        where: { memberId_typeId: { memberId: member.id, typeId: observer.id } },
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
        await prisma.credentialRequirement.delete({ where: { id: requirement.id } });
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

      it('stores an ordered ladder as neighbouring links only', async () => {
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
        expect((await graph.satisfying(low)).sort()).toEqual([low, high].sort());
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
        .put(`/v1/certifications/types/${await typeIdFor('NYS EMT')}/supersedes`)
        .set(as(bob))
        .send({ lowerTypeIds: [] })
        .expect(403);
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

  it('lets an observer take one rider slot, then enforces the fairness limit', async () => {
    await request(app.getHttpServer())
      .post(`/v1/crews/${await crewIdFor(dayA)}/slots/OBSERVER/signup`)
      .set(as(bob))
      .expect(201);

    const second = await request(app.getHttpServer())
      .post(`/v1/crews/${await crewIdFor(dayB)}/slots/OBSERVER/signup`)
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
    const crew = await prisma.crew.findUnique({ where: { date: toDbDate(today) } });
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
      .delete(`/v1/crews/${crewId}/slots/OBSERVER/signup`)
      .set(as(bob))
      .expect(200);
  });
});
