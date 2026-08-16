# Google Calendar service account setup

Rampart pushes approved events to a shared calendar. It calls three endpoints
on one calendar:

- `POST   /calendar/v3/calendars/{calendarId}/events` — create
- `PUT    /calendar/v3/calendars/{calendarId}/events/{eventId}` — update
- `DELETE /calendar/v3/calendars/{calendarId}/events/{eventId}` — delete

Auth is a self-signed JWT assertion exchanged for an access token, requesting
one scope: **`https://www.googleapis.com/auth/calendar.events`** (read/write
events, no calendar management). Unset `GOOGLE_CALENDAR_ID` or the credentials
and sync silently no-ops.

## The short answer: no IAM roles

The common expectation is that the service account needs a project IAM role
like "Calendar Admin". **It does not** — no such role exists, and Cloud IAM
does not govern access to a user's calendar. Access comes from **the
calendar's own sharing ACL**. Grant the service account nothing in IAM.

## What you actually need

1. **A GCP project with the Google Calendar API enabled**
   (APIs & Services → Library → Google Calendar API → Enable). Without this
   every call fails with `accessNotConfigured`.

2. **A service account** in that project (IAM & Admin → Service Accounts).
   - Skip the "Grant this service account access to project" step entirely.
   - Give it a human-friendly display name — it appears as the event
     **creator/organizer** on the calendar, so members will see it. Something
     like "RPIA Rampart" rather than `svc-1234`.
   - Create a **JSON key** and provide it to the API as either
     `GOOGLE_SERVICE_ACCOUNT_JSON` (inline) or
     `GOOGLE_SERVICE_ACCOUNT_JSON_PATH` (mounted file).

3. **Share the calendar with the service account.** Open the calendar's
   settings as its owner (Calendar → Settings → *the calendar* → Share with
   specific people) and add the service account's address —
   `something@your-project.iam.gserviceaccount.com` — with:

   > **Make changes to events** (`writer`)

   That is the minimum role that permits create/update/delete. "See all event
   details" (`reader`) is not enough; "Make changes and manage sharing"
   (`owner`) is more than needed.

4. **Set the calendar ID**: `GOOGLE_CALENDAR_ID=events@rpiambulance.com`
   (or the long `…@group.calendar.google.com` ID for a secondary calendar —
   find it under Settings → Integrate calendar → Calendar ID).

That's the whole grant: **one calendar ACL entry, zero IAM roles.**

## Gotchas

- **Who owns `events@rpiambulance.com`?** If it's a Workspace *user's*
  primary calendar, someone must sign in as that user to share it. If it's a
  *secondary* calendar, its owner shares it — and that's the better setup,
  since ownership survives staff turnover. A Google **Group** address will
  not work as a calendar ID.
- **Don't let the service account create its own calendar.** It can, but the
  result is invisible to humans until shared over the API, which is a mess.
  Share an existing calendar instead.
- **Attendees/invitations.** Without domain-wide delegation a service account
  cannot email invitations to attendees. Rampart doesn't set attendees — it
  writes title, description, location, and start/end — so this doesn't bite
  us today. It would if we ever invited assigned crew members to the event.
- **Key hygiene.** The JSON key is a long-lived private credential: store it
  as a Coolify secret (not in the repo — `.gitignore` already covers the dev
  path), and rotate it if it's ever exposed. Deleting a leaked key in the
  console immediately invalidates it.
- **Quota** is 1,000,000 queries/day by default. We use a handful per week.

## If you want events to appear authored by a person

Only then do you need **domain-wide delegation**, and it requires both a
Workspace change and a small code change:

1. On the service account, enable domain-wide delegation and note its
   **Client ID**.
2. A Workspace super-admin authorizes it in Admin console → Security → Access
   and data control → API controls → Domain-wide delegation, pasting the
   client ID and the scope `https://www.googleapis.com/auth/calendar.events`.
3. In `GoogleCalendarService.accessToken()`, add `.setSubject('events@rpiambulance.com')`
   to the JWT so it impersonates that user, plus an env var for the subject.

Unless you specifically want human-attributed events or attendee invitations,
skip this — the direct-share path is simpler and involves no Workspace admin.
