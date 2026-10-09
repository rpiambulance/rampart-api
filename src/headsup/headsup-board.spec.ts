import { crewBoard, RIDER_SPARES } from './headsup-board';

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
    // 992 is nobody else's, so it is this rider's — the seat they happen to
    // be in does not make them 993.
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('992');
  });

  // The crew everybody recognises: a chief, a driver and one rider all
  // carrying numbers, and one rider who does not.
  it('gives the only rider without a number the first spare', () => {
    const board = crewBoard([
      {
        position: 'CC',
        placeholder: null,
        member: member('C', 'Chief', '901'),
      },
      {
        position: 'DRIVER',
        placeholder: null,
        member: member('D', 'River', '915'),
      },
      {
        position: 'ATTENDANT',
        placeholder: null,
        member: member('A', 'One', '947'),
      },
      { position: 'OBSERVER', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('992');
    expect(board.filter((s) => s.number === '993')).toHaveLength(0);
  });

  it('gives a lone attendant the first spare too', () => {
    const board = crewBoard([
      { position: 'ATTENDANT', placeholder: null, member: member('A', 'One') },
      {
        position: 'OBSERVER',
        placeholder: null,
        member: member('B', 'Two', '948'),
      },
    ]);
    expect(board.find((s) => s.position === 'ATTENDANT')?.number).toBe('992');
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('948');
  });

  // An empty seat is not somebody waiting for a number.
  it('does not spend a spare on a vacant seat', () => {
    const board = crewBoard([
      { position: 'ATTENDANT', placeholder: null, member: null },
      { position: 'OBSERVER', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'ATTENDANT')?.number).toBeNull();
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('992');
  });

  it('does not spend one on a placeholder either', () => {
    const board = crewBoard([
      { position: 'ATTENDANT', placeholder: 'CLOSED', member: null },
      { position: 'OBSERVER', placeholder: null, member: member('B', 'Two') },
    ]);
    expect(board.find((s) => s.position === 'OBSERVER')?.number).toBe('992');
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
    expect([...RIDER_SPARES]).toEqual(['992', '993']);
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
