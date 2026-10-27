/**
 * One call, several messages.
 *
 * Dispatch often sends the location first, with no call type, and the call
 * type a minute or two later as a second message. Herald forwards each as
 * it comes, with nothing to say the second is about the first — there is no
 * incident number in them — so the only things that tie them together are
 * where the call is and how soon the second came.
 */

import { addressOf, type DispatchDetail } from './dispatch-message';

/**
 * How long after the last message about a call another one at the same
 * place is taken to be about it. Updates come within a minute or two; this
 * leaves room for a slow one without welding together two calls to the same
 * address that are genuinely a quarter of an hour apart.
 */
export const UPDATE_WINDOW_MINUTES = 5;

/** Within this many metres, two geocoded points are the same place. */
const SAME_PLACE_METRES = 75;

/** Lower case, punctuation out, spaces collapsed: a comparable address. */
function normal(text: string | null | undefined): string | null {
  const out = (text ?? '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
  return out || null;
}

function metresBetween(
  a: { latitude: number; longitude: number },
  b: { latitude: number; longitude: number },
): number {
  // Equirectangular: exact enough over a few hundred metres, and a few
  // hundred metres is the only distance that matters here.
  const rad = Math.PI / 180;
  const x =
    (b.longitude - a.longitude) *
    rad *
    Math.cos(((a.latitude + b.latitude) / 2) * rad);
  const y = (b.latitude - a.latitude) * rad;
  return Math.sqrt(x * x + y * y) * 6_371_000;
}

/**
 * Whether two messages are about the same place.
 *
 * The same address, the same geocoded place, or points within a few doors
 * of each other. The address is compared loosely as well — one starting
 * with the other — because Herald rewrites the location once it has
 * geocoded it, and a message whose lookup failed keeps the bare text:
 * "51 COLLEGE AVE" and "51 College Ave, Troy, NY 12180, USA" are one place.
 * That only counts for an address that starts with a house number, so
 * "Troy" is not taken to be every street in it.
 */
export function samePlace(a: DispatchDetail, b: DispatchDetail): boolean {
  const addressA = normal(addressOf(a));
  const addressB = normal(addressOf(b));
  if (addressA && addressB) {
    if (addressA === addressB) return true;
    const [shorter, longer] =
      addressA.length <= addressB.length
        ? [addressA, addressB]
        : [addressB, addressA];
    if (/^\d+ \S+/.test(shorter) && longer.startsWith(`${shorter} `)) {
      return true;
    }
  }

  const placeA = normal(a.geocodedPlace);
  if (placeA && placeA === normal(b.geocodedPlace)) return true;

  if (
    a.latitude != null &&
    a.longitude != null &&
    b.latitude != null &&
    b.longitude != null
  ) {
    return (
      metresBetween(
        { latitude: a.latitude, longitude: a.longitude },
        { latitude: b.latitude, longitude: b.longitude },
      ) <= SAME_PLACE_METRES
    );
  }
  return false;
}

/**
 * Herald's word for a call type dispatch has not given yet. Taken at face
 * value it would overwrite the real one whenever a later message lacked it.
 */
const isUnknown = (value: string): boolean => /^unknown$/i.test(value.trim());

const TEXT_FIELDS = [
  'determinant',
  'complaint',
  'location',
  'business',
  'additionalInfo',
  'crossStreets',
  'units',
] as const;

/**
 * The call as all its messages together describe it.
 *
 * Oldest first, each field taking the latest message that actually says
 * something about it: a follow-up that gives the call type and leaves the
 * cross streets blank has not removed the cross streets. A point on the
 * map is taken whole — latitude, longitude and the address it was looked
 * up as — so a newer pin never ends up beside an older address.
 */
export function mergeMessages(messages: DispatchDetail[]): DispatchDetail {
  const merged: DispatchDetail = {
    determinant: null,
    complaint: null,
    location: null,
    business: null,
    additionalInfo: null,
    crossStreets: null,
    units: null,
    latitude: null,
    longitude: null,
    geocodedPlace: null,
  };
  for (const message of messages) {
    for (const field of TEXT_FIELDS) {
      const value = message[field]?.trim();
      if (!value) continue;
      if (
        (field === 'determinant' || field === 'complaint') &&
        isUnknown(value)
      ) {
        continue;
      }
      merged[field] = value;
    }
    if (message.latitude != null && message.longitude != null) {
      merged.latitude = message.latitude;
      merged.longitude = message.longitude;
      merged.geocodedPlace = message.geocodedPlace?.trim() || null;
    } else if (merged.latitude == null && message.geocodedPlace?.trim()) {
      merged.geocodedPlace = message.geocodedPlace.trim();
    }
  }
  return merged;
}
