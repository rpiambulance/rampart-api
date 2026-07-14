import * as runtime from "@prisma/client/runtime/index-browser";
export type * from '../models.js';
export type * from './prismaNamespace.js';
export declare const Decimal: typeof runtime.Decimal;
export declare const NullTypes: {
    DbNull: (new (secret: never) => typeof runtime.DbNull);
    JsonNull: (new (secret: never) => typeof runtime.JsonNull);
    AnyNull: (new (secret: never) => typeof runtime.AnyNull);
};
export declare const DbNull: import("@prisma/client-runtime-utils").DbNullClass;
export declare const JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
export declare const AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
export declare const ModelName: {
    readonly Member: "Member";
    readonly Role: "Role";
    readonly RolePermission: "RolePermission";
    readonly MemberRole: "MemberRole";
    readonly CertificationType: "CertificationType";
    readonly MemberCertification: "MemberCertification";
    readonly CertificationDocument: "CertificationDocument";
    readonly CredentialType: "CredentialType";
    readonly CredentialPrerequisite: "CredentialPrerequisite";
    readonly CredentialRequirement: "CredentialRequirement";
    readonly MemberCredential: "MemberCredential";
    readonly EvalFormTemplate: "EvalFormTemplate";
    readonly EvalFormItem: "EvalFormItem";
    readonly Evaluation: "Evaluation";
    readonly EvalScore: "EvalScore";
    readonly PromotionRequest: "PromotionRequest";
    readonly PromotionVote: "PromotionVote";
    readonly PromotionProxy: "PromotionProxy";
    readonly PromotionApproval: "PromotionApproval";
    readonly Crew: "Crew";
    readonly CrewSlot: "CrewSlot";
    readonly DefaultCrewTemplate: "DefaultCrewTemplate";
    readonly SchedulingSetting: "SchedulingSetting";
    readonly EventKind: "EventKind";
    readonly Event: "Event";
    readonly EventPosition: "EventPosition";
    readonly EventSignup: "EventSignup";
    readonly AnnualTrainingRequirement: "AnnualTrainingRequirement";
    readonly MemberAnnualTraining: "MemberAnnualTraining";
    readonly TrainingClass: "TrainingClass";
    readonly ClassAttendance: "ClassAttendance";
    readonly FuelLogEntry: "FuelLogEntry";
    readonly Radio: "Radio";
    readonly RadioAssignment: "RadioAssignment";
    readonly IcsToken: "IcsToken";
    readonly ApiToken: "ApiToken";
    readonly AuditLog: "AuditLog";
};
export type ModelName = (typeof ModelName)[keyof typeof ModelName];
export declare const TransactionIsolationLevel: {
    readonly ReadUncommitted: "ReadUncommitted";
    readonly ReadCommitted: "ReadCommitted";
    readonly RepeatableRead: "RepeatableRead";
    readonly Serializable: "Serializable";
};
export type TransactionIsolationLevel = (typeof TransactionIsolationLevel)[keyof typeof TransactionIsolationLevel];
export declare const MemberScalarFieldEnum: {
    readonly id: "id";
    readonly legacyId: "legacyId";
    readonly keycloakSubject: "keycloakSubject";
    readonly firstName: "firstName";
    readonly lastName: "lastName";
    readonly dob: "dob";
    readonly email: "email";
    readonly personalEmail: "personalEmail";
    readonly cellPhone: "cellPhone";
    readonly homePhone: "homePhone";
    readonly localAddress: "localAddress";
    readonly homeAddress: "homeAddress";
    readonly rcsId: "rcsId";
    readonly rin: "rin";
    readonly facilityId: "facilityId";
    readonly cardId: "cardId";
    readonly slackId: "slackId";
    readonly active: "active";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MemberScalarFieldEnum = (typeof MemberScalarFieldEnum)[keyof typeof MemberScalarFieldEnum];
export declare const RoleScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly isOfficer: "isOfficer";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type RoleScalarFieldEnum = (typeof RoleScalarFieldEnum)[keyof typeof RoleScalarFieldEnum];
export declare const RolePermissionScalarFieldEnum: {
    readonly roleId: "roleId";
    readonly permission: "permission";
};
export type RolePermissionScalarFieldEnum = (typeof RolePermissionScalarFieldEnum)[keyof typeof RolePermissionScalarFieldEnum];
export declare const MemberRoleScalarFieldEnum: {
    readonly id: "id";
    readonly memberId: "memberId";
    readonly roleId: "roleId";
    readonly startDate: "startDate";
    readonly endDate: "endDate";
};
export type MemberRoleScalarFieldEnum = (typeof MemberRoleScalarFieldEnum)[keyof typeof MemberRoleScalarFieldEnum];
export declare const CertificationTypeScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly abbreviation: "abbreviation";
    readonly issuingOrg: "issuingOrg";
    readonly defaultValidityMonths: "defaultValidityMonths";
    readonly active: "active";
};
export type CertificationTypeScalarFieldEnum = (typeof CertificationTypeScalarFieldEnum)[keyof typeof CertificationTypeScalarFieldEnum];
export declare const MemberCertificationScalarFieldEnum: {
    readonly id: "id";
    readonly memberId: "memberId";
    readonly typeId: "typeId";
    readonly identifier: "identifier";
    readonly issuedAt: "issuedAt";
    readonly expiresAt: "expiresAt";
    readonly status: "status";
    readonly verifiedById: "verifiedById";
    readonly verifiedAt: "verifiedAt";
    readonly rejectionReason: "rejectionReason";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type MemberCertificationScalarFieldEnum = (typeof MemberCertificationScalarFieldEnum)[keyof typeof MemberCertificationScalarFieldEnum];
export declare const CertificationDocumentScalarFieldEnum: {
    readonly id: "id";
    readonly certificationId: "certificationId";
    readonly storageKey: "storageKey";
    readonly fileName: "fileName";
    readonly contentType: "contentType";
    readonly sizeBytes: "sizeBytes";
    readonly uploadedAt: "uploadedAt";
};
export type CertificationDocumentScalarFieldEnum = (typeof CertificationDocumentScalarFieldEnum)[keyof typeof CertificationDocumentScalarFieldEnum];
export declare const CredentialTypeScalarFieldEnum: {
    readonly id: "id";
    readonly key: "key";
    readonly name: "name";
    readonly grantMethod: "grantMethod";
    readonly isAddOn: "isAddOn";
    readonly active: "active";
};
export type CredentialTypeScalarFieldEnum = (typeof CredentialTypeScalarFieldEnum)[keyof typeof CredentialTypeScalarFieldEnum];
export declare const CredentialPrerequisiteScalarFieldEnum: {
    readonly credentialTypeId: "credentialTypeId";
    readonly requiresTypeId: "requiresTypeId";
};
export type CredentialPrerequisiteScalarFieldEnum = (typeof CredentialPrerequisiteScalarFieldEnum)[keyof typeof CredentialPrerequisiteScalarFieldEnum];
export declare const CredentialRequirementScalarFieldEnum: {
    readonly id: "id";
    readonly credentialTypeId: "credentialTypeId";
    readonly kind: "kind";
    readonly certificationTypeId: "certificationTypeId";
    readonly evalTemplateId: "evalTemplateId";
    readonly count: "count";
    readonly classId: "classId";
};
export type CredentialRequirementScalarFieldEnum = (typeof CredentialRequirementScalarFieldEnum)[keyof typeof CredentialRequirementScalarFieldEnum];
export declare const MemberCredentialScalarFieldEnum: {
    readonly id: "id";
    readonly memberId: "memberId";
    readonly typeId: "typeId";
    readonly status: "status";
    readonly title: "title";
    readonly grantedAt: "grantedAt";
    readonly grantedViaId: "grantedViaId";
    readonly revokedAt: "revokedAt";
};
export type MemberCredentialScalarFieldEnum = (typeof MemberCredentialScalarFieldEnum)[keyof typeof MemberCredentialScalarFieldEnum];
export declare const EvalFormTemplateScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly version: "version";
    readonly active: "active";
    readonly createdAt: "createdAt";
};
export type EvalFormTemplateScalarFieldEnum = (typeof EvalFormTemplateScalarFieldEnum)[keyof typeof EvalFormTemplateScalarFieldEnum];
export declare const EvalFormItemScalarFieldEnum: {
    readonly id: "id";
    readonly templateId: "templateId";
    readonly order: "order";
    readonly prompt: "prompt";
    readonly scoreType: "scoreType";
};
export type EvalFormItemScalarFieldEnum = (typeof EvalFormItemScalarFieldEnum)[keyof typeof EvalFormItemScalarFieldEnum];
export declare const EvaluationScalarFieldEnum: {
    readonly id: "id";
    readonly templateId: "templateId";
    readonly evaluatorId: "evaluatorId";
    readonly subjectId: "subjectId";
    readonly status: "status";
    readonly shiftDate: "shiftDate";
    readonly notes: "notes";
    readonly signedByEvaluator: "signedByEvaluator";
    readonly signedBySubject: "signedBySubject";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EvaluationScalarFieldEnum = (typeof EvaluationScalarFieldEnum)[keyof typeof EvaluationScalarFieldEnum];
export declare const EvalScoreScalarFieldEnum: {
    readonly evaluationId: "evaluationId";
    readonly itemId: "itemId";
    readonly scaleValue: "scaleValue";
    readonly passed: "passed";
    readonly textValue: "textValue";
};
export type EvalScoreScalarFieldEnum = (typeof EvalScoreScalarFieldEnum)[keyof typeof EvalScoreScalarFieldEnum];
export declare const PromotionRequestScalarFieldEnum: {
    readonly id: "id";
    readonly memberId: "memberId";
    readonly credentialTypeId: "credentialTypeId";
    readonly status: "status";
    readonly createdAt: "createdAt";
    readonly resolvedAt: "resolvedAt";
};
export type PromotionRequestScalarFieldEnum = (typeof PromotionRequestScalarFieldEnum)[keyof typeof PromotionRequestScalarFieldEnum];
export declare const PromotionVoteScalarFieldEnum: {
    readonly id: "id";
    readonly requestId: "requestId";
    readonly voterId: "voterId";
    readonly proxyForId: "proxyForId";
    readonly vote: "vote";
    readonly notes: "notes";
    readonly castAt: "castAt";
};
export type PromotionVoteScalarFieldEnum = (typeof PromotionVoteScalarFieldEnum)[keyof typeof PromotionVoteScalarFieldEnum];
export declare const PromotionProxyScalarFieldEnum: {
    readonly requestId: "requestId";
    readonly principalId: "principalId";
    readonly proxyId: "proxyId";
};
export type PromotionProxyScalarFieldEnum = (typeof PromotionProxyScalarFieldEnum)[keyof typeof PromotionProxyScalarFieldEnum];
export declare const PromotionApprovalScalarFieldEnum: {
    readonly requestId: "requestId";
    readonly approvedById: "approvedById";
    readonly approved: "approved";
    readonly notes: "notes";
    readonly decidedAt: "decidedAt";
};
export type PromotionApprovalScalarFieldEnum = (typeof PromotionApprovalScalarFieldEnum)[keyof typeof PromotionApprovalScalarFieldEnum];
export declare const CrewScalarFieldEnum: {
    readonly id: "id";
    readonly date: "date";
};
export type CrewScalarFieldEnum = (typeof CrewScalarFieldEnum)[keyof typeof CrewScalarFieldEnum];
export declare const CrewSlotScalarFieldEnum: {
    readonly id: "id";
    readonly crewId: "crewId";
    readonly position: "position";
    readonly memberId: "memberId";
    readonly placeholder: "placeholder";
};
export type CrewSlotScalarFieldEnum = (typeof CrewSlotScalarFieldEnum)[keyof typeof CrewSlotScalarFieldEnum];
export declare const DefaultCrewTemplateScalarFieldEnum: {
    readonly id: "id";
    readonly weekday: "weekday";
    readonly position: "position";
    readonly memberId: "memberId";
    readonly placeholder: "placeholder";
};
export type DefaultCrewTemplateScalarFieldEnum = (typeof DefaultCrewTemplateScalarFieldEnum)[keyof typeof DefaultCrewTemplateScalarFieldEnum];
export declare const SchedulingSettingScalarFieldEnum: {
    readonly key: "key";
    readonly value: "value";
};
export type SchedulingSettingScalarFieldEnum = (typeof SchedulingSettingScalarFieldEnum)[keyof typeof SchedulingSettingScalarFieldEnum];
export declare const EventKindScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly defaults: "defaults";
    readonly active: "active";
};
export type EventKindScalarFieldEnum = (typeof EventKindScalarFieldEnum)[keyof typeof EventKindScalarFieldEnum];
export declare const EventScalarFieldEnum: {
    readonly id: "id";
    readonly title: "title";
    readonly description: "description";
    readonly location: "location";
    readonly startsAt: "startsAt";
    readonly endsAt: "endsAt";
    readonly kindId: "kindId";
    readonly locked: "locked";
    readonly attendeeCap: "attendeeCap";
    readonly hidden: "hidden";
    readonly gcalEventId: "gcalEventId";
    readonly createdAt: "createdAt";
    readonly updatedAt: "updatedAt";
};
export type EventScalarFieldEnum = (typeof EventScalarFieldEnum)[keyof typeof EventScalarFieldEnum];
export declare const EventPositionScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly position: "position";
    readonly count: "count";
    readonly requiredCredentialKey: "requiredCredentialKey";
};
export type EventPositionScalarFieldEnum = (typeof EventPositionScalarFieldEnum)[keyof typeof EventPositionScalarFieldEnum];
export declare const EventSignupScalarFieldEnum: {
    readonly id: "id";
    readonly eventId: "eventId";
    readonly memberId: "memberId";
    readonly position: "position";
    readonly createdAt: "createdAt";
};
export type EventSignupScalarFieldEnum = (typeof EventSignupScalarFieldEnum)[keyof typeof EventSignupScalarFieldEnum];
export declare const AnnualTrainingRequirementScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly year: "year";
    readonly alertOnLapse: "alertOnLapse";
    readonly active: "active";
};
export type AnnualTrainingRequirementScalarFieldEnum = (typeof AnnualTrainingRequirementScalarFieldEnum)[keyof typeof AnnualTrainingRequirementScalarFieldEnum];
export declare const MemberAnnualTrainingScalarFieldEnum: {
    readonly requirementId: "requirementId";
    readonly memberId: "memberId";
    readonly completedAt: "completedAt";
};
export type MemberAnnualTrainingScalarFieldEnum = (typeof MemberAnnualTrainingScalarFieldEnum)[keyof typeof MemberAnnualTrainingScalarFieldEnum];
export declare const TrainingClassScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly description: "description";
    readonly sessionAt: "sessionAt";
    readonly location: "location";
};
export type TrainingClassScalarFieldEnum = (typeof TrainingClassScalarFieldEnum)[keyof typeof TrainingClassScalarFieldEnum];
export declare const ClassAttendanceScalarFieldEnum: {
    readonly classId: "classId";
    readonly memberId: "memberId";
    readonly status: "status";
};
export type ClassAttendanceScalarFieldEnum = (typeof ClassAttendanceScalarFieldEnum)[keyof typeof ClassAttendanceScalarFieldEnum];
export declare const FuelLogEntryScalarFieldEnum: {
    readonly id: "id";
    readonly loggedAt: "loggedAt";
    readonly memberId: "memberId";
    readonly vehicle: "vehicle";
    readonly amount: "amount";
    readonly mileage: "mileage";
};
export type FuelLogEntryScalarFieldEnum = (typeof FuelLogEntryScalarFieldEnum)[keyof typeof FuelLogEntryScalarFieldEnum];
export declare const RadioScalarFieldEnum: {
    readonly id: "id";
    readonly number: "number";
    readonly model: "model";
    readonly serial: "serial";
    readonly accessories: "accessories";
    readonly retired: "retired";
};
export type RadioScalarFieldEnum = (typeof RadioScalarFieldEnum)[keyof typeof RadioScalarFieldEnum];
export declare const RadioAssignmentScalarFieldEnum: {
    readonly id: "id";
    readonly radioId: "radioId";
    readonly memberId: "memberId";
    readonly issuedAt: "issuedAt";
    readonly returnedAt: "returnedAt";
};
export type RadioAssignmentScalarFieldEnum = (typeof RadioAssignmentScalarFieldEnum)[keyof typeof RadioAssignmentScalarFieldEnum];
export declare const IcsTokenScalarFieldEnum: {
    readonly id: "id";
    readonly memberId: "memberId";
    readonly token: "token";
    readonly scope: "scope";
    readonly createdAt: "createdAt";
};
export type IcsTokenScalarFieldEnum = (typeof IcsTokenScalarFieldEnum)[keyof typeof IcsTokenScalarFieldEnum];
export declare const ApiTokenScalarFieldEnum: {
    readonly id: "id";
    readonly name: "name";
    readonly tokenHash: "tokenHash";
    readonly ownerId: "ownerId";
    readonly permissions: "permissions";
    readonly expiresAt: "expiresAt";
    readonly revokedAt: "revokedAt";
    readonly lastUsedAt: "lastUsedAt";
    readonly createdAt: "createdAt";
};
export type ApiTokenScalarFieldEnum = (typeof ApiTokenScalarFieldEnum)[keyof typeof ApiTokenScalarFieldEnum];
export declare const AuditLogScalarFieldEnum: {
    readonly id: "id";
    readonly actorType: "actorType";
    readonly actorId: "actorId";
    readonly action: "action";
    readonly entity: "entity";
    readonly entityId: "entityId";
    readonly diff: "diff";
    readonly at: "at";
};
export type AuditLogScalarFieldEnum = (typeof AuditLogScalarFieldEnum)[keyof typeof AuditLogScalarFieldEnum];
export declare const SortOrder: {
    readonly asc: "asc";
    readonly desc: "desc";
};
export type SortOrder = (typeof SortOrder)[keyof typeof SortOrder];
export declare const JsonNullValueInput: {
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type JsonNullValueInput = (typeof JsonNullValueInput)[keyof typeof JsonNullValueInput];
export declare const NullableJsonNullValueInput: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
};
export type NullableJsonNullValueInput = (typeof NullableJsonNullValueInput)[keyof typeof NullableJsonNullValueInput];
export declare const QueryMode: {
    readonly default: "default";
    readonly insensitive: "insensitive";
};
export type QueryMode = (typeof QueryMode)[keyof typeof QueryMode];
export declare const NullsOrder: {
    readonly first: "first";
    readonly last: "last";
};
export type NullsOrder = (typeof NullsOrder)[keyof typeof NullsOrder];
export declare const JsonNullValueFilter: {
    readonly DbNull: import("@prisma/client-runtime-utils").DbNullClass;
    readonly JsonNull: import("@prisma/client-runtime-utils").JsonNullClass;
    readonly AnyNull: import("@prisma/client-runtime-utils").AnyNullClass;
};
export type JsonNullValueFilter = (typeof JsonNullValueFilter)[keyof typeof JsonNullValueFilter];
