import { NotificationsService } from './notifications.service';

/**
 * What a send reports back.
 *
 * The inbox copy is written whatever happens, so a count of notifications is
 * always a success story. These are the four outcomes that tell somebody
 * whether their message actually reached anybody.
 */
function serviceWith(options: {
  member: { email: string | null; slackId: string | null } | null;
  emailWorks?: boolean;
  slackWorks?: boolean;
}) {
  const prisma = {
    inboxMessage: { create: () => Promise.resolve({ id: 1 }) },
    member: { findUnique: () => Promise.resolve(options.member) },
    appSetting: { findUnique: () => Promise.resolve(null) },
  };
  const slack = {
    postTo: () => Promise.resolve(options.slackWorks ?? false),
  };
  const service = new NotificationsService(
    prisma as never,
    slack as never,
    { get: () => undefined } as never,
  );
  // The mail transport is settings-driven and not worth standing up here;
  // what matters is how its answer is reported.
  service.sendEmail = () => Promise.resolve(options.emailWorks ?? false);
  return service;
}

const notice = {
  type: 'credential.suspension-warning',
  subject: 'Your credential is at risk',
  body: 'Upload your card.',
};

describe('delivery reporting', () => {
  it('says sent when both channels accepted it', async () => {
    const service = serviceWith({
      member: { email: 'a@b.test', slackId: 'U01ABCDEFGH' },
      emailWorks: true,
      slackWorks: true,
    });
    const { delivery } = await service.notifyReporting(1, notice, {
      email: true,
      slack: true,
    });
    expect(delivery).toEqual({ email: 'sent', slack: 'sent' });
  });

  it('says failed when a channel was tried and refused', async () => {
    const service = serviceWith({
      member: { email: 'a@b.test', slackId: 'U01ABCDEFGH' },
      emailWorks: false,
      slackWorks: false,
    });
    const { delivery } = await service.notifyReporting(1, notice, {
      email: true,
      slack: true,
    });
    expect(delivery).toEqual({ email: 'failed', slack: 'failed' });
  });

  it('tells "nowhere to send" apart from "tried and failed"', async () => {
    // The distinction the sender acts on: a failure is worth retrying, an
    // unlinked Slack account is worth linking.
    const service = serviceWith({
      member: { email: 'a@b.test', slackId: null },
      emailWorks: true,
    });
    const { delivery } = await service.notifyReporting(1, notice, {
      email: true,
      slack: true,
    });
    expect(delivery).toEqual({ email: 'sent', slack: 'no-destination' });
  });

  it('treats a Slack handle left by the legacy import as no destination', async () => {
    // Only an id can be messaged; a handle would post to a channel that does
    // not exist, so it is not attempted and must not be reported as sent.
    const service = serviceWith({
      member: { email: null, slackId: '@casey' },
      slackWorks: true,
    });
    const { delivery } = await service.notifyReporting(1, notice, {
      email: true,
      slack: true,
    });
    expect(delivery).toEqual({
      email: 'no-destination',
      slack: 'no-destination',
    });
  });

  it('marks a channel nobody asked for as not chosen', async () => {
    const service = serviceWith({
      member: { email: 'a@b.test', slackId: 'U01ABCDEFGH' },
      emailWorks: true,
    });
    const { delivery } = await service.notifyReporting(1, notice, {
      email: true,
      slack: false,
    });
    expect(delivery).toEqual({ email: 'sent', slack: 'not-requested' });
  });
});
