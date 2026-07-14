import { PrismaService } from '../prisma/prisma.service';
import { ScoreType } from '../generated/prisma/enums';
export interface TemplateItemInput {
    order: number;
    prompt: string;
    scoreType: ScoreType;
}
export interface ScoreInput {
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
}
export declare class EvalsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listTemplates(includeInactive?: boolean): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: ScoreType;
        }[];
    } & {
        id: number;
        active: boolean;
        createdAt: Date;
        name: string;
        version: number;
    })[]>;
    createTemplate(name: string, items: TemplateItemInput[]): import("../generated/prisma/models").Prisma__EvalFormTemplateClient<{
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: ScoreType;
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
    reviseTemplate(templateId: number, items: TemplateItemInput[]): Promise<{
        items: {
            id: number;
            templateId: number;
            order: number;
            prompt: string;
            scoreType: ScoreType;
        }[];
    } & {
        id: number;
        active: boolean;
        createdAt: Date;
        name: string;
        version: number;
    }>;
    create(evaluatorId: number, subjectId: number, templateId: number, shiftDate?: string): Promise<{
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
    saveScores(evaluatorId: number, evaluationId: number, scores: ScoreInput[], opts?: {
        submit?: boolean;
        notes?: string;
    }): Promise<{
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
    sign(memberId: number, evaluationId: number): Promise<{
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
    get(evaluationId: number, viewerId: number, canReadAll: boolean): Promise<{
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
                scoreType: ScoreType;
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
    listFor(memberId: number): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
    listAbout(subjectId: number): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
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
}
