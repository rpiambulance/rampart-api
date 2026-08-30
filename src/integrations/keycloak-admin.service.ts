import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

/**
 * Keycloak user provisioning via the Admin REST API (spec §6). Enabled by:
 *   KEYCLOAK_ISSUER               (already required for authN)
 *   KEYCLOAK_ADMIN_CLIENT_ID      (confidential client with manage-users)
 *   KEYCLOAK_ADMIN_CLIENT_SECRET
 * Disabled (no-op, returns null) when the admin client is unset.
 */
@Injectable()
export class KeycloakAdminService {
  private readonly logger = new Logger(KeycloakAdminService.name);
  private readonly issuer?: string;
  private readonly clientId?: string;
  private readonly clientSecret?: string;

  constructor(config: ConfigService) {
    this.issuer = config.get('KEYCLOAK_ISSUER');
    this.clientId = config.get('KEYCLOAK_ADMIN_CLIENT_ID');
    this.clientSecret = config.get('KEYCLOAK_ADMIN_CLIENT_SECRET');
    // Said out loud either way. Unconfigured, every member added from the
    // roster is created with no login and nothing says so — which is exactly
    // how this went unnoticed.
    if (this.enabled) {
      this.logger.log(
        'Keycloak provisioning enabled — new members get a login.',
      );
    } else {
      this.logger.warn(
        'KEYCLOAK_ADMIN_CLIENT_ID/SECRET are not set — members added from the ' +
          'roster get no Keycloak login and cannot sign in until one is made ' +
          'for them by hand.',
      );
    }
  }

  get enabled(): boolean {
    return !!(this.issuer && this.clientId && this.clientSecret);
  }

  /** issuer = https://host/realms/<realm> → https://host/admin/realms/<realm> */
  private adminBase(): string {
    return this.issuer!.replace('/realms/', '/admin/realms/');
  }

  private async accessToken(): Promise<string> {
    const res = await fetch(`${this.issuer}/protocol/openid-connect/token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'client_credentials',
        client_id: this.clientId!,
        client_secret: this.clientSecret!,
      }),
    });
    if (!res.ok)
      throw new Error(`Keycloak token exchange failed: ${res.status}`);
    const data = (await res.json()) as { access_token: string };
    return data.access_token;
  }

  /**
   * Create (or find by email) a Keycloak user; returns the subject (user id)
   * or null when provisioning is disabled or fails.
   */
  async provisionUser(user: {
    email: string;
    firstName: string;
    lastName: string;
  }): Promise<string | null> {
    if (!this.enabled) return null;
    try {
      const token = await this.accessToken();
      const headers = {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      };

      const create = await fetch(`${this.adminBase()}/users`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          email: user.email,
          username: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          enabled: true,
          emailVerified: false,
          requiredActions: ['UPDATE_PASSWORD'],
        }),
      });
      if (create.status === 201) {
        const location = create.headers.get('location') ?? '';
        const id = location.split('/').pop() ?? null;
        if (id) {
          this.logger.log(`Created Keycloak login for ${user.email}`);
          // Their way in. Without it the account exists and nobody can use
          // it: no password, and no message saying there is one to set.
          await this.sendPasswordSetup(id, user.email);
        }
        return id;
      }
      if (create.status === 409) {
        // Already exists — look it up by email.
        const search = await fetch(
          `${this.adminBase()}/users?email=${encodeURIComponent(user.email)}&exact=true`,
          { headers },
        );
        const users = (await search.json()) as Array<{ id: string }>;
        return users[0]?.id ?? null;
      }
      this.logger.error(
        `Keycloak user create failed for ${user.email}: ${create.status} ${await create.text()}`,
      );
      return null;
    } catch (error) {
      this.logger.error(
        `Keycloak provisioning failed for ${user.email}: ${error}`,
      );
      return null;
    }
  }

  /**
   * Asks Keycloak to email the new member a link to set their password.
   *
   * Best effort: a member who exists but never got the email can still be
   * sent one from the Keycloak console, whereas failing the whole creation
   * over an unconfigured mail server would leave the officer with nothing.
   */
  private async sendPasswordSetup(userId: string, email: string) {
    try {
      const token = await this.accessToken();
      const res = await fetch(
        `${this.adminBase()}/users/${userId}/execute-actions-email`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(['UPDATE_PASSWORD']),
        },
      );
      if (!res.ok) {
        this.logger.warn(
          `Could not send the set-password email to ${email}: ${res.status}. ` +
            'The login exists; send it from the Keycloak console.',
        );
      }
    } catch (error) {
      this.logger.warn(
        `Could not send the set-password email to ${email}: ${error}`,
      );
    }
  }
}
