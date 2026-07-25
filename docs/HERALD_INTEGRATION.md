# Herald → Rampart integration

[Herald](https://github.com/techinems/herald) is the SMTP service that receives
the county's text-message dispatches (TMDs), parses them, geocodes the
location, and posts to Slack. It also forwards the parsed JSON to a
configurable HTTP endpoint:

```js
POST {HEADSUP_URL}/dispatch?token={HEADSUP_TOKEN}   // Content-Type: application/json
```

## Works today — zero Herald changes

Rampart exposes `POST /v1/herald/dispatch` accepting exactly that call:

1. In the Rampart admin console, create an API token with only the
   `dispatches:ingest` permission.
2. Configure Herald:
   ```
   HEADSUP_URL=https://<rampart-api-host>/v1/herald
   HEADSUP_TOKEN=rpa_<the token secret>
   ```

Every dispatch Herald parses is then stored as a `Dispatch` row (determinant,
complaint, location, business, additional info, cross streets, units,
response areas, coordinates, plus the full raw payload for reprocessing) and
appears in central's **Dispatch Log** (`dispatches:read`).

Accepted payload shape (what Herald's `handleDispatchText` sends):

```json
{
  "Call Type": "A - Falls",
  "CALL TYPE": { "determinant": "Alpha", "complaint": "Falls" },
  "Location": "Darrin Communications Center (DCC) - 51 College Ave, Troy, NY …",
  "Business": "Darrin Communications Center (DCC)",
  "Additional Location Info": "RM 308",
  "Cross Street": "13TH ST / 8TH ST",
  "Dispatched Units": "E59",
  "Response Areas": "Troy FD 2640/Troy EMS 8243",
  "latitude": 42.7298,
  "longitude": -73.6789,
  "geocoded_place": "51 College Ave, Troy, NY 12180, USA"
}
```

Unknown keys are preserved in `raw`. Missing keys are fine.

## Proposed Herald changes (future, no rush)

None are required for ingestion, but these would harden the pipeline:

1. **Auth header instead of query token** — send
   `Authorization: Bearer ${HEADSUP_TOKEN}` and drop `?token=` (query strings
   leak into logs/proxies). Rampart already accepts the header on all
   endpoints.
2. **Include the raw dispatch text and a timestamp** — add `raw_text` and
   `received_at` (ISO 8601) fields so Rampart stores the original TMD verbatim
   and the true receipt time rather than ingestion time.
3. **Idempotency key** — add a `dedupe_key` (e.g. SHA-256 of raw text +
   received minute). Re-sent emails / retries then can't double-log; Rampart
   would upsert on it.
4. **Retry on failure** — Herald currently fire-and-forgets the HEADSUP POST
   (`.catch(console.error)`). A small retry queue (even 3 attempts with
   backoff) prevents dropped dispatches during API restarts.
5. **Stable field names** — emit a versioned envelope
   (`{ "version": 2, "dispatch": { snake_case fields… } }`) so parser tweaks
   in Herald can't silently break consumers; keep the current keys inside for
   Slack formatting.
6. **Send pre-geocode location too** — Herald overwrites `Location` with the
   geocoded/business-prefixed form before POSTing; including the original
   `Location` as `raw_location` preserves the dispatcher's exact address.
