import { displayName, firstNameOf, initialAndSurname } from './name';

describe('what to call somebody', () => {
  it('uses the preferred name when there is one', () => {
    expect(
      displayName({
        firstName: 'Daniel',
        preferredFirstName: 'Alex',
        lastName: 'Rivera',
      }),
    ).toBe('Alex Rivera');
  });

  it('falls back to the legal name when there is not', () => {
    expect(displayName({ firstName: 'Daniel', lastName: 'Rivera' })).toBe(
      'Daniel Rivera',
    );
  });

  // A member who clears the box leaves an empty string behind, not a null,
  // and being addressed as " Rivera" is worse than being addressed legally.
  it.each([null, undefined, '', '   '])(
    'treats %p as no preferred name at all',
    (value) => {
      expect(
        firstNameOf({ firstName: 'Daniel', preferredFirstName: value }),
      ).toBe('Daniel');
    },
  );

  it('trims a preferred name that was typed with a space', () => {
    expect(firstNameOf({ firstName: 'Daniel', preferredFirstName: ' Alex ' })).toBe(
      'Alex',
    );
  });

  // Narrow selects are common, and a trailing space would show on the board.
  it('copes with only half a name selected', () => {
    expect(displayName({ firstName: 'Daniel' })).toBe('Daniel');
    expect(
      displayName({ firstName: 'Daniel', preferredFirstName: 'Alex' }),
    ).toBe('Alex');
  });

  it('initials the preferred name for the crew board', () => {
    expect(
      initialAndSurname({
        firstName: 'Daniel',
        preferredFirstName: 'Alex',
        lastName: 'Rivera',
      }),
    ).toBe('A. Rivera');
  });
});
