import type { DispatchDetail } from './dispatch-message';
import { callType } from './dispatch-message';
import { mergeMessages, samePlace } from './dispatch-updates';

const message = (over: Partial<DispatchDetail> = {}): DispatchDetail => ({
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
  ...over,
});

/** What Herald forwards when the first message has only a location. */
const locationOnly = message({
  determinant: 'Unknown',
  complaint: 'Unknown',
  location:
    'Russell Sage Dining Hall (RPI) - 1649 15th St, Troy, NY 12180, USA',
  business: 'Russell Sage Dining Hall (RPI)',
  crossStreets: 'Bouton Road/Sage Avenue',
  latitude: 42.729787,
  longitude: -73.678242,
  geocodedPlace: '1649 15th St, Troy, NY 12180, USA',
});

/** And the second, a minute later, with the call type. */
const withCallType = message({
  ...locationOnly,
  determinant: 'Bravo',
  complaint: 'Falls',
  crossStreets: null,
  units: 'RE59',
});

describe('whether two messages are about the same place', () => {
  it('matches the same address', () => {
    expect(samePlace(locationOnly, withCallType)).toBe(true);
  });

  // Herald rewrites a location once it has geocoded it; a message whose
  // lookup failed keeps the bare text.
  it('matches the bare address against the geocoded one', () => {
    expect(
      samePlace(
        message({ location: '1649 15TH ST' }),
        message({
          location: 'Russell Sage Dining Hall (RPI) - 1649 15th St, Troy, NY',
          business: 'Russell Sage Dining Hall (RPI)',
        }),
      ),
    ).toBe(true);
  });

  it('matches points a few doors apart', () => {
    expect(
      samePlace(
        message({ latitude: 42.729787, longitude: -73.678242 }),
        message({ latitude: 42.73015, longitude: -73.678242 }),
      ),
    ).toBe(true);
  });

  it('does not match a different address', () => {
    expect(
      samePlace(locationOnly, message({ location: '110 8th St, Troy, NY' })),
    ).toBe(false);
  });

  it('does not match points a street apart', () => {
    expect(
      samePlace(
        message({ latitude: 42.729787, longitude: -73.678242 }),
        message({ latitude: 42.7325, longitude: -73.678242 }),
      ),
    ).toBe(false);
  });

  // A town name is not an address, and would otherwise contain them all.
  it('does not treat a bare street name as every number on it', () => {
    expect(
      samePlace(
        message({ location: '15th St' }),
        message({ location: '15th St, Troy, NY' }),
      ),
    ).toBe(false);
  });

  it('does not match two messages with nowhere in them', () => {
    expect(samePlace(message(), message())).toBe(false);
  });
});

describe('a call as all its messages describe it', () => {
  it('takes the call type from the message that gave it', () => {
    const call = mergeMessages([locationOnly, withCallType]);
    expect(call.determinant).toBe('Bravo');
    expect(call.complaint).toBe('Falls');
    expect(callType(call)).toBe('Bravo - Falls');
  });

  it('keeps what a later message left blank', () => {
    const call = mergeMessages([locationOnly, withCallType]);
    expect(call.crossStreets).toBe('Bouton Road/Sage Avenue');
    expect(call.units).toBe('RE59');
  });

  // Herald's "Unknown" is dispatch not having said, not dispatch saying so.
  it('does not let Unknown overwrite a real call type', () => {
    const call = mergeMessages([withCallType, locationOnly]);
    expect(callType(call)).toBe('Bravo - Falls');
  });

  it('says so when no message has given a call type', () => {
    expect(callType(mergeMessages([locationOnly]))).toBe('type not given yet');
  });

  it('takes a point on the map whole', () => {
    const moved = message({
      latitude: 42.8,
      longitude: -73.7,
      geocodedPlace: 'Somewhere else',
    });
    const call = mergeMessages([locationOnly, moved]);
    expect([call.latitude, call.longitude, call.geocodedPlace]).toEqual([
      42.8,
      -73.7,
      'Somewhere else',
    ]);
  });
});
