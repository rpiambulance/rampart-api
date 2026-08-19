/**
 * Slack configuration, held in AppSetting rather than the environment.
 *
 * Channels move as an agency reorganises its workspace, and asking someone to
 * redeploy to change where a message lands is the wrong shape of task. The
 * environment is still read as a fallback so an existing deployment keeps
 * working until somebody saves settings in the console.
 */
export const SLACK_SETTING_KEY = 'slack.config';

export interface SlackChannel {
  /** Stable identifier used in code; never shown. */
  key: string;
  label: string;
  description: string;
  /** Environment variable consulted when nothing is saved. */
  envVar: string;
}

export const SLACK_CHANNELS: SlackChannel[] = [
  {
    key: 'officers',
    label: 'Officers',
    description:
      'Anything addressed to officers as a group: coverage requests, promotions, unfilled crew slots.',
    envVar: 'SLACK_OFFICERS_CHANNEL',
  },
  {
    key: 'whoson',
    label: "Who's on tonight",
    description: 'The nightly crew post, and where /whoson replies publicly.',
    envVar: 'SLACK_WHOSON_CHANNEL',
  },
  {
    key: 'chores',
    label: 'Chores',
    description:
      'Chore assignments, and the buttons members press to claim them.',
    envVar: 'SLACK_CHORES_CHANNEL',
  },
  {
    key: 'dispatches',
    label: 'Dispatches',
    description:
      'Live call notifications, if you want them mirrored into Slack.',
    envVar: 'SLACK_DISPATCH_CHANNEL',
  },
];

export interface SlackConfig {
  botToken?: string | null;
  /** For verifying that inbound requests really came from Slack. */
  signingSecret?: string | null;
  channels: Record<string, string | null>;
}
