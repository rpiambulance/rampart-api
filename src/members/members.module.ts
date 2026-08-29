import { Module } from '@nestjs/common';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { ProfileReviewService } from './profile-review.service';

@Module({
  controllers: [MembersController],
  providers: [MembersService, ProfileReviewService],
  exports: [MembersService, ProfileReviewService],
})
export class MembersModule {}
