import type { AuthContext } from '../auth/auth-context';
import { EvalsService } from './evals.service';
declare class TemplateItemDto {
    order: number;
    prompt: string;
    scoreType: 'SCALE_1_5' | 'PASS_FAIL' | 'TEXT';
}
declare class CreateTemplateDto {
    name: string;
    items: TemplateItemDto[];
}
declare class CreateEvalDto {
    subjectId: number;
    templateId: number;
    shiftDate?: string;
}
declare class ScoreDto {
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
}
declare class SaveScoresDto {
    scores: ScoreDto[];
    submit?: boolean;
    notes?: string;
}
export declare class EvalsController {
    private readonly evals;
    constructor(evals: EvalsService);
    templates(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: import("../generated/prisma/enums").ScoreType;
        }[];
    } & {
        id: number;
        active: boolean;
        createdAt: Date;
        name: string;
        version: number;
    })[]>;
    createTemplate(body: CreateTemplateDto): import("../generated/prisma/models").Prisma__EvalFormTemplateClient<{
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: import("../generated/prisma/enums").ScoreType;
        }[];
    } & {
        id: number;
        active: boolean;
        createdAt: Date;
        name: string;
        version: number;
    }, never, import("@prisma/client/runtime/client").DefaultArgs, {
        omit: import("../generated/prisma/internal/prismaNamespace").GlobalOmitConfig | undefined;
    }>;
    reviseTemplate(id: number, body: CreateTemplateDto): Promise<{
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: import("../generated/prisma/enums").ScoreType;
        }[];
    } & {
        id: number;
        active: boolean;
        createdAt: Date;
        name: string;
        version: number;
    }>;
    create(auth: AuthContext, body: CreateEvalDto): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    }>;
    mine(auth: AuthContext): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        template: {
            id: number;
            name: string;
        };
        evaluator: {
            id: number;
            firstName: string;
            lastName: string;
        };
        subject: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    })[]>;
    about(memberId: number): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        template: {
            id: number;
            name: string;
        };
        evaluator: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    })[]>;
    get(auth: AuthContext, id: number): Promise<{
        scores: {
            evaluationId: number;
            itemId: number;
            scaleValue: number | null;
            passed: boolean | null;
            textValue: string | null;
        }[];
        template: {
            items: {
                id: number;
                templateId: number;
                order: number;
                prompt: string;
                scoreType: import("../generated/prisma/enums").ScoreType;
            }[];
        } & {
            id: number;
            active: boolean;
            createdAt: Date;
            name: string;
            version: number;
        };
        evaluator: {
            id: number;
            firstName: string;
            lastName: string;
        };
        subject: {
            id: number;
            firstName: string;
            lastName: string;
        };
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    }>;
    saveScores(auth: AuthContext, id: number, body: SaveScoresDto): Promise<{
        scores: {
            evaluationId: number;
            itemId: number;
            scaleValue: number | null;
            passed: boolean | null;
            textValue: string | null;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    }>;
    sign(auth: AuthContext, id: number): Promise<{
        id: number;
        createdAt: Date;
        updatedAt: Date;
        status: import("../generated/prisma/enums").EvalStatus;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
    }>;
}
export {};
