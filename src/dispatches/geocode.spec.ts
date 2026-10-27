import { geocode, isSpecific } from './geocode';

type Reply = { status: string; results?: unknown[] };

const result = (types: string[], place = '51 College Ave, Troy, NY') => ({
  formatted_address: place,
  types,
  geometry: { location: { lat: 42.7298, lng: -73.6789 } },
});

/** Answers each request in turn, and remembers what was asked. */
function fakeFetch(replies: Array<Reply | 'http-error' | 'throw'>) {
  const asked: string[] = [];
  const impl = ((url: string) => {
    asked.push(url);
    const next = replies.shift();
    if (next === 'throw') return Promise.reject(new Error('network down'));
    if (next === 'http-error' || !next) {
      return Promise.resolve({ ok: false, json: () => Promise.resolve({}) });
    }
    return Promise.resolve({ ok: true, json: () => Promise.resolve(next) });
  }) as unknown as typeof fetch;
  return { impl, asked };
}

describe('placing an address on the map', () => {
  it('asks for Troy first, as Herald does', async () => {
    const { impl, asked } = fakeFetch([
      { status: 'OK', results: [result(['street_address'])] },
    ]);
    const found = await geocode('51 College Ave', 'key', impl);
    expect(found).toEqual({
      latitude: 42.7298,
      longitude: -73.6789,
      place: '51 College Ave, Troy, NY',
    });
    expect(asked).toHaveLength(1);
    expect(decodeURIComponent(asked[0])).toContain(
      'components=locality:Troy|administrative_area:NY|country:US',
    );
  });

  it('tries anywhere when Troy has nothing', async () => {
    const { impl, asked } = fakeFetch([
      { status: 'ZERO_RESULTS', results: [] },
      { status: 'OK', results: [result(['premise'], 'Brunswick, NY')] },
    ]);
    expect((await geocode('Somewhere', 'key', impl))?.place).toBe(
      'Brunswick, NY',
    );
    expect(asked[1]).not.toContain('components');
  });

  // A pin in the middle of town looks exactly like a pin at the call.
  it('will not give the town for an address it could not find', async () => {
    const { impl } = fakeFetch([
      { status: 'OK', results: [result(['locality', 'political'], 'Troy')] },
      { status: 'OK', results: [result(['postal_code'], '12180')] },
    ]);
    expect(await geocode('Nowhere St', 'key', impl)).toBeNull();
  });

  it('knows a place from an area', () => {
    expect(isSpecific({ types: ['street_address'] })).toBe(true);
    expect(isSpecific({ types: ['establishment', 'point_of_interest'] })).toBe(
      true,
    );
    expect(isSpecific({ types: ['locality', 'political'] })).toBe(false);
    expect(isSpecific({ types: [] })).toBe(false);
  });

  // A call is filed whether or not the map could be found.
  it('never throws', async () => {
    expect(await geocode('x', 'key', fakeFetch(['throw']).impl)).toBeNull();
    expect(
      await geocode('x', 'key', fakeFetch(['http-error', 'http-error']).impl),
    ).toBeNull();
  });
});
