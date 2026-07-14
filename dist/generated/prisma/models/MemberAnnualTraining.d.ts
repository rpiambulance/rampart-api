import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MemberAnnualTrainingModel = runtime.Types.Result.DefaultSelection<Prisma.$MemberAnnualTrainingPayload>;
export type AggregateMemberAnnualTraining = {
    _count: MemberAnnualTrainingCountAggregateOutputType | null;
    _avg: MemberAnnualTrainingAvgAggregateOutputType | null;
    _sum: MemberAnnualTrainingSumAggregateOutputType | null;
    _min: MemberAnnualTrainingMinAggregateOutputType | null;
    _max: MemberAnnualTrainingMaxAggregateOutputType | null;
};
export type MemberAnnualTrainingAvgAggregateOutputType = {
    requirementId: number | null;
    memberId: number | null;
};
export type MemberAnnualTrainingSumAggregateOutputType = {
    requirementId: number | null;
    memberId: number | null;
};
export type MemberAnnualTrainingMinAggregateOutputType = {
    requirementId: number | null;
    memberId: number | null;
    completedAt: Date | null;
};
export type MemberAnnualTrainingMaxAggregateOutputType = {
    requirementId: number | null;
    memberId: number | null;
    completedAt: Date | null;
};
export type MemberAnnualTrainingCountAggregateOutputType = {
    requirementId: number;
    memberId: number;
    completedAt: number;
    _all: number;
};
export type MemberAnnualTrainingAvgAggregateInputType = {
    requirementId?: true;
    memberId?: true;
};
export type MemberAnnualTrainingSumAggregateInputType = {
    requirementId?: true;
    memberId?: true;
};
export type MemberAnnualTrainingMinAggregateInputType = {
    requirementId?: true;
    memberId?: true;
    completedAt?: true;
};
export type MemberAnnualTrainingMaxAggregateInputType = {
    requirementId?: true;
    memberId?: true;
    completedAt?: true;
};
export type MemberAnnualTrainingCountAggregateInputType = {
    requirementId?: true;
    memberId?: true;
    completedAt?: true;
    _all?: true;
};
export type MemberAnnualTrainingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithRelationInput | Prisma.MemberAnnualTrainingOrderByWithRelationInput[];
    cursor?: Prisma.MemberAnnualTrainingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MemberAnnualTrainingCountAggregateInputType;
    _avg?: MemberAnnualTrainingAvgAggregateInputType;
    _sum?: MemberAnnualTrainingSumAggregateInputType;
    _min?: MemberAnnualTrainingMinAggregateInputType;
    _max?: MemberAnnualTrainingMaxAggregateInputType;
};
export type GetMemberAnnualTrainingAggregateType<T extends MemberAnnualTrainingAggregateArgs> = {
    [P in keyof T & keyof AggregateMemberAnnualTraining]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMemberAnnualTraining[P]> : Prisma.GetScalarType<T[P], AggregateMemberAnnualTraining[P]>;
};
export type MemberAnnualTrainingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithAggregationInput | Prisma.MemberAnnualTrainingOrderByWithAggregationInput[];
    by: Prisma.MemberAnnualTrainingScalarFieldEnum[] | Prisma.MemberAnnualTrainingScalarFieldEnum;
    having?: Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MemberAnnualTrainingCountAggregateInputType | true;
    _avg?: MemberAnnualTrainingAvgAggregateInputType;
    _sum?: MemberAnnualTrainingSumAggregateInputType;
    _min?: MemberAnnualTrainingMinAggregateInputType;
    _max?: MemberAnnualTrainingMaxAggregateInputType;
};
export type MemberAnnualTrainingGroupByOutputType = {
    requirementId: number;
    memberId: number;
    completedAt: Date | null;
    _count: MemberAnnualTrainingCountAggregateOutputType | null;
    _avg: MemberAnnualTrainingAvgAggregateOutputType | null;
    _sum: MemberAnnualTrainingSumAggregateOutputType | null;
    _min: MemberAnnualTrainingMinAggregateOutputType | null;
    _max: MemberAnnualTrainingMaxAggregateOutputType | null;
};
export type GetMemberAnnualTrainingGroupByPayload<T extends MemberAnnualTrainingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MemberAnnualTrainingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MemberAnnualTrainingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MemberAnnualTrainingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MemberAnnualTrainingGroupByOutputType[P]>;
}>>;
export type MemberAnnualTrainingWhereInput = {
    AND?: Prisma.MemberAnnualTrainingWhereInput | Prisma.MemberAnnualTrainingWhereInput[];
    OR?: Prisma.MemberAnnualTrainingWhereInput[];
    NOT?: Prisma.MemberAnnualTrainingWhereInput | Prisma.MemberAnnualTrainingWhereInput[];
    requirementId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    memberId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    completedAt?: Prisma.DateTimeNullableFilter<"MemberAnnualTraining"> | Date | string | null;
    requirement?: Prisma.XOR<Prisma.AnnualTrainingRequirementScalarRelationFilter, Prisma.AnnualTrainingRequirementWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type MemberAnnualTrainingOrderByWithRelationInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    requirement?: Prisma.AnnualTrainingRequirementOrderByWithRelationInput;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type MemberAnnualTrainingWhereUniqueInput = Prisma.AtLeast<{
    requirementId_memberId?: Prisma.MemberAnnualTrainingRequirementIdMemberIdCompoundUniqueInput;
    AND?: Prisma.MemberAnnualTrainingWhereInput | Prisma.MemberAnnualTrainingWhereInput[];
    OR?: Prisma.MemberAnnualTrainingWhereInput[];
    NOT?: Prisma.MemberAnnualTrainingWhereInput | Prisma.MemberAnnualTrainingWhereInput[];
    requirementId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    memberId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    completedAt?: Prisma.DateTimeNullableFilter<"MemberAnnualTraining"> | Date | string | null;
    requirement?: Prisma.XOR<Prisma.AnnualTrainingRequirementScalarRelationFilter, Prisma.AnnualTrainingRequirementWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "requirementId_memberId">;
export type MemberAnnualTrainingOrderByWithAggregationInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MemberAnnualTrainingCountOrderByAggregateInput;
    _avg?: Prisma.MemberAnnualTrainingAvgOrderByAggregateInput;
    _max?: Prisma.MemberAnnualTrainingMaxOrderByAggregateInput;
    _min?: Prisma.MemberAnnualTrainingMinOrderByAggregateInput;
    _sum?: Prisma.MemberAnnualTrainingSumOrderByAggregateInput;
};
export type MemberAnnualTrainingScalarWhereWithAggregatesInput = {
    AND?: Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput | Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput[];
    OR?: Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput | Prisma.MemberAnnualTrainingScalarWhereWithAggregatesInput[];
    requirementId?: Prisma.IntWithAggregatesFilter<"MemberAnnualTraining"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"MemberAnnualTraining"> | number;
    completedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberAnnualTraining"> | Date | string | null;
};
export type MemberAnnualTrainingCreateInput = {
    completedAt?: Date | string | null;
    requirement: Prisma.AnnualTrainingRequirementCreateNestedOneWithoutCompletionsInput;
    member: Prisma.MemberCreateNestedOneWithoutAnnualTrainingsInput;
};
export type MemberAnnualTrainingUncheckedCreateInput = {
    requirementId: number;
    memberId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingUpdateInput = {
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    requirement?: Prisma.AnnualTrainingRequirementUpdateOneRequiredWithoutCompletionsNestedInput;
    member?: Prisma.MemberUpdateOneRequiredWithoutAnnualTrainingsNestedInput;
};
export type MemberAnnualTrainingUncheckedUpdateInput = {
    requirementId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingCreateManyInput = {
    requirementId: number;
    memberId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingUpdateManyMutationInput = {
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingUncheckedUpdateManyInput = {
    requirementId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingListRelationFilter = {
    every?: Prisma.MemberAnnualTrainingWhereInput;
    some?: Prisma.MemberAnnualTrainingWhereInput;
    none?: Prisma.MemberAnnualTrainingWhereInput;
};
export type MemberAnnualTrainingOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MemberAnnualTrainingRequirementIdMemberIdCompoundUniqueInput = {
    requirementId: number;
    memberId: number;
};
export type MemberAnnualTrainingCountOrderByAggregateInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type MemberAnnualTrainingAvgOrderByAggregateInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type MemberAnnualTrainingMaxOrderByAggregateInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type MemberAnnualTrainingMinOrderByAggregateInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    completedAt?: Prisma.SortOrder;
};
export type MemberAnnualTrainingSumOrderByAggregateInput = {
    requirementId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type MemberAnnualTrainingCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput> | Prisma.MemberAnnualTrainingCreateWithoutMemberInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
};
export type MemberAnnualTrainingUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput> | Prisma.MemberAnnualTrainingCreateWithoutMemberInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
};
export type MemberAnnualTrainingUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput> | Prisma.MemberAnnualTrainingCreateWithoutMemberInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyMemberInputEnvelope;
    set?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    disconnect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    delete?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    update?: Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutMemberInput | Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
};
export type MemberAnnualTrainingUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput> | Prisma.MemberAnnualTrainingCreateWithoutMemberInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyMemberInputEnvelope;
    set?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    disconnect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    delete?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    update?: Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutMemberInput | Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
};
export type MemberAnnualTrainingCreateNestedManyWithoutRequirementInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput> | Prisma.MemberAnnualTrainingCreateWithoutRequirementInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyRequirementInputEnvelope;
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
};
export type MemberAnnualTrainingUncheckedCreateNestedManyWithoutRequirementInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput> | Prisma.MemberAnnualTrainingCreateWithoutRequirementInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyRequirementInputEnvelope;
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
};
export type MemberAnnualTrainingUpdateManyWithoutRequirementNestedInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput> | Prisma.MemberAnnualTrainingCreateWithoutRequirementInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput[];
    upsert?: Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutRequirementInput | Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutRequirementInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyRequirementInputEnvelope;
    set?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    disconnect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    delete?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    update?: Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutRequirementInput | Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutRequirementInput[];
    updateMany?: Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutRequirementInput | Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutRequirementInput[];
    deleteMany?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
};
export type MemberAnnualTrainingUncheckedUpdateManyWithoutRequirementNestedInput = {
    create?: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput> | Prisma.MemberAnnualTrainingCreateWithoutRequirementInput[] | Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput[];
    connectOrCreate?: Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput | Prisma.MemberAnnualTrainingCreateOrConnectWithoutRequirementInput[];
    upsert?: Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutRequirementInput | Prisma.MemberAnnualTrainingUpsertWithWhereUniqueWithoutRequirementInput[];
    createMany?: Prisma.MemberAnnualTrainingCreateManyRequirementInputEnvelope;
    set?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    disconnect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    delete?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    connect?: Prisma.MemberAnnualTrainingWhereUniqueInput | Prisma.MemberAnnualTrainingWhereUniqueInput[];
    update?: Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutRequirementInput | Prisma.MemberAnnualTrainingUpdateWithWhereUniqueWithoutRequirementInput[];
    updateMany?: Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutRequirementInput | Prisma.MemberAnnualTrainingUpdateManyWithWhereWithoutRequirementInput[];
    deleteMany?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
};
export type MemberAnnualTrainingCreateWithoutMemberInput = {
    completedAt?: Date | string | null;
    requirement: Prisma.AnnualTrainingRequirementCreateNestedOneWithoutCompletionsInput;
};
export type MemberAnnualTrainingUncheckedCreateWithoutMemberInput = {
    requirementId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingCreateOrConnectWithoutMemberInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput>;
};
export type MemberAnnualTrainingCreateManyMemberInputEnvelope = {
    data: Prisma.MemberAnnualTrainingCreateManyMemberInput | Prisma.MemberAnnualTrainingCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type MemberAnnualTrainingUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutMemberInput>;
};
export type MemberAnnualTrainingUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateWithoutMemberInput, Prisma.MemberAnnualTrainingUncheckedUpdateWithoutMemberInput>;
};
export type MemberAnnualTrainingUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.MemberAnnualTrainingScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateManyMutationInput, Prisma.MemberAnnualTrainingUncheckedUpdateManyWithoutMemberInput>;
};
export type MemberAnnualTrainingScalarWhereInput = {
    AND?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
    OR?: Prisma.MemberAnnualTrainingScalarWhereInput[];
    NOT?: Prisma.MemberAnnualTrainingScalarWhereInput | Prisma.MemberAnnualTrainingScalarWhereInput[];
    requirementId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    memberId?: Prisma.IntFilter<"MemberAnnualTraining"> | number;
    completedAt?: Prisma.DateTimeNullableFilter<"MemberAnnualTraining"> | Date | string | null;
};
export type MemberAnnualTrainingCreateWithoutRequirementInput = {
    completedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutAnnualTrainingsInput;
};
export type MemberAnnualTrainingUncheckedCreateWithoutRequirementInput = {
    memberId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingCreateOrConnectWithoutRequirementInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput>;
};
export type MemberAnnualTrainingCreateManyRequirementInputEnvelope = {
    data: Prisma.MemberAnnualTrainingCreateManyRequirementInput | Prisma.MemberAnnualTrainingCreateManyRequirementInput[];
    skipDuplicates?: boolean;
};
export type MemberAnnualTrainingUpsertWithWhereUniqueWithoutRequirementInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedUpdateWithoutRequirementInput>;
    create: Prisma.XOR<Prisma.MemberAnnualTrainingCreateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedCreateWithoutRequirementInput>;
};
export type MemberAnnualTrainingUpdateWithWhereUniqueWithoutRequirementInput = {
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateWithoutRequirementInput, Prisma.MemberAnnualTrainingUncheckedUpdateWithoutRequirementInput>;
};
export type MemberAnnualTrainingUpdateManyWithWhereWithoutRequirementInput = {
    where: Prisma.MemberAnnualTrainingScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateManyMutationInput, Prisma.MemberAnnualTrainingUncheckedUpdateManyWithoutRequirementInput>;
};
export type MemberAnnualTrainingCreateManyMemberInput = {
    requirementId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingUpdateWithoutMemberInput = {
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    requirement?: Prisma.AnnualTrainingRequirementUpdateOneRequiredWithoutCompletionsNestedInput;
};
export type MemberAnnualTrainingUncheckedUpdateWithoutMemberInput = {
    requirementId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingUncheckedUpdateManyWithoutMemberInput = {
    requirementId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingCreateManyRequirementInput = {
    memberId: number;
    completedAt?: Date | string | null;
};
export type MemberAnnualTrainingUpdateWithoutRequirementInput = {
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutAnnualTrainingsNestedInput;
};
export type MemberAnnualTrainingUncheckedUpdateWithoutRequirementInput = {
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingUncheckedUpdateManyWithoutRequirementInput = {
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    completedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberAnnualTrainingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requirementId?: boolean;
    memberId?: boolean;
    completedAt?: boolean;
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberAnnualTraining"]>;
export type MemberAnnualTrainingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requirementId?: boolean;
    memberId?: boolean;
    completedAt?: boolean;
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberAnnualTraining"]>;
export type MemberAnnualTrainingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requirementId?: boolean;
    memberId?: boolean;
    completedAt?: boolean;
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberAnnualTraining"]>;
export type MemberAnnualTrainingSelectScalar = {
    requirementId?: boolean;
    memberId?: boolean;
    completedAt?: boolean;
};
export type MemberAnnualTrainingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"requirementId" | "memberId" | "completedAt", ExtArgs["result"]["memberAnnualTraining"]>;
export type MemberAnnualTrainingInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type MemberAnnualTrainingIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type MemberAnnualTrainingIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    requirement?: boolean | Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $MemberAnnualTrainingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MemberAnnualTraining";
    objects: {
        requirement: Prisma.$AnnualTrainingRequirementPayload<ExtArgs>;
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        requirementId: number;
        memberId: number;
        completedAt: Date | null;
    }, ExtArgs["result"]["memberAnnualTraining"]>;
    composites: {};
};
export type MemberAnnualTrainingGetPayload<S extends boolean | null | undefined | MemberAnnualTrainingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload, S>;
export type MemberAnnualTrainingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MemberAnnualTrainingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MemberAnnualTrainingCountAggregateInputType | true;
};
export interface MemberAnnualTrainingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MemberAnnualTraining'];
        meta: {
            name: 'MemberAnnualTraining';
        };
    };
    findUnique<T extends MemberAnnualTrainingFindUniqueArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MemberAnnualTrainingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MemberAnnualTrainingFindFirstArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingFindFirstArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MemberAnnualTrainingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MemberAnnualTrainingFindManyArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MemberAnnualTrainingCreateArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingCreateArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MemberAnnualTrainingCreateManyArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MemberAnnualTrainingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MemberAnnualTrainingDeleteArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingDeleteArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MemberAnnualTrainingUpdateArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingUpdateArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MemberAnnualTrainingDeleteManyArgs>(args?: Prisma.SelectSubset<T, MemberAnnualTrainingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MemberAnnualTrainingUpdateManyArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MemberAnnualTrainingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MemberAnnualTrainingUpsertArgs>(args: Prisma.SelectSubset<T, MemberAnnualTrainingUpsertArgs<ExtArgs>>): Prisma.Prisma__MemberAnnualTrainingClient<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MemberAnnualTrainingCountArgs>(args?: Prisma.Subset<T, MemberAnnualTrainingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MemberAnnualTrainingCountAggregateOutputType> : number>;
    aggregate<T extends MemberAnnualTrainingAggregateArgs>(args: Prisma.Subset<T, MemberAnnualTrainingAggregateArgs>): Prisma.PrismaPromise<GetMemberAnnualTrainingAggregateType<T>>;
    groupBy<T extends MemberAnnualTrainingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MemberAnnualTrainingGroupByArgs['orderBy'];
    } : {
        orderBy?: MemberAnnualTrainingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MemberAnnualTrainingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberAnnualTrainingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MemberAnnualTrainingFieldRefs;
}
export interface Prisma__MemberAnnualTrainingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    requirement<T extends Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AnnualTrainingRequirementDefaultArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MemberAnnualTrainingFieldRefs {
    readonly requirementId: Prisma.FieldRef<"MemberAnnualTraining", 'Int'>;
    readonly memberId: Prisma.FieldRef<"MemberAnnualTraining", 'Int'>;
    readonly completedAt: Prisma.FieldRef<"MemberAnnualTraining", 'DateTime'>;
}
export type MemberAnnualTrainingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
};
export type MemberAnnualTrainingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
};
export type MemberAnnualTrainingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithRelationInput | Prisma.MemberAnnualTrainingOrderByWithRelationInput[];
    cursor?: Prisma.MemberAnnualTrainingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberAnnualTrainingScalarFieldEnum | Prisma.MemberAnnualTrainingScalarFieldEnum[];
};
export type MemberAnnualTrainingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithRelationInput | Prisma.MemberAnnualTrainingOrderByWithRelationInput[];
    cursor?: Prisma.MemberAnnualTrainingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberAnnualTrainingScalarFieldEnum | Prisma.MemberAnnualTrainingScalarFieldEnum[];
};
export type MemberAnnualTrainingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithRelationInput | Prisma.MemberAnnualTrainingOrderByWithRelationInput[];
    cursor?: Prisma.MemberAnnualTrainingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberAnnualTrainingScalarFieldEnum | Prisma.MemberAnnualTrainingScalarFieldEnum[];
};
export type MemberAnnualTrainingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingCreateInput, Prisma.MemberAnnualTrainingUncheckedCreateInput>;
};
export type MemberAnnualTrainingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MemberAnnualTrainingCreateManyInput | Prisma.MemberAnnualTrainingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MemberAnnualTrainingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    data: Prisma.MemberAnnualTrainingCreateManyInput | Prisma.MemberAnnualTrainingCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MemberAnnualTrainingIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MemberAnnualTrainingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateInput, Prisma.MemberAnnualTrainingUncheckedUpdateInput>;
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
};
export type MemberAnnualTrainingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateManyMutationInput, Prisma.MemberAnnualTrainingUncheckedUpdateManyInput>;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    limit?: number;
};
export type MemberAnnualTrainingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateManyMutationInput, Prisma.MemberAnnualTrainingUncheckedUpdateManyInput>;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    limit?: number;
    include?: Prisma.MemberAnnualTrainingIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MemberAnnualTrainingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberAnnualTrainingCreateInput, Prisma.MemberAnnualTrainingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MemberAnnualTrainingUpdateInput, Prisma.MemberAnnualTrainingUncheckedUpdateInput>;
};
export type MemberAnnualTrainingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where: Prisma.MemberAnnualTrainingWhereUniqueInput;
};
export type MemberAnnualTrainingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberAnnualTrainingWhereInput;
    limit?: number;
};
export type MemberAnnualTrainingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
};
