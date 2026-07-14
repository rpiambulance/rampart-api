export declare const CertStatus: {
    readonly PENDING_VERIFICATION: "PENDING_VERIFICATION";
    readonly VERIFIED: "VERIFIED";
    readonly REJECTED: "REJECTED";
};
export type CertStatus = (typeof CertStatus)[keyof typeof CertStatus];
export declare const GrantMethod: {
    readonly PROMOTION: "PROMOTION";
    readonly APPOINTMENT: "APPOINTMENT";
};
export type GrantMethod = (typeof GrantMethod)[keyof typeof GrantMethod];
export declare const RequirementKind: {
    readonly CERTIFICATION: "CERTIFICATION";
    readonly EVALUATION_COUNT: "EVALUATION_COUNT";
    readonly CLASS: "CLASS";
};
export type RequirementKind = (typeof RequirementKind)[keyof typeof RequirementKind];
export declare const CredentialStatus: {
    readonly ACTIVE: "ACTIVE";
    readonly SUSPENDED: "SUSPENDED";
    readonly REVOKED: "REVOKED";
};
export type CredentialStatus = (typeof CredentialStatus)[keyof typeof CredentialStatus];
export declare const ScoreType: {
    readonly SCALE_1_5: "SCALE_1_5";
    readonly PASS_FAIL: "PASS_FAIL";
    readonly TEXT: "TEXT";
};
export type ScoreType = (typeof ScoreType)[keyof typeof ScoreType];
export declare const EvalStatus: {
    readonly DRAFT: "DRAFT";
    readonly SUBMITTED: "SUBMITTED";
    readonly SIGNED: "SIGNED";
};
export type EvalStatus = (typeof EvalStatus)[keyof typeof EvalStatus];
export declare const PromoStatus: {
    readonly PENDING: "PENDING";
    readonly IN_VOTE: "IN_VOTE";
    readonly TC_APPROVED: "TC_APPROVED";
    readonly APPROVED: "APPROVED";
    readonly DENIED: "DENIED";
    readonly WITHDRAWN: "WITHDRAWN";
};
export type PromoStatus = (typeof PromoStatus)[keyof typeof PromoStatus];
export declare const VoteChoice: {
    readonly APPROVE: "APPROVE";
    readonly DENY: "DENY";
};
export type VoteChoice = (typeof VoteChoice)[keyof typeof VoteChoice];
export declare const CrewPosition: {
    readonly CC: "CC";
    readonly DRIVER: "DRIVER";
    readonly ATTENDANT: "ATTENDANT";
    readonly OBSERVER: "OBSERVER";
    readonly DUTY_SUP: "DUTY_SUP";
};
export type CrewPosition = (typeof CrewPosition)[keyof typeof CrewPosition];
export declare const AttendanceStatus: {
    readonly REGISTERED: "REGISTERED";
    readonly ATTENDED: "ATTENDED";
    readonly COMPLETED: "COMPLETED";
    readonly NO_SHOW: "NO_SHOW";
};
export type AttendanceStatus = (typeof AttendanceStatus)[keyof typeof AttendanceStatus];
export declare const IcsScope: {
    readonly MY_SCHEDULE: "MY_SCHEDULE";
    readonly MY_SCHEDULE_AND_ALL_EVENTS: "MY_SCHEDULE_AND_ALL_EVENTS";
};
export type IcsScope = (typeof IcsScope)[keyof typeof IcsScope];
export declare const ActorType: {
    readonly MEMBER: "MEMBER";
    readonly API_TOKEN: "API_TOKEN";
    readonly SYSTEM: "SYSTEM";
};
export type ActorType = (typeof ActorType)[keyof typeof ActorType];
