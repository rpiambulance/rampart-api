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
    key: 'credential.suspension-warning',
    label: 'Your credential is at risk',
    description:
      'An officer has warned a member that a certification they hold is out ' +
      'of date and a credential depends on it.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'checksheet.completed',
    label: 'Checksheet completed',
    description: 'Somebody finished a truck, bag or equipment check.',
    audience: 'officers',
    defaults: { email: false, slack: true },
  },
  {
    key: 'checksheet.expiring',
    label: 'Something on a checksheet is expiring',
    description:
      'An item logged with an expiry date is close to its date, or past it.',
    audience: 'officers',
    defaults: { email: true, slack: true },
  },
  {
    key: 'profile.review-requested',
    label: 'Check your profile details',
    description:
      'An officer has asked members to confirm their contact details are current.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'cert.submitted',
    label: 'Certification awaiting verification',
    description:
      'A member submitted a certification that somebody needs to check.',
    audience: 'officers',
    defaults: { email: false, slack: false },
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
    key: 'eval.requested',
    label: 'Evaluation to fill in',
    description:
      'A trainee has asked a trainer to evaluate them, and it is waiting on the trainer.',
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
  {
    key: 'credential.mass-suspension',
    label: 'Mass credential suspension stopped',
    description:
      'More credentials failed an ongoing requirement in one night than looks like ordinary lapses, so nothing was changed.',
    audience: 'officers',
    defaults: { email: true, slack: true },
  },
  {
    key: 'checklist.started',
    label: 'Checklist to work through',
    description: 'A trainer has started a member on a checklist.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'checklist.complete',
    label: 'Checklist finished',
    description: 'Every line of a training checklist has been signed off.',
    audience: 'member',
    defaults: { email: true, slack: true },
  },
  {
    key: 'checklist.complete.officers',
    label: 'A checklist was finished',
    description:
      'A member has finished a checklist, which may unlock a credential.',
    audience: 'officers',
    defaults: { email: true, slack: true },
  },
  {
    key: 'checklist.revoked',
    label: 'Checklist sign-off withdrawn',
    description:
      'A line that had been signed off has been un-signed and needs doing again.',
    audience: 'member',
    defaults: { email: true, slack: false },
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
