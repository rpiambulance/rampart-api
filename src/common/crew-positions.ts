import type { CrewPosition } from '../generated/prisma/enums';

/**
 * Human labels for crew positions. The stored values are enum constants
 * (DUTY_SUP), which should never reach a member's screen or calendar.
 */
export const CREW_POSITION_LABELS: Record<CrewPosition, string> = {
  CC: 'Crew Chief',
  DRIVER: 'Driver',
  ATTENDANT: 'Attendant',
  OBSERVER: 'Observer',
  DUTY_SUP: 'Duty Supervisor',
};

export function crewPositionLabel(position: string): string {
  return (
    CREW_POSITION_LABELS[position as CrewPosition] ??
    position
      .toLowerCase()
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ')
  );
}
