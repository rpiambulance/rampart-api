# Deployment topology & public surface

## Four HTTP services, not two

| Service | Repo | Dev port | Suggested prod host | Must be public? |
|---|---|---|---|---|
| **Central** — member portal | `central` | 3000 | `members.rpiambulance.com` | Yes |
| **Rampart Admin** — console | `rampart-web` | 3002 | `admin.rpiambulance.com` | Yes |
| **Rampart API** | `rampart-api` | 3001 | `api.rpiambulance.com` | **Yes** — see below |
| **Keycloak** | (managed) | 8080 | `auth.rpiambulance.com` | **Yes** — browsers redirect to it |
| Postgres | (managed) | 5433 | — | **No** — never expose |

Both web apps are thin: they hold no database and call the API server-side
with the signed-in member's Keycloak token.

### Why the API can't be internal-only

The two web apps could reach the API over a private network, but four other
consumers can't:

1. **ICS feeds** — `GET /v1/calendar/feed/:token.ics` is fetched by Google
   Calendar / Apple Calendar **servers**, not the member's browser.
2. **Herald** — POSTs dispatches from wherever it runs.
3. **Service API tokens** — the entire `rpa_` token system exists so outside
   apps can call in. That's the point of the console's token page.
4. **Swagger** — integrators reading `/docs`.

### Why Keycloak needs its own public hostname

The OIDC flow **redirects the member's browser** to Keycloak to sign in, so
it must be reachable from the public internet — not just from the containers.
Its issuer URL must be identical in the browser and inside the network, which
is why the dev stack pins `KC_HOSTNAME` and needs the `keycloak` hosts entry.
In production, set the issuer to the real hostname everywhere:

```
# API
KEYCLOAK_ISSUER=https://auth.rpiambulance.com/realms/rampart
# Central + console
AUTH_KEYCLOAK_ISSUER=https://auth.rpiambulance.com/realms/rampart
```

Each web app needs its own Keycloak client with its own redirect URI
(`https://members…/*` and `https://admin…/*`) and the `rampart-api` audience
mapper.

## Unauthenticated surface (the actual attack surface)

Everything not listed here requires either a Keycloak session or an `rpa_`
API token.

### API

| Endpoint | Protection |
|---|---|
| `GET /v1/health` | none (intentional — for uptime checks) |
| `POST /v1/coverage-requests` | throttled 5/hour per IP |
| `GET /v1/coverage-requests/status/:token` | 24-byte random token |
| `POST /v1/coverage-requests/status/:token/messages` | token + 10/hour |
| `GET /v1/calendar/feed/:token.ics` | 24-byte random token, revocable |
| `POST /v1/herald/dispatch` | `rpa_` token with `dispatches:ingest`, 120/hour |
| `GET /docs`, `GET /docs-json` | **none** — see below |

### Central

- `/coverage` — public coverage request form
- `/coverage/status/<token>` — tokenized status page
- `/api/auth/*` — Auth.js routes

Everything else redirects to sign-in via middleware.

### Rampart Admin console

- `/api/auth/*` only.

Every other path requires a session **and** at least one console permission
(`tokens:manage`, `roles:manage`, `settings:write`, `schedule:settings`,
`vehicles:manage`, `audit:read`, `integrations:manage`) — otherwise the
member gets an "Administrators only" screen.

## Note on `/docs`

Swagger UI is registered directly on the HTTP adapter, so it sits **outside**
the global auth guard — `/docs` and `/docs-json` are world-readable wherever
the API is reachable. Verified: an unauthenticated request returns the full
OpenAPI document.

This exposes the API's *shape* (paths, DTO schemas, which permission each
group needs) but **no member data** — every data endpoint still enforces
auth. Options, in order of preference:

1. **Leave it public.** Reasonable: it's how integrators discover the API,
   and the shape isn't a secret.
2. **Set `SWAGGER_ENABLED=false` in production** and read the docs from a
   staging instance. Already supported, no code change.
3. **Basic-auth it at the reverse proxy** (Coolify/Traefik middleware on the
   `/docs*` path prefix) — keeps it available to integrators who have the
   shared credential.

Pick one deliberately rather than by default.

## Bootstrapping the first administrator

The console requires a console permission, which comes from a role assignment,
which is normally granted *in* the console — a chicken-and-egg. Two supported
ways out.

### Preferred: `BOOTSTRAP_ADMIN_EMAIL`

Set on the **API** (not the web apps) and restart it:

```
BOOTSTRAP_ADMIN_EMAIL=you@rpiambulance.com
BOOTSTRAP_ADMIN_NAME=Your Name        # optional
BOOTSTRAP_ADMIN_ROLE=Admin            # optional, defaults to Admin
```

On boot the API creates that member if needed and grants the role. It is a
**no-op as soon as any active member holds `roles:manage`**, so it can never
re-grant access after you remove someone, and leaving it set is harmless —
though you should still remove it once you're in.

Requires the seed to have run first (that's what creates the `Admin` role).

### Fallback: SQL

If you'd rather not restart with an env var:

```sql
INSERT INTO "Member" ("firstName","lastName",email,active,"updatedAt")
VALUES ('Your','Name','you@rpiambulance.com',true,now())
ON CONFLICT (email) DO NOTHING;

INSERT INTO "MemberRole" ("memberId","roleId","startDate")
SELECT m.id, r.id, now()
FROM "Member" m, "Role" r
WHERE m.email='you@rpiambulance.com' AND r.name='Admin';
```

### How the account gets linked to Keycloak

Neither path needs the Keycloak subject up front. On first login the API
matches an unlinked member by the token's **verified** email claim and stores
the subject permanently. This is also what lets members migrated from the
legacy portal (who have no subject) sign in at all.

The linking only fires when the member has no subject yet and the token's
`email_verified` is true, so it can never re-point an already-linked member at
a different Keycloak account.
