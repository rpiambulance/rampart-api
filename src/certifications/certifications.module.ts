import { Module } from '@nestjs/common';
import { ChecklistsModule } from '../checklists/checklists.module';
import { CertificationGraphService } from './certification-graph.service';
import { CertificationsController } from './certifications.controller';
import { CertificationsJobs } from './certifications.jobs';
import { CertificationsService } from './certifications.service';
import { RequirementEvidenceService } from './requirement-evidence.service';
import { RequirementRemindersService } from './requirement-reminders.service';

@Module({
  imports: [ChecklistsModule],
  controllers: [CertificationsController],
  providers: [
    CertificationsService,
    CertificationsJobs,
    CertificationGraphService,
    RequirementEvidenceService,
    RequirementRemindersService,
  ],
  exports: [
    CertificationsService,
    CertificationGraphService,
    RequirementEvidenceService,
  ],
})
export class CertificationsModule {}
