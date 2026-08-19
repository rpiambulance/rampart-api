import { Module } from '@nestjs/common';
import { CertificationGraphService } from './certification-graph.service';
import { CertificationsController } from './certifications.controller';
import { CertificationsJobs } from './certifications.jobs';
import { CertificationsService } from './certifications.service';

@Module({
  controllers: [CertificationsController],
  providers: [
    CertificationsService,
    CertificationsJobs,
    CertificationGraphService,
  ],
  exports: [CertificationsService, CertificationGraphService],
})
export class CertificationsModule {}
