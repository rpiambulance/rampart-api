import { Module } from '@nestjs/common';
import { CertificationsController } from './certifications.controller';
import { CertificationsJobs } from './certifications.jobs';
import { CertificationsService } from './certifications.service';

@Module({
  controllers: [CertificationsController],
  providers: [CertificationsService, CertificationsJobs],
  exports: [CertificationsService],
})
export class CertificationsModule {}
