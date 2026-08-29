import { Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import type { AuthContext } from '../auth/auth-context';
import { NotificationsService } from '../notifications/notifications.service';
import { PrismaService } from '../prisma/prisma.service';

/** What a member needs to be told about their own record, if anything. */
export interface ProfileReviewState {
  outstanding: boolean;
  requestedAt: Date | null;
  confirmedAt: Date | null;
  note: string | null;
  requestedBy: { firstName: string; lastName: string } | null;
}

/**
 * Asking members to check their own details.
 *
 * Contact details rot quietly: a member changes phone or moves off campus and
 * nobody finds out until the night somebody needs to reach them. This is the
 * periodic nudge, addressed either to one person or to everybody.
 *
 * Outstanding means "asked more recently than last confirmed", which needs no
 * separate flag to keep in step — and an answer given between two requests
 * cannot be lost, because it is compared against whichever request is newer.
 */
@Injectable()
export class ProfileReviewService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notifications: NotificationsService,
    private readonly audit: AuditService,
  ) {}

  static isOutstanding(member: {
    profileReviewRequestedAt: Date | null;
    profileConfirmedAt: Date | null;
  }): boolean {
    if (!member.profileReviewRequestedAt) return false;
    if (!member.profileConfirmedAt) return true;
    return member.profileConfirmedAt < member.profileReviewRequestedAt;
  }

  async stateFor(memberId: number): Promise<ProfileReviewState> {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: {
        profileReviewRequestedAt: true,
        profileConfirmedAt: true,
        profileReviewNote: true,
        profileReviewRequestedBy: {
          select: { firstName: true, lastName: true },
        },
      },
    });
    if (!member) throw new NotFoundException('No such member');
    return {
      outstanding: ProfileReviewService.isOutstanding(member),
      requestedAt: member.profileReviewRequestedAt,
      confirmedAt: member.profileConfirmedAt,
      note: member.profileReviewNote,
      requestedBy: member.profileReviewRequestedBy,
    };
  }

  /** The member saying their details are right, which clears the request. */
  async confirm(memberId: number) {
    const member = await this.prisma.member.update({
      where: { id: memberId },
      data: { profileConfirmedAt: new Date() },
      select: { profileConfirmedAt: true },
    });
    // The inbox task goes with it — a to-do that stays after the thing is
    // done is a to-do people learn to ignore.
    await this.notifications.completeTasksAbout(
      { type: 'ProfileReview', id: memberId },
      memberId,
    );
    // Their own act on their own record, so no audit entry: the timestamp on
    // the record is the record of it.
    return { confirmedAt: member.profileConfirmedAt };
  }

  async requestFrom(auth: AuthContext, memberId: number, note?: string) {
    const member = await this.prisma.member.findUnique({
      where: { id: memberId },
      select: { id: true, active: true, firstName: true },
    });
    if (!member) throw new NotFoundException('No such member');

    await this.markRequested(auth, [memberId], note);
    await this.notifyOne(memberId, note);
    await this.audit.log(
      auth,
      'members.profile-review.request',
      'Member',
      memberId,
      {
        note,
      },
    );
    return { asked: 1 };
  }

  /**
   * Everybody who could actually answer.
   *
   * Inactive members are skipped rather than filtered out of the notification
   * afterwards: someone who has left the agency should not be marked as
   * owing the agency a task, and should certainly not be emailed about it.
   */
  async requestFromEveryone(auth: AuthContext, note?: string) {
    const members = await this.prisma.member.findMany({
      where: { active: true },
      select: { id: true },
    });
    const ids = members.map((member) => member.id);
    if (!ids.length) return { asked: 0 };

    await this.markRequested(auth, ids, note);
    for (const memberId of ids) await this.notifyOne(memberId, note);
    await this.audit.log(
      auth,
      'members.profile-review.request-all',
      'Member',
      undefined,
      {
        asked: ids.length,
        note,
      },
    );
    return { asked: ids.length };
  }

  private async markRequested(
    auth: AuthContext,
    memberIds: number[],
    note?: string,
  ) {
    await this.prisma.member.updateMany({
      where: { id: { in: memberIds } },
      data: {
        profileReviewRequestedAt: new Date(),
        profileReviewRequestedById:
          auth.kind === 'member' ? auth.memberId : null,
        profileReviewNote: note?.trim() || null,
      },
    });
  }

  private async notifyOne(memberId: number, note?: string) {
    await this.notifications.notify(memberId, {
      type: 'profile.review-requested',
      subject: 'Please check your profile details',
      body:
        'Have a look at your contact details and confirm they are current. ' +
        'It takes a moment, and it is how anyone reaches you on a bad night.' +
        (note?.trim() ? `\n\n${note.trim()}` : ''),
      task: {
        actionLabel: 'Check my details',
        actionUrl: '/profile',
      },
      about: { type: 'ProfileReview', id: memberId },
    });
  }
}
