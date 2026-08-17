import { Module } from '@nestjs/common';
import { CertificationsModule } from '../certifications/certifications.module';
import { ChecklistsModule } from '../checklists/checklists.module';
import { CredentialsController } from './credentials.controller';
import { CredentialsService } from './credentials.service';

@Module({
  imports: [CertificationsModule, ChecklistsModule],
  controllers: [CredentialsController],
  providers: [CredentialsService],
  exports: [CredentialsService],
})
export class CredentialsModule {}
