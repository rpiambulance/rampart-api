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
