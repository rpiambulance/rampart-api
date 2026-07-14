# Rampart API

The API for the RPI Ambulance member portal (members.rpiambulance.com). NestJS + Prisma + PostgreSQL. Sole owner of the database; consumed by `rampart-web` and by machine clients via admin-issued API tokens.

**Spec:** `docs/modernization-spec.md` in the legacy `website` repo.

## Stack

- **NestJS** (TypeScript) with URI versioning (`/v1/...`)
- **Prisma 6** + PostgreSQL — schema in [`prisma/schema.prisma`](prisma/schema.prisma)
- **Auth:** Keycloak OIDC JWTs (validated via realm JWKS) for members; `rpa_`-prefixed API tokens (hashed, permission-scoped) for machine clients. Both handled by the global `AuthGuard`; authorization by `PermissionsGuard` + `@RequirePermissions(...)` against the catalog in [`src/permissions/catalog.ts`](src/permissions/catalog.ts).
- **Storage:** local-volume object storage by default, pluggable S3 driver (`STORAGE_DRIVER`).

## Development

```bash
cp .env.example .env
docker compose -f docker-compose.dev.yml up -d   # Postgres :5432, Keycloak :8082
npx prisma migrate dev                            # create/apply migrations
npx prisma db seed                                # credential ladder, knobs, cert types
npm run start:dev                                 # API on :3001
```

## Domain model (short version)

- **Members** hold **roles** (dated assignments → permissions), **credentials** (the operational ladder: O → A → {A-D → P-D → D → D-T | A-CC → P-CC → CC → CC-T}, CC add-ons FR-CC/EES, captain-appointed DS; SDS = a DS with a different display title), and **certifications** (external, expiring, document-verified).
- **Scheduling:** night `Crew`s (5 slots/date, generated weekly from `DefaultCrewTemplate`, rules driven by `SchedulingSetting` knobs) and unified `Event`s (optional positional slots + optional attendee cap).
- **Training:** eval form templates → draft/submit/sign evaluations → promotion requests with unanimous TC votes (no abstentions, proxy support for conflicts) + captain approval; DS granted by captain appointment.

## Deploy

```bash
cp scripts/.env.deploy.example scripts/.env.deploy   # fill in registry + Coolify values
./scripts/deploy.sh            # builds linux/amd64, pushes, triggers Coolify redeploy
```

The image runs `prisma migrate deploy` on start.
