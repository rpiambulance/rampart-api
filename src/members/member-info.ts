import { displayName } from '../common/name';
import type { PrismaService } from '../prisma/prisma.service';

/** How many names to offer before asking for a narrower search. */
const TOO_MANY = 6;

/** A credential key as people write it: D_T is a D-T on paper and in speech. */
function formatKey(key: string): string {
  return key.replace(/_/g, '-');
}

/**
 * Looking somebody up from Slack.
 *
 * Answers what a member would otherwise ask the channel for — how do I
 * reach this person, and what can they do — without the channel having to
 * hear the question or the answer.
 *
 * A cell phone number is not part of that. It is in the portal for people
 * with a reason to have it, and a slash command anybody can run is not a
 * reason, so it is shown only to whoever administers the workspace.
 */
export async function memberInfoReply(
  prisma: PrismaService,
  asked: string,
  options: { withPhones: boolean },
): Promise<string> {
  const query = asked.trim();
  if (!query) {
    return 'Who? Try `/memberinfo Rivera`.';
  }

  const like = { contains: query, mode: 'insensitive' as const };
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
    select: {
      firstName: true,
      preferredFirstName: true,
      lastName: true,
      email: true,
      cellPhone: true,
      credentials: {
        where: { status: 'ACTIVE' },
        select: { type: { select: { key: true, name: true } } },
      },
    },
    take: TOO_MANY + 1,
  });

  if (!matches.length) {
    return `Nobody active goes by “${query}”.`;
  }

  // A search matching half the roster is a search, not an answer: naming
  // them is more use than picking one and hoping.
  if (matches.length > 1) {
    if (matches.length > TOO_MANY) {
      return `Too many people match “${query}”. Try more of the name.`;
    }
    return [
      `${matches.length} people match “${query}”:`,
      ...matches.map((member) => `• ${displayName(member)}`),
    ].join('\n');
  }

  const member = matches[0];
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
  if (options.withPhones) {
    lines.push(
      member.cellPhone ? `Cell: ${member.cellPhone}` : 'No cell on file.',
    );
  }
  return lines.join('\n');
}
