import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

const SITEVERIFY = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

interface SiteverifyResponse {
  success: boolean;
  'error-codes'?: string[];
}

/**
 * Cloudflare Turnstile, guarding the endpoints anyone on the internet can
 * reach — currently the coverage intake form.
 *
 * Enabled by TURNSTILE_SECRET_KEY; a no-op when unset, so an install that has
 * not been given keys keeps working rather than losing its public form. The
 * matching site key lives in the web app, which renders the widget.
 *
 * Verification happens here rather than in the web app because this is the
 * endpoint that is actually exposed: a check the browser could skip by
 * posting straight to the API would only be decorating the form.
 */
@Injectable()
export class TurnstileService {
  private readonly logger = new Logger(TurnstileService.name);
  private readonly secret?: string;

  constructor(config: ConfigService) {
    this.secret = config.get<string>('TURNSTILE_SECRET_KEY') || undefined;
    if (!this.secret) {
      this.logger.warn(
        'TURNSTILE_SECRET_KEY is not set — public forms accept submissions ' +
          'without a bot check.',
      );
    }
  }

  get enabled(): boolean {
    return !!this.secret;
  }

  /**
   * Throws unless the token checks out.
   *
   * A token is single-use and lives about five minutes, so a form left open
   * over lunch fails here rather than at the database — hence the distinct
   * message for an expired one, which is a real person to be asked to try
   * again rather than a bot to be turned away.
   */
  async verify(token: string | undefined, ip: string | null): Promise<void> {
    if (!this.secret) return;
    if (!token) {
      throw new BadRequestException(
        'Please complete the "I am human" check and submit again.',
      );
    }

    const body = new URLSearchParams({ secret: this.secret, response: token });
    // Cloudflare scores the requester's address, not ours, so this is only
    // worth sending when the web app has passed the real one through.
    if (ip) body.set('remoteip', ip);

    let result: SiteverifyResponse;
    try {
      const res = await fetch(SITEVERIFY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body,
        signal: AbortSignal.timeout(10_000),
      });
      if (!res.ok) throw new Error(`siteverify returned ${res.status}`);
      result = (await res.json()) as SiteverifyResponse;
    } catch (error) {
      // Failing closed. Turnstile being unreachable from here usually means
      // it was unreachable from the browser too, so the submission had no
      // token to send in the first place; treating the outage as a pass would
      // hand anyone watching a way to switch the check off.
      this.logger.error(`Turnstile verification failed to complete: ${error}`);
      throw new BadRequestException(
        'We could not run the bot check just now. Please try again in a ' +
          'minute, or email us directly.',
      );
    }

    if (result.success) return;

    const codes = result['error-codes'] ?? [];
    this.logger.warn(`Turnstile rejected a submission: ${codes.join(', ')}`);
    if (codes.includes('timeout-or-duplicate')) {
      throw new BadRequestException(
        'That check has expired. Please complete it again and resubmit.',
      );
    }
    if (
      codes.includes('invalid-input-secret') ||
      codes.includes('missing-input-secret')
    ) {
      // Ours, not theirs: say so in the log and stay vague to the submitter.
      this.logger.error(
        'TURNSTILE_SECRET_KEY is missing or wrong — Cloudflare is rejecting ' +
          'every submission.',
      );
      throw new BadRequestException(
        'We could not run the bot check just now. Please try again in a ' +
          'minute, or email us directly.',
      );
    }
    throw new BadRequestException(
      'That check did not pass. Please complete it again and resubmit.',
    );
  }
}
