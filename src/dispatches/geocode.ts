/**
 * An address to a point on the map, through Google's Geocoding API.
 *
 * Herald does this before it forwards a call, so most dispatches arrive with
 * coordinates already. This is for the ones that do not: Herald without a
 * key, a lookup that failed there, or a call entered here by hand.
 *
 * Ported from Herald so both look up the same way — Troy first, then
 * anywhere — with one thing added, below.
 */

/** Herald's preference for Troy, tried before an unrestricted lookup. */
const TROY = 'locality:Troy|administrative_area:NY|country:US';

/**
 * Per lookup, and there can be two. This sits in front of the AIR post when
 * it runs at all, so a slow Google must not hold up asking who is coming:
 * a call posted without its map buttons beats one posted late.
 */
const TIMEOUT_MS = 3000;

/**
 * Result types that name an area rather than a place.
 *
 * Asked for an address it cannot find, Google can still answer OK with the
 * town, the county or the postcode, and a pin there is worse than no pin: a
 * button that drives a crew to the middle of Troy looks exactly like one
 * that drives them to the call. An answer made only of these is treated as
 * no answer, and the post falls back to a link built from the address text,
 * which the maps app looks up for itself.
 */
const AREA_TYPES = new Set([
  'political',
  'country',
  'administrative_area_level_1',
  'administrative_area_level_2',
  'administrative_area_level_3',
  'locality',
  'sublocality',
  'neighborhood',
  'colloquial_area',
  'postal_code',
]);

export interface Geocoded {
  latitude: number;
  longitude: number;
  place: string;
}

interface GoogleResult {
  formatted_address: string;
  types?: string[];
  geometry: { location: { lat: number; lng: number } };
}

/** Whether a result is somewhere specific, rather than a whole area. */
export function isSpecific(result: { types?: string[] }): boolean {
  const types = result.types ?? [];
  return types.length > 0 && types.some((type) => !AREA_TYPES.has(type));
}

/**
 * Coordinates for an address, or null.
 *
 * Never throws: a call is filed whether or not the map could be found, and
 * a lookup that fails is a missing button, not a missing call.
 */
export async function geocode(
  address: string,
  apiKey: string,
  fetchImpl: typeof fetch = fetch,
): Promise<Geocoded | null> {
  const ask = async (
    params: Record<string, string>,
  ): Promise<Geocoded | null> => {
    const query = new URLSearchParams({ address, key: apiKey, ...params });
    const res = await fetchImpl(
      `https://maps.googleapis.com/maps/api/geocode/json?${query}`,
      { signal: AbortSignal.timeout(TIMEOUT_MS) },
    );
    if (!res.ok) return null;
    const data = (await res.json()) as {
      status?: string;
      results?: GoogleResult[];
    };
    const result = data.status === 'OK' ? data.results?.[0] : undefined;
    if (!result || !isSpecific(result)) return null;
    return {
      latitude: result.geometry.location.lat,
      longitude: result.geometry.location.lng,
      place: result.formatted_address,
    };
  };

  try {
    return (await ask({ components: TROY })) ?? (await ask({}));
  } catch {
    return null;
  }
}
