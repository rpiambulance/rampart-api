"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorType = exports.IcsScope = exports.AttendanceStatus = exports.CrewPosition = exports.VoteChoice = exports.PromoStatus = exports.EvalStatus = exports.ScoreType = exports.CredentialStatus = exports.RequirementKind = exports.GrantMethod = exports.CertStatus = void 0;
exports.CertStatus = {
    PENDING_VERIFICATION: 'PENDING_VERIFICATION',
    VERIFIED: 'VERIFIED',
    REJECTED: 'REJECTED'
};
exports.GrantMethod = {
    PROMOTION: 'PROMOTION',
    APPOINTMENT: 'APPOINTMENT'
};
exports.RequirementKind = {
    CERTIFICATION: 'CERTIFICATION',
    EVALUATION_COUNT: 'EVALUATION_COUNT',
    CLASS: 'CLASS'
};
exports.CredentialStatus = {
    ACTIVE: 'ACTIVE',
    SUSPENDED: 'SUSPENDED',
    REVOKED: 'REVOKED'
};
exports.ScoreType = {
    SCALE_1_5: 'SCALE_1_5',
    PASS_FAIL: 'PASS_FAIL',
    TEXT: 'TEXT'
};
exports.EvalStatus = {
    DRAFT: 'DRAFT',
    SUBMITTED: 'SUBMITTED',
    SIGNED: 'SIGNED'
};
exports.PromoStatus = {
    PENDING: 'PENDING',
    IN_VOTE: 'IN_VOTE',
    TC_APPROVED: 'TC_APPROVED',
    APPROVED: 'APPROVED',
    DENIED: 'DENIED',
    WITHDRAWN: 'WITHDRAWN'
};
exports.VoteChoice = {
    APPROVE: 'APPROVE',
    DENY: 'DENY'
};
exports.CrewPosition = {
    CC: 'CC',
    DRIVER: 'DRIVER',
    ATTENDANT: 'ATTENDANT',
    OBSERVER: 'OBSERVER',
    DUTY_SUP: 'DUTY_SUP'
};
exports.AttendanceStatus = {
    REGISTERED: 'REGISTERED',
    ATTENDED: 'ATTENDED',
    COMPLETED: 'COMPLETED',
    NO_SHOW: 'NO_SHOW'
};
exports.IcsScope = {
    MY_SCHEDULE: 'MY_SCHEDULE',
    MY_SCHEDULE_AND_ALL_EVENTS: 'MY_SCHEDULE_AND_ALL_EVENTS'
};
exports.ActorType = {
    MEMBER: 'MEMBER',
    API_TOKEN: 'API_TOKEN',
    SYSTEM: 'SYSTEM'
};
//# sourceMappingURL=enums.js.map