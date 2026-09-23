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
    select: { type: { select: { key: true, name: true } } },
  },
} as const;

interface Card {
  firstName: string;
  preferredFirstName: string | null;
  lastName: string;
  email: string | null;
  cellPhone: string | null;
  credentials: Array<{ type: { key: string; name: string } }>;
}

/** A credential key as people write it: D_T is a D-T on paper and in speech. */
function formatKey(key: string): string {
  return key.replace(/_/g, '-');
}

function card(member: Card, withPhones: boolean): string {
  const credentials = member.credentials
    .map((held) => formatKey(held.type.key))
    .sort();
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
      ? card(member, options.withPhones)
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

  return card(matches[0], options.withPhones);
}
