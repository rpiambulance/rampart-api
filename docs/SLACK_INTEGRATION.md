# Slack integration setup

Rampart's Slack usage is **outbound only**. The entire integration calls one
Web API method — `chat.postMessage` — against three kinds of target:

| What | Target | Code |
|---|---|---|
| Member notifications (cert expiry, promotion outcomes, credential grants, availability requests) | the member's Slack **user ID** (`Member.slackId`) → DM | `NotificationsService.notifyMember` |
| Officer broadcasts (new coverage request, requester replies, crew absences, promotion awaiting captain) | `SLACK_OFFICERS_CHANNEL` | `NotificationsService.notifyOfficers` |
| Nightly "who's on tonight" post (17:00 America/New_York) | `SLACK_WHOSON_CHANNEL`, with `<@userId>` mentions | `WhosOnJobs.postWhosOn` |

Unset `SLACK_BOT_TOKEN` disables all of it (messages fall back to server logs).

## 1. Create the app

Create a **new** app at <https://api.slack.com/apps> — *don't* reuse Herald's.
They serve different purposes, and separate apps mean one can be rotated or
revoked without silencing dispatches. Name it something like "Rampart".

## 2. Bot token scopes

Under **OAuth & Permissions → Scopes → Bot Token Scopes**:

**Required**

- `chat:write` — post messages. This is the only scope the current code
  strictly needs.

**Strongly recommended**

- `im:write` — lets the bot open a DM with a member it hasn't messaged
  before. `chat.postMessage` with a user ID as `channel` usually opens the DM
  on its own under `chat:write`, but this removes an entire class of
  intermittent failure and costs nothing.

**Situational**

- `chat:write.public` — only if you'd rather not invite the bot to the
  officer/who's-on channels. Inviting the bot (`/invite @Rampart` in each
  channel) is the tighter option; this scope lets it post to *any* public
  channel.
- `users:read` + `users:read.email` — **only** if you want the Slack-ID
  backfill described in §5. Not needed for messaging.
- `commands` — only if you later add slash commands (e.g. `/whoson`).

Nothing here needs a **user token** (`xoxp-`), and no user scopes are
required. Install to the workspace and copy the **Bot User OAuth Token**
(`xoxb-…`).

## 3. Channels

Invite the bot to each target channel, then set:

```
SLACK_BOT_TOKEN=xoxb-…
SLACK_OFFICERS_CHANNEL=C0123456789     # officers / leadership channel
SLACK_WHOSON_CHANNEL=C0987654321       # where the nightly crew post goes
```

Use **channel IDs** (right-click the channel → View channel details → ID at
the bottom), not `#names`. Names break silently when a channel is renamed;
IDs never change. Private channels work too, as long as the bot is a member.

## 4. What you do *not* need

- **Signing secret / request URL** — those are for *inbound* traffic
  (Events API, interactivity, slash commands). Rampart only calls out.
- **Event subscriptions** — nothing subscribes to Slack events.
- **Socket Mode** — no persistent connection is used.

Add them only if you later want interactive buttons ("Take this open slot"
straight from the who's-on post), which would require Interactivity with a
public request URL plus Slack signature verification on the endpoint.

## 5. Populating `Member.slackId` (the current gap)

DMs only reach members whose `slackId` is set. Today that field is populated
**only** by the legacy MySQL migration (the old portal's `slack-link.php`
stored `members.slackID`). New members have no Slack ID, so they silently
fall back to email.

Options for closing this, cheapest first:

1. **Email backfill (recommended).** Add `users:read` + `users:read.email`,
   then a "Sync Slack IDs" button in the admin console that walks active
   members and calls `users.lookupByEmail` for each. No member action
   required; re-runnable as people join. ~30 lines.
2. **Self-service link.** A "Link Slack" button on the member profile using
   Sign in with Slack (OIDC scopes `openid`, `email`, `profile`). More
   reliable when portal and Slack emails differ, but adds an OAuth flow.
3. **Manual entry.** Officers paste a member's Slack ID on the admin member
   page. Fine for a handful of stragglers, tedious at scale.

## 6. Rate-limit note on broadcasts

`chat.postMessage` is throttled to roughly **1 message per second per
channel**, with short bursts tolerated. `NotificationsService.notifyAllActiveMembers`
— used by the coverage **availability request** — currently loops over every
active member and DMs each one sequentially. At ~60 members that's ~60 API
calls per broadcast: it will work, but it's slow and bursty.

Better: post the availability request **once** to a members channel with a
link to the event page, and reserve DMs for messages that are genuinely
personal (your cert expires, your promotion was approved). That's one API
call, and it reads better in Slack too. Worth changing before the transports
go live.
