import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EvalScoreModel = runtime.Types.Result.DefaultSelection<Prisma.$EvalScorePayload>;
export type AggregateEvalScore = {
    _count: EvalScoreCountAggregateOutputType | null;
    _avg: EvalScoreAvgAggregateOutputType | null;
    _sum: EvalScoreSumAggregateOutputType | null;
    _min: EvalScoreMinAggregateOutputType | null;
    _max: EvalScoreMaxAggregateOutputType | null;
};
export type EvalScoreAvgAggregateOutputType = {
    evaluationId: number | null;
    itemId: number | null;
    scaleValue: number | null;
};
export type EvalScoreSumAggregateOutputType = {
    evaluationId: number | null;
    itemId: number | null;
    scaleValue: number | null;
};
export type EvalScoreMinAggregateOutputType = {
    evaluationId: number | null;
    itemId: number | null;
    scaleValue: number | null;
    passed: boolean | null;
    textValue: string | null;
};
export type EvalScoreMaxAggregateOutputType = {
    evaluationId: number | null;
    itemId: number | null;
    scaleValue: number | null;
    passed: boolean | null;
    textValue: string | null;
};
export type EvalScoreCountAggregateOutputType = {
    evaluationId: number;
    itemId: number;
    scaleValue: number;
    passed: number;
    textValue: number;
    _all: number;
};
export type EvalScoreAvgAggregateInputType = {
    evaluationId?: true;
    itemId?: true;
    scaleValue?: true;
};
export type EvalScoreSumAggregateInputType = {
    evaluationId?: true;
    itemId?: true;
    scaleValue?: true;
};
export type EvalScoreMinAggregateInputType = {
    evaluationId?: true;
    itemId?: true;
    scaleValue?: true;
    passed?: true;
    textValue?: true;
};
export type EvalScoreMaxAggregateInputType = {
    evaluationId?: true;
    itemId?: true;
    scaleValue?: true;
    passed?: true;
    textValue?: true;
};
export type EvalScoreCountAggregateInputType = {
    evaluationId?: true;
    itemId?: true;
    scaleValue?: true;
    passed?: true;
    textValue?: true;
    _all?: true;
};
export type EvalScoreAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalScoreWhereInput;
    orderBy?: Prisma.EvalScoreOrderByWithRelationInput | Prisma.EvalScoreOrderByWithRelationInput[];
    cursor?: Prisma.EvalScoreWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EvalScoreCountAggregateInputType;
    _avg?: EvalScoreAvgAggregateInputType;
    _sum?: EvalScoreSumAggregateInputType;
    _min?: EvalScoreMinAggregateInputType;
    _max?: EvalScoreMaxAggregateInputType;
};
export type GetEvalScoreAggregateType<T extends EvalScoreAggregateArgs> = {
    [P in keyof T & keyof AggregateEvalScore]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvalScore[P]> : Prisma.GetScalarType<T[P], AggregateEvalScore[P]>;
};
export type EvalScoreGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalScoreWhereInput;
    orderBy?: Prisma.EvalScoreOrderByWithAggregationInput | Prisma.EvalScoreOrderByWithAggregationInput[];
    by: Prisma.EvalScoreScalarFieldEnum[] | Prisma.EvalScoreScalarFieldEnum;
    having?: Prisma.EvalScoreScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EvalScoreCountAggregateInputType | true;
    _avg?: EvalScoreAvgAggregateInputType;
    _sum?: EvalScoreSumAggregateInputType;
    _min?: EvalScoreMinAggregateInputType;
    _max?: EvalScoreMaxAggregateInputType;
};
export type EvalScoreGroupByOutputType = {
    evaluationId: number;
    itemId: number;
    scaleValue: number | null;
    passed: boolean | null;
    textValue: string | null;
    _count: EvalScoreCountAggregateOutputType | null;
    _avg: EvalScoreAvgAggregateOutputType | null;
    _sum: EvalScoreSumAggregateOutputType | null;
    _min: EvalScoreMinAggregateOutputType | null;
    _max: EvalScoreMaxAggregateOutputType | null;
};
export type GetEvalScoreGroupByPayload<T extends EvalScoreGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EvalScoreGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EvalScoreGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EvalScoreGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EvalScoreGroupByOutputType[P]>;
}>>;
export type EvalScoreWhereInput = {
    AND?: Prisma.EvalScoreWhereInput | Prisma.EvalScoreWhereInput[];
    OR?: Prisma.EvalScoreWhereInput[];
    NOT?: Prisma.EvalScoreWhereInput | Prisma.EvalScoreWhereInput[];
    evaluationId?: Prisma.IntFilter<"EvalScore"> | number;
    itemId?: Prisma.IntFilter<"EvalScore"> | number;
    scaleValue?: Prisma.IntNullableFilter<"EvalScore"> | number | null;
    passed?: Prisma.BoolNullableFilter<"EvalScore"> | boolean | null;
    textValue?: Prisma.StringNullableFilter<"EvalScore"> | string | null;
    evaluation?: Prisma.XOR<Prisma.EvaluationScalarRelationFilter, Prisma.EvaluationWhereInput>;
    item?: Prisma.XOR<Prisma.EvalFormItemScalarRelationFilter, Prisma.EvalFormItemWhereInput>;
};
export type EvalScoreOrderByWithRelationInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    passed?: Prisma.SortOrderInput | Prisma.SortOrder;
    textValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    evaluation?: Prisma.EvaluationOrderByWithRelationInput;
    item?: Prisma.EvalFormItemOrderByWithRelationInput;
};
export type EvalScoreWhereUniqueInput = Prisma.AtLeast<{
    evaluationId_itemId?: Prisma.EvalScoreEvaluationIdItemIdCompoundUniqueInput;
    AND?: Prisma.EvalScoreWhereInput | Prisma.EvalScoreWhereInput[];
    OR?: Prisma.EvalScoreWhereInput[];
    NOT?: Prisma.EvalScoreWhereInput | Prisma.EvalScoreWhereInput[];
    evaluationId?: Prisma.IntFilter<"EvalScore"> | number;
    itemId?: Prisma.IntFilter<"EvalScore"> | number;
    scaleValue?: Prisma.IntNullableFilter<"EvalScore"> | number | null;
    passed?: Prisma.BoolNullableFilter<"EvalScore"> | boolean | null;
    textValue?: Prisma.StringNullableFilter<"EvalScore"> | string | null;
    evaluation?: Prisma.XOR<Prisma.EvaluationScalarRelationFilter, Prisma.EvaluationWhereInput>;
    item?: Prisma.XOR<Prisma.EvalFormItemScalarRelationFilter, Prisma.EvalFormItemWhereInput>;
}, "evaluationId_itemId">;
export type EvalScoreOrderByWithAggregationInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    passed?: Prisma.SortOrderInput | Prisma.SortOrder;
    textValue?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.EvalScoreCountOrderByAggregateInput;
    _avg?: Prisma.EvalScoreAvgOrderByAggregateInput;
    _max?: Prisma.EvalScoreMaxOrderByAggregateInput;
    _min?: Prisma.EvalScoreMinOrderByAggregateInput;
    _sum?: Prisma.EvalScoreSumOrderByAggregateInput;
};
export type EvalScoreScalarWhereWithAggregatesInput = {
    AND?: Prisma.EvalScoreScalarWhereWithAggregatesInput | Prisma.EvalScoreScalarWhereWithAggregatesInput[];
    OR?: Prisma.EvalScoreScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EvalScoreScalarWhereWithAggregatesInput | Prisma.EvalScoreScalarWhereWithAggregatesInput[];
    evaluationId?: Prisma.IntWithAggregatesFilter<"EvalScore"> | number;
    itemId?: Prisma.IntWithAggregatesFilter<"EvalScore"> | number;
    scaleValue?: Prisma.IntNullableWithAggregatesFilter<"EvalScore"> | number | null;
    passed?: Prisma.BoolNullableWithAggregatesFilter<"EvalScore"> | boolean | null;
    textValue?: Prisma.StringNullableWithAggregatesFilter<"EvalScore"> | string | null;
};
export type EvalScoreCreateInput = {
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
    evaluation: Prisma.EvaluationCreateNestedOneWithoutScoresInput;
    item: Prisma.EvalFormItemCreateNestedOneWithoutScoresInput;
};
export type EvalScoreUncheckedCreateInput = {
    evaluationId: number;
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreUpdateInput = {
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    evaluation?: Prisma.EvaluationUpdateOneRequiredWithoutScoresNestedInput;
    item?: Prisma.EvalFormItemUpdateOneRequiredWithoutScoresNestedInput;
};
export type EvalScoreUncheckedUpdateInput = {
    evaluationId?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreCreateManyInput = {
    evaluationId: number;
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreUpdateManyMutationInput = {
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreUncheckedUpdateManyInput = {
    evaluationId?: Prisma.IntFieldUpdateOperationsInput | number;
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreListRelationFilter = {
    every?: Prisma.EvalScoreWhereInput;
    some?: Prisma.EvalScoreWhereInput;
    none?: Prisma.EvalScoreWhereInput;
};
export type EvalScoreOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EvalScoreEvaluationIdItemIdCompoundUniqueInput = {
    evaluationId: number;
    itemId: number;
};
export type EvalScoreCountOrderByAggregateInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrder;
    passed?: Prisma.SortOrder;
    textValue?: Prisma.SortOrder;
};
export type EvalScoreAvgOrderByAggregateInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrder;
};
export type EvalScoreMaxOrderByAggregateInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrder;
    passed?: Prisma.SortOrder;
    textValue?: Prisma.SortOrder;
};
export type EvalScoreMinOrderByAggregateInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrder;
    passed?: Prisma.SortOrder;
    textValue?: Prisma.SortOrder;
};
export type EvalScoreSumOrderByAggregateInput = {
    evaluationId?: Prisma.SortOrder;
    itemId?: Prisma.SortOrder;
    scaleValue?: Prisma.SortOrder;
};
export type EvalScoreCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput> | Prisma.EvalScoreCreateWithoutItemInput[] | Prisma.EvalScoreUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutItemInput | Prisma.EvalScoreCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.EvalScoreCreateManyItemInputEnvelope;
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
};
export type EvalScoreUncheckedCreateNestedManyWithoutItemInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput> | Prisma.EvalScoreCreateWithoutItemInput[] | Prisma.EvalScoreUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutItemInput | Prisma.EvalScoreCreateOrConnectWithoutItemInput[];
    createMany?: Prisma.EvalScoreCreateManyItemInputEnvelope;
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
};
export type EvalScoreUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput> | Prisma.EvalScoreCreateWithoutItemInput[] | Prisma.EvalScoreUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutItemInput | Prisma.EvalScoreCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.EvalScoreUpsertWithWhereUniqueWithoutItemInput | Prisma.EvalScoreUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.EvalScoreCreateManyItemInputEnvelope;
    set?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    disconnect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    delete?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    update?: Prisma.EvalScoreUpdateWithWhereUniqueWithoutItemInput | Prisma.EvalScoreUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.EvalScoreUpdateManyWithWhereWithoutItemInput | Prisma.EvalScoreUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
};
export type EvalScoreUncheckedUpdateManyWithoutItemNestedInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput> | Prisma.EvalScoreCreateWithoutItemInput[] | Prisma.EvalScoreUncheckedCreateWithoutItemInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutItemInput | Prisma.EvalScoreCreateOrConnectWithoutItemInput[];
    upsert?: Prisma.EvalScoreUpsertWithWhereUniqueWithoutItemInput | Prisma.EvalScoreUpsertWithWhereUniqueWithoutItemInput[];
    createMany?: Prisma.EvalScoreCreateManyItemInputEnvelope;
    set?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    disconnect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    delete?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    update?: Prisma.EvalScoreUpdateWithWhereUniqueWithoutItemInput | Prisma.EvalScoreUpdateWithWhereUniqueWithoutItemInput[];
    updateMany?: Prisma.EvalScoreUpdateManyWithWhereWithoutItemInput | Prisma.EvalScoreUpdateManyWithWhereWithoutItemInput[];
    deleteMany?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
};
export type EvalScoreCreateNestedManyWithoutEvaluationInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput> | Prisma.EvalScoreCreateWithoutEvaluationInput[] | Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput | Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput[];
    createMany?: Prisma.EvalScoreCreateManyEvaluationInputEnvelope;
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
};
export type EvalScoreUncheckedCreateNestedManyWithoutEvaluationInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput> | Prisma.EvalScoreCreateWithoutEvaluationInput[] | Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput | Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput[];
    createMany?: Prisma.EvalScoreCreateManyEvaluationInputEnvelope;
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
};
export type EvalScoreUpdateManyWithoutEvaluationNestedInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput> | Prisma.EvalScoreCreateWithoutEvaluationInput[] | Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput | Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput[];
    upsert?: Prisma.EvalScoreUpsertWithWhereUniqueWithoutEvaluationInput | Prisma.EvalScoreUpsertWithWhereUniqueWithoutEvaluationInput[];
    createMany?: Prisma.EvalScoreCreateManyEvaluationInputEnvelope;
    set?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    disconnect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    delete?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    update?: Prisma.EvalScoreUpdateWithWhereUniqueWithoutEvaluationInput | Prisma.EvalScoreUpdateWithWhereUniqueWithoutEvaluationInput[];
    updateMany?: Prisma.EvalScoreUpdateManyWithWhereWithoutEvaluationInput | Prisma.EvalScoreUpdateManyWithWhereWithoutEvaluationInput[];
    deleteMany?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
};
export type EvalScoreUncheckedUpdateManyWithoutEvaluationNestedInput = {
    create?: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput> | Prisma.EvalScoreCreateWithoutEvaluationInput[] | Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput[];
    connectOrCreate?: Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput | Prisma.EvalScoreCreateOrConnectWithoutEvaluationInput[];
    upsert?: Prisma.EvalScoreUpsertWithWhereUniqueWithoutEvaluationInput | Prisma.EvalScoreUpsertWithWhereUniqueWithoutEvaluationInput[];
    createMany?: Prisma.EvalScoreCreateManyEvaluationInputEnvelope;
    set?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    disconnect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    delete?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    connect?: Prisma.EvalScoreWhereUniqueInput | Prisma.EvalScoreWhereUniqueInput[];
    update?: Prisma.EvalScoreUpdateWithWhereUniqueWithoutEvaluationInput | Prisma.EvalScoreUpdateWithWhereUniqueWithoutEvaluationInput[];
    updateMany?: Prisma.EvalScoreUpdateManyWithWhereWithoutEvaluationInput | Prisma.EvalScoreUpdateManyWithWhereWithoutEvaluationInput[];
    deleteMany?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
};
export type NullableBoolFieldUpdateOperationsInput = {
    set?: boolean | null;
};
export type EvalScoreCreateWithoutItemInput = {
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
    evaluation: Prisma.EvaluationCreateNestedOneWithoutScoresInput;
};
export type EvalScoreUncheckedCreateWithoutItemInput = {
    evaluationId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreCreateOrConnectWithoutItemInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput>;
};
export type EvalScoreCreateManyItemInputEnvelope = {
    data: Prisma.EvalScoreCreateManyItemInput | Prisma.EvalScoreCreateManyItemInput[];
    skipDuplicates?: boolean;
};
export type EvalScoreUpsertWithWhereUniqueWithoutItemInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvalScoreUpdateWithoutItemInput, Prisma.EvalScoreUncheckedUpdateWithoutItemInput>;
    create: Prisma.XOR<Prisma.EvalScoreCreateWithoutItemInput, Prisma.EvalScoreUncheckedCreateWithoutItemInput>;
};
export type EvalScoreUpdateWithWhereUniqueWithoutItemInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvalScoreUpdateWithoutItemInput, Prisma.EvalScoreUncheckedUpdateWithoutItemInput>;
};
export type EvalScoreUpdateManyWithWhereWithoutItemInput = {
    where: Prisma.EvalScoreScalarWhereInput;
    data: Prisma.XOR<Prisma.EvalScoreUpdateManyMutationInput, Prisma.EvalScoreUncheckedUpdateManyWithoutItemInput>;
};
export type EvalScoreScalarWhereInput = {
    AND?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
    OR?: Prisma.EvalScoreScalarWhereInput[];
    NOT?: Prisma.EvalScoreScalarWhereInput | Prisma.EvalScoreScalarWhereInput[];
    evaluationId?: Prisma.IntFilter<"EvalScore"> | number;
    itemId?: Prisma.IntFilter<"EvalScore"> | number;
    scaleValue?: Prisma.IntNullableFilter<"EvalScore"> | number | null;
    passed?: Prisma.BoolNullableFilter<"EvalScore"> | boolean | null;
    textValue?: Prisma.StringNullableFilter<"EvalScore"> | string | null;
};
export type EvalScoreCreateWithoutEvaluationInput = {
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
    item: Prisma.EvalFormItemCreateNestedOneWithoutScoresInput;
};
export type EvalScoreUncheckedCreateWithoutEvaluationInput = {
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreCreateOrConnectWithoutEvaluationInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput>;
};
export type EvalScoreCreateManyEvaluationInputEnvelope = {
    data: Prisma.EvalScoreCreateManyEvaluationInput | Prisma.EvalScoreCreateManyEvaluationInput[];
    skipDuplicates?: boolean;
};
export type EvalScoreUpsertWithWhereUniqueWithoutEvaluationInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvalScoreUpdateWithoutEvaluationInput, Prisma.EvalScoreUncheckedUpdateWithoutEvaluationInput>;
    create: Prisma.XOR<Prisma.EvalScoreCreateWithoutEvaluationInput, Prisma.EvalScoreUncheckedCreateWithoutEvaluationInput>;
};
export type EvalScoreUpdateWithWhereUniqueWithoutEvaluationInput = {
    where: Prisma.EvalScoreWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvalScoreUpdateWithoutEvaluationInput, Prisma.EvalScoreUncheckedUpdateWithoutEvaluationInput>;
};
export type EvalScoreUpdateManyWithWhereWithoutEvaluationInput = {
    where: Prisma.EvalScoreScalarWhereInput;
    data: Prisma.XOR<Prisma.EvalScoreUpdateManyMutationInput, Prisma.EvalScoreUncheckedUpdateManyWithoutEvaluationInput>;
};
export type EvalScoreCreateManyItemInput = {
    evaluationId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreUpdateWithoutItemInput = {
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    evaluation?: Prisma.EvaluationUpdateOneRequiredWithoutScoresNestedInput;
};
export type EvalScoreUncheckedUpdateWithoutItemInput = {
    evaluationId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreUncheckedUpdateManyWithoutItemInput = {
    evaluationId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreCreateManyEvaluationInput = {
    itemId: number;
    scaleValue?: number | null;
    passed?: boolean | null;
    textValue?: string | null;
};
export type EvalScoreUpdateWithoutEvaluationInput = {
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    item?: Prisma.EvalFormItemUpdateOneRequiredWithoutScoresNestedInput;
};
export type EvalScoreUncheckedUpdateWithoutEvaluationInput = {
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreUncheckedUpdateManyWithoutEvaluationInput = {
    itemId?: Prisma.IntFieldUpdateOperationsInput | number;
    scaleValue?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    passed?: Prisma.NullableBoolFieldUpdateOperationsInput | boolean | null;
    textValue?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EvalScoreSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    evaluationId?: boolean;
    itemId?: boolean;
    scaleValue?: boolean;
    passed?: boolean;
    textValue?: boolean;
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalScore"]>;
export type EvalScoreSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    evaluationId?: boolean;
    itemId?: boolean;
    scaleValue?: boolean;
    passed?: boolean;
    textValue?: boolean;
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalScore"]>;
export type EvalScoreSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    evaluationId?: boolean;
    itemId?: boolean;
    scaleValue?: boolean;
    passed?: boolean;
    textValue?: boolean;
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalScore"]>;
export type EvalScoreSelectScalar = {
    evaluationId?: boolean;
    itemId?: boolean;
    scaleValue?: boolean;
    passed?: boolean;
    textValue?: boolean;
};
export type EvalScoreOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"evaluationId" | "itemId" | "scaleValue" | "passed" | "textValue", ExtArgs["result"]["evalScore"]>;
export type EvalScoreInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
};
export type EvalScoreIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
};
export type EvalScoreIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    evaluation?: boolean | Prisma.EvaluationDefaultArgs<ExtArgs>;
    item?: boolean | Prisma.EvalFormItemDefaultArgs<ExtArgs>;
};
export type $EvalScorePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EvalScore";
    objects: {
        evaluation: Prisma.$EvaluationPayload<ExtArgs>;
        item: Prisma.$EvalFormItemPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        evaluationId: number;
        itemId: number;
        scaleValue: number | null;
        passed: boolean | null;
        textValue: string | null;
    }, ExtArgs["result"]["evalScore"]>;
    composites: {};
};
export type EvalScoreGetPayload<S extends boolean | null | undefined | EvalScoreDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EvalScorePayload, S>;
export type EvalScoreCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EvalScoreFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EvalScoreCountAggregateInputType | true;
};
export interface EvalScoreDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EvalScore'];
        meta: {
            name: 'EvalScore';
        };
    };
    findUnique<T extends EvalScoreFindUniqueArgs>(args: Prisma.SelectSubset<T, EvalScoreFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EvalScoreFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EvalScoreFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EvalScoreFindFirstArgs>(args?: Prisma.SelectSubset<T, EvalScoreFindFirstArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EvalScoreFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EvalScoreFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EvalScoreFindManyArgs>(args?: Prisma.SelectSubset<T, EvalScoreFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EvalScoreCreateArgs>(args: Prisma.SelectSubset<T, EvalScoreCreateArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EvalScoreCreateManyArgs>(args?: Prisma.SelectSubset<T, EvalScoreCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EvalScoreCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EvalScoreCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EvalScoreDeleteArgs>(args: Prisma.SelectSubset<T, EvalScoreDeleteArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EvalScoreUpdateArgs>(args: Prisma.SelectSubset<T, EvalScoreUpdateArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EvalScoreDeleteManyArgs>(args?: Prisma.SelectSubset<T, EvalScoreDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EvalScoreUpdateManyArgs>(args: Prisma.SelectSubset<T, EvalScoreUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EvalScoreUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EvalScoreUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EvalScoreUpsertArgs>(args: Prisma.SelectSubset<T, EvalScoreUpsertArgs<ExtArgs>>): Prisma.Prisma__EvalScoreClient<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EvalScoreCountArgs>(args?: Prisma.Subset<T, EvalScoreCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EvalScoreCountAggregateOutputType> : number>;
    aggregate<T extends EvalScoreAggregateArgs>(args: Prisma.Subset<T, EvalScoreAggregateArgs>): Prisma.PrismaPromise<GetEvalScoreAggregateType<T>>;
    groupBy<T extends EvalScoreGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EvalScoreGroupByArgs['orderBy'];
    } : {
        orderBy?: EvalScoreGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EvalScoreGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvalScoreGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EvalScoreFieldRefs;
}
export interface Prisma__EvalScoreClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    evaluation<T extends Prisma.EvaluationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvaluationDefaultArgs<ExtArgs>>): Prisma.Prisma__EvaluationClient<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    item<T extends Prisma.EvalFormItemDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormItemDefaultArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EvalScoreFieldRefs {
    readonly evaluationId: Prisma.FieldRef<"EvalScore", 'Int'>;
    readonly itemId: Prisma.FieldRef<"EvalScore", 'Int'>;
    readonly scaleValue: Prisma.FieldRef<"EvalScore", 'Int'>;
    readonly passed: Prisma.FieldRef<"EvalScore", 'Boolean'>;
    readonly textValue: Prisma.FieldRef<"EvalScore", 'String'>;
}
export type EvalScoreFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    where: Prisma.EvalScoreWhereUniqueInput;
};
export type EvalScoreFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    where: Prisma.EvalScoreWhereUniqueInput;
};
export type EvalScoreFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalScoreFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalScoreFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalScoreCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalScoreCreateInput, Prisma.EvalScoreUncheckedCreateInput>;
};
export type EvalScoreCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EvalScoreCreateManyInput | Prisma.EvalScoreCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EvalScoreCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    data: Prisma.EvalScoreCreateManyInput | Prisma.EvalScoreCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EvalScoreIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EvalScoreUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalScoreUpdateInput, Prisma.EvalScoreUncheckedUpdateInput>;
    where: Prisma.EvalScoreWhereUniqueInput;
};
export type EvalScoreUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EvalScoreUpdateManyMutationInput, Prisma.EvalScoreUncheckedUpdateManyInput>;
    where?: Prisma.EvalScoreWhereInput;
    limit?: number;
};
export type EvalScoreUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalScoreUpdateManyMutationInput, Prisma.EvalScoreUncheckedUpdateManyInput>;
    where?: Prisma.EvalScoreWhereInput;
    limit?: number;
    include?: Prisma.EvalScoreIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EvalScoreUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    where: Prisma.EvalScoreWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalScoreCreateInput, Prisma.EvalScoreUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EvalScoreUpdateInput, Prisma.EvalScoreUncheckedUpdateInput>;
};
export type EvalScoreDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
    where: Prisma.EvalScoreWhereUniqueInput;
};
export type EvalScoreDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalScoreWhereInput;
    limit?: number;
};
export type EvalScoreDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalScoreSelect<ExtArgs> | null;
    omit?: Prisma.EvalScoreOmit<ExtArgs> | null;
    include?: Prisma.EvalScoreInclude<ExtArgs> | null;
};
