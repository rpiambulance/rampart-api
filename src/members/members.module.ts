import { Module } from '@nestjs/common';
import { CertificationsModule } from '../certifications/certifications.module';
import { MembersController } from './members.controller';
import { MembersService } from './members.service';
import { ProfileReviewService } from './profile-review.service';

@Module({
  imports: [CertificationsModule],
  controllers: [MembersController],
  providers: [MembersService, ProfileReviewService],
  exports: [MembersService, ProfileReviewService],
})
export class MembersModule {}
