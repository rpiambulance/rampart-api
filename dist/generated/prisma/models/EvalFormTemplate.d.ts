import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EvalFormTemplateModel = runtime.Types.Result.DefaultSelection<Prisma.$EvalFormTemplatePayload>;
export type AggregateEvalFormTemplate = {
    _count: EvalFormTemplateCountAggregateOutputType | null;
    _avg: EvalFormTemplateAvgAggregateOutputType | null;
    _sum: EvalFormTemplateSumAggregateOutputType | null;
    _min: EvalFormTemplateMinAggregateOutputType | null;
    _max: EvalFormTemplateMaxAggregateOutputType | null;
};
export type EvalFormTemplateAvgAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type EvalFormTemplateSumAggregateOutputType = {
    id: number | null;
    version: number | null;
};
export type EvalFormTemplateMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    version: number | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type EvalFormTemplateMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    version: number | null;
    active: boolean | null;
    createdAt: Date | null;
};
export type EvalFormTemplateCountAggregateOutputType = {
    id: number;
    name: number;
    version: number;
    active: number;
    createdAt: number;
    _all: number;
};
export type EvalFormTemplateAvgAggregateInputType = {
    id?: true;
    version?: true;
};
export type EvalFormTemplateSumAggregateInputType = {
    id?: true;
    version?: true;
};
export type EvalFormTemplateMinAggregateInputType = {
    id?: true;
    name?: true;
    version?: true;
    active?: true;
    createdAt?: true;
};
export type EvalFormTemplateMaxAggregateInputType = {
    id?: true;
    name?: true;
    version?: true;
    active?: true;
    createdAt?: true;
};
export type EvalFormTemplateCountAggregateInputType = {
    id?: true;
    name?: true;
    version?: true;
    active?: true;
    createdAt?: true;
    _all?: true;
};
export type EvalFormTemplateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormTemplateWhereInput;
    orderBy?: Prisma.EvalFormTemplateOrderByWithRelationInput | Prisma.EvalFormTemplateOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EvalFormTemplateCountAggregateInputType;
    _avg?: EvalFormTemplateAvgAggregateInputType;
    _sum?: EvalFormTemplateSumAggregateInputType;
    _min?: EvalFormTemplateMinAggregateInputType;
    _max?: EvalFormTemplateMaxAggregateInputType;
};
export type GetEvalFormTemplateAggregateType<T extends EvalFormTemplateAggregateArgs> = {
    [P in keyof T & keyof AggregateEvalFormTemplate]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvalFormTemplate[P]> : Prisma.GetScalarType<T[P], AggregateEvalFormTemplate[P]>;
};
export type EvalFormTemplateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormTemplateWhereInput;
    orderBy?: Prisma.EvalFormTemplateOrderByWithAggregationInput | Prisma.EvalFormTemplateOrderByWithAggregationInput[];
    by: Prisma.EvalFormTemplateScalarFieldEnum[] | Prisma.EvalFormTemplateScalarFieldEnum;
    having?: Prisma.EvalFormTemplateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EvalFormTemplateCountAggregateInputType | true;
    _avg?: EvalFormTemplateAvgAggregateInputType;
    _sum?: EvalFormTemplateSumAggregateInputType;
    _min?: EvalFormTemplateMinAggregateInputType;
    _max?: EvalFormTemplateMaxAggregateInputType;
};
export type EvalFormTemplateGroupByOutputType = {
    id: number;
    name: string;
    version: number;
    active: boolean;
    createdAt: Date;
    _count: EvalFormTemplateCountAggregateOutputType | null;
    _avg: EvalFormTemplateAvgAggregateOutputType | null;
    _sum: EvalFormTemplateSumAggregateOutputType | null;
    _min: EvalFormTemplateMinAggregateOutputType | null;
    _max: EvalFormTemplateMaxAggregateOutputType | null;
};
export type GetEvalFormTemplateGroupByPayload<T extends EvalFormTemplateGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EvalFormTemplateGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EvalFormTemplateGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EvalFormTemplateGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EvalFormTemplateGroupByOutputType[P]>;
}>>;
export type EvalFormTemplateWhereInput = {
    AND?: Prisma.EvalFormTemplateWhereInput | Prisma.EvalFormTemplateWhereInput[];
    OR?: Prisma.EvalFormTemplateWhereInput[];
    NOT?: Prisma.EvalFormTemplateWhereInput | Prisma.EvalFormTemplateWhereInput[];
    id?: Prisma.IntFilter<"EvalFormTemplate"> | number;
    name?: Prisma.StringFilter<"EvalFormTemplate"> | string;
    version?: Prisma.IntFilter<"EvalFormTemplate"> | number;
    active?: Prisma.BoolFilter<"EvalFormTemplate"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"EvalFormTemplate"> | Date | string;
    items?: Prisma.EvalFormItemListRelationFilter;
    evaluations?: Prisma.EvaluationListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
};
export type EvalFormTemplateOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    items?: Prisma.EvalFormItemOrderByRelationAggregateInput;
    evaluations?: Prisma.EvaluationOrderByRelationAggregateInput;
    credentialRequirements?: Prisma.CredentialRequirementOrderByRelationAggregateInput;
};
export type EvalFormTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name_version?: Prisma.EvalFormTemplateNameVersionCompoundUniqueInput;
    AND?: Prisma.EvalFormTemplateWhereInput | Prisma.EvalFormTemplateWhereInput[];
    OR?: Prisma.EvalFormTemplateWhereInput[];
    NOT?: Prisma.EvalFormTemplateWhereInput | Prisma.EvalFormTemplateWhereInput[];
    name?: Prisma.StringFilter<"EvalFormTemplate"> | string;
    version?: Prisma.IntFilter<"EvalFormTemplate"> | number;
    active?: Prisma.BoolFilter<"EvalFormTemplate"> | boolean;
    createdAt?: Prisma.DateTimeFilter<"EvalFormTemplate"> | Date | string;
    items?: Prisma.EvalFormItemListRelationFilter;
    evaluations?: Prisma.EvaluationListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
}, "id" | "name_version">;
export type EvalFormTemplateOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EvalFormTemplateCountOrderByAggregateInput;
    _avg?: Prisma.EvalFormTemplateAvgOrderByAggregateInput;
    _max?: Prisma.EvalFormTemplateMaxOrderByAggregateInput;
    _min?: Prisma.EvalFormTemplateMinOrderByAggregateInput;
    _sum?: Prisma.EvalFormTemplateSumOrderByAggregateInput;
};
export type EvalFormTemplateScalarWhereWithAggregatesInput = {
    AND?: Prisma.EvalFormTemplateScalarWhereWithAggregatesInput | Prisma.EvalFormTemplateScalarWhereWithAggregatesInput[];
    OR?: Prisma.EvalFormTemplateScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EvalFormTemplateScalarWhereWithAggregatesInput | Prisma.EvalFormTemplateScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EvalFormTemplate"> | number;
    name?: Prisma.StringWithAggregatesFilter<"EvalFormTemplate"> | string;
    version?: Prisma.IntWithAggregatesFilter<"EvalFormTemplate"> | number;
    active?: Prisma.BoolWithAggregatesFilter<"EvalFormTemplate"> | boolean;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EvalFormTemplate"> | Date | string;
};
export type EvalFormTemplateCreateInput = {
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemCreateNestedManyWithoutTemplateInput;
    evaluations?: Prisma.EvaluationCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateUncheckedCreateInput = {
    id?: number;
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemUncheckedCreateNestedManyWithoutTemplateInput;
    evaluations?: Prisma.EvaluationUncheckedCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUpdateManyWithoutTemplateNestedInput;
    evaluations?: Prisma.EvaluationUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUncheckedUpdateManyWithoutTemplateNestedInput;
    evaluations?: Prisma.EvaluationUncheckedUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateCreateManyInput = {
    id?: number;
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
};
export type EvalFormTemplateUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvalFormTemplateUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EvalFormTemplateNullableScalarRelationFilter = {
    is?: Prisma.EvalFormTemplateWhereInput | null;
    isNot?: Prisma.EvalFormTemplateWhereInput | null;
};
export type EvalFormTemplateNameVersionCompoundUniqueInput = {
    name: string;
    version: number;
};
export type EvalFormTemplateCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EvalFormTemplateAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type EvalFormTemplateMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EvalFormTemplateMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EvalFormTemplateSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    version?: Prisma.SortOrder;
};
export type EvalFormTemplateScalarRelationFilter = {
    is?: Prisma.EvalFormTemplateWhereInput;
    isNot?: Prisma.EvalFormTemplateWhereInput;
};
export type EvalFormTemplateCreateNestedOneWithoutCredentialRequirementsInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutCredentialRequirementsInput;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateUpdateOneWithoutCredentialRequirementsNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutCredentialRequirementsInput;
    upsert?: Prisma.EvalFormTemplateUpsertWithoutCredentialRequirementsInput;
    disconnect?: Prisma.EvalFormTemplateWhereInput | boolean;
    delete?: Prisma.EvalFormTemplateWhereInput | boolean;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EvalFormTemplateUpdateToOneWithWhereWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUpdateWithoutCredentialRequirementsInput>, Prisma.EvalFormTemplateUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type EvalFormTemplateCreateNestedOneWithoutItemsInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutItemsInput;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateUpdateOneRequiredWithoutItemsNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutItemsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutItemsInput;
    upsert?: Prisma.EvalFormTemplateUpsertWithoutItemsInput;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EvalFormTemplateUpdateToOneWithWhereWithoutItemsInput, Prisma.EvalFormTemplateUpdateWithoutItemsInput>, Prisma.EvalFormTemplateUncheckedUpdateWithoutItemsInput>;
};
export type EvalFormTemplateCreateNestedOneWithoutEvaluationsInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutEvaluationsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutEvaluationsInput;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateUpdateOneRequiredWithoutEvaluationsNestedInput = {
    create?: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutEvaluationsInput>;
    connectOrCreate?: Prisma.EvalFormTemplateCreateOrConnectWithoutEvaluationsInput;
    upsert?: Prisma.EvalFormTemplateUpsertWithoutEvaluationsInput;
    connect?: Prisma.EvalFormTemplateWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EvalFormTemplateUpdateToOneWithWhereWithoutEvaluationsInput, Prisma.EvalFormTemplateUpdateWithoutEvaluationsInput>, Prisma.EvalFormTemplateUncheckedUpdateWithoutEvaluationsInput>;
};
export type EvalFormTemplateCreateWithoutCredentialRequirementsInput = {
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemCreateNestedManyWithoutTemplateInput;
    evaluations?: Prisma.EvaluationCreateNestedManyWithoutTemplateInput;
};
export type EvalFormTemplateUncheckedCreateWithoutCredentialRequirementsInput = {
    id?: number;
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemUncheckedCreateNestedManyWithoutTemplateInput;
    evaluations?: Prisma.EvaluationUncheckedCreateNestedManyWithoutTemplateInput;
};
export type EvalFormTemplateCreateOrConnectWithoutCredentialRequirementsInput = {
    where: Prisma.EvalFormTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutCredentialRequirementsInput>;
};
export type EvalFormTemplateUpsertWithoutCredentialRequirementsInput = {
    update: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutCredentialRequirementsInput>;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutCredentialRequirementsInput>;
    where?: Prisma.EvalFormTemplateWhereInput;
};
export type EvalFormTemplateUpdateToOneWithWhereWithoutCredentialRequirementsInput = {
    where?: Prisma.EvalFormTemplateWhereInput;
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutCredentialRequirementsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type EvalFormTemplateUpdateWithoutCredentialRequirementsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUpdateManyWithoutTemplateNestedInput;
    evaluations?: Prisma.EvaluationUpdateManyWithoutTemplateNestedInput;
};
export type EvalFormTemplateUncheckedUpdateWithoutCredentialRequirementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUncheckedUpdateManyWithoutTemplateNestedInput;
    evaluations?: Prisma.EvaluationUncheckedUpdateManyWithoutTemplateNestedInput;
};
export type EvalFormTemplateCreateWithoutItemsInput = {
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    evaluations?: Prisma.EvaluationCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateUncheckedCreateWithoutItemsInput = {
    id?: number;
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    evaluations?: Prisma.EvaluationUncheckedCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateCreateOrConnectWithoutItemsInput = {
    where: Prisma.EvalFormTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutItemsInput>;
};
export type EvalFormTemplateUpsertWithoutItemsInput = {
    update: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutItemsInput>;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutItemsInput>;
    where?: Prisma.EvalFormTemplateWhereInput;
};
export type EvalFormTemplateUpdateToOneWithWhereWithoutItemsInput = {
    where?: Prisma.EvalFormTemplateWhereInput;
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutItemsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutItemsInput>;
};
export type EvalFormTemplateUpdateWithoutItemsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    evaluations?: Prisma.EvaluationUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateUncheckedUpdateWithoutItemsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    evaluations?: Prisma.EvaluationUncheckedUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateCreateWithoutEvaluationsInput = {
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateUncheckedCreateWithoutEvaluationsInput = {
    id?: number;
    name: string;
    version?: number;
    active?: boolean;
    createdAt?: Date | string;
    items?: Prisma.EvalFormItemUncheckedCreateNestedManyWithoutTemplateInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutEvalTemplateInput;
};
export type EvalFormTemplateCreateOrConnectWithoutEvaluationsInput = {
    where: Prisma.EvalFormTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutEvaluationsInput>;
};
export type EvalFormTemplateUpsertWithoutEvaluationsInput = {
    update: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutEvaluationsInput>;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedCreateWithoutEvaluationsInput>;
    where?: Prisma.EvalFormTemplateWhereInput;
};
export type EvalFormTemplateUpdateToOneWithWhereWithoutEvaluationsInput = {
    where?: Prisma.EvalFormTemplateWhereInput;
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateWithoutEvaluationsInput, Prisma.EvalFormTemplateUncheckedUpdateWithoutEvaluationsInput>;
};
export type EvalFormTemplateUpdateWithoutEvaluationsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateUncheckedUpdateWithoutEvaluationsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    version?: Prisma.IntFieldUpdateOperationsInput | number;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    items?: Prisma.EvalFormItemUncheckedUpdateManyWithoutTemplateNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateNestedInput;
};
export type EvalFormTemplateCountOutputType = {
    items: number;
    evaluations: number;
    credentialRequirements: number;
};
export type EvalFormTemplateCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | EvalFormTemplateCountOutputTypeCountItemsArgs;
    evaluations?: boolean | EvalFormTemplateCountOutputTypeCountEvaluationsArgs;
    credentialRequirements?: boolean | EvalFormTemplateCountOutputTypeCountCredentialRequirementsArgs;
};
export type EvalFormTemplateCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateCountOutputTypeSelect<ExtArgs> | null;
};
export type EvalFormTemplateCountOutputTypeCountItemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormItemWhereInput;
};
export type EvalFormTemplateCountOutputTypeCountEvaluationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvaluationWhereInput;
};
export type EvalFormTemplateCountOutputTypeCountCredentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
};
export type EvalFormTemplateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    version?: boolean;
    active?: boolean;
    createdAt?: boolean;
    items?: boolean | Prisma.EvalFormTemplate$itemsArgs<ExtArgs>;
    evaluations?: boolean | Prisma.EvalFormTemplate$evaluationsArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.EvalFormTemplate$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.EvalFormTemplateCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["evalFormTemplate"]>;
export type EvalFormTemplateSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    version?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["evalFormTemplate"]>;
export type EvalFormTemplateSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    version?: boolean;
    active?: boolean;
    createdAt?: boolean;
}, ExtArgs["result"]["evalFormTemplate"]>;
export type EvalFormTemplateSelectScalar = {
    id?: boolean;
    name?: boolean;
    version?: boolean;
    active?: boolean;
    createdAt?: boolean;
};
export type EvalFormTemplateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "version" | "active" | "createdAt", ExtArgs["result"]["evalFormTemplate"]>;
export type EvalFormTemplateInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    items?: boolean | Prisma.EvalFormTemplate$itemsArgs<ExtArgs>;
    evaluations?: boolean | Prisma.EvalFormTemplate$evaluationsArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.EvalFormTemplate$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.EvalFormTemplateCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EvalFormTemplateIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type EvalFormTemplateIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $EvalFormTemplatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EvalFormTemplate";
    objects: {
        items: Prisma.$EvalFormItemPayload<ExtArgs>[];
        evaluations: Prisma.$EvaluationPayload<ExtArgs>[];
        credentialRequirements: Prisma.$CredentialRequirementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        version: number;
        active: boolean;
        createdAt: Date;
    }, ExtArgs["result"]["evalFormTemplate"]>;
    composites: {};
};
export type EvalFormTemplateGetPayload<S extends boolean | null | undefined | EvalFormTemplateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload, S>;
export type EvalFormTemplateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EvalFormTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EvalFormTemplateCountAggregateInputType | true;
};
export interface EvalFormTemplateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EvalFormTemplate'];
        meta: {
            name: 'EvalFormTemplate';
        };
    };
    findUnique<T extends EvalFormTemplateFindUniqueArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EvalFormTemplateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EvalFormTemplateFindFirstArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateFindFirstArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EvalFormTemplateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EvalFormTemplateFindManyArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EvalFormTemplateCreateArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateCreateArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EvalFormTemplateCreateManyArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EvalFormTemplateCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EvalFormTemplateDeleteArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateDeleteArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EvalFormTemplateUpdateArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateUpdateArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EvalFormTemplateDeleteManyArgs>(args?: Prisma.SelectSubset<T, EvalFormTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EvalFormTemplateUpdateManyArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EvalFormTemplateUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EvalFormTemplateUpsertArgs>(args: Prisma.SelectSubset<T, EvalFormTemplateUpsertArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EvalFormTemplateCountArgs>(args?: Prisma.Subset<T, EvalFormTemplateCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EvalFormTemplateCountAggregateOutputType> : number>;
    aggregate<T extends EvalFormTemplateAggregateArgs>(args: Prisma.Subset<T, EvalFormTemplateAggregateArgs>): Prisma.PrismaPromise<GetEvalFormTemplateAggregateType<T>>;
    groupBy<T extends EvalFormTemplateGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EvalFormTemplateGroupByArgs['orderBy'];
    } : {
        orderBy?: EvalFormTemplateGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EvalFormTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEvalFormTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EvalFormTemplateFieldRefs;
}
export interface Prisma__EvalFormTemplateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    items<T extends Prisma.EvalFormTemplate$itemsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormTemplate$itemsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvalFormItemPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    evaluations<T extends Prisma.EvalFormTemplate$evaluationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormTemplate$evaluationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EvaluationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    credentialRequirements<T extends Prisma.EvalFormTemplate$credentialRequirementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EvalFormTemplate$credentialRequirementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EvalFormTemplateFieldRefs {
    readonly id: Prisma.FieldRef<"EvalFormTemplate", 'Int'>;
    readonly name: Prisma.FieldRef<"EvalFormTemplate", 'String'>;
    readonly version: Prisma.FieldRef<"EvalFormTemplate", 'Int'>;
    readonly active: Prisma.FieldRef<"EvalFormTemplate", 'Boolean'>;
    readonly createdAt: Prisma.FieldRef<"EvalFormTemplate", 'DateTime'>;
}
export type EvalFormTemplateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where?: Prisma.EvalFormTemplateWhereInput;
    orderBy?: Prisma.EvalFormTemplateOrderByWithRelationInput | Prisma.EvalFormTemplateOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormTemplateScalarFieldEnum | Prisma.EvalFormTemplateScalarFieldEnum[];
};
export type EvalFormTemplateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where?: Prisma.EvalFormTemplateWhereInput;
    orderBy?: Prisma.EvalFormTemplateOrderByWithRelationInput | Prisma.EvalFormTemplateOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormTemplateScalarFieldEnum | Prisma.EvalFormTemplateScalarFieldEnum[];
};
export type EvalFormTemplateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where?: Prisma.EvalFormTemplateWhereInput;
    orderBy?: Prisma.EvalFormTemplateOrderByWithRelationInput | Prisma.EvalFormTemplateOrderByWithRelationInput[];
    cursor?: Prisma.EvalFormTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EvalFormTemplateScalarFieldEnum | Prisma.EvalFormTemplateScalarFieldEnum[];
};
export type EvalFormTemplateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormTemplateCreateInput, Prisma.EvalFormTemplateUncheckedCreateInput>;
};
export type EvalFormTemplateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EvalFormTemplateCreateManyInput | Prisma.EvalFormTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EvalFormTemplateCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    data: Prisma.EvalFormTemplateCreateManyInput | Prisma.EvalFormTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EvalFormTemplateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateInput, Prisma.EvalFormTemplateUncheckedUpdateInput>;
    where: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateManyMutationInput, Prisma.EvalFormTemplateUncheckedUpdateManyInput>;
    where?: Prisma.EvalFormTemplateWhereInput;
    limit?: number;
};
export type EvalFormTemplateUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EvalFormTemplateUpdateManyMutationInput, Prisma.EvalFormTemplateUncheckedUpdateManyInput>;
    where?: Prisma.EvalFormTemplateWhereInput;
    limit?: number;
};
export type EvalFormTemplateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where: Prisma.EvalFormTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.EvalFormTemplateCreateInput, Prisma.EvalFormTemplateUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EvalFormTemplateUpdateInput, Prisma.EvalFormTemplateUncheckedUpdateInput>;
};
export type EvalFormTemplateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where: Prisma.EvalFormTemplateWhereUniqueInput;
};
export type EvalFormTemplateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EvalFormTemplateWhereInput;
    limit?: number;
};
export type EvalFormTemplate$itemsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalFormTemplate$evaluationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type EvalFormTemplate$credentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where?: Prisma.CredentialRequirementWhereInput;
    orderBy?: Prisma.CredentialRequirementOrderByWithRelationInput | Prisma.CredentialRequirementOrderByWithRelationInput[];
    cursor?: Prisma.CredentialRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialRequirementScalarFieldEnum | Prisma.CredentialRequirementScalarFieldEnum[];
};
export type EvalFormTemplateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
};
