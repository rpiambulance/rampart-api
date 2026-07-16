# Rampart API — External Integration Guide

How to call the Rampart API from an outside service (Slack bots, kiosks,
reporting scripts, future mobile apps). Full request/response schemas for
every endpoint live in the OpenAPI document — Swagger UI at **`/docs`**,
machine-readable JSON at **`/docs-json`** (disable with `SWAGGER_ENABLED=false`).

## Authentication

Every request (except the public endpoints listed at the bottom) needs:

```
Authorization: Bearer <token>
```

Two token kinds are accepted on the same header:

| Kind | Looks like | Who gets one | Authorization model |
|---|---|---|---|
| Keycloak OIDC access token | JWT | Members via the web app's login | Permissions come from the member's **roles** in the portal |
| API token | `rpa_<64 hex chars>` | Machine clients — created by an admin at **Admin → Tokens** (`POST /v1/tokens`, permission `tokens:manage`) | Permissions are the **explicit subset** chosen at creation; nothing else |

API-token notes:

- The plaintext secret is shown **once** at creation. Store it in your
  service's secret manager; the API only keeps a SHA-256 hash.
- Tokens can carry an expiration and are revocable at any time; `lastUsedAt`
  is tracked for audit.
- A `403` with `Missing permission(s): …` means the token wasn't granted that
  permission — no amount of retrying helps; ask an admin to reissue.
- Some endpoints require a *member* session (they act on "me": crew signups,
  own certifications, ICS tokens, votes). These return `403 This endpoint
  requires a member session` for API tokens by design.

## Conventions

- Base path: `https://<api-host>/v1/…` (URI-versioned).
- JSON in, JSON out. `Content-Type: application/json`.
- Validation errors → `400` with `message: string[]`. Auth → `401`.
  Permission/authorization → `403`. Missing → `404`. Conflicts (slot taken,
  duplicate vote) → `409`. Public endpoints are rate-limited → `429`.
- Dates: calendar dates are `YYYY-MM-DD`; timestamps are ISO-8601 UTC.

## Endpoint groups and the permission each requires

Read endpoints marked *(member data)* need `members:read` unless they act on
the caller's own record.

| Group | Base | Read | Write | Notes |
|---|---|---|---|---|
| Members | `/v1/members` | `members:read` | `members:write` (+`members:deactivate` to deactivate) | `GET /me`, `PATCH /me` are member-session-only |
| Roles & permissions | `/v1/roles` | any authed | `roles:manage` | `GET /v1/roles/permissions` returns the catalog — the values usable on API tokens |
| Night crews | `/v1/crews` | member session | self-signup: member session; overrides: `schedule:crews:assign` | `PUT /v1/crews/by-date/:date/slots/:position` assigns any future date (pre-publication); `GET ?viewDate=` pages weeks for holders of `schedule:crews:assign` |
| Crew absences | `/v1/crews/absences` | member session | member session | Distant-shift drops / default-template exceptions |
| Weekly availability polls | `/v1/availability/polls` | `schedule:crews:manage-defaults` (member: `GET mine/open`) | create/close: `schedule:crews:manage-defaults`; respond: invited member | |
| Crew defaults & knobs | `/v1/crews/defaults`, `/v1/crews/settings` | defaults: `schedule:crews:manage-defaults`; settings: any authed | `schedule:crews:manage-defaults` / `schedule:settings` | |
| Events | `/v1/events` | any authed | `events:create`, lock: `events:lock`, assign others: `events:assign-others` | Unified games/details/meetings model with positional slots |
| Event workflow | `/v1/events/:id/workflow` | — | `events:create`; APPROVE/DENY additionally `events:approve` | Actions: `REQUEST_AVAILABILITY`, `SUBMIT_FOR_APPROVAL`, `APPROVE`, `DENY`, `CANCEL` |
| Event availability | `/v1/events/:id/availability` | `events:create` | member session | "I can work this" responses |
| Event kinds & tiers | `/v1/events/kinds`, `/v1/events/tiers` | any authed | `settings:write` | |
| Coverage requests (staff) | `/v1/coverage-requests` | `events:create` | `events:create` | Message the requester, draft the event |
| Certifications | `/v1/certifications` | own: member; others: `certs:read-all` | submit/upload: member; verify: `certs:verify`; types: `settings:write` | Document upload is `multipart/form-data`, field `file` |
| Credentials | `/v1/credentials` | any authed | grant/revoke: `credentials:grant`; appoint DS: `credentials:appoint`; requirements: `settings:write` | |
| Evaluations | `/v1/evals` | own: member; others: `evals:read-all` | write: `evals:write`; templates: `evals:manage-forms` | |
| Promotions | `/v1/promotions` | review: `promotions:review` | vote: `promotions:vote` (member); captain: `promotions:captain-approve` | Proxy voting supported |
| Trainings & classes | `/v1/trainings` | any authed | `trainings:manage` (register: member) | |
| Fuel log | `/v1/fuel` | any authed | member session | |
| Radios | `/v1/radios` | any authed | `radios:manage` | |
| API tokens | `/v1/tokens` | `tokens:manage` | `tokens:manage` | |
| Audit log | `/v1/audit` | `audit:read` | — | |
| ICS calendar | `/v1/calendar` | member session | member session | Feed URLs themselves are tokenized and public |

## Worked examples

Create a token (as an admin, via a member session):

```bash
curl -X POST https://api.example.com/v1/tokens \
  -H "Authorization: Bearer $MEMBER_JWT" -H 'Content-Type: application/json' \
  -d '{"name":"slack-bot","permissions":["members:read","schedule:crews:assign"],"expiresAt":"2027-01-01T00:00:00Z"}'
# -> { "id": 4, "name": "slack-bot", "secret": "rpa_…" }   (secret shown once)
```

Read the roster:

```bash
curl https://api.example.com/v1/members -H "Authorization: Bearer rpa_…"
```

Assign a member to a not-yet-public crew date:

```bash
curl -X PUT https://api.example.com/v1/crews/by-date/2026-08-14/slots/CC \
  -H "Authorization: Bearer rpa_…" -H 'Content-Type: application/json' \
  -d '{"memberId": 42}'
```

Advance a coverage event to approval:

```bash
curl -X POST https://api.example.com/v1/events/17/workflow \
  -H "Authorization: Bearer rpa_…" -H 'Content-Type: application/json' \
  -d '{"action":"SUBMIT_FOR_APPROVAL"}'
```

## Public (unauthenticated) endpoints

Rate-limited; no bearer token:

- `POST /v1/coverage-requests` — outside coverage intake (5/hour/IP). Returns a `statusUrl` with an unguessable token.
- `GET /v1/coverage-requests/status/:token` — requester status page data.
- `POST /v1/coverage-requests/status/:token/messages` — requester replies (10/hour/IP).
- `GET /v1/calendar/feed/:token.ics` — per-member ICS feeds.
- `GET /v1/health` — liveness.
