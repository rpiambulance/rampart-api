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
    if (!res.ok) throw new Error(`Keycloak token exchange failed: ${res.status}`);
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
        return location.split('/').pop() ?? null;
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
      this.logger.error(`Keycloak user create failed: ${create.status} ${await create.text()}`);
      return null;
    } catch (error) {
      this.logger.error(`Keycloak provisioning failed: ${error}`);
      return null;
    }
  }
}
