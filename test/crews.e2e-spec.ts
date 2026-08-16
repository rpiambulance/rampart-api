import 'dotenv/config';
import { CanActivate, ExecutionContext, INestApplication, ValidationPipe, VersioningType } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import request from 'supertest';
import { AppModule } from '../src/app.module';
import { AuthGuard } from '../src/auth/auth.guard';
import { PrismaService } from '../src/prisma/prisma.service';
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
      permissions: new Set<string>(),
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
    expect(blocked.body.message).toBe('No CC-Trainer on');

    // Put a CC-Trainer on the crew (driver seat), then retry.
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
