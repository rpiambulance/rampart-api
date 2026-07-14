"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.ClassAttendanceScalarFieldEnum = exports.TrainingClassScalarFieldEnum = exports.MemberAnnualTrainingScalarFieldEnum = exports.AnnualTrainingRequirementScalarFieldEnum = exports.EventSignupScalarFieldEnum = exports.EventPositionScalarFieldEnum = exports.EventScalarFieldEnum = exports.EventKindScalarFieldEnum = exports.SchedulingSettingScalarFieldEnum = exports.DefaultCrewTemplateScalarFieldEnum = exports.CrewSlotScalarFieldEnum = exports.CrewScalarFieldEnum = exports.PromotionApprovalScalarFieldEnum = exports.PromotionProxyScalarFieldEnum = exports.PromotionVoteScalarFieldEnum = exports.PromotionRequestScalarFieldEnum = exports.EvalScoreScalarFieldEnum = exports.EvaluationScalarFieldEnum = exports.EvalFormItemScalarFieldEnum = exports.EvalFormTemplateScalarFieldEnum = exports.MemberCredentialScalarFieldEnum = exports.CredentialRequirementScalarFieldEnum = exports.CredentialPrerequisiteScalarFieldEnum = exports.CredentialTypeScalarFieldEnum = exports.CertificationDocumentScalarFieldEnum = exports.MemberCertificationScalarFieldEnum = exports.CertificationTypeScalarFieldEnum = exports.MemberRoleScalarFieldEnum = exports.RolePermissionScalarFieldEnum = exports.RoleScalarFieldEnum = exports.MemberScalarFieldEnum = exports.TransactionIsolationLevel = exports.ModelName = exports.AnyNull = exports.JsonNull = exports.DbNull = exports.NullTypes = exports.prismaVersion = exports.getExtensionContext = exports.Decimal = exports.Sql = exports.raw = exports.join = exports.empty = exports.sql = exports.PrismaClientValidationError = exports.PrismaClientInitializationError = exports.PrismaClientRustPanicError = exports.PrismaClientUnknownRequestError = exports.PrismaClientKnownRequestError = void 0;
exports.defineExtension = exports.JsonNullValueFilter = exports.NullsOrder = exports.QueryMode = exports.NullableJsonNullValueInput = exports.JsonNullValueInput = exports.SortOrder = exports.AuditLogScalarFieldEnum = exports.ApiTokenScalarFieldEnum = exports.IcsTokenScalarFieldEnum = exports.RadioAssignmentScalarFieldEnum = exports.RadioScalarFieldEnum = exports.FuelLogEntryScalarFieldEnum = void 0;
const runtime = __importStar(require("@prisma/client/runtime/client"));
exports.PrismaClientKnownRequestError = runtime.PrismaClientKnownRequestError;
exports.PrismaClientUnknownRequestError = runtime.PrismaClientUnknownRequestError;
exports.PrismaClientRustPanicError = runtime.PrismaClientRustPanicError;
exports.PrismaClientInitializationError = runtime.PrismaClientInitializationError;
exports.PrismaClientValidationError = runtime.PrismaClientValidationError;
exports.sql = runtime.sqltag;
exports.empty = runtime.empty;
exports.join = runtime.join;
exports.raw = runtime.raw;
exports.Sql = runtime.Sql;
exports.Decimal = runtime.Decimal;
exports.getExtensionContext = runtime.Extensions.getExtensionContext;
exports.prismaVersion = {
    client: "7.8.0",
    engine: "3c6e192761c0362d496ed980de936e2f3cebcd3a"
};
exports.NullTypes = {
    DbNull: runtime.NullTypes.DbNull,
    JsonNull: runtime.NullTypes.JsonNull,
    AnyNull: runtime.NullTypes.AnyNull,
};
exports.DbNull = runtime.DbNull;
exports.JsonNull = runtime.JsonNull;
exports.AnyNull = runtime.AnyNull;
exports.ModelName = {
    Member: 'Member',
    Role: 'Role',
    RolePermission: 'RolePermission',
    MemberRole: 'MemberRole',
    CertificationType: 'CertificationType',
    MemberCertification: 'MemberCertification',
    CertificationDocument: 'CertificationDocument',
    CredentialType: 'CredentialType',
    CredentialPrerequisite: 'CredentialPrerequisite',
    CredentialRequirement: 'CredentialRequirement',
    MemberCredential: 'MemberCredential',
    EvalFormTemplate: 'EvalFormTemplate',
    EvalFormItem: 'EvalFormItem',
    Evaluation: 'Evaluation',
    EvalScore: 'EvalScore',
    PromotionRequest: 'PromotionRequest',
    PromotionVote: 'PromotionVote',
    PromotionProxy: 'PromotionProxy',
    PromotionApproval: 'PromotionApproval',
    Crew: 'Crew',
    CrewSlot: 'CrewSlot',
    DefaultCrewTemplate: 'DefaultCrewTemplate',
    SchedulingSetting: 'SchedulingSetting',
    EventKind: 'EventKind',
    Event: 'Event',
    EventPosition: 'EventPosition',
    EventSignup: 'EventSignup',
    AnnualTrainingRequirement: 'AnnualTrainingRequirement',
    MemberAnnualTraining: 'MemberAnnualTraining',
    TrainingClass: 'TrainingClass',
    ClassAttendance: 'ClassAttendance',
    FuelLogEntry: 'FuelLogEntry',
    Radio: 'Radio',
    RadioAssignment: 'RadioAssignment',
    IcsToken: 'IcsToken',
    ApiToken: 'ApiToken',
    AuditLog: 'AuditLog'
};
exports.TransactionIsolationLevel = runtime.makeStrictEnum({
    ReadUncommitted: 'ReadUncommitted',
    ReadCommitted: 'ReadCommitted',
    RepeatableRead: 'RepeatableRead',
    Serializable: 'Serializable'
});
exports.MemberScalarFieldEnum = {
    id: 'id',
    legacyId: 'legacyId',
    keycloakSubject: 'keycloakSubject',
    firstName: 'firstName',
    lastName: 'lastName',
    dob: 'dob',
    email: 'email',
    personalEmail: 'personalEmail',
    cellPhone: 'cellPhone',
    homePhone: 'homePhone',
    localAddress: 'localAddress',
    homeAddress: 'homeAddress',
    rcsId: 'rcsId',
    rin: 'rin',
    facilityId: 'facilityId',
    cardId: 'cardId',
    slackId: 'slackId',
    active: 'active',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RoleScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    isOfficer: 'isOfficer',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.RolePermissionScalarFieldEnum = {
    roleId: 'roleId',
    permission: 'permission'
};
exports.MemberRoleScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    roleId: 'roleId',
    startDate: 'startDate',
    endDate: 'endDate'
};
exports.CertificationTypeScalarFieldEnum = {
    id: 'id',
    name: 'name',
    abbreviation: 'abbreviation',
    issuingOrg: 'issuingOrg',
    defaultValidityMonths: 'defaultValidityMonths',
    active: 'active'
};
exports.MemberCertificationScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    typeId: 'typeId',
    identifier: 'identifier',
    issuedAt: 'issuedAt',
    expiresAt: 'expiresAt',
    status: 'status',
    verifiedById: 'verifiedById',
    verifiedAt: 'verifiedAt',
    rejectionReason: 'rejectionReason',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.CertificationDocumentScalarFieldEnum = {
    id: 'id',
    certificationId: 'certificationId',
    storageKey: 'storageKey',
    fileName: 'fileName',
    contentType: 'contentType',
    sizeBytes: 'sizeBytes',
    uploadedAt: 'uploadedAt'
};
exports.CredentialTypeScalarFieldEnum = {
    id: 'id',
    key: 'key',
    name: 'name',
    grantMethod: 'grantMethod',
    isAddOn: 'isAddOn',
    active: 'active'
};
exports.CredentialPrerequisiteScalarFieldEnum = {
    credentialTypeId: 'credentialTypeId',
    requiresTypeId: 'requiresTypeId'
};
exports.CredentialRequirementScalarFieldEnum = {
    id: 'id',
    credentialTypeId: 'credentialTypeId',
    kind: 'kind',
    certificationTypeId: 'certificationTypeId',
    evalTemplateId: 'evalTemplateId',
    count: 'count',
    classId: 'classId'
};
exports.MemberCredentialScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    typeId: 'typeId',
    status: 'status',
    title: 'title',
    grantedAt: 'grantedAt',
    grantedViaId: 'grantedViaId',
    revokedAt: 'revokedAt'
};
exports.EvalFormTemplateScalarFieldEnum = {
    id: 'id',
    name: 'name',
    version: 'version',
    active: 'active',
    createdAt: 'createdAt'
};
exports.EvalFormItemScalarFieldEnum = {
    id: 'id',
    templateId: 'templateId',
    order: 'order',
    prompt: 'prompt',
    scoreType: 'scoreType'
};
exports.EvaluationScalarFieldEnum = {
    id: 'id',
    templateId: 'templateId',
    evaluatorId: 'evaluatorId',
    subjectId: 'subjectId',
    status: 'status',
    shiftDate: 'shiftDate',
    notes: 'notes',
    signedByEvaluator: 'signedByEvaluator',
    signedBySubject: 'signedBySubject',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.EvalScoreScalarFieldEnum = {
    evaluationId: 'evaluationId',
    itemId: 'itemId',
    scaleValue: 'scaleValue',
    passed: 'passed',
    textValue: 'textValue'
};
exports.PromotionRequestScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    credentialTypeId: 'credentialTypeId',
    status: 'status',
    createdAt: 'createdAt',
    resolvedAt: 'resolvedAt'
};
exports.PromotionVoteScalarFieldEnum = {
    id: 'id',
    requestId: 'requestId',
    voterId: 'voterId',
    proxyForId: 'proxyForId',
    vote: 'vote',
    notes: 'notes',
    castAt: 'castAt'
};
exports.PromotionProxyScalarFieldEnum = {
    requestId: 'requestId',
    principalId: 'principalId',
    proxyId: 'proxyId'
};
exports.PromotionApprovalScalarFieldEnum = {
    requestId: 'requestId',
    approvedById: 'approvedById',
    approved: 'approved',
    notes: 'notes',
    decidedAt: 'decidedAt'
};
exports.CrewScalarFieldEnum = {
    id: 'id',
    date: 'date'
};
exports.CrewSlotScalarFieldEnum = {
    id: 'id',
    crewId: 'crewId',
    position: 'position',
    memberId: 'memberId',
    placeholder: 'placeholder'
};
exports.DefaultCrewTemplateScalarFieldEnum = {
    id: 'id',
    weekday: 'weekday',
    position: 'position',
    memberId: 'memberId',
    placeholder: 'placeholder'
};
exports.SchedulingSettingScalarFieldEnum = {
    key: 'key',
    value: 'value'
};
exports.EventKindScalarFieldEnum = {
    id: 'id',
    name: 'name',
    defaults: 'defaults',
    active: 'active'
};
exports.EventScalarFieldEnum = {
    id: 'id',
    title: 'title',
    description: 'description',
    location: 'location',
    startsAt: 'startsAt',
    endsAt: 'endsAt',
    kindId: 'kindId',
    locked: 'locked',
    attendeeCap: 'attendeeCap',
    hidden: 'hidden',
    gcalEventId: 'gcalEventId',
    createdAt: 'createdAt',
    updatedAt: 'updatedAt'
};
exports.EventPositionScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    position: 'position',
    count: 'count',
    requiredCredentialKey: 'requiredCredentialKey'
};
exports.EventSignupScalarFieldEnum = {
    id: 'id',
    eventId: 'eventId',
    memberId: 'memberId',
    position: 'position',
    createdAt: 'createdAt'
};
exports.AnnualTrainingRequirementScalarFieldEnum = {
    id: 'id',
    name: 'name',
    year: 'year',
    alertOnLapse: 'alertOnLapse',
    active: 'active'
};
exports.MemberAnnualTrainingScalarFieldEnum = {
    requirementId: 'requirementId',
    memberId: 'memberId',
    completedAt: 'completedAt'
};
exports.TrainingClassScalarFieldEnum = {
    id: 'id',
    name: 'name',
    description: 'description',
    sessionAt: 'sessionAt',
    location: 'location'
};
exports.ClassAttendanceScalarFieldEnum = {
    classId: 'classId',
    memberId: 'memberId',
    status: 'status'
};
exports.FuelLogEntryScalarFieldEnum = {
    id: 'id',
    loggedAt: 'loggedAt',
    memberId: 'memberId',
    vehicle: 'vehicle',
    amount: 'amount',
    mileage: 'mileage'
};
exports.RadioScalarFieldEnum = {
    id: 'id',
    number: 'number',
    model: 'model',
    serial: 'serial',
    accessories: 'accessories',
    retired: 'retired'
};
exports.RadioAssignmentScalarFieldEnum = {
    id: 'id',
    radioId: 'radioId',
    memberId: 'memberId',
    issuedAt: 'issuedAt',
    returnedAt: 'returnedAt'
};
exports.IcsTokenScalarFieldEnum = {
    id: 'id',
    memberId: 'memberId',
    token: 'token',
    scope: 'scope',
    createdAt: 'createdAt'
};
exports.ApiTokenScalarFieldEnum = {
    id: 'id',
    name: 'name',
    tokenHash: 'tokenHash',
    ownerId: 'ownerId',
    permissions: 'permissions',
    expiresAt: 'expiresAt',
    revokedAt: 'revokedAt',
    lastUsedAt: 'lastUsedAt',
    createdAt: 'createdAt'
};
exports.AuditLogScalarFieldEnum = {
    id: 'id',
    actorType: 'actorType',
    actorId: 'actorId',
    action: 'action',
    entity: 'entity',
    entityId: 'entityId',
    diff: 'diff',
    at: 'at'
};
exports.SortOrder = {
    asc: 'asc',
    desc: 'desc'
};
exports.JsonNullValueInput = {
    JsonNull: exports.JsonNull
};
exports.NullableJsonNullValueInput = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull
};
exports.QueryMode = {
    default: 'default',
    insensitive: 'insensitive'
};
exports.NullsOrder = {
    first: 'first',
    last: 'last'
};
exports.JsonNullValueFilter = {
    DbNull: exports.DbNull,
    JsonNull: exports.JsonNull,
    AnyNull: exports.AnyNull
};
exports.defineExtension = runtime.Extensions.defineExtension;
//# sourceMappingURL=prismaNamespace.js.map