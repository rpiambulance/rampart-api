import { crewBoard, RIDER_FALLBACKS } from './headsup-board';

const member = (
  firstName: string,
  lastName: string,
  nineHundredNumber: string | null = null,
  preferredFirstName: string | null = null,
) => ({ firstName, lastName, nineHundredNumber, preferredFirstName });

describe('the crew on the board', () => {
  it('shows every seat, filled or not', () => {
    const board = crewBoard([
      {
        position: 'CC',
        placeholder: null,
        member: member('Dana', 'Reilly', '901'),
      },
    ]);
    expect(board).toHaveLength(5);
    expect(board.map((seat) => seat.position)).toEqual([
      'CC',
      'DRIVER',
      'ATTENDANT',
      'OBSERVER',
      'DUTY_SUP',
    ]);
    expect(board[0]).toMatchObject({
      name: 'Dana Reilly',
      number: '901',
      vacant: false,
    });
    expect(board[1]).toMatchObject({ name: null, vacant: true });
  });

  it('calls people what they go by', () => {
    const [cc] = crewBoard([
      {
        position: 'CC',
        placeholder: null,
        member: member('Daniel', 'Reilly', '901', 'Alex'),
      },
    ]);
    expect(cc.name).toBe('Alex Reilly');
  });

  // The riders have to be addressable on the radio even when they have no
  // number of their own, and the two must not collide.
  it('gives riders without a number the station spares, in order', () => {
    const board = crewBoard([
      { position: 'ATTENDANT', placeholder: null, member: member('A', 'One') },
      { position: 'OBSERVER', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'ATTENDANT')?.number).toBe('992');
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('993');
  });

  it('leaves a rider with a real number alone', () => {
    const board = crewBoard([
      {
        position: 'ATTENDANT',
        placeholder: null,
        member: member('A', 'One', '947'),
      },
      { position: 'OBSERVER', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'ATTENDANT')?.number).toBe('947');
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('993');
  });

  it('treats a blank number as no number', () => {
    const board = crewBoard([
      {
        position: 'ATTENDANT',
        placeholder: null,
        member: member('A', 'One', '   '),
      },
    ]);
    expect(board.find((s) => s.position === 'ATTENDANT')?.number).toBe('992');
  });

  // The spares are for riders. A crew chief without a number gets nothing
  // invented for them rather than borrowing a rider's.
  it('invents nothing for the seats that have no spare', () => {
    const board = crewBoard([
      { position: 'CC', placeholder: null, member: member('A', 'One') },
      { position: 'DUTY_SUP', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'CC')?.number).toBeNull();
    expect(board.find((s) => s.position === 'DUTY_SUP')?.number).toBeNull();
    expect(Object.keys(RIDER_FALLBACKS)).toEqual(['ATTENDANT', 'OBSERVER']);
  });

  it('shows a placeholder as written, and does not call it vacant', () => {
    const board = crewBoard([
      { position: 'DRIVER', placeholder: 'CLOSED', member: null },
    ]);
    expect(board.find((s) => s.position === 'DRIVER')).toMatchObject({
      name: 'CLOSED',
      vacant: false,
    });
  });
});
