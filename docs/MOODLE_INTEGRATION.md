# Moodle → Rampart integration plan

Goal: course completions in Moodle automatically satisfy Rampart's annual
training requirements (and optionally class completions), and outstanding
*required* trainings block night-crew signup until completed.

## What Rampart already has (built)

- `AnnualTrainingRequirement.blocksScheduling` — when true and the member has
  no completion for the current year, **every crew slot is ineligible** with
  the reason "Outstanding required training: <name>". Toggled per requirement
  in central → Admin → Trainings.
- Machine-writable completion endpoints (any `trainings:manage` API token):
  - `PUT  /v1/trainings/annual/:id/completions/:memberId {completedAt?}`
  - `DELETE /v1/trainings/annual/:id/completions/:memberId`
  - `PUT  /v1/trainings/classes/:id/attendance/:memberId {status:"COMPLETED"}`

So a Moodle sync only needs to *read Moodle and call those endpoints* — no
further Rampart schema is strictly required. The pieces below make it a
first-class integration.

## Moodle-side prerequisites (Moodle admin work)

1. **Enable web services**: Site administration → Advanced features →
   *Enable web services*; enable the **REST protocol**.
2. **Course completion enabled** on every course that maps to a requirement
   (Course settings → Completion tracking), with completion criteria set —
   otherwise the completion API returns nothing.
3. **Create a dedicated service** (Site admin → Server → Web services →
   External services) exposing only the functions the sync needs:
   - `core_user_get_users_by_field` (identity matching)
   - `core_enrol_get_enrolled_users` (roster per course)
   - `core_completion_get_course_completion_status` (per user × course)
   - optionally `core_course_get_courses` (course list for the mapping UI)
4. **Service account + token**: a dedicated Moodle user with a role limited
   to those capabilities; generate a web-service token for it. Optionally IP-
   allowlist the token to the Rampart API host.
5. **Identity key**: the reliable join is email. RPI Moodle usernames are RCS
   IDs, so `Member.rcsId`/portal email ↔ Moodle `email`/`username` should
   match; decide which field is authoritative (recommend: match on email,
   fall back to `username == rcsId`).

Moodle REST calls look like:

```
GET {MOODLE_URL}/webservice/rest/server.php
    ?wstoken={token}&moodlewsrestformat=json
    &wsfunction=core_completion_get_course_completion_status
    &courseid=42&userid=137
```

Response: `completionstatus.completed: true/false` plus per-criteria detail.

## Rampart-side work (next build, ~1 day)

1. **Mapping table** `MoodleCourseLink { moodleCourseId, moodleCourseName,
   target: annualRequirementId | trainingClassId }` + a mapping editor in the
   admin console's App Settings (courses fetched live for pickers).
2. **Sync job** (`@nestjs/schedule` cron, e.g. hourly; env `MOODLE_URL`,
   `MOODLE_WS_TOKEN`, `MOODLE_SYNC_ENABLED`): for each mapped course, pull
   enrolled users → match to members (email/rcsId) → fetch completion status
   → upsert `MemberAnnualTraining.completedAt` / class attendance COMPLETED.
   Never *revokes* a completion automatically (Moodle resets happen); removal
   stays a manual officer action. Unmatched Moodle users and matched members
   missing from Moodle are reported via the officer notification channel.
3. **`Member.moodleUserId`** cached after first match to skip re-matching.
4. **Audit**: sync writes audit rows (`SYSTEM` actor) per completion applied.

## The blocking chain, end to end

Moodle completion → sync marks the annual requirement complete → the
`blocksScheduling` gate clears → the member can sign up for night crews.
Until then every slot shows "Outstanding required training: X" (and the same
gate can be extended to event positional signups later if wanted — currently
it applies to night crews only, per the original "annual trainings don't
gate credentials" decision; blocking is opt-in per requirement).

## Alternatives considered

- **Moodle webhooks** (`local_webhooks` plugin) → push on completion instead
  of polling. Lower latency but adds a plugin dependency and still needs the
  poll for reconciliation; recommend starting pull-only.
- **LTI / grade passback** — heavier machinery aimed at embedding content,
  not needed for completion sync.
