/**
 * The events an outside system can subscribe to.
 *
 * Named and described here rather than assembled from strings at each call
 * site, so the console can offer a list and a typo cannot silently create an
 * event nobody receives.
 */
export interface WebhookEvent {
  key: string;
  label: string;
  description: string;
}

export const WEBHOOK_EVENTS: WebhookEvent[] = [
  {
    key: 'dispatch.received',
    label: 'Dispatch received',
    description: 'A call came in from Herald.',
  },
  {
    key: 'crew.assigned',
    label: 'Crew slot filled',
    description: 'Somebody took, or was placed in, a night crew seat.',
  },
  {
    key: 'crew.vacated',
    label: 'Crew slot vacated',
    description: 'A night crew seat was given up or cleared.',
  },
  {
    key: 'crew.out-of-service',
    label: 'Night marked out of service',
    description: 'A night was taken out of service, or put back in.',
  },
  {
    key: 'event.approved',
    label: 'Event approved',
    description: 'A coverage request became a published event.',
  },
  {
    key: 'event.declined',
    label: 'Event declined',
    description: 'A coverage request was turned down.',
  },
  {
    key: 'coverage.requested',
    label: 'Coverage requested',
    description: 'Somebody outside the agency asked for coverage.',
  },
  {
    key: 'member.deactivated',
    label: 'Member deactivated',
    description: 'A member was made inactive.',
  },
  {
    key: 'credential.granted',
    label: 'Credential granted',
    description: 'A member was promoted or cleared for calls.',
  },
  {
    key: 'certification.expiring',
    label: 'Certification expiring',
    description: 'A verified certification is coming up for renewal.',
  },
  {
    key: 'chore.completed',
    label: 'Chore completed',
    description: 'Somebody marked a chore done.',
  },
];

export const WEBHOOK_EVENT_KEYS = WEBHOOK_EVENTS.map((event) => event.key);
