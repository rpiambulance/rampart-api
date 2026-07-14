import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { readFileSync } from 'fs';
import { importPKCS8, SignJWT } from 'jose';

interface ServiceAccount {
  client_email: string;
  private_key: string;
}

export interface GcalEventInput {
  title: string;
  description?: string | null;
  location?: string | null;
  startsAt: Date;
  endsAt: Date;
}

/**
 * Google Calendar sync via a service account (spec §5.3). Enabled by:
 *   GOOGLE_SERVICE_ACCOUNT_JSON (inline) or GOOGLE_SERVICE_ACCOUNT_JSON_PATH
 *   GOOGLE_CALENDAR_ID (e.g. events@rpiambulance.com)
 * Disabled (no-op, returns null) when unset.
 */
@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private readonly account?: ServiceAccount;
  private readonly calendarId?: string;
  private cachedToken?: { token: string; expiresAt: number };

  constructor(config: ConfigService) {
    this.calendarId = config.get('GOOGLE_CALENDAR_ID');
    const inline = config.get<string>('GOOGLE_SERVICE_ACCOUNT_JSON');
    const path = config.get<string>('GOOGLE_SERVICE_ACCOUNT_JSON_PATH');
    try {
      if (inline) this.account = JSON.parse(inline);
      else if (path) this.account = JSON.parse(readFileSync(path, 'utf8'));
    } catch (error) {
      this.logger.error(`Failed to load Google service account: ${error}`);
    }
  }

  get enabled(): boolean {
    return !!(this.account && this.calendarId);
  }

  private async accessToken(): Promise<string> {
    if (this.cachedToken && Date.now() < this.cachedToken.expiresAt - 60_000) {
      return this.cachedToken.token;
    }
    const key = await importPKCS8(this.account!.private_key, 'RS256');
    const assertion = await new SignJWT({
      scope: 'https://www.googleapis.com/auth/calendar.events',
    })
      .setProtectedHeader({ alg: 'RS256' })
      .setIssuer(this.account!.client_email)
      .setAudience('https://oauth2.googleapis.com/token')
      .setIssuedAt()
      .setExpirationTime('1h')
      .sign(key);

    const res = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        assertion,
      }),
    });
    if (!res.ok) throw new Error(`Google token exchange failed: ${res.status}`);
    const data = (await res.json()) as { access_token: string; expires_in: number };
    this.cachedToken = {
      token: data.access_token,
      expiresAt: Date.now() + data.expires_in * 1000,
    };
    return data.access_token;
  }

  private toGcalBody(input: GcalEventInput) {
    return {
      summary: input.title,
      description: input.description ?? undefined,
      location: input.location ?? undefined,
      start: { dateTime: input.startsAt.toISOString() },
      end: { dateTime: input.endsAt.toISOString() },
    };
  }

  /** Create or update; returns the gcal event id, or null when disabled/failed. */
  async upsertEvent(gcalEventId: string | null, input: GcalEventInput): Promise<string | null> {
    if (!this.enabled) return gcalEventId;
    try {
      const token = await this.accessToken();
      const base = `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId!)}/events`;
      const res = await fetch(gcalEventId ? `${base}/${gcalEventId}` : base, {
        method: gcalEventId ? 'PUT' : 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(this.toGcalBody(input)),
      });
      if (!res.ok) {
        this.logger.error(`gcal upsert failed: ${res.status} ${await res.text()}`);
        return gcalEventId;
      }
      const data = (await res.json()) as { id: string };
      return data.id;
    } catch (error) {
      this.logger.error(`gcal upsert failed: ${error}`);
      return gcalEventId;
    }
  }

  async deleteEvent(gcalEventId: string): Promise<void> {
    if (!this.enabled) return;
    try {
      const token = await this.accessToken();
      await fetch(
        `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(this.calendarId!)}/events/${gcalEventId}`,
        { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } },
      );
    } catch (error) {
      this.logger.error(`gcal delete failed: ${error}`);
    }
  }
}
