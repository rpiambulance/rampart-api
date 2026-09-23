import type { CredentialGraphService } from '../credentials/credential-graph.service';
import { displayName } from '../common/name';
import { slackIdIn } from '../notifications/slack-id';
import type { PrismaService } from '../prisma/prisma.service';

/** How many names to offer before asking for a narrower search. */
const TOO_MANY = 6;

const CARD = {
  firstName: true,
  preferredFirstName: true,
  lastName: true,
  email: true,
  cellPhone: true,
  credentials: {
    where: { status: 'ACTIVE' as const },
    select: { title: true, type: { select: { key: true, name: true } } },
  },
} as const;

interface Card {
  firstName: string;
  preferredFirstName: string | null;
  lastName: string;
  email: string | null;
  cellPhone: string | null;
  credentials: Array<{
    title: string | null;
    type: { key: string; name: string };
  }>;
}

/** A credential key as people write it: D_T is a D-T on paper and in speech. */
function formatKey(key: string): string {
  return key.replace(/_/g, '-');
}

/**
 * What somebody is, rather than everything they have been signed off on.
 *
 * The top of each branch of the ladder they are on, which for most people
 * is two words — a crew chief side and a driver side. A duty supervisor is
 * one, being above the fork, and says so in whatever the grant is titled:
 * the portal shows a senior supervisor as SDS and this is the same person.
 */
async function summarize(
  graph: CredentialGraphService,
  credentials: Card['credentials'],
): Promise<string[]> {
  const byKey = new Map(credentials.map((held) => [held.type.key, held]));
  const top = await graph.topmostOf(byKey.keys());
  return top.map((key) => {
    const title = byKey.get(key)?.title?.trim();
    // "Senior Duty Supervisor" is initials on a badge everywhere else.
    return title
      ? title
          .split(/\s+/)
          .map((word) => word[0].toUpperCase())
          .join('')
      : formatKey(key);
  });
}

async function card(
  graph: CredentialGraphService,
  member: Card,
  withPhones: boolean,
): Promise<string> {
  const credentials = await summarize(graph, member.credentials);
  const lines = [
    `*${displayName(member)}*`,
    member.email ? `Email: ${member.email}` : 'No email on file.',
    credentials.length
      ? `Credentials: ${credentials.join(', ')}`
      : 'No credentials on file.',
  ];
  if (withPhones) {
    lines.push(
      member.cellPhone ? `Cell: ${member.cellPhone}` : 'No cell on file.',
    );
  }
  return lines.join('\n');
}

/**
 * Looking somebody up from Slack.
 *
 * Answers what a member would otherwise ask the channel for — how do I
 * reach this person, and what can they do — without the channel having to
 * hear the question or the answer.
 *
 * Takes a tagged name as well as a typed one, because tagging somebody is
 * what a person does in Slack when they mean a person. A tag names an
 * account outright and needs no searching; everything else is matched
 * against the roster.
 *
 * A cell phone number is not part of the answer. It is in the portal for
 * people with a reason to have it, and a slash command anybody can run is
 * not a reason, so it is shown only to whoever administers the workspace.
 */
export async function memberInfoReply(
  prisma: PrismaService,
  graph: CredentialGraphService,
  asked: string,
  options: { withPhones: boolean },
): Promise<string> {
  const query = asked.trim();
  if (!query) {
    return 'Who? Try `/memberinfo @somebody` or `/memberinfo Rivera`.';
  }

  const tagged = slackIdIn(query);
  if (tagged) {
    const member = await prisma.member.findFirst({
      where: { slackId: tagged, active: true },
      select: CARD,
    });
    // Knowing exactly who was meant and still having nothing is worth
    // saying plainly, along with the one thing that fixes it.
    return member
      ? await card(graph, member, options.withPhones)
      : `<@${tagged}> is not linked to an active member. They can link themselves with \`/linkme\`.`;
  }

  // Typed rather than tagged. A leading @ is somebody tagging in a workspace
  // whose app is not set to escape mentions, so what arrives is the display
  // name they typed — worth trying against the roster, and no more.
  const name = query.replace(/^@/, '').trim();
  const like = { contains: name, mode: 'insensitive' as const };
  const matches = await prisma.member.findMany({
    where: {
      active: true,
      OR: [
        { firstName: like },
        { preferredFirstName: like },
        { lastName: like },
      ],
    },
    orderBy: [{ lastName: 'asc' }, { firstName: 'asc' }],
    select: CARD,
    take: TOO_MANY + 1,
  });

  if (!matches.length) {
    return `Nobody active goes by “${name}”. Try the name as the roster has it.`;
  }

  // A search matching half the roster is a search, not an answer: naming
  // them is more use than picking one and hoping.
  if (matches.length > 1) {
    if (matches.length > TOO_MANY) {
      return `Too many people match “${name}”. Try more of the name.`;
    }
    return [
      `${matches.length} people match “${name}”:`,
      ...matches.map((member) => `• ${displayName(member)}`),
    ].join('\n');
  }

  return card(graph, matches[0], options.withPhones);
}
