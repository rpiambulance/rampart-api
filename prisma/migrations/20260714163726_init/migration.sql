-- CreateEnum
CREATE TYPE "CertStatus" AS ENUM ('PENDING_VERIFICATION', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "GrantMethod" AS ENUM ('PROMOTION', 'APPOINTMENT');

-- CreateEnum
CREATE TYPE "RequirementKind" AS ENUM ('CERTIFICATION', 'EVALUATION_COUNT', 'CLASS');

-- CreateEnum
CREATE TYPE "CredentialStatus" AS ENUM ('ACTIVE', 'SUSPENDED', 'REVOKED');

-- CreateEnum
CREATE TYPE "ScoreType" AS ENUM ('SCALE_1_5', 'PASS_FAIL', 'TEXT');

-- CreateEnum
CREATE TYPE "EvalStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'SIGNED');

-- CreateEnum
CREATE TYPE "PromoStatus" AS ENUM ('PENDING', 'IN_VOTE', 'TC_APPROVED', 'APPROVED', 'DENIED', 'WITHDRAWN');

-- CreateEnum
CREATE TYPE "VoteChoice" AS ENUM ('APPROVE', 'DENY');

-- CreateEnum
CREATE TYPE "CrewPosition" AS ENUM ('CC', 'DRIVER', 'ATTENDANT', 'OBSERVER', 'DUTY_SUP');

-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('REGISTERED', 'ATTENDED', 'COMPLETED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "IcsScope" AS ENUM ('MY_SCHEDULE', 'MY_SCHEDULE_AND_ALL_EVENTS');

-- CreateEnum
CREATE TYPE "ActorType" AS ENUM ('MEMBER', 'API_TOKEN', 'SYSTEM');

-- CreateTable
CREATE TABLE "Member" (
    "id" SERIAL NOT NULL,
    "legacyId" INTEGER,
    "keycloakSubject" TEXT,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dob" DATE,
    "email" TEXT NOT NULL,
    "personalEmail" TEXT,
    "cellPhone" TEXT,
    "homePhone" TEXT,
    "localAddress" TEXT,
    "homeAddress" TEXT,
    "rcsId" TEXT,
    "rin" TEXT,
    "facilityId" TEXT,
    "cardId" TEXT,
    "slackId" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "isOfficer" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "roleId" INTEGER NOT NULL,
    "permission" TEXT NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("roleId","permission")
);

-- CreateTable
CREATE TABLE "MemberRole" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "roleId" INTEGER NOT NULL,
    "startDate" DATE NOT NULL,
    "endDate" DATE,

    CONSTRAINT "MemberRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "issuingOrg" TEXT,
    "defaultValidityMonths" INTEGER,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CertificationType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberCertification" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "identifier" TEXT,
    "issuedAt" DATE,
    "expiresAt" DATE,
    "status" "CertStatus" NOT NULL DEFAULT 'PENDING_VERIFICATION',
    "verifiedById" INTEGER,
    "verifiedAt" TIMESTAMP(3),
    "rejectionReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MemberCertification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CertificationDocument" (
    "id" SERIAL NOT NULL,
    "certificationId" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "contentType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CertificationDocument_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredentialType" (
    "id" SERIAL NOT NULL,
    "key" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "grantMethod" "GrantMethod" NOT NULL DEFAULT 'PROMOTION',
    "isAddOn" BOOLEAN NOT NULL DEFAULT false,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "CredentialType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CredentialPrerequisite" (
    "credentialTypeId" INTEGER NOT NULL,
    "requiresTypeId" INTEGER NOT NULL,

    CONSTRAINT "CredentialPrerequisite_pkey" PRIMARY KEY ("credentialTypeId","requiresTypeId")
);

-- CreateTable
CREATE TABLE "CredentialRequirement" (
    "id" SERIAL NOT NULL,
    "credentialTypeId" INTEGER NOT NULL,
    "kind" "RequirementKind" NOT NULL,
    "certificationTypeId" INTEGER,
    "evalTemplateId" INTEGER,
    "count" INTEGER,
    "classId" INTEGER,

    CONSTRAINT "CredentialRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberCredential" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "typeId" INTEGER NOT NULL,
    "status" "CredentialStatus" NOT NULL DEFAULT 'ACTIVE',
    "title" TEXT,
    "grantedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "grantedViaId" INTEGER,
    "revokedAt" TIMESTAMP(3),

    CONSTRAINT "MemberCredential_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalFormTemplate" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "version" INTEGER NOT NULL DEFAULT 1,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EvalFormTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalFormItem" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "prompt" TEXT NOT NULL,
    "scoreType" "ScoreType" NOT NULL,

    CONSTRAINT "EvalFormItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Evaluation" (
    "id" SERIAL NOT NULL,
    "templateId" INTEGER NOT NULL,
    "evaluatorId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "status" "EvalStatus" NOT NULL DEFAULT 'DRAFT',
    "shiftDate" DATE,
    "notes" TEXT,
    "signedByEvaluator" TIMESTAMP(3),
    "signedBySubject" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Evaluation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EvalScore" (
    "evaluationId" INTEGER NOT NULL,
    "itemId" INTEGER NOT NULL,
    "scaleValue" INTEGER,
    "passed" BOOLEAN,
    "textValue" TEXT,

    CONSTRAINT "EvalScore_pkey" PRIMARY KEY ("evaluationId","itemId")
);

-- CreateTable
CREATE TABLE "PromotionRequest" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "credentialTypeId" INTEGER NOT NULL,
    "status" "PromoStatus" NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMP(3),

    CONSTRAINT "PromotionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionVote" (
    "id" SERIAL NOT NULL,
    "requestId" INTEGER NOT NULL,
    "voterId" INTEGER NOT NULL,
    "proxyForId" INTEGER,
    "vote" "VoteChoice" NOT NULL,
    "notes" TEXT,
    "castAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PromotionProxy" (
    "requestId" INTEGER NOT NULL,
    "principalId" INTEGER NOT NULL,
    "proxyId" INTEGER NOT NULL,

    CONSTRAINT "PromotionProxy_pkey" PRIMARY KEY ("requestId","principalId")
);

-- CreateTable
CREATE TABLE "PromotionApproval" (
    "requestId" INTEGER NOT NULL,
    "approvedById" INTEGER NOT NULL,
    "approved" BOOLEAN NOT NULL,
    "notes" TEXT,
    "decidedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromotionApproval_pkey" PRIMARY KEY ("requestId")
);

-- CreateTable
CREATE TABLE "Crew" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,

    CONSTRAINT "Crew_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CrewSlot" (
    "id" SERIAL NOT NULL,
    "crewId" INTEGER NOT NULL,
    "position" "CrewPosition" NOT NULL,
    "memberId" INTEGER,
    "placeholder" TEXT,

    CONSTRAINT "CrewSlot_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DefaultCrewTemplate" (
    "id" SERIAL NOT NULL,
    "weekday" INTEGER NOT NULL,
    "position" "CrewPosition" NOT NULL,
    "memberId" INTEGER,
    "placeholder" TEXT,

    CONSTRAINT "DefaultCrewTemplate_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SchedulingSetting" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,

    CONSTRAINT "SchedulingSetting_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "EventKind" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "defaults" JSONB,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "EventKind_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "location" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3) NOT NULL,
    "kindId" INTEGER NOT NULL,
    "locked" BOOLEAN NOT NULL DEFAULT false,
    "attendeeCap" INTEGER,
    "hidden" BOOLEAN NOT NULL DEFAULT false,
    "gcalEventId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventPosition" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "position" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "requiredCredentialKey" TEXT,

    CONSTRAINT "EventPosition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EventSignup" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "position" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EventSignup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnnualTrainingRequirement" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "alertOnLapse" BOOLEAN NOT NULL DEFAULT true,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "AnnualTrainingRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MemberAnnualTraining" (
    "requirementId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "MemberAnnualTraining_pkey" PRIMARY KEY ("requirementId","memberId")
);

-- CreateTable
CREATE TABLE "TrainingClass" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "sessionAt" TIMESTAMP(3),
    "location" TEXT,

    CONSTRAINT "TrainingClass_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClassAttendance" (
    "classId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "status" "AttendanceStatus" NOT NULL DEFAULT 'REGISTERED',

    CONSTRAINT "ClassAttendance_pkey" PRIMARY KEY ("classId","memberId")
);

-- CreateTable
CREATE TABLE "FuelLogEntry" (
    "id" SERIAL NOT NULL,
    "loggedAt" TIMESTAMP(3) NOT NULL,
    "memberId" INTEGER NOT NULL,
    "vehicle" TEXT NOT NULL,
    "amount" DECIMAL(6,2) NOT NULL,
    "mileage" INTEGER NOT NULL,

    CONSTRAINT "FuelLogEntry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Radio" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "model" TEXT,
    "serial" TEXT,
    "accessories" JSONB,
    "retired" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Radio_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RadioAssignment" (
    "id" SERIAL NOT NULL,
    "radioId" INTEGER NOT NULL,
    "memberId" INTEGER NOT NULL,
    "issuedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" TIMESTAMP(3),

    CONSTRAINT "RadioAssignment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IcsToken" (
    "id" SERIAL NOT NULL,
    "memberId" INTEGER NOT NULL,
    "token" TEXT NOT NULL,
    "scope" "IcsScope" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IcsToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ApiToken" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "tokenHash" TEXT NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "permissions" TEXT[],
    "expiresAt" TIMESTAMP(3),
    "revokedAt" TIMESTAMP(3),
    "lastUsedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApiToken_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditLog" (
    "id" BIGSERIAL NOT NULL,
    "actorType" "ActorType" NOT NULL,
    "actorId" INTEGER,
    "action" TEXT NOT NULL,
    "entity" TEXT NOT NULL,
    "entityId" TEXT,
    "diff" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditLog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Member_legacyId_key" ON "Member"("legacyId");

-- CreateIndex
CREATE UNIQUE INDEX "Member_keycloakSubject_key" ON "Member"("keycloakSubject");

-- CreateIndex
CREATE UNIQUE INDEX "Member_email_key" ON "Member"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Member_slackId_key" ON "Member"("slackId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE INDEX "MemberRole_memberId_idx" ON "MemberRole"("memberId");

-- CreateIndex
CREATE INDEX "MemberRole_roleId_idx" ON "MemberRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "CertificationType_name_key" ON "CertificationType"("name");

-- CreateIndex
CREATE INDEX "MemberCertification_memberId_idx" ON "MemberCertification"("memberId");

-- CreateIndex
CREATE INDEX "MemberCertification_expiresAt_idx" ON "MemberCertification"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "CredentialType_key_key" ON "CredentialType"("key");

-- CreateIndex
CREATE INDEX "MemberCredential_typeId_idx" ON "MemberCredential"("typeId");

-- CreateIndex
CREATE UNIQUE INDEX "MemberCredential_memberId_typeId_key" ON "MemberCredential"("memberId", "typeId");

-- CreateIndex
CREATE UNIQUE INDEX "EvalFormTemplate_name_version_key" ON "EvalFormTemplate"("name", "version");

-- CreateIndex
CREATE UNIQUE INDEX "EvalFormItem_templateId_order_key" ON "EvalFormItem"("templateId", "order");

-- CreateIndex
CREATE INDEX "Evaluation_subjectId_idx" ON "Evaluation"("subjectId");

-- CreateIndex
CREATE INDEX "Evaluation_evaluatorId_idx" ON "Evaluation"("evaluatorId");

-- CreateIndex
CREATE INDEX "PromotionRequest_memberId_idx" ON "PromotionRequest"("memberId");

-- CreateIndex
CREATE INDEX "PromotionRequest_status_idx" ON "PromotionRequest"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PromotionVote_requestId_voterId_proxyForId_key" ON "PromotionVote"("requestId", "voterId", "proxyForId");

-- CreateIndex
CREATE UNIQUE INDEX "Crew_date_key" ON "Crew"("date");

-- CreateIndex
CREATE INDEX "CrewSlot_memberId_idx" ON "CrewSlot"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "CrewSlot_crewId_position_key" ON "CrewSlot"("crewId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "DefaultCrewTemplate_weekday_position_key" ON "DefaultCrewTemplate"("weekday", "position");

-- CreateIndex
CREATE UNIQUE INDEX "EventKind_name_key" ON "EventKind"("name");

-- CreateIndex
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- CreateIndex
CREATE UNIQUE INDEX "EventPosition_eventId_position_key" ON "EventPosition"("eventId", "position");

-- CreateIndex
CREATE UNIQUE INDEX "EventSignup_eventId_memberId_key" ON "EventSignup"("eventId", "memberId");

-- CreateIndex
CREATE UNIQUE INDEX "AnnualTrainingRequirement_name_year_key" ON "AnnualTrainingRequirement"("name", "year");

-- CreateIndex
CREATE UNIQUE INDEX "Radio_number_key" ON "Radio"("number");

-- CreateIndex
CREATE INDEX "RadioAssignment_radioId_idx" ON "RadioAssignment"("radioId");

-- CreateIndex
CREATE INDEX "RadioAssignment_memberId_idx" ON "RadioAssignment"("memberId");

-- CreateIndex
CREATE UNIQUE INDEX "IcsToken_token_key" ON "IcsToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "ApiToken_tokenHash_key" ON "ApiToken"("tokenHash");

-- CreateIndex
CREATE INDEX "AuditLog_entity_entityId_idx" ON "AuditLog"("entity", "entityId");

-- CreateIndex
CREATE INDEX "AuditLog_at_idx" ON "AuditLog"("at");

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberRole" ADD CONSTRAINT "MemberRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCertification" ADD CONSTRAINT "MemberCertification_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCertification" ADD CONSTRAINT "MemberCertification_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "CertificationType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCertification" ADD CONSTRAINT "MemberCertification_verifiedById_fkey" FOREIGN KEY ("verifiedById") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CertificationDocument" ADD CONSTRAINT "CertificationDocument_certificationId_fkey" FOREIGN KEY ("certificationId") REFERENCES "MemberCertification"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialPrerequisite" ADD CONSTRAINT "CredentialPrerequisite_credentialTypeId_fkey" FOREIGN KEY ("credentialTypeId") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialPrerequisite" ADD CONSTRAINT "CredentialPrerequisite_requiresTypeId_fkey" FOREIGN KEY ("requiresTypeId") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRequirement" ADD CONSTRAINT "CredentialRequirement_credentialTypeId_fkey" FOREIGN KEY ("credentialTypeId") REFERENCES "CredentialType"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRequirement" ADD CONSTRAINT "CredentialRequirement_certificationTypeId_fkey" FOREIGN KEY ("certificationTypeId") REFERENCES "CertificationType"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRequirement" ADD CONSTRAINT "CredentialRequirement_evalTemplateId_fkey" FOREIGN KEY ("evalTemplateId") REFERENCES "EvalFormTemplate"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CredentialRequirement" ADD CONSTRAINT "CredentialRequirement_classId_fkey" FOREIGN KEY ("classId") REFERENCES "TrainingClass"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCredential" ADD CONSTRAINT "MemberCredential_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCredential" ADD CONSTRAINT "MemberCredential_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "CredentialType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberCredential" ADD CONSTRAINT "MemberCredential_grantedViaId_fkey" FOREIGN KEY ("grantedViaId") REFERENCES "PromotionRequest"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalFormItem" ADD CONSTRAINT "EvalFormItem_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EvalFormTemplate"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_templateId_fkey" FOREIGN KEY ("templateId") REFERENCES "EvalFormTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_evaluatorId_fkey" FOREIGN KEY ("evaluatorId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Evaluation" ADD CONSTRAINT "Evaluation_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalScore" ADD CONSTRAINT "EvalScore_evaluationId_fkey" FOREIGN KEY ("evaluationId") REFERENCES "Evaluation"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EvalScore" ADD CONSTRAINT "EvalScore_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "EvalFormItem"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequest" ADD CONSTRAINT "PromotionRequest_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionRequest" ADD CONSTRAINT "PromotionRequest_credentialTypeId_fkey" FOREIGN KEY ("credentialTypeId") REFERENCES "CredentialType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionVote" ADD CONSTRAINT "PromotionVote_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PromotionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionVote" ADD CONSTRAINT "PromotionVote_voterId_fkey" FOREIGN KEY ("voterId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionVote" ADD CONSTRAINT "PromotionVote_proxyForId_fkey" FOREIGN KEY ("proxyForId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProxy" ADD CONSTRAINT "PromotionProxy_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PromotionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProxy" ADD CONSTRAINT "PromotionProxy_principalId_fkey" FOREIGN KEY ("principalId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionProxy" ADD CONSTRAINT "PromotionProxy_proxyId_fkey" FOREIGN KEY ("proxyId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PromotionApproval" ADD CONSTRAINT "PromotionApproval_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "PromotionRequest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewSlot" ADD CONSTRAINT "CrewSlot_crewId_fkey" FOREIGN KEY ("crewId") REFERENCES "Crew"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CrewSlot" ADD CONSTRAINT "CrewSlot_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_kindId_fkey" FOREIGN KEY ("kindId") REFERENCES "EventKind"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventPosition" ADD CONSTRAINT "EventPosition_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSignup" ADD CONSTRAINT "EventSignup_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EventSignup" ADD CONSTRAINT "EventSignup_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnnualTraining" ADD CONSTRAINT "MemberAnnualTraining_requirementId_fkey" FOREIGN KEY ("requirementId") REFERENCES "AnnualTrainingRequirement"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MemberAnnualTraining" ADD CONSTRAINT "MemberAnnualTraining_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAttendance" ADD CONSTRAINT "ClassAttendance_classId_fkey" FOREIGN KEY ("classId") REFERENCES "TrainingClass"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClassAttendance" ADD CONSTRAINT "ClassAttendance_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FuelLogEntry" ADD CONSTRAINT "FuelLogEntry_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioAssignment" ADD CONSTRAINT "RadioAssignment_radioId_fkey" FOREIGN KEY ("radioId") REFERENCES "Radio"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RadioAssignment" ADD CONSTRAINT "RadioAssignment_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IcsToken" ADD CONSTRAINT "IcsToken_memberId_fkey" FOREIGN KEY ("memberId") REFERENCES "Member"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ApiToken" ADD CONSTRAINT "ApiToken_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
