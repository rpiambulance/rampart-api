import { winAnsi } from './standby-pdf';

describe('winAnsi', () => {
  // The bug this exists for: pdfkit's built-in fonts drop everything from
  // the offending character to the end of the line, without complaining.
  it('keeps an arrow from eating the rest of the line', () => {
    expect(winAnsi('M-1: Available → Transporting')).toBe(
      'M-1: Available -> Transporting',
    );
  });

  it('leaves the punctuation the forms actually use alone', () => {
    expect(winAnsi('Standby closed — 3 encounters')).toBe(
      'Standby closed — 3 encounters',
    );
    expect(winAnsi('Treated & released, 14–16 Aug')).toBe(
      'Treated & released, 14–16 Aug',
    );
  });

  it('flattens what a phone keyboard produces', () => {
    expect(winAnsi('Pt’s “fine”…')).toBe(`Pt's "fine"...`);
  });

  it('drops what nothing can draw rather than printing damage', () => {
    expect(winAnsi('Knee 🤕 pain')).toBe('Knee  pain');
  });
});
