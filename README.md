# Rampart API

The API for the RPI Ambulance member portal (members.rpiambulance.com). NestJS + Prisma + PostgreSQL. Sole owner of the database; consumed by `rampart-web` and by machine clients via admin-issued API tokens.

**Spec:** `docs/modernization-spec.md` in the legacy `website` repo.

## Stack

- **NestJS** (TypeScript) with URI versioning (`/v1/...`)
- **Prisma 6** + PostgreSQL — schema in [`prisma/schema.prisma`](prisma/schema.prisma)
- **Auth:** Keycloak OIDC JWTs (validated via realm JWKS) for members; `rpa_`-prefixed API tokens (hashed, permission-scoped) for machine clients. Both handled by the global `AuthGuard`; authorization by `PermissionsGuard` + `@RequirePermissions(...)` against the catalog in [`src/permissions/catalog.ts`](src/permissions/catalog.ts).
- **Storage:** local-volume object storage by default, pluggable S3 driver (`STORAGE_DRIVER`).

## Run locally — fully in Docker

```bash
docker compose up -d --build      # Postgres :5433, Keycloak :8080, API :3001 (migrations run on start)
docker compose run --rm seed      # reference data + a dev member (Keycloak login dev/dev)
```

A dev realm (`rampart`, client `rampart-web` / secret `dev-secret`, user
`dev`/`dev`, 8-hour access tokens) is imported automatically from
[keycloak/realm-rampart.json](keycloak/realm-rampart.json).

**Calling the API without any browser login:**

```bash
TOKEN=$(./scripts/dev-token.sh)        # password grant as dev/dev — no /etc/hosts needed
curl -H "Authorization: Bearer $TOKEN" localhost:3001/v1/members/me
```

(The web app has the same shortcut: its compose sets `AUTH_DEV_LOGIN=true`,
enabling a dashboard username/password form that does this exchange
server-side.) The Keycloak container pins its issuer to `http://keycloak:8080`
so tokens validate identically inside and outside Docker; only the full
browser OIDC redirect flow needs `127.0.0.1 keycloak` in `/etc/hosts`.

The `seed` service uses the image's `dev` target (full source + tsx), so the
legacy ETL also runs in Docker:

```bash
docker compose run --rm -e LEGACY_MYSQL_URL=mysql://... seed npx tsx scripts/migrate-legacy.ts
```

## Development (API on the host)

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d   # infra only: Postgres :5433, Keycloak :8080
npx prisma migrate dev                            # create/apply migrations
npx prisma db seed                                # credential ladder, knobs, cert types
npm run start:dev                                 # API on :3001
```

## Domain model (short version)

- **Members** hold **roles** (dated assignments → permissions), **credentials** (the operational ladder: O → A → {A-D → P-D → D → D-T | A-CC → P-CC → CC → CC-T}, CC add-ons FR-CC/EES, captain-appointed DS; SDS = a DS with a different display title), and **certifications** (external, expiring, document-verified).
- **Scheduling:** night `Crew`s (5 slots/date, generated weekly from `DefaultCrewTemplate`, rules driven by `SchedulingSetting` knobs) and unified `Event`s (optional positional slots + optional attendee cap).
- **Training:** eval form templates → draft/submit/sign evaluations → promotion requests with unanimous TC votes (no abstentions, proxy support for conflicts) + captain approval; DS granted by captain appointment.

## Integrations (all optional, env-driven)

Unset variables disable the integration gracefully — see [.env.example](.env.example):

- **Email** — `SMTP_URL` + `EMAIL_FROM` (cert-expiry reminders, promotion outcomes)
- **Slack** — `SLACK_BOT_TOKEN` (+ `SLACK_OFFICERS_CHANNEL` for officer broadcasts, `SLACK_WHOSON_CHANNEL` for the nightly 17:00 who's-on post; member DMs use `Member.slackId`)
- **Google Calendar** — `GOOGLE_CALENDAR_ID` + service account JSON (events sync on create/update/delete)
- **Keycloak provisioning** — `KEYCLOAK_ADMIN_CLIENT_ID`/`SECRET` (creates the Keycloak user when an officer creates a member)

## Legacy migration

One-shot, idempotent ETL from the old portal's MySQL (spec §8):

```bash
LEGACY_MYSQL_URL=mysql://user:pass@host:3306/ambulanc_web npx tsx scripts/migrate-legacy.ts
```

Maps members (flags → ladder credentials, officer flags → roles, cert fields → verified certifications), crews + weekly defaults (negative pseudo-members become placeholders), games/events → unified events with signups, fuel/radio logs. Run migrations + seed first.

## Tests

```bash
npm run test:e2e   # crews-engine suite; needs the dev Postgres running
```

## Deploy

```bash
cp scripts/.env.deploy.example scripts/.env.deploy   # fill in registry + Coolify values
./scripts/deploy.sh            # builds linux/amd64, pushes, triggers Coolify redeploy
```

The image runs `prisma migrate deploy` on start.
