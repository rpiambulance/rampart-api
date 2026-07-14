import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CredentialPrerequisiteModel = runtime.Types.Result.DefaultSelection<Prisma.$CredentialPrerequisitePayload>;
export type AggregateCredentialPrerequisite = {
    _count: CredentialPrerequisiteCountAggregateOutputType | null;
    _avg: CredentialPrerequisiteAvgAggregateOutputType | null;
    _sum: CredentialPrerequisiteSumAggregateOutputType | null;
    _min: CredentialPrerequisiteMinAggregateOutputType | null;
    _max: CredentialPrerequisiteMaxAggregateOutputType | null;
};
export type CredentialPrerequisiteAvgAggregateOutputType = {
    credentialTypeId: number | null;
    requiresTypeId: number | null;
};
export type CredentialPrerequisiteSumAggregateOutputType = {
    credentialTypeId: number | null;
    requiresTypeId: number | null;
};
export type CredentialPrerequisiteMinAggregateOutputType = {
    credentialTypeId: number | null;
    requiresTypeId: number | null;
};
export type CredentialPrerequisiteMaxAggregateOutputType = {
    credentialTypeId: number | null;
    requiresTypeId: number | null;
};
export type CredentialPrerequisiteCountAggregateOutputType = {
    credentialTypeId: number;
    requiresTypeId: number;
    _all: number;
};
export type CredentialPrerequisiteAvgAggregateInputType = {
    credentialTypeId?: true;
    requiresTypeId?: true;
};
export type CredentialPrerequisiteSumAggregateInputType = {
    credentialTypeId?: true;
    requiresTypeId?: true;
};
export type CredentialPrerequisiteMinAggregateInputType = {
    credentialTypeId?: true;
    requiresTypeId?: true;
};
export type CredentialPrerequisiteMaxAggregateInputType = {
    credentialTypeId?: true;
    requiresTypeId?: true;
};
export type CredentialPrerequisiteCountAggregateInputType = {
    credentialTypeId?: true;
    requiresTypeId?: true;
    _all?: true;
};
export type CredentialPrerequisiteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CredentialPrerequisiteCountAggregateInputType;
    _avg?: CredentialPrerequisiteAvgAggregateInputType;
    _sum?: CredentialPrerequisiteSumAggregateInputType;
    _min?: CredentialPrerequisiteMinAggregateInputType;
    _max?: CredentialPrerequisiteMaxAggregateInputType;
};
export type GetCredentialPrerequisiteAggregateType<T extends CredentialPrerequisiteAggregateArgs> = {
    [P in keyof T & keyof AggregateCredentialPrerequisite]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCredentialPrerequisite[P]> : Prisma.GetScalarType<T[P], AggregateCredentialPrerequisite[P]>;
};
export type CredentialPrerequisiteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithAggregationInput | Prisma.CredentialPrerequisiteOrderByWithAggregationInput[];
    by: Prisma.CredentialPrerequisiteScalarFieldEnum[] | Prisma.CredentialPrerequisiteScalarFieldEnum;
    having?: Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CredentialPrerequisiteCountAggregateInputType | true;
    _avg?: CredentialPrerequisiteAvgAggregateInputType;
    _sum?: CredentialPrerequisiteSumAggregateInputType;
    _min?: CredentialPrerequisiteMinAggregateInputType;
    _max?: CredentialPrerequisiteMaxAggregateInputType;
};
export type CredentialPrerequisiteGroupByOutputType = {
    credentialTypeId: number;
    requiresTypeId: number;
    _count: CredentialPrerequisiteCountAggregateOutputType | null;
    _avg: CredentialPrerequisiteAvgAggregateOutputType | null;
    _sum: CredentialPrerequisiteSumAggregateOutputType | null;
    _min: CredentialPrerequisiteMinAggregateOutputType | null;
    _max: CredentialPrerequisiteMaxAggregateOutputType | null;
};
export type GetCredentialPrerequisiteGroupByPayload<T extends CredentialPrerequisiteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CredentialPrerequisiteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CredentialPrerequisiteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CredentialPrerequisiteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CredentialPrerequisiteGroupByOutputType[P]>;
}>>;
export type CredentialPrerequisiteWhereInput = {
    AND?: Prisma.CredentialPrerequisiteWhereInput | Prisma.CredentialPrerequisiteWhereInput[];
    OR?: Prisma.CredentialPrerequisiteWhereInput[];
    NOT?: Prisma.CredentialPrerequisiteWhereInput | Prisma.CredentialPrerequisiteWhereInput[];
    credentialTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
    requiresTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    requiresType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
};
export type CredentialPrerequisiteOrderByWithRelationInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
    credentialType?: Prisma.CredentialTypeOrderByWithRelationInput;
    requiresType?: Prisma.CredentialTypeOrderByWithRelationInput;
};
export type CredentialPrerequisiteWhereUniqueInput = Prisma.AtLeast<{
    credentialTypeId_requiresTypeId?: Prisma.CredentialPrerequisiteCredentialTypeIdRequiresTypeIdCompoundUniqueInput;
    AND?: Prisma.CredentialPrerequisiteWhereInput | Prisma.CredentialPrerequisiteWhereInput[];
    OR?: Prisma.CredentialPrerequisiteWhereInput[];
    NOT?: Prisma.CredentialPrerequisiteWhereInput | Prisma.CredentialPrerequisiteWhereInput[];
    credentialTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
    requiresTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    requiresType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
}, "credentialTypeId_requiresTypeId">;
export type CredentialPrerequisiteOrderByWithAggregationInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
    _count?: Prisma.CredentialPrerequisiteCountOrderByAggregateInput;
    _avg?: Prisma.CredentialPrerequisiteAvgOrderByAggregateInput;
    _max?: Prisma.CredentialPrerequisiteMaxOrderByAggregateInput;
    _min?: Prisma.CredentialPrerequisiteMinOrderByAggregateInput;
    _sum?: Prisma.CredentialPrerequisiteSumOrderByAggregateInput;
};
export type CredentialPrerequisiteScalarWhereWithAggregatesInput = {
    AND?: Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput | Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput[];
    OR?: Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput | Prisma.CredentialPrerequisiteScalarWhereWithAggregatesInput[];
    credentialTypeId?: Prisma.IntWithAggregatesFilter<"CredentialPrerequisite"> | number;
    requiresTypeId?: Prisma.IntWithAggregatesFilter<"CredentialPrerequisite"> | number;
};
export type CredentialPrerequisiteCreateInput = {
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPrerequisitesInput;
    requiresType: Prisma.CredentialTypeCreateNestedOneWithoutPrerequisiteOfInput;
};
export type CredentialPrerequisiteUncheckedCreateInput = {
    credentialTypeId: number;
    requiresTypeId: number;
};
export type CredentialPrerequisiteUpdateInput = {
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPrerequisitesNestedInput;
    requiresType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPrerequisiteOfNestedInput;
};
export type CredentialPrerequisiteUncheckedUpdateInput = {
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    requiresTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteCreateManyInput = {
    credentialTypeId: number;
    requiresTypeId: number;
};
export type CredentialPrerequisiteUpdateManyMutationInput = {};
export type CredentialPrerequisiteUncheckedUpdateManyInput = {
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    requiresTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteListRelationFilter = {
    every?: Prisma.CredentialPrerequisiteWhereInput;
    some?: Prisma.CredentialPrerequisiteWhereInput;
    none?: Prisma.CredentialPrerequisiteWhereInput;
};
export type CredentialPrerequisiteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CredentialPrerequisiteCredentialTypeIdRequiresTypeIdCompoundUniqueInput = {
    credentialTypeId: number;
    requiresTypeId: number;
};
export type CredentialPrerequisiteCountOrderByAggregateInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
};
export type CredentialPrerequisiteAvgOrderByAggregateInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
};
export type CredentialPrerequisiteMaxOrderByAggregateInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
};
export type CredentialPrerequisiteMinOrderByAggregateInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
};
export type CredentialPrerequisiteSumOrderByAggregateInput = {
    credentialTypeId?: Prisma.SortOrder;
    requiresTypeId?: Prisma.SortOrder;
};
export type CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
};
export type CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyRequiresTypeInputEnvelope;
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
};
export type CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
};
export type CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyRequiresTypeInputEnvelope;
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
};
export type CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    disconnect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    delete?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    update?: Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
};
export type CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput[];
    upsert?: Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutRequiresTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyRequiresTypeInputEnvelope;
    set?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    disconnect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    delete?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    update?: Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutRequiresTypeInput[];
    updateMany?: Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutRequiresTypeInput[];
    deleteMany?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
};
export type CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    disconnect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    delete?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    update?: Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
};
export type CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput> | Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput[] | Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput[];
    connectOrCreate?: Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput[];
    upsert?: Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpsertWithWhereUniqueWithoutRequiresTypeInput[];
    createMany?: Prisma.CredentialPrerequisiteCreateManyRequiresTypeInputEnvelope;
    set?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    disconnect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    delete?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    connect?: Prisma.CredentialPrerequisiteWhereUniqueInput | Prisma.CredentialPrerequisiteWhereUniqueInput[];
    update?: Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpdateWithWhereUniqueWithoutRequiresTypeInput[];
    updateMany?: Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutRequiresTypeInput | Prisma.CredentialPrerequisiteUpdateManyWithWhereWithoutRequiresTypeInput[];
    deleteMany?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
};
export type CredentialPrerequisiteCreateWithoutCredentialTypeInput = {
    requiresType: Prisma.CredentialTypeCreateNestedOneWithoutPrerequisiteOfInput;
};
export type CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput = {
    requiresTypeId: number;
};
export type CredentialPrerequisiteCreateOrConnectWithoutCredentialTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput>;
};
export type CredentialPrerequisiteCreateManyCredentialTypeInputEnvelope = {
    data: Prisma.CredentialPrerequisiteCreateManyCredentialTypeInput | Prisma.CredentialPrerequisiteCreateManyCredentialTypeInput[];
    skipDuplicates?: boolean;
};
export type CredentialPrerequisiteCreateWithoutRequiresTypeInput = {
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPrerequisitesInput;
};
export type CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput = {
    credentialTypeId: number;
};
export type CredentialPrerequisiteCreateOrConnectWithoutRequiresTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput>;
};
export type CredentialPrerequisiteCreateManyRequiresTypeInputEnvelope = {
    data: Prisma.CredentialPrerequisiteCreateManyRequiresTypeInput | Prisma.CredentialPrerequisiteCreateManyRequiresTypeInput[];
    skipDuplicates?: boolean;
};
export type CredentialPrerequisiteUpsertWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedUpdateWithoutCredentialTypeInput>;
    create: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutCredentialTypeInput>;
};
export type CredentialPrerequisiteUpdateWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateWithoutCredentialTypeInput, Prisma.CredentialPrerequisiteUncheckedUpdateWithoutCredentialTypeInput>;
};
export type CredentialPrerequisiteUpdateManyWithWhereWithoutCredentialTypeInput = {
    where: Prisma.CredentialPrerequisiteScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateManyMutationInput, Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeInput>;
};
export type CredentialPrerequisiteScalarWhereInput = {
    AND?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
    OR?: Prisma.CredentialPrerequisiteScalarWhereInput[];
    NOT?: Prisma.CredentialPrerequisiteScalarWhereInput | Prisma.CredentialPrerequisiteScalarWhereInput[];
    credentialTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
    requiresTypeId?: Prisma.IntFilter<"CredentialPrerequisite"> | number;
};
export type CredentialPrerequisiteUpsertWithWhereUniqueWithoutRequiresTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedUpdateWithoutRequiresTypeInput>;
    create: Prisma.XOR<Prisma.CredentialPrerequisiteCreateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedCreateWithoutRequiresTypeInput>;
};
export type CredentialPrerequisiteUpdateWithWhereUniqueWithoutRequiresTypeInput = {
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateWithoutRequiresTypeInput, Prisma.CredentialPrerequisiteUncheckedUpdateWithoutRequiresTypeInput>;
};
export type CredentialPrerequisiteUpdateManyWithWhereWithoutRequiresTypeInput = {
    where: Prisma.CredentialPrerequisiteScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateManyMutationInput, Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeInput>;
};
export type CredentialPrerequisiteCreateManyCredentialTypeInput = {
    requiresTypeId: number;
};
export type CredentialPrerequisiteCreateManyRequiresTypeInput = {
    credentialTypeId: number;
};
export type CredentialPrerequisiteUpdateWithoutCredentialTypeInput = {
    requiresType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPrerequisiteOfNestedInput;
};
export type CredentialPrerequisiteUncheckedUpdateWithoutCredentialTypeInput = {
    requiresTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeInput = {
    requiresTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteUpdateWithoutRequiresTypeInput = {
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPrerequisitesNestedInput;
};
export type CredentialPrerequisiteUncheckedUpdateWithoutRequiresTypeInput = {
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeInput = {
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type CredentialPrerequisiteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    credentialTypeId?: boolean;
    requiresTypeId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialPrerequisite"]>;
export type CredentialPrerequisiteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    credentialTypeId?: boolean;
    requiresTypeId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialPrerequisite"]>;
export type CredentialPrerequisiteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    credentialTypeId?: boolean;
    requiresTypeId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialPrerequisite"]>;
export type CredentialPrerequisiteSelectScalar = {
    credentialTypeId?: boolean;
    requiresTypeId?: boolean;
};
export type CredentialPrerequisiteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"credentialTypeId" | "requiresTypeId", ExtArgs["result"]["credentialPrerequisite"]>;
export type CredentialPrerequisiteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
};
export type CredentialPrerequisiteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
};
export type CredentialPrerequisiteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    requiresType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
};
export type $CredentialPrerequisitePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CredentialPrerequisite";
    objects: {
        credentialType: Prisma.$CredentialTypePayload<ExtArgs>;
        requiresType: Prisma.$CredentialTypePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        credentialTypeId: number;
        requiresTypeId: number;
    }, ExtArgs["result"]["credentialPrerequisite"]>;
    composites: {};
};
export type CredentialPrerequisiteGetPayload<S extends boolean | null | undefined | CredentialPrerequisiteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload, S>;
export type CredentialPrerequisiteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CredentialPrerequisiteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CredentialPrerequisiteCountAggregateInputType | true;
};
export interface CredentialPrerequisiteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CredentialPrerequisite'];
        meta: {
            name: 'CredentialPrerequisite';
        };
    };
    findUnique<T extends CredentialPrerequisiteFindUniqueArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CredentialPrerequisiteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CredentialPrerequisiteFindFirstArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteFindFirstArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CredentialPrerequisiteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CredentialPrerequisiteFindManyArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CredentialPrerequisiteCreateArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteCreateArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CredentialPrerequisiteCreateManyArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CredentialPrerequisiteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CredentialPrerequisiteDeleteArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteDeleteArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CredentialPrerequisiteUpdateArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteUpdateArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CredentialPrerequisiteDeleteManyArgs>(args?: Prisma.SelectSubset<T, CredentialPrerequisiteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CredentialPrerequisiteUpdateManyArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CredentialPrerequisiteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CredentialPrerequisiteUpsertArgs>(args: Prisma.SelectSubset<T, CredentialPrerequisiteUpsertArgs<ExtArgs>>): Prisma.Prisma__CredentialPrerequisiteClient<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CredentialPrerequisiteCountArgs>(args?: Prisma.Subset<T, CredentialPrerequisiteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CredentialPrerequisiteCountAggregateOutputType> : number>;
    aggregate<T extends CredentialPrerequisiteAggregateArgs>(args: Prisma.Subset<T, CredentialPrerequisiteAggregateArgs>): Prisma.PrismaPromise<GetCredentialPrerequisiteAggregateType<T>>;
    groupBy<T extends CredentialPrerequisiteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CredentialPrerequisiteGroupByArgs['orderBy'];
    } : {
        orderBy?: CredentialPrerequisiteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CredentialPrerequisiteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialPrerequisiteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CredentialPrerequisiteFieldRefs;
}
export interface Prisma__CredentialPrerequisiteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    credentialType<T extends Prisma.CredentialTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    requiresType<T extends Prisma.CredentialTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CredentialPrerequisiteFieldRefs {
    readonly credentialTypeId: Prisma.FieldRef<"CredentialPrerequisite", 'Int'>;
    readonly requiresTypeId: Prisma.FieldRef<"CredentialPrerequisite", 'Int'>;
}
export type CredentialPrerequisiteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
};
export type CredentialPrerequisiteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
};
export type CredentialPrerequisiteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialPrerequisiteScalarFieldEnum | Prisma.CredentialPrerequisiteScalarFieldEnum[];
};
export type CredentialPrerequisiteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialPrerequisiteScalarFieldEnum | Prisma.CredentialPrerequisiteScalarFieldEnum[];
};
export type CredentialPrerequisiteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialPrerequisiteScalarFieldEnum | Prisma.CredentialPrerequisiteScalarFieldEnum[];
};
export type CredentialPrerequisiteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteCreateInput, Prisma.CredentialPrerequisiteUncheckedCreateInput>;
};
export type CredentialPrerequisiteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CredentialPrerequisiteCreateManyInput | Prisma.CredentialPrerequisiteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CredentialPrerequisiteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    data: Prisma.CredentialPrerequisiteCreateManyInput | Prisma.CredentialPrerequisiteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CredentialPrerequisiteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CredentialPrerequisiteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateInput, Prisma.CredentialPrerequisiteUncheckedUpdateInput>;
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
};
export type CredentialPrerequisiteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateManyMutationInput, Prisma.CredentialPrerequisiteUncheckedUpdateManyInput>;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    limit?: number;
};
export type CredentialPrerequisiteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateManyMutationInput, Prisma.CredentialPrerequisiteUncheckedUpdateManyInput>;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    limit?: number;
    include?: Prisma.CredentialPrerequisiteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CredentialPrerequisiteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialPrerequisiteCreateInput, Prisma.CredentialPrerequisiteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CredentialPrerequisiteUpdateInput, Prisma.CredentialPrerequisiteUncheckedUpdateInput>;
};
export type CredentialPrerequisiteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where: Prisma.CredentialPrerequisiteWhereUniqueInput;
};
export type CredentialPrerequisiteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialPrerequisiteWhereInput;
    limit?: number;
};
export type CredentialPrerequisiteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
};
