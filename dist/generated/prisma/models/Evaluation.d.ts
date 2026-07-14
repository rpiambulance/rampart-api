import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EvaluationModel = runtime.Types.Result.DefaultSelection<Prisma.$EvaluationPayload>;
export type AggregateEvaluation = {
    _count: EvaluationCountAggregateOutputType | null;
    _avg: EvaluationAvgAggregateOutputType | null;
    _sum: EvaluationSumAggregateOutputType | null;
    _min: EvaluationMinAggregateOutputType | null;
    _max: EvaluationMaxAggregateOutputType | null;
};
export type EvaluationAvgAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    evaluatorId: number | null;
    subjectId: number | null;
};
export type EvaluationSumAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    evaluatorId: number | null;
    subjectId: number | null;
};
export type EvaluationMinAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    evaluatorId: number | null;
    subjectId: number | null;
    status: $Enums.EvalStatus | null;
    shiftDate: Date | null;
    notes: string | null;
    signedByEvaluator: Date | null;
    signedBySubject: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EvaluationMaxAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    evaluatorId: number | null;
    subjectId: number | null;
    status: $Enums.EvalStatus | null;
    shiftDate: Date | null;
    notes: string | null;
    signedByEvaluator: Date | null;
    signedBySubject: Date | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EvaluationCountAggregateOutputType = {
    id: number;
    templateId: number;
    evaluatorId: number;
    subjectId: number;
    status: number;
    shiftDate: number;
    notes: number;
    signedByEvaluator: number;
    signedBySubject: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EvaluationAvgAggregateInputType = {
    id?: true;
    templateId?: true;
    evaluatorId?: true;
    subjectId?: true;
};
export type EvaluationSumAggregateInputType = {
    id?: true;
    templateId?: true;
    evaluatorId?: true;
    subjectId?: true;
};
export type EvaluationMinAggregateInputType = {
    id?: true;
    templateId?: true;
    evaluatorId?: true;
    subjectId?: true;
    status?: true;
    shiftDate?: true;
    notes?: true;
    signedByEvaluator?: true;
    signedBySubject?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EvaluationMaxAggregateInputType = {
    id?: true;
    templateId?: true;
    evaluatorId?: true;
    subjectId?: true;
    status?: true;
    shiftDate?: true;
    notes?: true;
    signedByEvaluator?: true;
    signedBySubject?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EvaluationCountAggregateInputType = {
    id?: true;
    templateId?: true;
    evaluatorId?: true;
    subjectId?: true;
    status?: true;
    shiftDate?: true;
    notes?: true;
    signedByEvaluator?: true;
    signedBySubject?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EvaluationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvaluationWhereInput;
    orderBy?: Prisma.EvaluationOrderByWithRelationInput | Prisma.EvaluationOrderByWithRelationInput[];
    cursor?: Prisma.EvaluationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EvaluationCountAggregateInputType;
    _avg?: EvaluationAvgAggregateInputType;
    _sum?: EvaluationSumAggregateInputType;
    _min?: EvaluationMinAggregateInputType;
    _max?: EvaluationMaxAggregateInputType;
};
export type GetEvaluationAggregateType<T extends EvaluationAggregateArgs> = {
    [P in keyof T & keyof AggregateEvaluation]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvaluation[P]> : Prisma.GetScalarType<T[P], AggregateEvaluation[P]>;
};
export type EvaluationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvaluationWhereInput;
    orderBy?: Prisma.EvaluationOrderByWithAggregationInput | Prisma.EvaluationOrderByWithAggregationInput[];
    by: Prisma.EvaluationScalarFieldEnum[] | Prisma.EvaluationScalarFieldEnum;
    having?: Prisma.EvaluationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EvaluationCountAggregateInputType | true;
    _avg?: EvaluationAvgAggregateInputType;
    _sum?: EvaluationSumAggregateInputType;
    _min?: EvaluationMinAggregateInputType;
    _max?: EvaluationMaxAggregateInputType;
};
export type EvaluationGroupByOutputType = {
    id: number;
    templateId: number;
    evaluatorId: number;
    subjectId: number;
    status: $Enums.EvalStatus;
    shiftDate: Date | null;
    notes: string | null;
    signedByEvaluator: Date | null;
    signedBySubject: Date | null;
    createdAt: Date;
    updatedAt: Date;
    _count: EvaluationCountAggregateOutputType | null;
    _avg: EvaluationAvgAggregateOutputType | null;
    _sum: EvaluationSumAggregateOutputType | null;
    _min: EvaluationMinAggregateOutputType | null;
    _max: EvaluationMaxAggregateOutputType | null;
};
export type GetEvaluationGroupByPayload<T extends EvaluationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EvaluationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EvaluationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EvaluationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EvaluationGroupByOutputType[P]>;
}>>;
export type EvaluationWhereInput = {
    AND?: Prisma.EvaluationWhereInput | Prisma.EvaluationWhereInput[];
    OR?: Prisma.EvaluationWhereInput[];
    NOT?: Prisma.EvaluationWhereInput | Prisma.EvaluationWhereInput[];
    id?: Prisma.IntFilter<"Evaluation"> | number;
    templateId?: Prisma.IntFilter<"Evaluation"> | number;
    evaluatorId?: Prisma.IntFilter<"Evaluation"> | number;
    subjectId?: Prisma.IntFilter<"Evaluation"> | number;
    status?: Prisma.EnumEvalStatusFilter<"Evaluation"> | $Enums.EvalStatus;
    shiftDate?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"Evaluation"> | string | null;
    signedByEvaluator?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    signedBySubject?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
    template?: Prisma.XOR<Prisma.EvalFormTemplateScalarRelationFilter, Prisma.EvalFormTemplateWhereInput>;
    evaluator?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    subject?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    scores?: Prisma.EvalScoreListRelationFilter;
};
export type EvaluationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    shiftDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedByEvaluator?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedBySubject?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    template?: Prisma.EvalFormTemplateOrderByWithRelationInput;
    evaluator?: Prisma.MemberOrderByWithRelationInput;
    subject?: Prisma.MemberOrderByWithRelationInput;
    scores?: Prisma.EvalScoreOrderByRelationAggregateInput;
};
export type EvaluationWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.EvaluationWhereInput | Prisma.EvaluationWhereInput[];
    OR?: Prisma.EvaluationWhereInput[];
    NOT?: Prisma.EvaluationWhereInput | Prisma.EvaluationWhereInput[];
    templateId?: Prisma.IntFilter<"Evaluation"> | number;
    evaluatorId?: Prisma.IntFilter<"Evaluation"> | number;
    subjectId?: Prisma.IntFilter<"Evaluation"> | number;
    status?: Prisma.EnumEvalStatusFilter<"Evaluation"> | $Enums.EvalStatus;
    shiftDate?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"Evaluation"> | string | null;
    signedByEvaluator?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    signedBySubject?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
    template?: Prisma.XOR<Prisma.EvalFormTemplateScalarRelationFilter, Prisma.EvalFormTemplateWhereInput>;
    evaluator?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    subject?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    scores?: Prisma.EvalScoreListRelationFilter;
}, "id">;
export type EvaluationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    shiftDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedByEvaluator?: Prisma.SortOrderInput | Prisma.SortOrder;
    signedBySubject?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EvaluationCountOrderByAggregateInput;
    _avg?: Prisma.EvaluationAvgOrderByAggregateInput;
    _max?: Prisma.EvaluationMaxOrderByAggregateInput;
    _min?: Prisma.EvaluationMinOrderByAggregateInput;
    _sum?: Prisma.EvaluationSumOrderByAggregateInput;
};
export type EvaluationScalarWhereWithAggregatesInput = {
    AND?: Prisma.EvaluationScalarWhereWithAggregatesInput | Prisma.EvaluationScalarWhereWithAggregatesInput[];
    OR?: Prisma.EvaluationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EvaluationScalarWhereWithAggregatesInput | Prisma.EvaluationScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Evaluation"> | number;
    templateId?: Prisma.IntWithAggregatesFilter<"Evaluation"> | number;
    evaluatorId?: Prisma.IntWithAggregatesFilter<"Evaluation"> | number;
    subjectId?: Prisma.IntWithAggregatesFilter<"Evaluation"> | number;
    status?: Prisma.EnumEvalStatusWithAggregatesFilter<"Evaluation"> | $Enums.EvalStatus;
    shiftDate?: Prisma.DateTimeNullableWithAggregatesFilter<"Evaluation"> | Date | string | null;
    notes?: Prisma.StringNullableWithAggregatesFilter<"Evaluation"> | string | null;
    signedByEvaluator?: Prisma.DateTimeNullableWithAggregatesFilter<"Evaluation"> | Date | string | null;
    signedBySubject?: Prisma.DateTimeNullableWithAggregatesFilter<"Evaluation"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Evaluation"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Evaluation"> | Date | string;
};
export type EvaluationCreateInput = {
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutEvaluationsInput;
    evaluator: Prisma.MemberCreateNestedOneWithoutEvaluationsWrittenInput;
    subject: Prisma.MemberCreateNestedOneWithoutEvaluationsAboutInput;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationUncheckedCreateInput = {
    id?: number;
    templateId: number;
    evaluatorId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationUpdateInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutEvaluationsNestedInput;
    evaluator?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsWrittenNestedInput;
    subject?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsAboutNestedInput;
    scores?: Prisma.EvalScoreUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationCreateManyInput = {
    id?: number;
    templateId: number;
    evaluatorId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EvaluationUpdateManyMutationInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationListRelationFilter = {
    every?: Prisma.EvaluationWhereInput;
    some?: Prisma.EvaluationWhereInput;
    none?: Prisma.EvaluationWhereInput;
};
export type EvaluationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EvaluationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    shiftDate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    signedByEvaluator?: Prisma.SortOrder;
    signedBySubject?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EvaluationAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
};
export type EvaluationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    shiftDate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    signedByEvaluator?: Prisma.SortOrder;
    signedBySubject?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EvaluationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    shiftDate?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    signedByEvaluator?: Prisma.SortOrder;
    signedBySubject?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EvaluationSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    evaluatorId?: Prisma.SortOrder;
    subjectId?: Prisma.SortOrder;
};
export type EvaluationScalarRelationFilter = {
    is?: Prisma.EvaluationWhereInput;
    isNot?: Prisma.EvaluationWhereInput;
};
export type EvaluationCreateNestedManyWithoutEvaluatorInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput> | Prisma.EvaluationCreateWithoutEvaluatorInput[] | Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput | Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput[];
    createMany?: Prisma.EvaluationCreateManyEvaluatorInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationCreateNestedManyWithoutSubjectInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput> | Prisma.EvaluationCreateWithoutSubjectInput[] | Prisma.EvaluationUncheckedCreateWithoutSubjectInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutSubjectInput | Prisma.EvaluationCreateOrConnectWithoutSubjectInput[];
    createMany?: Prisma.EvaluationCreateManySubjectInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationUncheckedCreateNestedManyWithoutEvaluatorInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput> | Prisma.EvaluationCreateWithoutEvaluatorInput[] | Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput | Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput[];
    createMany?: Prisma.EvaluationCreateManyEvaluatorInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationUncheckedCreateNestedManyWithoutSubjectInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput> | Prisma.EvaluationCreateWithoutSubjectInput[] | Prisma.EvaluationUncheckedCreateWithoutSubjectInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutSubjectInput | Prisma.EvaluationCreateOrConnectWithoutSubjectInput[];
    createMany?: Prisma.EvaluationCreateManySubjectInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationUpdateManyWithoutEvaluatorNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput> | Prisma.EvaluationCreateWithoutEvaluatorInput[] | Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput | Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluatorInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluatorInput[];
    createMany?: Prisma.EvaluationCreateManyEvaluatorInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluatorInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluatorInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutEvaluatorInput | Prisma.EvaluationUpdateManyWithWhereWithoutEvaluatorInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EvaluationUpdateManyWithoutSubjectNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput> | Prisma.EvaluationCreateWithoutSubjectInput[] | Prisma.EvaluationUncheckedCreateWithoutSubjectInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutSubjectInput | Prisma.EvaluationCreateOrConnectWithoutSubjectInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutSubjectInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutSubjectInput[];
    createMany?: Prisma.EvaluationCreateManySubjectInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutSubjectInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutSubjectInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutSubjectInput | Prisma.EvaluationUpdateManyWithWhereWithoutSubjectInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EvaluationUncheckedUpdateManyWithoutEvaluatorNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput> | Prisma.EvaluationCreateWithoutEvaluatorInput[] | Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput | Prisma.EvaluationCreateOrConnectWithoutEvaluatorInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluatorInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutEvaluatorInput[];
    createMany?: Prisma.EvaluationCreateManyEvaluatorInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluatorInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutEvaluatorInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutEvaluatorInput | Prisma.EvaluationUpdateManyWithWhereWithoutEvaluatorInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EvaluationUncheckedUpdateManyWithoutSubjectNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput> | Prisma.EvaluationCreateWithoutSubjectInput[] | Prisma.EvaluationUncheckedCreateWithoutSubjectInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutSubjectInput | Prisma.EvaluationCreateOrConnectWithoutSubjectInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutSubjectInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutSubjectInput[];
    createMany?: Prisma.EvaluationCreateManySubjectInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutSubjectInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutSubjectInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutSubjectInput | Prisma.EvaluationUpdateManyWithWhereWithoutSubjectInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EvaluationCreateNestedManyWithoutTemplateInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput> | Prisma.EvaluationCreateWithoutTemplateInput[] | Prisma.EvaluationUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutTemplateInput | Prisma.EvaluationCreateOrConnectWithoutTemplateInput[];
    createMany?: Prisma.EvaluationCreateManyTemplateInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput> | Prisma.EvaluationCreateWithoutTemplateInput[] | Prisma.EvaluationUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutTemplateInput | Prisma.EvaluationCreateOrConnectWithoutTemplateInput[];
    createMany?: Prisma.EvaluationCreateManyTemplateInputEnvelope;
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
};
export type EvaluationUpdateManyWithoutTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput> | Prisma.EvaluationCreateWithoutTemplateInput[] | Prisma.EvaluationUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutTemplateInput | Prisma.EvaluationCreateOrConnectWithoutTemplateInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutTemplateInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutTemplateInput[];
    createMany?: Prisma.EvaluationCreateManyTemplateInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutTemplateInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutTemplateInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutTemplateInput | Prisma.EvaluationUpdateManyWithWhereWithoutTemplateInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EvaluationUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput> | Prisma.EvaluationCreateWithoutTemplateInput[] | Prisma.EvaluationUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutTemplateInput | Prisma.EvaluationCreateOrConnectWithoutTemplateInput[];
    upsert?: Prisma.EvaluationUpsertWithWhereUniqueWithoutTemplateInput | Prisma.EvaluationUpsertWithWhereUniqueWithoutTemplateInput[];
    createMany?: Prisma.EvaluationCreateManyTemplateInputEnvelope;
    set?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    disconnect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    delete?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    connect?: Prisma.EvaluationWhereUniqueInput | Prisma.EvaluationWhereUniqueInput[];
    update?: Prisma.EvaluationUpdateWithWhereUniqueWithoutTemplateInput | Prisma.EvaluationUpdateWithWhereUniqueWithoutTemplateInput[];
    updateMany?: Prisma.EvaluationUpdateManyWithWhereWithoutTemplateInput | Prisma.EvaluationUpdateManyWithWhereWithoutTemplateInput[];
    deleteMany?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
};
export type EnumEvalStatusFieldUpdateOperationsInput = {
    set?: $Enums.EvalStatus;
};
export type EvaluationCreateNestedOneWithoutScoresInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutScoresInput, Prisma.EvaluationUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutScoresInput;
    connect?: Prisma.EvaluationWhereUniqueInput;
};
export type EvaluationUpdateOneRequiredWithoutScoresNestedInput = {
    create?: Prisma.XOR<Prisma.EvaluationCreateWithoutScoresInput, Prisma.EvaluationUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.EvaluationCreateOrConnectWithoutScoresInput;
    upsert?: Prisma.EvaluationUpsertWithoutScoresInput;
    connect?: Prisma.EvaluationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EvaluationUpdateToOneWithWhereWithoutScoresInput, Prisma.EvaluationUpdateWithoutScoresInput>, Prisma.EvaluationUncheckedUpdateWithoutScoresInput>;
};
export type EvaluationCreateWithoutEvaluatorInput = {
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutEvaluationsInput;
    subject: Prisma.MemberCreateNestedOneWithoutEvaluationsAboutInput;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationUncheckedCreateWithoutEvaluatorInput = {
    id?: number;
    templateId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationCreateOrConnectWithoutEvaluatorInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput>;
};
export type EvaluationCreateManyEvaluatorInputEnvelope = {
    data: Prisma.EvaluationCreateManyEvaluatorInput | Prisma.EvaluationCreateManyEvaluatorInput[];
    skipDuplicates?: boolean;
};
export type EvaluationCreateWithoutSubjectInput = {
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutEvaluationsInput;
    evaluator: Prisma.MemberCreateNestedOneWithoutEvaluationsWrittenInput;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationUncheckedCreateWithoutSubjectInput = {
    id?: number;
    templateId: number;
    evaluatorId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationCreateOrConnectWithoutSubjectInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput>;
};
export type EvaluationCreateManySubjectInputEnvelope = {
    data: Prisma.EvaluationCreateManySubjectInput | Prisma.EvaluationCreateManySubjectInput[];
    skipDuplicates?: boolean;
};
export type EvaluationUpsertWithWhereUniqueWithoutEvaluatorInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvaluationUpdateWithoutEvaluatorInput, Prisma.EvaluationUncheckedUpdateWithoutEvaluatorInput>;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutEvaluatorInput, Prisma.EvaluationUncheckedCreateWithoutEvaluatorInput>;
};
export type EvaluationUpdateWithWhereUniqueWithoutEvaluatorInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateWithoutEvaluatorInput, Prisma.EvaluationUncheckedUpdateWithoutEvaluatorInput>;
};
export type EvaluationUpdateManyWithWhereWithoutEvaluatorInput = {
    where: Prisma.EvaluationScalarWhereInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateManyMutationInput, Prisma.EvaluationUncheckedUpdateManyWithoutEvaluatorInput>;
};
export type EvaluationScalarWhereInput = {
    AND?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
    OR?: Prisma.EvaluationScalarWhereInput[];
    NOT?: Prisma.EvaluationScalarWhereInput | Prisma.EvaluationScalarWhereInput[];
    id?: Prisma.IntFilter<"Evaluation"> | number;
    templateId?: Prisma.IntFilter<"Evaluation"> | number;
    evaluatorId?: Prisma.IntFilter<"Evaluation"> | number;
    subjectId?: Prisma.IntFilter<"Evaluation"> | number;
    status?: Prisma.EnumEvalStatusFilter<"Evaluation"> | $Enums.EvalStatus;
    shiftDate?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    notes?: Prisma.StringNullableFilter<"Evaluation"> | string | null;
    signedByEvaluator?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    signedBySubject?: Prisma.DateTimeNullableFilter<"Evaluation"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Evaluation"> | Date | string;
};
export type EvaluationUpsertWithWhereUniqueWithoutSubjectInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvaluationUpdateWithoutSubjectInput, Prisma.EvaluationUncheckedUpdateWithoutSubjectInput>;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutSubjectInput, Prisma.EvaluationUncheckedCreateWithoutSubjectInput>;
};
export type EvaluationUpdateWithWhereUniqueWithoutSubjectInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateWithoutSubjectInput, Prisma.EvaluationUncheckedUpdateWithoutSubjectInput>;
};
export type EvaluationUpdateManyWithWhereWithoutSubjectInput = {
    where: Prisma.EvaluationScalarWhereInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateManyMutationInput, Prisma.EvaluationUncheckedUpdateManyWithoutSubjectInput>;
};
export type EvaluationCreateWithoutTemplateInput = {
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    evaluator: Prisma.MemberCreateNestedOneWithoutEvaluationsWrittenInput;
    subject: Prisma.MemberCreateNestedOneWithoutEvaluationsAboutInput;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationUncheckedCreateWithoutTemplateInput = {
    id?: number;
    evaluatorId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutEvaluationInput;
};
export type EvaluationCreateOrConnectWithoutTemplateInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput>;
};
export type EvaluationCreateManyTemplateInputEnvelope = {
    data: Prisma.EvaluationCreateManyTemplateInput | Prisma.EvaluationCreateManyTemplateInput[];
    skipDuplicates?: boolean;
};
export type EvaluationUpsertWithWhereUniqueWithoutTemplateInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvaluationUpdateWithoutTemplateInput, Prisma.EvaluationUncheckedUpdateWithoutTemplateInput>;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutTemplateInput, Prisma.EvaluationUncheckedCreateWithoutTemplateInput>;
};
export type EvaluationUpdateWithWhereUniqueWithoutTemplateInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateWithoutTemplateInput, Prisma.EvaluationUncheckedUpdateWithoutTemplateInput>;
};
export type EvaluationUpdateManyWithWhereWithoutTemplateInput = {
    where: Prisma.EvaluationScalarWhereInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateManyMutationInput, Prisma.EvaluationUncheckedUpdateManyWithoutTemplateInput>;
};
export type EvaluationCreateWithoutScoresInput = {
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutEvaluationsInput;
    evaluator: Prisma.MemberCreateNestedOneWithoutEvaluationsWrittenInput;
    subject: Prisma.MemberCreateNestedOneWithoutEvaluationsAboutInput;
};
export type EvaluationUncheckedCreateWithoutScoresInput = {
    id?: number;
    templateId: number;
    evaluatorId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EvaluationCreateOrConnectWithoutScoresInput = {
    where: Prisma.EvaluationWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutScoresInput, Prisma.EvaluationUncheckedCreateWithoutScoresInput>;
};
export type EvaluationUpsertWithoutScoresInput = {
    update: Prisma.XOR<Prisma.EvaluationUpdateWithoutScoresInput, Prisma.EvaluationUncheckedUpdateWithoutScoresInput>;
    create: Prisma.XOR<Prisma.EvaluationCreateWithoutScoresInput, Prisma.EvaluationUncheckedCreateWithoutScoresInput>;
    where?: Prisma.EvaluationWhereInput;
};
export type EvaluationUpdateToOneWithWhereWithoutScoresInput = {
    where?: Prisma.EvaluationWhereInput;
    data: Prisma.XOR<Prisma.EvaluationUpdateWithoutScoresInput, Prisma.EvaluationUncheckedUpdateWithoutScoresInput>;
};
export type EvaluationUpdateWithoutScoresInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutEvaluationsNestedInput;
    evaluator?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsWrittenNestedInput;
    subject?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsAboutNestedInput;
};
export type EvaluationUncheckedUpdateWithoutScoresInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationCreateManyEvaluatorInput = {
    id?: number;
    templateId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EvaluationCreateManySubjectInput = {
    id?: number;
    templateId: number;
    evaluatorId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EvaluationUpdateWithoutEvaluatorInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutEvaluationsNestedInput;
    subject?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsAboutNestedInput;
    scores?: Prisma.EvalScoreUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateWithoutEvaluatorInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateManyWithoutEvaluatorInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationUpdateWithoutSubjectInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutEvaluationsNestedInput;
    evaluator?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsWrittenNestedInput;
    scores?: Prisma.EvalScoreUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateWithoutSubjectInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateManyWithoutSubjectInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationCreateManyTemplateInput = {
    id?: number;
    evaluatorId: number;
    subjectId: number;
    status?: $Enums.EvalStatus;
    shiftDate?: Date | string | null;
    notes?: string | null;
    signedByEvaluator?: Date | string | null;
    signedBySubject?: Date | string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EvaluationUpdateWithoutTemplateInput = {
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    evaluator?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsWrittenNestedInput;
    subject?: Prisma.MemberUpdateOneRequiredWithoutEvaluationsAboutNestedInput;
    scores?: Prisma.EvalScoreUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateWithoutTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutEvaluationNestedInput;
};
export type EvaluationUncheckedUpdateManyWithoutTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    evaluatorId?: Prisma.IntFieldUpdateOperationsInput | number;
    subjectId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumEvalStatusFieldUpdateOperationsInput | $Enums.EvalStatus;
    shiftDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    signedByEvaluator?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    signedBySubject?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvaluationCountOutputType = {
    scores: number;
};
export type EvaluationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scores?: boolean | EvaluationCountOutputTypeCountScoresArgs;
};
export type EvaluationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationCountOutputTypeSelect<ExtArgs> | null;
};
export type EvaluationCountOutputTypeCountScoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalScoreWhereInput;
};
export type EvaluationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    evaluatorId?: boolean;
    subjectId?: boolean;
    status?: boolean;
    shiftDate?: boolean;
    notes?: boolean;
    signedByEvaluator?: boolean;
    signedBySubject?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    scores?: boolean | Prisma.Evaluation$scoresArgs<ExtArgs>;
    _count?: boolean | Prisma.EvaluationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evaluation"]>;
export type EvaluationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    evaluatorId?: boolean;
    subjectId?: boolean;
    status?: boolean;
    shiftDate?: boolean;
    notes?: boolean;
    signedByEvaluator?: boolean;
    signedBySubject?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evaluation"]>;
export type EvaluationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    evaluatorId?: boolean;
    subjectId?: boolean;
    status?: boolean;
    shiftDate?: boolean;
    notes?: boolean;
    signedByEvaluator?: boolean;
    signedBySubject?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evaluation"]>;
export type EvaluationSelectScalar = {
    id?: boolean;
    templateId?: boolean;
    evaluatorId?: boolean;
    subjectId?: boolean;
    status?: boolean;
    shiftDate?: boolean;
    notes?: boolean;
    signedByEvaluator?: boolean;
    signedBySubject?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EvaluationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "templateId" | "evaluatorId" | "subjectId" | "status" | "shiftDate" | "notes" | "signedByEvaluator" | "signedBySubject" | "createdAt" | "updatedAt", ExtArgs["result"]["evaluation"]>;
export type EvaluationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    scores?: boolean | Prisma.Evaluation$scoresArgs<ExtArgs>;
    _count?: boolean | Prisma.EvaluationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EvaluationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type EvaluationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    evaluator?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    subject?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $EvaluationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Evaluation";
    objects: {
        template: Prisma.$EvalFormTemplatePayload<ExtArgs>;
        evaluator: Prisma.$MemberPayload<ExtArgs>;
        subject: Prisma.$MemberPayload<ExtArgs>;
        scores: Prisma.$EvalScorePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        templateId: number;
        evaluatorId: number;
        subjectId: number;
        status: $Enums.EvalStatus;
        shiftDate: Date | null;
        notes: string | null;
        signedByEvaluator: Date | null;
        signedBySubject: Date | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["evaluation"]>;
    composites: {};
};
export type EvaluationGetPayload<S extends boolean | null | undefined | EvaluationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EvaluationPayload, S>;
export type EvaluationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EvaluationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EvaluationCountAggregateInputType | true;
};
export interface EvaluationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Evaluation'];
        meta: {
            name: 'Evaluation';
        };
    };
    findUnique<T extends EvaluationFindUniqueArgs>(args: Prisma.SelectSubset<T, EvaluationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EvaluationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EvaluationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EvaluationFindFirstArgs>(args?: Prisma.SelectSubset<T, EvaluationFindFirstArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EvaluationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EvaluationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EvaluationFindManyArgs>(args?: Prisma.SelectSubset<T, EvaluationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EvaluationCreateArgs>(args: Prisma.SelectSubset<T, EvaluationCreateArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EvaluationCreateManyArgs>(args?: Prisma.SelectSubset<T, EvaluationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EvaluationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EvaluationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EvaluationDeleteArgs>(args: Prisma.SelectSubset<T, EvaluationDeleteArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EvaluationUpdateArgs>(args: Prisma.SelectSubset<T, EvaluationUpdateArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EvaluationDeleteManyArgs>(args?: Prisma.SelectSubset<T, EvaluationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EvaluationUpdateManyArgs>(args: Prisma.SelectSubset<T, EvaluationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EvaluationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EvaluationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EvaluationUpsertArgs>(args: Prisma.SelectSubset<T, EvaluationUpsertArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EvaluationCountArgs>(args?: Prisma.Subset<T, EvaluationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EvaluationCountAggregateOutputType> : number>;
    aggregate<T extends EvaluationAggregateArgs>(args: Prisma.Subset<T, EvaluationAggregateArgs>): Prisma.PrismaPromise<GetEvaluationAggregateType<T>>;
    groupBy<T extends EvaluationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EvaluationGroupByArgs['orderBy'];
    } : {
        orderBy?: EvaluationGroupByArgs['orderBy'];
    }, OrderFields extends Prisma.ExcludeUnderscoreKeys<Prisma.Keys<Prisma.MaybeTupleToUnion<T['orderBy']>>>, ByFields extends Prisma.MaybeTupleToUnion<T['by']>, ByValid extends Prisma.Has<ByFields, OrderFields>, HavingFields extends Prisma.GetHavingFields<T['having']>, HavingValid extends Prisma.Has<ByFields, HavingFields>, ByEmpty extends T['by'] extends never[] ? Prisma.True : Prisma.False, InputErrors extends ByEmpty extends Prisma.True ? `Error: "by" must not be empty.` : HavingValid extends Prisma.False ? {
        [P in HavingFields]: P extends ByFields ? never : P extends string ? `Error: Field "${P}" used in "having" needs to be provided in "by".` : [
            Error,
            'Field ',
            P,
            ` in "having" needs to be provided in "by"`
        ];
    }[HavingFields] : 'take' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "take", you also need to provide "orderBy"' : 'skip' extends Prisma.Keys<T> ? 'orderBy' extends Prisma.Keys<T> ? ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields] : 'Error: If you provide "skip", you also need to provide "orderBy"' : ByValid extends Prisma.True ? {} : {
        [P in OrderFields]: P extends ByFields ? never : `Error: Field "${P}" in "orderBy" needs to be provided in "by"`;
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EvaluationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvaluationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EvaluationFieldRefs;
}
export interface Prisma__EvaluationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    template<T extends Prisma.EvalFormTemplateDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormTemplateDefaultArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    evaluator<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    subject<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scores<T extends Prisma.Evaluation$scoresArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Evaluation$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EvaluationFieldRefs {
    readonly id: Prisma.FieldRef<"Evaluation", 'Int'>;
    readonly templateId: Prisma.FieldRef<"Evaluation", 'Int'>;
    readonly evaluatorId: Prisma.FieldRef<"Evaluation", 'Int'>;
    readonly subjectId: Prisma.FieldRef<"Evaluation", 'Int'>;
    readonly status: Prisma.FieldRef<"Evaluation", 'EvalStatus'>;
    readonly shiftDate: Prisma.FieldRef<"Evaluation", 'DateTime'>;
    readonly notes: Prisma.FieldRef<"Evaluation", 'String'>;
    readonly signedByEvaluator: Prisma.FieldRef<"Evaluation", 'DateTime'>;
    readonly signedBySubject: Prisma.FieldRef<"Evaluation", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"Evaluation", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Evaluation", 'DateTime'>;
}
export type EvaluationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where: Prisma.EvaluationWhereUniqueInput;
};
export type EvaluationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where: Prisma.EvaluationWhereUniqueInput;
};
export type EvaluationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where?: Prisma.EvaluationWhereInput;
    orderBy?: Prisma.EvaluationOrderByWithRelationInput | Prisma.EvaluationOrderByWithRelationInput[];
    cursor?: Prisma.EvaluationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvaluationScalarFieldEnum | Prisma.EvaluationScalarFieldEnum[];
};
export type EvaluationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where?: Prisma.EvaluationWhereInput;
    orderBy?: Prisma.EvaluationOrderByWithRelationInput | Prisma.EvaluationOrderByWithRelationInput[];
    cursor?: Prisma.EvaluationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvaluationScalarFieldEnum | Prisma.EvaluationScalarFieldEnum[];
};
export type EvaluationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where?: Prisma.EvaluationWhereInput;
    orderBy?: Prisma.EvaluationOrderByWithRelationInput | Prisma.EvaluationOrderByWithRelationInput[];
    cursor?: Prisma.EvaluationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvaluationScalarFieldEnum | Prisma.EvaluationScalarFieldEnum[];
};
export type EvaluationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvaluationCreateInput, Prisma.EvaluationUncheckedCreateInput>;
};
export type EvaluationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EvaluationCreateManyInput | Prisma.EvaluationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EvaluationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    data: Prisma.EvaluationCreateManyInput | Prisma.EvaluationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EvaluationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EvaluationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvaluationUpdateInput, Prisma.EvaluationUncheckedUpdateInput>;
    where: Prisma.EvaluationWhereUniqueInput;
};
export type EvaluationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EvaluationUpdateManyMutationInput, Prisma.EvaluationUncheckedUpdateManyInput>;
    where?: Prisma.EvaluationWhereInput;
    limit?: number;
};
export type EvaluationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvaluationUpdateManyMutationInput, Prisma.EvaluationUncheckedUpdateManyInput>;
    where?: Prisma.EvaluationWhereInput;
    limit?: number;
    include?: Prisma.EvaluationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EvaluationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where: Prisma.EvaluationWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvaluationCreateInput, Prisma.EvaluationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EvaluationUpdateInput, Prisma.EvaluationUncheckedUpdateInput>;
};
export type EvaluationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
    where: Prisma.EvaluationWhereUniqueInput;
};
export type EvaluationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvaluationWhereInput;
    limit?: number;
};
export type Evaluation$scoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    where?: Prisma.EvalScoreWhereInput;
    orderBy?: Prisma.EvalScoreOrderByWithRelationInput | Prisma.EvalScoreOrderByWithRelationInput[];
    cursor?: Prisma.EvalScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalScoreScalarFieldEnum | Prisma.EvalScoreScalarFieldEnum[];
};
export type EvaluationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvaluationSelect<ExtArgs> | null;
    omit?: Prisma.EvaluationOmit<ExtArgs> | null;
    include?: Prisma.EvaluationInclude<ExtArgs> | null;
};
