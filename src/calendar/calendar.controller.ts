import {
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Header,
  NotFoundException,
  Param,
  Post,
} from '@nestjs/common';
import { randomBytes } from 'crypto';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { Public } from '../auth/public.decorator';
import { fromDbDate } from '../common/dates';
import { PrismaService } from '../prisma/prisma.service';
import { IcsScope } from '../generated/prisma/enums';

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

const ICS_UID_DOMAIN =
  process.env.ICS_UID_DOMAIN ?? 'rampart.rpiambulance.com';

function icsEscape(text: string): string {
  return text.replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');
}

function fmtUtc(date: Date): string {
  return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/** Per-member tokenized ICS feeds (spec §5.3). */
@Controller({ path: 'calendar', version: '1' })
export class CalendarController {
  constructor(private readonly prisma: PrismaService) {}

  @Get('tokens')
  listTokens(@CurrentAuth() auth: AuthContext) {
    return this.prisma.icsToken.findMany({
      where: { memberId: requireMember(auth) },
      select: { id: true, token: true, scope: true, createdAt: true },
    });
  }

  @Post('tokens/:scope')
  async createToken(
    @CurrentAuth() auth: AuthContext,
    @Param('scope') scope: string,
  ) {
    const memberId = requireMember(auth);
    if (!['MY_SCHEDULE', 'MY_SCHEDULE_AND_ALL_EVENTS'].includes(scope)) {
      throw new NotFoundException('Unknown scope');
    }
    // one token per scope; regenerating replaces it
    await this.prisma.icsToken.deleteMany({
      where: { memberId, scope: scope as IcsScope },
    });
    return this.prisma.icsToken.create({
      data: {
        memberId,
        scope: scope as IcsScope,
        token: randomBytes(24).toString('hex'),
      },
    });
  }

  @Delete('tokens/:id')
  async deleteToken(@CurrentAuth() auth: AuthContext, @Param('id') id: string) {
    await this.prisma.icsToken.deleteMany({
      where: { id: Number(id), memberId: requireMember(auth) },
    });
    return { ok: true };
  }

  @Public()
  @Get('feed/:token.ics')
  @Header('Content-Type', 'text/calendar; charset=utf-8')
  async feed(@Param('token') token: string) {
    const icsToken = await this.prisma.icsToken.findUnique({
      where: { token },
      include: { member: { select: { id: true, firstName: true } } },
    });
    if (!icsToken) throw new NotFoundException();

    const memberId = icsToken.member.id;
    const lines: string[] = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//RPI Ambulance//Rampart//EN',
      'CALSCALE:GREGORIAN',
      `X-WR-CALNAME:RPIA — ${icsToken.scope === 'MY_SCHEDULE' ? 'My Schedule' : 'My Schedule + Events'}`,
    ];

    // My crew shifts
    const slots = await this.prisma.crewSlot.findMany({
      where: { memberId },
      include: { crew: true },
    });
    for (const slot of slots) {
      const date = fromDbDate(slot.crew.date).replace(/-/g, '');
      lines.push(
        'BEGIN:VEVENT',
        `UID:crew-${slot.crew.id}-${slot.position}@${ICS_UID_DOMAIN}`,
        `DTSTART;VALUE=DATE:${date}`,
        `SUMMARY:${icsEscape(`Night Crew — ${slot.position}`)}`,
        'END:VEVENT',
      );
    }

    // Events: mine, or all (per scope)
    const events =
      icsToken.scope === 'MY_SCHEDULE'
        ? await this.prisma.event.findMany({
            where: { signups: { some: { memberId } }, hidden: false },
          })
        : await this.prisma.event.findMany({ where: { hidden: false } });
    for (const event of events) {
      lines.push(
        'BEGIN:VEVENT',
        `UID:event-${event.id}@${ICS_UID_DOMAIN}`,
        `DTSTART:${fmtUtc(event.startsAt)}`,
        `DTEND:${fmtUtc(event.endsAt)}`,
        `SUMMARY:${icsEscape(event.title)}`,
        ...(event.location ? [`LOCATION:${icsEscape(event.location)}`] : []),
        'END:VEVENT',
      );
    }

    lines.push('END:VCALENDAR');
    return lines.join('\r\n');
  }
}
