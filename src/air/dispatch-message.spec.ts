import {
  addressOf,
  dispatchBlocks,
  fallbackText,
  navigationLinks,
  type DispatchDetail,
} from './dispatch-message';

/** Herald's own example payload, as Rampart stores it. */
const geocoded = (over: Partial<DispatchDetail> = {}): DispatchDetail => ({
  determinant: 'Alpha',
  complaint: 'Falls',
  location:
    'Darrin Communications Center (DCC) - 51 College Ave, Troy, NY 12180, USA',
  business: 'Darrin Communications Center (DCC)',
  additionalInfo: 'RM 308',
  crossStreets: '13TH ST / 8TH ST',
  units: 'E59',
  latitude: 42.7298,
  longitude: -73.6789,
  geocodedPlace: '51 College Ave, Troy, NY 12180, USA',
  ...over,
});

type Block = {
  type: string;
  text?: { text: string };
  elements?: Array<{ text: { text: string }; url: string }>;
};
const blocksOf = (d: DispatchDetail) => dispatchBlocks(d) as Block[];
const textOf = (d: DispatchDetail) =>
  blocksOf(d)
    .map((b) => b.text?.text ?? '')
    .join('\n');

describe('a dispatch as Slack shows it', () => {
  it('leads with the call type, as Herald does', () => {
    const [header] = blocksOf(geocoded());
    expect(header.type).toBe('header');
    expect(header.text?.text).toBe('Call received: Alpha - Falls');
  });

  it('gives location, business, cross streets and additional info', () => {
    const text = textOf(geocoded());
    expect(text).toContain('*Location:* 51 College Ave, Troy, NY 12180, USA');
    expect(text).toContain('*Business:* Darrin Communications Center (DCC)');
    expect(text).toContain('*Cross Streets:* 13TH ST / 8TH ST');
    expect(text).toContain('*Additional Info:* RM 308');
    expect(text).toContain('*Units:* E59');
  });

  // Herald forwards "<business> - <address>" once it has geocoded; the
  // business has its own line.
  it('does not say the business twice', () => {
    expect(addressOf(geocoded())).toBe('51 College Ave, Troy, NY 12180, USA');
    expect(addressOf(geocoded({ business: null }))).toContain(
      'Darrin Communications Center (DCC) - ',
    );
  });

  it('says N/A for what dispatch did not give, as Herald does', () => {
    const text = textOf(
      geocoded({ business: null, crossStreets: null, additionalInfo: '  ' }),
    );
    expect(text).toContain('*Business:* N/A');
    expect(text).toContain('*Cross Streets:* N/A');
    expect(text).toContain('*Additional Info:* N/A');
  });

  it('leaves the units line out rather than saying N/A', () => {
    expect(textOf(geocoded({ units: null }))).not.toContain('Units');
  });

  describe('directions', () => {
    it('drives to the coordinates when there are any', () => {
      const links = navigationLinks(geocoded());
      expect(links?.apple).toBe(
        'https://maps.apple.com/?daddr=42.7298,-73.6789',
      );
      expect(links?.google).toBe(
        'https://www.google.com/maps/dir/?api=1&destination=42.7298,-73.6789',
      );
      const buttons = blocksOf(geocoded()).find((b) => b.type === 'actions');
      expect(buttons?.elements?.map((e) => e.text.text)).toEqual([
        'Apple Maps',
        'Google Maps',
      ]);
    });

    // Herald had no buttons at all for a call it could not geocode.
    it('falls back to the address when nothing was geocoded', () => {
      const links = navigationLinks(
        geocoded({
          latitude: null,
          longitude: null,
          geocodedPlace: null,
          location: '51 COLLEGE AVE, TROY',
          business: null,
        }),
      );
      expect(links?.google).toBe(
        'https://www.google.com/maps/dir/?api=1&destination=51%20COLLEGE%20AVE%2C%20TROY',
      );
    });

    it('treats a coordinate of zero as a coordinate', () => {
      expect(
        navigationLinks(geocoded({ latitude: 0, longitude: 0 }))?.apple,
      ).toBe('https://maps.apple.com/?daddr=0,0');
    });

    it('offers none when there is nowhere to go', () => {
      const nowhere = geocoded({
        latitude: null,
        longitude: null,
        geocodedPlace: null,
        location: null,
      });
      expect(navigationLinks(nowhere)).toBeNull();
      expect(blocksOf(nowhere).some((b) => b.type === 'actions')).toBe(false);
    });

    // Herald printed the geocoded address so a misplaced pin could be
    // caught against what dispatch said — useful only when they differ.
    it('shows the geocoded address only when it adds something', () => {
      expect(textOf(geocoded())).toContain('Navigate:');
      expect(textOf(geocoded())).not.toContain('Navigate:\n51 College Ave');
      expect(
        textOf(geocoded({ location: '51 COLLEGE', business: null })),
      ).toContain('Navigate:\n51 College Ave, Troy, NY 12180, USA');
    });
  });

  it('says it the way a lock screen can read', () => {
    expect(fallbackText(geocoded())).toBe(
      'ALPHA falls at 51 College Ave, Troy, NY 12180, USA',
    );
    expect(fallbackText(geocoded({ location: null }))).toBe('ALPHA falls');
  });

  // An angle bracket in a note would otherwise become a broken link.
  it('escapes what Slack would read as markup', () => {
    expect(textOf(geocoded({ additionalInfo: 'R&D <rear> door' }))).toContain(
      'R&amp;D &lt;rear&gt; door',
    );
  });

  // Slack rejects the whole message, not one block, over these limits.
  it('stays inside what Slack will accept', () => {
    const long = geocoded({
      complaint: 'x'.repeat(400),
      additionalInfo: 'y'.repeat(5000),
    });
    const blocks = blocksOf(long);
    expect(blocks[0].text!.text.length).toBeLessThanOrEqual(150);
    for (const block of blocks) {
      expect((block.text?.text ?? '').length).toBeLessThanOrEqual(3000);
    }
  });
});
