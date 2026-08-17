/**
 * Every kind of message the app sends, and who it goes to.
 *
 * Each type is a key an administrator can configure delivery for. The inbox
 * copy is always written — these settings only decide whether a message is
 * *also* pushed out by email or Slack, so turning everything off still leaves
 * a record the member can find.
 */
export interface MessageType {
  key: string;
  label: string;
  description: string;
  /** Who receives it, for grouping in the settings UI. */
  audience: 'member' | 'officers';
  /** Delivery when nothing has been configured. */
  defaults: { email: boolean; slack: boolean };
}

export const MESSAGE_TYPES: MessageType[] = [
  {
    key: 'coverage.received',
    label: 'Coverage request received',
    description: 'An outside group has asked for event coverage.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'crew.unfilled',
    label: 'Crew slot unfilled',
    description: 'A night is approaching without a full crew.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'promotion.requested',
    label: 'Promotion requested',
    description: 'A member has asked to be considered for a credential.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'promotion.vote',
    label: 'Promotion vote progress',
    description: 'A promotion has advanced through the review.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'promotion.decided',
    label: 'Promotion decided',
    description: 'The outcome of a promotion request, to the member.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'promotion.number',
    label: '900 number needed',
    description:
      'A member was promoted by a trainer and needs a 900 number issued.',
    audience: 'officers',
    defaults: { email: true, slack: true },
  },
  {
    key: 'cert.decided',
    label: 'Certification verified or rejected',
    description: 'An officer has reviewed a submitted certification.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'cert.expiring',
    label: 'Certification expiring',
    description: 'A certification is close to lapsing.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'training.outstanding',
    label: 'Annual training outstanding',
    description: 'Required training has not been completed.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'availability.requested',
    label: 'Availability requested',
    description: 'A poll or an event is asking when members can work.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'eval.received',
    label: 'Evaluation to acknowledge',
    description:
      'An evaluation has been written about a member, for them to sign.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
];

export const MESSAGE_TYPE_KEYS = MESSAGE_TYPES.map((t) => t.key);

export const NOTIFICATION_SETTING_KEY = 'notifications.channels';

export type ChannelSettings = Record<
  string,
  { email: boolean; slack: boolean } | undefined
>;

/** Delivery for a type, falling back to its default when unconfigured. */
export function channelsFor(
  settings: ChannelSettings | null,
  type: string,
): { email: boolean; slack: boolean } {
  const configured = settings?.[type];
  if (configured) return configured;
  return (
    MESSAGE_TYPES.find((t) => t.key === type)?.defaults ?? {
      email: true,
      slack: true,
    }
  );
}
