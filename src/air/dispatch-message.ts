/**
 * A dispatch as Slack shows it, laid out the way Herald lays it out.
 *
 * Herald posted every call to Slack itself before Rampart did, and people
 * learned to read that post: the call type as a heading, where it is, what
 * is near it, and buttons that open the address in a maps app. Rampart's
 * post now carries the same thing in the same order, so turning Herald's
 * own post off loses nothing anybody was used to looking at.
 *
 * Kept apart from the service so it can be read and tested as layout.
 */

/** What a dispatch carries that a Slack post can show. */
export interface DispatchDetail {
  determinant: string | null;
  complaint: string | null;
  location: string | null;
  business: string | null;
  additionalInfo: string | null;
  crossStreets: string | null;
  units: string | null;
  latitude: number | null;
  longitude: number | null;
  geocodedPlace: string | null;
}

/** Slack refuses a header block longer than this. */
const HEADER_MAX = 150;

/**
 * Nor a section longer than this — and it refuses the whole message, not
 * the one block, so a long free-text note from dispatch would take the call
 * out of Slack entirely.
 */
const SECTION_MAX = 3000;

const clip = (text: string, max: number): string =>
  text.length > max ? `${text.slice(0, max - 1)}…` : text;

/**
 * Slack reads &, < and > as markup in mrkdwn. A location or a note with an
 * angle bracket in it would otherwise turn into a broken link.
 */
function esc(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

const present = (value: string | null | undefined): string | null =>
  value?.trim() || null;

/**
 * A call type that has actually been given. Herald says "Unknown" for both
 * halves when the first message about a call carries only a location, and
 * the call type follows in a second message.
 */
const given = (value: string | null | undefined): string | null => {
  const text = present(value);
  return text && !/^unknown$/i.test(text) ? text : null;
};

/**
 * "Alpha - Falls", as Herald writes it — and, before dispatch has said,
 * that it has not, rather than Herald's "Unknown - Unknown".
 */
export function callType(dispatch: DispatchDetail): string {
  return (
    [given(dispatch.determinant), given(dispatch.complaint)]
      .filter(Boolean)
      .join(' - ') || 'type not given yet'
  );
}

/**
 * The address, without the business in front of it.
 *
 * Once Herald has geocoded a call it forwards the location rewritten as
 * "<business> - <geocoded address>". The business has a line of its own,
 * so leaving it in the address would say it twice.
 */
export function addressOf(dispatch: DispatchDetail): string | null {
  const location = present(dispatch.location);
  if (!location) return null;
  const business = present(dispatch.business);
  if (business) {
    const prefix = `${business} - `;
    if (location.toLowerCase().startsWith(prefix.toLowerCase())) {
      return present(location.slice(prefix.length));
    }
  }
  return location;
}

/**
 * Directions to the call, for the two maps apps a phone is likely to have.
 *
 * Coordinates when there are any, because they are exact. Without them the
 * address itself still makes a working link — the maps app looks it up —
 * which Herald did not offer: a call it could not geocode had no buttons at
 * all, and those are the calls where somebody most needs help finding it.
 */
export function navigationLinks(
  dispatch: DispatchDetail,
): { apple: string; google: string } | null {
  if (dispatch.latitude != null && dispatch.longitude != null) {
    const at = `${dispatch.latitude},${dispatch.longitude}`;
    return {
      apple: `https://maps.apple.com/?daddr=${at}`,
      google: `https://www.google.com/maps/dir/?api=1&destination=${at}`,
    };
  }
  const address = present(dispatch.geocodedPlace) ?? addressOf(dispatch);
  if (!address) return null;
  const to = encodeURIComponent(address);
  return {
    apple: `https://maps.apple.com/?daddr=${to}`,
    google: `https://www.google.com/maps/dir/?api=1&destination=${to}`,
  };
}

/**
 * The line a phone shows in the notification: "ALPHA falls at …".
 *
 * Herald's wording, because it is short enough to read on a lock screen and
 * says the two things that decide whether somebody gets up.
 */
export function fallbackText(dispatch: DispatchDetail): string {
  const determinant = given(dispatch.determinant)?.toUpperCase();
  const complaint = given(dispatch.complaint)?.toLowerCase();
  const what = [determinant, complaint].filter(Boolean).join(' ') || 'Call';
  const where = addressOf(dispatch);
  return where ? `${what} at ${where}` : what;
}

/** The call itself: everything above the responders. */
export function dispatchBlocks(dispatch: DispatchDetail): unknown[] {
  const address = addressOf(dispatch);
  const business = present(dispatch.business);
  const cross = present(dispatch.crossStreets);
  const additional = present(dispatch.additionalInfo);
  const units = present(dispatch.units);
  const place = present(dispatch.geocodedPlace);

  const blocks: unknown[] = [
    {
      type: 'header',
      text: {
        type: 'plain_text',
        text: `Call received: ${callType(dispatch)}`.slice(0, HEADER_MAX),
        emoji: true,
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: clip(
          `*Location:* ${esc(address ?? 'N/A')}\n` +
            `*Business:* ${esc(business ?? 'N/A')}`,
          SECTION_MAX,
        ),
      },
    },
    {
      type: 'section',
      text: {
        type: 'mrkdwn',
        text: clip(
          [
            `*Cross Streets:* ${esc(cross ?? 'N/A')}`,
            `*Additional Info:* ${esc(additional ?? 'N/A')}`,
            // Not on Herald's post. Who else is going is worth knowing on
            // the way out the door, and Herald forwards it.
            ...(units ? [`*Units:* ${esc(units)}`] : []),
          ].join('\n'),
          SECTION_MAX,
        ),
      },
    },
  ];

  const links = navigationLinks(dispatch);
  if (links) {
    blocks.push(
      { type: 'divider' },
      {
        type: 'section',
        text: {
          type: 'mrkdwn',
          // Herald showed the geocoded address under the label so a pin in
          // the wrong place could be caught against what dispatch said. It
          // is only worth the line when it says something the location
          // above does not.
          text:
            place && place.toLowerCase() !== address?.toLowerCase()
              ? `Navigate:\n${esc(place)}`
              : 'Navigate:',
        },
      },
      {
        type: 'actions',
        elements: [
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Apple Maps', emoji: true },
            action_id: 'nav:apple',
            url: links.apple,
          },
          {
            type: 'button',
            text: { type: 'plain_text', text: 'Google Maps', emoji: true },
            action_id: 'nav:google',
            url: links.google,
          },
        ],
      },
    );
  }
  return blocks;
}
