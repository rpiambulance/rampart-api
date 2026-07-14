import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EvalFormItemModel = runtime.Types.Result.DefaultSelection<Prisma.$EvalFormItemPayload>;
export type AggregateEvalFormItem = {
    _count: EvalFormItemCountAggregateOutputType | null;
    _avg: EvalFormItemAvgAggregateOutputType | null;
    _sum: EvalFormItemSumAggregateOutputType | null;
    _min: EvalFormItemMinAggregateOutputType | null;
    _max: EvalFormItemMaxAggregateOutputType | null;
};
export type EvalFormItemAvgAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    order: number | null;
};
export type EvalFormItemSumAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    order: number | null;
};
export type EvalFormItemMinAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    order: number | null;
    prompt: string | null;
    scoreType: $Enums.ScoreType | null;
};
export type EvalFormItemMaxAggregateOutputType = {
    id: number | null;
    templateId: number | null;
    order: number | null;
    prompt: string | null;
    scoreType: $Enums.ScoreType | null;
};
export type EvalFormItemCountAggregateOutputType = {
    id: number;
    templateId: number;
    order: number;
    prompt: number;
    scoreType: number;
    _all: number;
};
export type EvalFormItemAvgAggregateInputType = {
    id?: true;
    templateId?: true;
    order?: true;
};
export type EvalFormItemSumAggregateInputType = {
    id?: true;
    templateId?: true;
    order?: true;
};
export type EvalFormItemMinAggregateInputType = {
    id?: true;
    templateId?: true;
    order?: true;
    prompt?: true;
    scoreType?: true;
};
export type EvalFormItemMaxAggregateInputType = {
    id?: true;
    templateId?: true;
    order?: true;
    prompt?: true;
    scoreType?: true;
};
export type EvalFormItemCountAggregateInputType = {
    id?: true;
    templateId?: true;
    order?: true;
    prompt?: true;
    scoreType?: true;
    _all?: true;
};
export type EvalFormItemAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormItemWhereInput;
    orderBy?: Prisma.EvalFormItemOrderByWithRelationInput | Prisma.EvalFormItemOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormItemWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EvalFormItemCountAggregateInputType;
    _avg?: EvalFormItemAvgAggregateInputType;
    _sum?: EvalFormItemSumAggregateInputType;
    _min?: EvalFormItemMinAggregateInputType;
    _max?: EvalFormItemMaxAggregateInputType;
};
export type GetEvalFormItemAggregateType<T extends EvalFormItemAggregateArgs> = {
    [P in keyof T & keyof AggregateEvalFormItem]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvalFormItem[P]> : Prisma.GetScalarType<T[P], AggregateEvalFormItem[P]>;
};
export type EvalFormItemGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormItemWhereInput;
    orderBy?: Prisma.EvalFormItemOrderByWithAggregationInput | Prisma.EvalFormItemOrderByWithAggregationInput[];
    by: Prisma.EvalFormItemScalarFieldEnum[] | Prisma.EvalFormItemScalarFieldEnum;
    having?: Prisma.EvalFormItemScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EvalFormItemCountAggregateInputType | true;
    _avg?: EvalFormItemAvgAggregateInputType;
    _sum?: EvalFormItemSumAggregateInputType;
    _min?: EvalFormItemMinAggregateInputType;
    _max?: EvalFormItemMaxAggregateInputType;
};
export type EvalFormItemGroupByOutputType = {
    id: number;
    templateId: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    _count: EvalFormItemCountAggregateOutputType | null;
    _avg: EvalFormItemAvgAggregateOutputType | null;
    _sum: EvalFormItemSumAggregateOutputType | null;
    _min: EvalFormItemMinAggregateOutputType | null;
    _max: EvalFormItemMaxAggregateOutputType | null;
};
export type GetEvalFormItemGroupByPayload<T extends EvalFormItemGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EvalFormItemGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EvalFormItemGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EvalFormItemGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EvalFormItemGroupByOutputType[P]>;
}>>;
export type EvalFormItemWhereInput = {
    AND?: Prisma.EvalFormItemWhereInput | Prisma.EvalFormItemWhereInput[];
    OR?: Prisma.EvalFormItemWhereInput[];
    NOT?: Prisma.EvalFormItemWhereInput | Prisma.EvalFormItemWhereInput[];
    id?: Prisma.IntFilter<"EvalFormItem"> | number;
    templateId?: Prisma.IntFilter<"EvalFormItem"> | number;
    order?: Prisma.IntFilter<"EvalFormItem"> | number;
    prompt?: Prisma.StringFilter<"EvalFormItem"> | string;
    scoreType?: Prisma.EnumScoreTypeFilter<"EvalFormItem"> | $Enums.ScoreType;
    template?: Prisma.XOR<Prisma.EvalFormTemplateScalarRelationFilter, Prisma.EvalFormTemplateWhereInput>;
    scores?: Prisma.EvalScoreListRelationFilter;
};
export type EvalFormItemOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    scoreType?: Prisma.SortOrder;
    template?: Prisma.EvalFormTemplateOrderByWithRelationInput;
    scores?: Prisma.EvalScoreOrderByRelationAggregateInput;
};
export type EvalFormItemWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    templateId_order?: Prisma.EvalFormItemTemplateIdOrderCompoundUniqueInput;
    AND?: Prisma.EvalFormItemWhereInput | Prisma.EvalFormItemWhereInput[];
    OR?: Prisma.EvalFormItemWhereInput[];
    NOT?: Prisma.EvalFormItemWhereInput | Prisma.EvalFormItemWhereInput[];
    templateId?: Prisma.IntFilter<"EvalFormItem"> | number;
    order?: Prisma.IntFilter<"EvalFormItem"> | number;
    prompt?: Prisma.StringFilter<"EvalFormItem"> | string;
    scoreType?: Prisma.EnumScoreTypeFilter<"EvalFormItem"> | $Enums.ScoreType;
    template?: Prisma.XOR<Prisma.EvalFormTemplateScalarRelationFilter, Prisma.EvalFormTemplateWhereInput>;
    scores?: Prisma.EvalScoreListRelationFilter;
}, "id" | "templateId_order">;
export type EvalFormItemOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    scoreType?: Prisma.SortOrder;
    _count?: Prisma.EvalFormItemCountOrderByAggregateInput;
    _avg?: Prisma.EvalFormItemAvgOrderByAggregateInput;
    _max?: Prisma.EvalFormItemMaxOrderByAggregateInput;
    _min?: Prisma.EvalFormItemMinOrderByAggregateInput;
    _sum?: Prisma.EvalFormItemSumOrderByAggregateInput;
};
export type EvalFormItemScalarWhereWithAggregatesInput = {
    AND?: Prisma.EvalFormItemScalarWhereWithAggregatesInput | Prisma.EvalFormItemScalarWhereWithAggregatesInput[];
    OR?: Prisma.EvalFormItemScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EvalFormItemScalarWhereWithAggregatesInput | Prisma.EvalFormItemScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EvalFormItem"> | number;
    templateId?: Prisma.IntWithAggregatesFilter<"EvalFormItem"> | number;
    order?: Prisma.IntWithAggregatesFilter<"EvalFormItem"> | number;
    prompt?: Prisma.StringWithAggregatesFilter<"EvalFormItem"> | string;
    scoreType?: Prisma.EnumScoreTypeWithAggregatesFilter<"EvalFormItem"> | $Enums.ScoreType;
};
export type EvalFormItemCreateInput = {
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutItemsInput;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutItemInput;
};
export type EvalFormItemUncheckedCreateInput = {
    id?: number;
    templateId: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutItemInput;
};
export type EvalFormItemUpdateInput = {
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutItemsNestedInput;
    scores?: Prisma.EvalScoreUpdateManyWithoutItemNestedInput;
};
export type EvalFormItemUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutItemNestedInput;
};
export type EvalFormItemCreateManyInput = {
    id?: number;
    templateId: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
};
export type EvalFormItemUpdateManyMutationInput = {
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
};
export type EvalFormItemUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
};
export type EvalFormItemListRelationFilter = {
    every?: Prisma.EvalFormItemWhereInput;
    some?: Prisma.EvalFormItemWhereInput;
    none?: Prisma.EvalFormItemWhereInput;
};
export type EvalFormItemOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EvalFormItemTemplateIdOrderCompoundUniqueInput = {
    templateId: number;
    order: number;
};
export type EvalFormItemCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    scoreType?: Prisma.SortOrder;
};
export type EvalFormItemAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
};
export type EvalFormItemMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    scoreType?: Prisma.SortOrder;
};
export type EvalFormItemMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
    prompt?: Prisma.SortOrder;
    scoreType?: Prisma.SortOrder;
};
export type EvalFormItemSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    templateId?: Prisma.SortOrder;
    order?: Prisma.SortOrder;
};
export type EvalFormItemScalarRelationFilter = {
    is?: Prisma.EvalFormItemWhereInput;
    isNot?: Prisma.EvalFormItemWhereInput;
};
export type EvalFormItemCreateNestedManyWithoutTemplateInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput> | Prisma.EvalFormItemCreateWithoutTemplateInput[] | Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput | Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput[];
    createMany?: Prisma.EvalFormItemCreateManyTemplateInputEnvelope;
    connect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
};
export type EvalFormItemUncheckedCreateNestedManyWithoutTemplateInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput> | Prisma.EvalFormItemCreateWithoutTemplateInput[] | Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput | Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput[];
    createMany?: Prisma.EvalFormItemCreateManyTemplateInputEnvelope;
    connect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
};
export type EvalFormItemUpdateManyWithoutTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput> | Prisma.EvalFormItemCreateWithoutTemplateInput[] | Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput | Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput[];
    upsert?: Prisma.EvalFormItemUpsertWithWhereUniqueWithoutTemplateInput | Prisma.EvalFormItemUpsertWithWhereUniqueWithoutTemplateInput[];
    createMany?: Prisma.EvalFormItemCreateManyTemplateInputEnvelope;
    set?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    disconnect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    delete?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    connect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    update?: Prisma.EvalFormItemUpdateWithWhereUniqueWithoutTemplateInput | Prisma.EvalFormItemUpdateWithWhereUniqueWithoutTemplateInput[];
    updateMany?: Prisma.EvalFormItemUpdateManyWithWhereWithoutTemplateInput | Prisma.EvalFormItemUpdateManyWithWhereWithoutTemplateInput[];
    deleteMany?: Prisma.EvalFormItemScalarWhereInput | Prisma.EvalFormItemScalarWhereInput[];
};
export type EvalFormItemUncheckedUpdateManyWithoutTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput> | Prisma.EvalFormItemCreateWithoutTemplateInput[] | Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput[];
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput | Prisma.EvalFormItemCreateOrConnectWithoutTemplateInput[];
    upsert?: Prisma.EvalFormItemUpsertWithWhereUniqueWithoutTemplateInput | Prisma.EvalFormItemUpsertWithWhereUniqueWithoutTemplateInput[];
    createMany?: Prisma.EvalFormItemCreateManyTemplateInputEnvelope;
    set?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    disconnect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    delete?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    connect?: Prisma.EvalFormItemWhereUniqueInput | Prisma.EvalFormItemWhereUniqueInput[];
    update?: Prisma.EvalFormItemUpdateWithWhereUniqueWithoutTemplateInput | Prisma.EvalFormItemUpdateWithWhereUniqueWithoutTemplateInput[];
    updateMany?: Prisma.EvalFormItemUpdateManyWithWhereWithoutTemplateInput | Prisma.EvalFormItemUpdateManyWithWhereWithoutTemplateInput[];
    deleteMany?: Prisma.EvalFormItemScalarWhereInput | Prisma.EvalFormItemScalarWhereInput[];
};
export type EnumScoreTypeFieldUpdateOperationsInput = {
    set?: $Enums.ScoreType;
};
export type EvalFormItemCreateNestedOneWithoutScoresInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutScoresInput, Prisma.EvalFormItemUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutScoresInput;
    connect?: Prisma.EvalFormItemWhereUniqueInput;
};
export type EvalFormItemUpdateOneRequiredWithoutScoresNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormItemCreateWithoutScoresInput, Prisma.EvalFormItemUncheckedCreateWithoutScoresInput>;
    connectOrCreate?: Prisma.EvalFormItemCreateOrConnectWithoutScoresInput;
    upsert?: Prisma.EvalFormItemUpsertWithoutScoresInput;
    connect?: Prisma.EvalFormItemWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EvalFormItemUpdateToOneWithWhereWithoutScoresInput, Prisma.EvalFormItemUpdateWithoutScoresInput>, Prisma.EvalFormItemUncheckedUpdateWithoutScoresInput>;
};
export type EvalFormItemCreateWithoutTemplateInput = {
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    scores?: Prisma.EvalScoreCreateNestedManyWithoutItemInput;
};
export type EvalFormItemUncheckedCreateWithoutTemplateInput = {
    id?: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    scores?: Prisma.EvalScoreUncheckedCreateNestedManyWithoutItemInput;
};
export type EvalFormItemCreateOrConnectWithoutTemplateInput = {
    where: Prisma.EvalFormItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput>;
};
export type EvalFormItemCreateManyTemplateInputEnvelope = {
    data: Prisma.EvalFormItemCreateManyTemplateInput | Prisma.EvalFormItemCreateManyTemplateInput[];
    skipDuplicates?: boolean;
};
export type EvalFormItemUpsertWithWhereUniqueWithoutTemplateInput = {
    where: Prisma.EvalFormItemWhereUniqueInput;
    update: Prisma.XOR<Prisma.EvalFormItemUpdateWithoutTemplateInput, Prisma.EvalFormItemUncheckedUpdateWithoutTemplateInput>;
    create: Prisma.XOR<Prisma.EvalFormItemCreateWithoutTemplateInput, Prisma.EvalFormItemUncheckedCreateWithoutTemplateInput>;
};
export type EvalFormItemUpdateWithWhereUniqueWithoutTemplateInput = {
    where: Prisma.EvalFormItemWhereUniqueInput;
    data: Prisma.XOR<Prisma.EvalFormItemUpdateWithoutTemplateInput, Prisma.EvalFormItemUncheckedUpdateWithoutTemplateInput>;
};
export type EvalFormItemUpdateManyWithWhereWithoutTemplateInput = {
    where: Prisma.EvalFormItemScalarWhereInput;
    data: Prisma.XOR<Prisma.EvalFormItemUpdateManyMutationInput, Prisma.EvalFormItemUncheckedUpdateManyWithoutTemplateInput>;
};
export type EvalFormItemScalarWhereInput = {
    AND?: Prisma.EvalFormItemScalarWhereInput | Prisma.EvalFormItemScalarWhereInput[];
    OR?: Prisma.EvalFormItemScalarWhereInput[];
    NOT?: Prisma.EvalFormItemScalarWhereInput | Prisma.EvalFormItemScalarWhereInput[];
    id?: Prisma.IntFilter<"EvalFormItem"> | number;
    templateId?: Prisma.IntFilter<"EvalFormItem"> | number;
    order?: Prisma.IntFilter<"EvalFormItem"> | number;
    prompt?: Prisma.StringFilter<"EvalFormItem"> | string;
    scoreType?: Prisma.EnumScoreTypeFilter<"EvalFormItem"> | $Enums.ScoreType;
};
export type EvalFormItemCreateWithoutScoresInput = {
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
    template: Prisma.EvalFormTemplateCreateNestedOneWithoutItemsInput;
};
export type EvalFormItemUncheckedCreateWithoutScoresInput = {
    id?: number;
    templateId: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
};
export type EvalFormItemCreateOrConnectWithoutScoresInput = {
    where: Prisma.EvalFormItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormItemCreateWithoutScoresInput, Prisma.EvalFormItemUncheckedCreateWithoutScoresInput>;
};
export type EvalFormItemUpsertWithoutScoresInput = {
    update: Prisma.XOR<Prisma.EvalFormItemUpdateWithoutScoresInput, Prisma.EvalFormItemUncheckedUpdateWithoutScoresInput>;
    create: Prisma.XOR<Prisma.EvalFormItemCreateWithoutScoresInput, Prisma.EvalFormItemUncheckedCreateWithoutScoresInput>;
    where?: Prisma.EvalFormItemWhereInput;
};
export type EvalFormItemUpdateToOneWithWhereWithoutScoresInput = {
    where?: Prisma.EvalFormItemWhereInput;
    data: Prisma.XOR<Prisma.EvalFormItemUpdateWithoutScoresInput, Prisma.EvalFormItemUncheckedUpdateWithoutScoresInput>;
};
export type EvalFormItemUpdateWithoutScoresInput = {
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
    template?: Prisma.EvalFormTemplateUpdateOneRequiredWithoutItemsNestedInput;
};
export type EvalFormItemUncheckedUpdateWithoutScoresInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    templateId?: Prisma.IntFieldUpdateOperationsInput | number;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
};
export type EvalFormItemCreateManyTemplateInput = {
    id?: number;
    order: number;
    prompt: string;
    scoreType: $Enums.ScoreType;
};
export type EvalFormItemUpdateWithoutTemplateInput = {
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
    scores?: Prisma.EvalScoreUpdateManyWithoutItemNestedInput;
};
export type EvalFormItemUncheckedUpdateWithoutTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
    scores?: Prisma.EvalScoreUncheckedUpdateManyWithoutItemNestedInput;
};
export type EvalFormItemUncheckedUpdateManyWithoutTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    order?: Prisma.IntFieldUpdateOperationsInput | number;
    prompt?: Prisma.StringFieldUpdateOperationsInput | string;
    scoreType?: Prisma.EnumScoreTypeFieldUpdateOperationsInput | $Enums.ScoreType;
};
export type EvalFormItemCountOutputType = {
    scores: number;
};
export type EvalFormItemCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    scores?: boolean | EvalFormItemCountOutputTypeCountScoresArgs;
};
export type EvalFormItemCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemCountOutputTypeSelect<ExtArgs> | null;
};
export type EvalFormItemCountOutputTypeCountScoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalScoreWhereInput;
};
export type EvalFormItemSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    order?: boolean;
    prompt?: boolean;
    scoreType?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    scores?: boolean | Prisma.EvalFormItem$scoresArgs<ExtArgs>;
    _count?: boolean | Prisma.EvalFormItemCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalFormItem"]>;
export type EvalFormItemSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    order?: boolean;
    prompt?: boolean;
    scoreType?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalFormItem"]>;
export type EvalFormItemSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    templateId?: boolean;
    order?: boolean;
    prompt?: boolean;
    scoreType?: boolean;
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalFormItem"]>;
export type EvalFormItemSelectScalar = {
    id?: boolean;
    templateId?: boolean;
    order?: boolean;
    prompt?: boolean;
    scoreType?: boolean;
};
export type EvalFormItemOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "templateId" | "order" | "prompt" | "scoreType", ExtArgs["result"]["evalFormItem"]>;
export type EvalFormItemInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
    scores?: boolean | Prisma.EvalFormItem$scoresArgs<ExtArgs>;
    _count?: boolean | Prisma.EvalFormItemCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EvalFormItemIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
};
export type EvalFormItemIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    template?: boolean | Prisma.EvalFormTemplateDefaultArgs<ExtArgs>;
};
export type $EvalFormItemPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EvalFormItem";
    objects: {
        template: Prisma.$EvalFormTemplatePayload<ExtArgs>;
        scores: Prisma.$EvalScorePayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        templateId: number;
        order: number;
        prompt: string;
        scoreType: $Enums.ScoreType;
    }, ExtArgs["result"]["evalFormItem"]>;
    composites: {};
};
export type EvalFormItemGetPayload<S extends boolean | null | undefined | EvalFormItemDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload, S>;
export type EvalFormItemCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EvalFormItemFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EvalFormItemCountAggregateInputType | true;
};
export interface EvalFormItemDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EvalFormItem'];
        meta: {
            name: 'EvalFormItem';
        };
    };
    findUnique<T extends EvalFormItemFindUniqueArgs>(args: Prisma.SelectSubset<T, EvalFormItemFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EvalFormItemFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EvalFormItemFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EvalFormItemFindFirstArgs>(args?: Prisma.SelectSubset<T, EvalFormItemFindFirstArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EvalFormItemFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EvalFormItemFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EvalFormItemFindManyArgs>(args?: Prisma.SelectSubset<T, EvalFormItemFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EvalFormItemCreateArgs>(args: Prisma.SelectSubset<T, EvalFormItemCreateArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EvalFormItemCreateManyArgs>(args?: Prisma.SelectSubset<T, EvalFormItemCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EvalFormItemCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EvalFormItemCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EvalFormItemDeleteArgs>(args: Prisma.SelectSubset<T, EvalFormItemDeleteArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EvalFormItemUpdateArgs>(args: Prisma.SelectSubset<T, EvalFormItemUpdateArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EvalFormItemDeleteManyArgs>(args?: Prisma.SelectSubset<T, EvalFormItemDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EvalFormItemUpdateManyArgs>(args: Prisma.SelectSubset<T, EvalFormItemUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EvalFormItemUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EvalFormItemUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EvalFormItemUpsertArgs>(args: Prisma.SelectSubset<T, EvalFormItemUpsertArgs<ExtArgs>>): Prisma.Prisma__EvalFormItemClient<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EvalFormItemCountArgs>(args?: Prisma.Subset<T, EvalFormItemCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EvalFormItemCountAggregateOutputType> : number>;
    aggregate<T extends EvalFormItemAggregateArgs>(args: Prisma.Subset<T, EvalFormItemAggregateArgs>): Prisma.PrismaPromise<GetEvalFormItemAggregateType<T>>;
    groupBy<T extends EvalFormItemGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EvalFormItemGroupByArgs['orderBy'];
    } : {
        orderBy?: EvalFormItemGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EvalFormItemGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvalFormItemGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EvalFormItemFieldRefs;
}
export interface Prisma__EvalFormItemClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    template<T extends Prisma.EvalFormTemplateDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormTemplateDefaultArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    scores<T extends Prisma.EvalFormItem$scoresArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormItem$scoresArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalScorePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EvalFormItemFieldRefs {
    readonly id: Prisma.FieldRef<"EvalFormItem", 'Int'>;
    readonly templateId: Prisma.FieldRef<"EvalFormItem", 'Int'>;
    readonly order: Prisma.FieldRef<"EvalFormItem", 'Int'>;
    readonly prompt: Prisma.FieldRef<"EvalFormItem", 'String'>;
    readonly scoreType: Prisma.FieldRef<"EvalFormItem", 'ScoreType'>;
}
export type EvalFormItemFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where: Prisma.EvalFormItemWhereUniqueInput;
};
export type EvalFormItemFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where: Prisma.EvalFormItemWhereUniqueInput;
};
export type EvalFormItemFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where?: Prisma.EvalFormItemWhereInput;
    orderBy?: Prisma.EvalFormItemOrderByWithRelationInput | Prisma.EvalFormItemOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormItemScalarFieldEnum | Prisma.EvalFormItemScalarFieldEnum[];
};
export type EvalFormItemFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where?: Prisma.EvalFormItemWhereInput;
    orderBy?: Prisma.EvalFormItemOrderByWithRelationInput | Prisma.EvalFormItemOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormItemScalarFieldEnum | Prisma.EvalFormItemScalarFieldEnum[];
};
export type EvalFormItemFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where?: Prisma.EvalFormItemWhereInput;
    orderBy?: Prisma.EvalFormItemOrderByWithRelationInput | Prisma.EvalFormItemOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormItemWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormItemScalarFieldEnum | Prisma.EvalFormItemScalarFieldEnum[];
};
export type EvalFormItemCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormItemCreateInput, Prisma.EvalFormItemUncheckedCreateInput>;
};
export type EvalFormItemCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EvalFormItemCreateManyInput | Prisma.EvalFormItemCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EvalFormItemCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    data: Prisma.EvalFormItemCreateManyInput | Prisma.EvalFormItemCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EvalFormItemIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EvalFormItemUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormItemUpdateInput, Prisma.EvalFormItemUncheckedUpdateInput>;
    where: Prisma.EvalFormItemWhereUniqueInput;
};
export type EvalFormItemUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EvalFormItemUpdateManyMutationInput, Prisma.EvalFormItemUncheckedUpdateManyInput>;
    where?: Prisma.EvalFormItemWhereInput;
    limit?: number;
};
export type EvalFormItemUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormItemUpdateManyMutationInput, Prisma.EvalFormItemUncheckedUpdateManyInput>;
    where?: Prisma.EvalFormItemWhereInput;
    limit?: number;
    include?: Prisma.EvalFormItemIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EvalFormItemUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where: Prisma.EvalFormItemWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormItemCreateInput, Prisma.EvalFormItemUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EvalFormItemUpdateInput, Prisma.EvalFormItemUncheckedUpdateInput>;
};
export type EvalFormItemDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
    where: Prisma.EvalFormItemWhereUniqueInput;
};
export type EvalFormItemDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormItemWhereInput;
    limit?: number;
};
export type EvalFormItem$scoresArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalFormItemDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormItemSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormItemOmit<ExtArgs> | null;
    include?: Prisma.EvalFormItemInclude<ExtArgs> | null;
};
