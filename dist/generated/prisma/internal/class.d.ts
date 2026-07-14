import * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "./prismaNamespace.js";
export type LogOptions<ClientOptions extends Prisma.PrismaClientOptions> = 'log' extends keyof ClientOptions ? ClientOptions['log'] extends Array<Prisma.LogLevel | Prisma.LogDefinition> ? Prisma.GetEvents<ClientOptions['log']> : never : never;
export interface PrismaClientConstructor {
    new <Options extends Prisma.PrismaClientOptions = Prisma.PrismaClientOptions, LogOpts extends LogOptions<Options> = LogOptions<Options>, OmitOpts extends Prisma.PrismaClientOptions['omit'] = Options extends {
        omit: infer U;
    } ? U : Prisma.PrismaClientOptions['omit'], ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs>(options: Prisma.Subset<Options, Prisma.PrismaClientOptions>): PrismaClient<LogOpts, OmitOpts, ExtArgs>;
}
export interface PrismaClient<in LogOpts extends Prisma.LogLevel = never, in out OmitOpts extends Prisma.PrismaClientOptions['omit'] = undefined, in out ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['other'];
    };
    $on<V extends LogOpts>(eventType: V, callback: (event: V extends 'query' ? Prisma.QueryEvent : Prisma.LogEvent) => void): PrismaClient;
    $connect(): runtime.Types.Utils.JsPromise<void>;
    $disconnect(): runtime.Types.Utils.JsPromise<void>;
    $executeRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<number>;
    $executeRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<number>;
    $queryRaw<T = unknown>(query: TemplateStringsArray | Prisma.Sql, ...values: any[]): Prisma.PrismaPromise<T>;
    $queryRawUnsafe<T = unknown>(query: string, ...values: any[]): Prisma.PrismaPromise<T>;
    $transaction<P extends Prisma.PrismaPromise<any>[]>(arg: [...P], options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<runtime.Types.Utils.UnwrapTuple<P>>;
    $transaction<R>(fn: (prisma: Omit<PrismaClient, runtime.ITXClientDenyList>) => runtime.Types.Utils.JsPromise<R>, options?: {
        maxWait?: number;
        timeout?: number;
        isolationLevel?: Prisma.TransactionIsolationLevel;
    }): runtime.Types.Utils.JsPromise<R>;
    $extends: runtime.Types.Extensions.ExtendsHook<"extends", Prisma.TypeMapCb<OmitOpts>, ExtArgs, runtime.Types.Utils.Call<Prisma.TypeMapCb<OmitOpts>, {
        extArgs: ExtArgs;
    }>>;
    get member(): Prisma.MemberDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get role(): Prisma.RoleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get rolePermission(): Prisma.RolePermissionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get memberRole(): Prisma.MemberRoleDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get certificationType(): Prisma.CertificationTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get memberCertification(): Prisma.MemberCertificationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get certificationDocument(): Prisma.CertificationDocumentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get credentialType(): Prisma.CredentialTypeDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get credentialPrerequisite(): Prisma.CredentialPrerequisiteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get credentialRequirement(): Prisma.CredentialRequirementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get memberCredential(): Prisma.MemberCredentialDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get evalFormTemplate(): Prisma.EvalFormTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get evalFormItem(): Prisma.EvalFormItemDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get evaluation(): Prisma.EvaluationDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get evalScore(): Prisma.EvalScoreDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotionRequest(): Prisma.PromotionRequestDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotionVote(): Prisma.PromotionVoteDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotionProxy(): Prisma.PromotionProxyDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get promotionApproval(): Prisma.PromotionApprovalDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get crew(): Prisma.CrewDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get crewSlot(): Prisma.CrewSlotDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get defaultCrewTemplate(): Prisma.DefaultCrewTemplateDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get schedulingSetting(): Prisma.SchedulingSettingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get eventKind(): Prisma.EventKindDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get event(): Prisma.EventDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get eventPosition(): Prisma.EventPositionDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get eventSignup(): Prisma.EventSignupDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get annualTrainingRequirement(): Prisma.AnnualTrainingRequirementDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get memberAnnualTraining(): Prisma.MemberAnnualTrainingDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get trainingClass(): Prisma.TrainingClassDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get classAttendance(): Prisma.ClassAttendanceDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get fuelLogEntry(): Prisma.FuelLogEntryDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get radio(): Prisma.RadioDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get radioAssignment(): Prisma.RadioAssignmentDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get icsToken(): Prisma.IcsTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get apiToken(): Prisma.ApiTokenDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
    get auditLog(): Prisma.AuditLogDelegate<ExtArgs, {
        omit: OmitOpts;
    }>;
}
export declare function getPrismaClientClass(): PrismaClientConstructor;
