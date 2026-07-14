import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PromotionProxyModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionProxyPayload>;
export type AggregatePromotionProxy = {
    _count: PromotionProxyCountAggregateOutputType | null;
    _avg: PromotionProxyAvgAggregateOutputType | null;
    _sum: PromotionProxySumAggregateOutputType | null;
    _min: PromotionProxyMinAggregateOutputType | null;
    _max: PromotionProxyMaxAggregateOutputType | null;
};
export type PromotionProxyAvgAggregateOutputType = {
    requestId: number | null;
    principalId: number | null;
    proxyId: number | null;
};
export type PromotionProxySumAggregateOutputType = {
    requestId: number | null;
    principalId: number | null;
    proxyId: number | null;
};
export type PromotionProxyMinAggregateOutputType = {
    requestId: number | null;
    principalId: number | null;
    proxyId: number | null;
};
export type PromotionProxyMaxAggregateOutputType = {
    requestId: number | null;
    principalId: number | null;
    proxyId: number | null;
};
export type PromotionProxyCountAggregateOutputType = {
    requestId: number;
    principalId: number;
    proxyId: number;
    _all: number;
};
export type PromotionProxyAvgAggregateInputType = {
    requestId?: true;
    principalId?: true;
    proxyId?: true;
};
export type PromotionProxySumAggregateInputType = {
    requestId?: true;
    principalId?: true;
    proxyId?: true;
};
export type PromotionProxyMinAggregateInputType = {
    requestId?: true;
    principalId?: true;
    proxyId?: true;
};
export type PromotionProxyMaxAggregateInputType = {
    requestId?: true;
    principalId?: true;
    proxyId?: true;
};
export type PromotionProxyCountAggregateInputType = {
    requestId?: true;
    principalId?: true;
    proxyId?: true;
    _all?: true;
};
export type PromotionProxyAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionProxyWhereInput;
    orderBy?: Prisma.PromotionProxyOrderByWithRelationInput | Prisma.PromotionProxyOrderByWithRelationInput[];
    cursor?: Prisma.PromotionProxyWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PromotionProxyCountAggregateInputType;
    _avg?: PromotionProxyAvgAggregateInputType;
    _sum?: PromotionProxySumAggregateInputType;
    _min?: PromotionProxyMinAggregateInputType;
    _max?: PromotionProxyMaxAggregateInputType;
};
export type GetPromotionProxyAggregateType<T extends PromotionProxyAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionProxy]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionProxy[P]> : Prisma.GetScalarType<T[P], AggregatePromotionProxy[P]>;
};
export type PromotionProxyGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionProxyWhereInput;
    orderBy?: Prisma.PromotionProxyOrderByWithAggregationInput | Prisma.PromotionProxyOrderByWithAggregationInput[];
    by: Prisma.PromotionProxyScalarFieldEnum[] | Prisma.PromotionProxyScalarFieldEnum;
    having?: Prisma.PromotionProxyScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionProxyCountAggregateInputType | true;
    _avg?: PromotionProxyAvgAggregateInputType;
    _sum?: PromotionProxySumAggregateInputType;
    _min?: PromotionProxyMinAggregateInputType;
    _max?: PromotionProxyMaxAggregateInputType;
};
export type PromotionProxyGroupByOutputType = {
    requestId: number;
    principalId: number;
    proxyId: number;
    _count: PromotionProxyCountAggregateOutputType | null;
    _avg: PromotionProxyAvgAggregateOutputType | null;
    _sum: PromotionProxySumAggregateOutputType | null;
    _min: PromotionProxyMinAggregateOutputType | null;
    _max: PromotionProxyMaxAggregateOutputType | null;
};
export type GetPromotionProxyGroupByPayload<T extends PromotionProxyGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionProxyGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionProxyGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionProxyGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionProxyGroupByOutputType[P]>;
}>>;
export type PromotionProxyWhereInput = {
    AND?: Prisma.PromotionProxyWhereInput | Prisma.PromotionProxyWhereInput[];
    OR?: Prisma.PromotionProxyWhereInput[];
    NOT?: Prisma.PromotionProxyWhereInput | Prisma.PromotionProxyWhereInput[];
    requestId?: Prisma.IntFilter<"PromotionProxy"> | number;
    principalId?: Prisma.IntFilter<"PromotionProxy"> | number;
    proxyId?: Prisma.IntFilter<"PromotionProxy"> | number;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
    principal?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    proxy?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type PromotionProxyOrderByWithRelationInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
    request?: Prisma.PromotionRequestOrderByWithRelationInput;
    principal?: Prisma.MemberOrderByWithRelationInput;
    proxy?: Prisma.MemberOrderByWithRelationInput;
};
export type PromotionProxyWhereUniqueInput = Prisma.AtLeast<{
    requestId_principalId?: Prisma.PromotionProxyRequestIdPrincipalIdCompoundUniqueInput;
    AND?: Prisma.PromotionProxyWhereInput | Prisma.PromotionProxyWhereInput[];
    OR?: Prisma.PromotionProxyWhereInput[];
    NOT?: Prisma.PromotionProxyWhereInput | Prisma.PromotionProxyWhereInput[];
    requestId?: Prisma.IntFilter<"PromotionProxy"> | number;
    principalId?: Prisma.IntFilter<"PromotionProxy"> | number;
    proxyId?: Prisma.IntFilter<"PromotionProxy"> | number;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
    principal?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    proxy?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "requestId_principalId">;
export type PromotionProxyOrderByWithAggregationInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
    _count?: Prisma.PromotionProxyCountOrderByAggregateInput;
    _avg?: Prisma.PromotionProxyAvgOrderByAggregateInput;
    _max?: Prisma.PromotionProxyMaxOrderByAggregateInput;
    _min?: Prisma.PromotionProxyMinOrderByAggregateInput;
    _sum?: Prisma.PromotionProxySumOrderByAggregateInput;
};
export type PromotionProxyScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionProxyScalarWhereWithAggregatesInput | Prisma.PromotionProxyScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionProxyScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionProxyScalarWhereWithAggregatesInput | Prisma.PromotionProxyScalarWhereWithAggregatesInput[];
    requestId?: Prisma.IntWithAggregatesFilter<"PromotionProxy"> | number;
    principalId?: Prisma.IntWithAggregatesFilter<"PromotionProxy"> | number;
    proxyId?: Prisma.IntWithAggregatesFilter<"PromotionProxy"> | number;
};
export type PromotionProxyCreateInput = {
    request: Prisma.PromotionRequestCreateNestedOneWithoutProxiesInput;
    principal: Prisma.MemberCreateNestedOneWithoutProxyPrincipalOfInput;
    proxy: Prisma.MemberCreateNestedOneWithoutProxyAgentOfInput;
};
export type PromotionProxyUncheckedCreateInput = {
    requestId: number;
    principalId: number;
    proxyId: number;
};
export type PromotionProxyUpdateInput = {
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutProxiesNestedInput;
    principal?: Prisma.MemberUpdateOneRequiredWithoutProxyPrincipalOfNestedInput;
    proxy?: Prisma.MemberUpdateOneRequiredWithoutProxyAgentOfNestedInput;
};
export type PromotionProxyUncheckedUpdateInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyCreateManyInput = {
    requestId: number;
    principalId: number;
    proxyId: number;
};
export type PromotionProxyUpdateManyMutationInput = {};
export type PromotionProxyUncheckedUpdateManyInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyListRelationFilter = {
    every?: Prisma.PromotionProxyWhereInput;
    some?: Prisma.PromotionProxyWhereInput;
    none?: Prisma.PromotionProxyWhereInput;
};
export type PromotionProxyOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PromotionProxyRequestIdPrincipalIdCompoundUniqueInput = {
    requestId: number;
    principalId: number;
};
export type PromotionProxyCountOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
};
export type PromotionProxyAvgOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
};
export type PromotionProxyMaxOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
};
export type PromotionProxyMinOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
};
export type PromotionProxySumOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    principalId?: Prisma.SortOrder;
    proxyId?: Prisma.SortOrder;
};
export type PromotionProxyCreateNestedManyWithoutPrincipalInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput> | Prisma.PromotionProxyCreateWithoutPrincipalInput[] | Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput | Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput[];
    createMany?: Prisma.PromotionProxyCreateManyPrincipalInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyCreateNestedManyWithoutProxyInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput> | Prisma.PromotionProxyCreateWithoutProxyInput[] | Prisma.PromotionProxyUncheckedCreateWithoutProxyInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutProxyInput | Prisma.PromotionProxyCreateOrConnectWithoutProxyInput[];
    createMany?: Prisma.PromotionProxyCreateManyProxyInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyUncheckedCreateNestedManyWithoutPrincipalInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput> | Prisma.PromotionProxyCreateWithoutPrincipalInput[] | Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput | Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput[];
    createMany?: Prisma.PromotionProxyCreateManyPrincipalInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyUncheckedCreateNestedManyWithoutProxyInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput> | Prisma.PromotionProxyCreateWithoutProxyInput[] | Prisma.PromotionProxyUncheckedCreateWithoutProxyInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutProxyInput | Prisma.PromotionProxyCreateOrConnectWithoutProxyInput[];
    createMany?: Prisma.PromotionProxyCreateManyProxyInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyUpdateManyWithoutPrincipalNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput> | Prisma.PromotionProxyCreateWithoutPrincipalInput[] | Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput | Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutPrincipalInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutPrincipalInput[];
    createMany?: Prisma.PromotionProxyCreateManyPrincipalInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutPrincipalInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutPrincipalInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutPrincipalInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutPrincipalInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyUpdateManyWithoutProxyNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput> | Prisma.PromotionProxyCreateWithoutProxyInput[] | Prisma.PromotionProxyUncheckedCreateWithoutProxyInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutProxyInput | Prisma.PromotionProxyCreateOrConnectWithoutProxyInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutProxyInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutProxyInput[];
    createMany?: Prisma.PromotionProxyCreateManyProxyInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutProxyInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutProxyInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutProxyInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutProxyInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyUncheckedUpdateManyWithoutPrincipalNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput> | Prisma.PromotionProxyCreateWithoutPrincipalInput[] | Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput | Prisma.PromotionProxyCreateOrConnectWithoutPrincipalInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutPrincipalInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutPrincipalInput[];
    createMany?: Prisma.PromotionProxyCreateManyPrincipalInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutPrincipalInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutPrincipalInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutPrincipalInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutPrincipalInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyUncheckedUpdateManyWithoutProxyNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput> | Prisma.PromotionProxyCreateWithoutProxyInput[] | Prisma.PromotionProxyUncheckedCreateWithoutProxyInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutProxyInput | Prisma.PromotionProxyCreateOrConnectWithoutProxyInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutProxyInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutProxyInput[];
    createMany?: Prisma.PromotionProxyCreateManyProxyInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutProxyInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutProxyInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutProxyInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutProxyInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput> | Prisma.PromotionProxyCreateWithoutRequestInput[] | Prisma.PromotionProxyUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutRequestInput | Prisma.PromotionProxyCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.PromotionProxyCreateManyRequestInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyUncheckedCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput> | Prisma.PromotionProxyCreateWithoutRequestInput[] | Prisma.PromotionProxyUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutRequestInput | Prisma.PromotionProxyCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.PromotionProxyCreateManyRequestInputEnvelope;
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
};
export type PromotionProxyUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput> | Prisma.PromotionProxyCreateWithoutRequestInput[] | Prisma.PromotionProxyUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutRequestInput | Prisma.PromotionProxyCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutRequestInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.PromotionProxyCreateManyRequestInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutRequestInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutRequestInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput> | Prisma.PromotionProxyCreateWithoutRequestInput[] | Prisma.PromotionProxyUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionProxyCreateOrConnectWithoutRequestInput | Prisma.PromotionProxyCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.PromotionProxyUpsertWithWhereUniqueWithoutRequestInput | Prisma.PromotionProxyUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.PromotionProxyCreateManyRequestInputEnvelope;
    set?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    disconnect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    delete?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    connect?: Prisma.PromotionProxyWhereUniqueInput | Prisma.PromotionProxyWhereUniqueInput[];
    update?: Prisma.PromotionProxyUpdateWithWhereUniqueWithoutRequestInput | Prisma.PromotionProxyUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.PromotionProxyUpdateManyWithWhereWithoutRequestInput | Prisma.PromotionProxyUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
};
export type PromotionProxyCreateWithoutPrincipalInput = {
    request: Prisma.PromotionRequestCreateNestedOneWithoutProxiesInput;
    proxy: Prisma.MemberCreateNestedOneWithoutProxyAgentOfInput;
};
export type PromotionProxyUncheckedCreateWithoutPrincipalInput = {
    requestId: number;
    proxyId: number;
};
export type PromotionProxyCreateOrConnectWithoutPrincipalInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput>;
};
export type PromotionProxyCreateManyPrincipalInputEnvelope = {
    data: Prisma.PromotionProxyCreateManyPrincipalInput | Prisma.PromotionProxyCreateManyPrincipalInput[];
    skipDuplicates?: boolean;
};
export type PromotionProxyCreateWithoutProxyInput = {
    request: Prisma.PromotionRequestCreateNestedOneWithoutProxiesInput;
    principal: Prisma.MemberCreateNestedOneWithoutProxyPrincipalOfInput;
};
export type PromotionProxyUncheckedCreateWithoutProxyInput = {
    requestId: number;
    principalId: number;
};
export type PromotionProxyCreateOrConnectWithoutProxyInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput>;
};
export type PromotionProxyCreateManyProxyInputEnvelope = {
    data: Prisma.PromotionProxyCreateManyProxyInput | Prisma.PromotionProxyCreateManyProxyInput[];
    skipDuplicates?: boolean;
};
export type PromotionProxyUpsertWithWhereUniqueWithoutPrincipalInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedUpdateWithoutPrincipalInput>;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedCreateWithoutPrincipalInput>;
};
export type PromotionProxyUpdateWithWhereUniqueWithoutPrincipalInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutPrincipalInput, Prisma.PromotionProxyUncheckedUpdateWithoutPrincipalInput>;
};
export type PromotionProxyUpdateManyWithWhereWithoutPrincipalInput = {
    where: Prisma.PromotionProxyScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateManyMutationInput, Prisma.PromotionProxyUncheckedUpdateManyWithoutPrincipalInput>;
};
export type PromotionProxyScalarWhereInput = {
    AND?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
    OR?: Prisma.PromotionProxyScalarWhereInput[];
    NOT?: Prisma.PromotionProxyScalarWhereInput | Prisma.PromotionProxyScalarWhereInput[];
    requestId?: Prisma.IntFilter<"PromotionProxy"> | number;
    principalId?: Prisma.IntFilter<"PromotionProxy"> | number;
    proxyId?: Prisma.IntFilter<"PromotionProxy"> | number;
};
export type PromotionProxyUpsertWithWhereUniqueWithoutProxyInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutProxyInput, Prisma.PromotionProxyUncheckedUpdateWithoutProxyInput>;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutProxyInput, Prisma.PromotionProxyUncheckedCreateWithoutProxyInput>;
};
export type PromotionProxyUpdateWithWhereUniqueWithoutProxyInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutProxyInput, Prisma.PromotionProxyUncheckedUpdateWithoutProxyInput>;
};
export type PromotionProxyUpdateManyWithWhereWithoutProxyInput = {
    where: Prisma.PromotionProxyScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateManyMutationInput, Prisma.PromotionProxyUncheckedUpdateManyWithoutProxyInput>;
};
export type PromotionProxyCreateWithoutRequestInput = {
    principal: Prisma.MemberCreateNestedOneWithoutProxyPrincipalOfInput;
    proxy: Prisma.MemberCreateNestedOneWithoutProxyAgentOfInput;
};
export type PromotionProxyUncheckedCreateWithoutRequestInput = {
    principalId: number;
    proxyId: number;
};
export type PromotionProxyCreateOrConnectWithoutRequestInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput>;
};
export type PromotionProxyCreateManyRequestInputEnvelope = {
    data: Prisma.PromotionProxyCreateManyRequestInput | Prisma.PromotionProxyCreateManyRequestInput[];
    skipDuplicates?: boolean;
};
export type PromotionProxyUpsertWithWhereUniqueWithoutRequestInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutRequestInput, Prisma.PromotionProxyUncheckedUpdateWithoutRequestInput>;
    create: Prisma.XOR<Prisma.PromotionProxyCreateWithoutRequestInput, Prisma.PromotionProxyUncheckedCreateWithoutRequestInput>;
};
export type PromotionProxyUpdateWithWhereUniqueWithoutRequestInput = {
    where: Prisma.PromotionProxyWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateWithoutRequestInput, Prisma.PromotionProxyUncheckedUpdateWithoutRequestInput>;
};
export type PromotionProxyUpdateManyWithWhereWithoutRequestInput = {
    where: Prisma.PromotionProxyScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateManyMutationInput, Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestInput>;
};
export type PromotionProxyCreateManyPrincipalInput = {
    requestId: number;
    proxyId: number;
};
export type PromotionProxyCreateManyProxyInput = {
    requestId: number;
    principalId: number;
};
export type PromotionProxyUpdateWithoutPrincipalInput = {
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutProxiesNestedInput;
    proxy?: Prisma.MemberUpdateOneRequiredWithoutProxyAgentOfNestedInput;
};
export type PromotionProxyUncheckedUpdateWithoutPrincipalInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyUncheckedUpdateManyWithoutPrincipalInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyUpdateWithoutProxyInput = {
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutProxiesNestedInput;
    principal?: Prisma.MemberUpdateOneRequiredWithoutProxyPrincipalOfNestedInput;
};
export type PromotionProxyUncheckedUpdateWithoutProxyInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyUncheckedUpdateManyWithoutProxyInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyCreateManyRequestInput = {
    principalId: number;
    proxyId: number;
};
export type PromotionProxyUpdateWithoutRequestInput = {
    principal?: Prisma.MemberUpdateOneRequiredWithoutProxyPrincipalOfNestedInput;
    proxy?: Prisma.MemberUpdateOneRequiredWithoutProxyAgentOfNestedInput;
};
export type PromotionProxyUncheckedUpdateWithoutRequestInput = {
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxyUncheckedUpdateManyWithoutRequestInput = {
    principalId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyId?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type PromotionProxySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    principalId?: boolean;
    proxyId?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionProxy"]>;
export type PromotionProxySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    principalId?: boolean;
    proxyId?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionProxy"]>;
export type PromotionProxySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    principalId?: boolean;
    proxyId?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionProxy"]>;
export type PromotionProxySelectScalar = {
    requestId?: boolean;
    principalId?: boolean;
    proxyId?: boolean;
};
export type PromotionProxyOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"requestId" | "principalId" | "proxyId", ExtArgs["result"]["promotionProxy"]>;
export type PromotionProxyInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type PromotionProxyIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type PromotionProxyIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    principal?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxy?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $PromotionProxyPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionProxy";
    objects: {
        request: Prisma.$PromotionRequestPayload<ExtArgs>;
        principal: Prisma.$MemberPayload<ExtArgs>;
        proxy: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        requestId: number;
        principalId: number;
        proxyId: number;
    }, ExtArgs["result"]["promotionProxy"]>;
    composites: {};
};
export type PromotionProxyGetPayload<S extends boolean | null | undefined | PromotionProxyDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload, S>;
export type PromotionProxyCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionProxyFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionProxyCountAggregateInputType | true;
};
export interface PromotionProxyDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionProxy'];
        meta: {
            name: 'PromotionProxy';
        };
    };
    findUnique<T extends PromotionProxyFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionProxyFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PromotionProxyFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionProxyFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PromotionProxyFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionProxyFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PromotionProxyFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionProxyFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PromotionProxyFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionProxyFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PromotionProxyCreateArgs>(args: Prisma.SelectSubset<T, PromotionProxyCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PromotionProxyCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionProxyCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PromotionProxyCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionProxyCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PromotionProxyDeleteArgs>(args: Prisma.SelectSubset<T, PromotionProxyDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PromotionProxyUpdateArgs>(args: Prisma.SelectSubset<T, PromotionProxyUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PromotionProxyDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionProxyDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PromotionProxyUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionProxyUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PromotionProxyUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionProxyUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PromotionProxyUpsertArgs>(args: Prisma.SelectSubset<T, PromotionProxyUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionProxyClient<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PromotionProxyCountArgs>(args?: Prisma.Subset<T, PromotionProxyCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionProxyCountAggregateOutputType> : number>;
    aggregate<T extends PromotionProxyAggregateArgs>(args: Prisma.Subset<T, PromotionProxyAggregateArgs>): Prisma.PrismaPromise<GetPromotionProxyAggregateType<T>>;
    groupBy<T extends PromotionProxyGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionProxyGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionProxyGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionProxyGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionProxyGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PromotionProxyFieldRefs;
}
export interface Prisma__PromotionProxyClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    request<T extends Prisma.PromotionRequestDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequestDefaultArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    principal<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    proxy<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PromotionProxyFieldRefs {
    readonly requestId: Prisma.FieldRef<"PromotionProxy", 'Int'>;
    readonly principalId: Prisma.FieldRef<"PromotionProxy", 'Int'>;
    readonly proxyId: Prisma.FieldRef<"PromotionProxy", 'Int'>;
}
export type PromotionProxyFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where: Prisma.PromotionProxyWhereUniqueInput;
};
export type PromotionProxyFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where: Prisma.PromotionProxyWhereUniqueInput;
};
export type PromotionProxyFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where?: Prisma.PromotionProxyWhereInput;
    orderBy?: Prisma.PromotionProxyOrderByWithRelationInput | Prisma.PromotionProxyOrderByWithRelationInput[];
    cursor?: Prisma.PromotionProxyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionProxyScalarFieldEnum | Prisma.PromotionProxyScalarFieldEnum[];
};
export type PromotionProxyFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where?: Prisma.PromotionProxyWhereInput;
    orderBy?: Prisma.PromotionProxyOrderByWithRelationInput | Prisma.PromotionProxyOrderByWithRelationInput[];
    cursor?: Prisma.PromotionProxyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionProxyScalarFieldEnum | Prisma.PromotionProxyScalarFieldEnum[];
};
export type PromotionProxyFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where?: Prisma.PromotionProxyWhereInput;
    orderBy?: Prisma.PromotionProxyOrderByWithRelationInput | Prisma.PromotionProxyOrderByWithRelationInput[];
    cursor?: Prisma.PromotionProxyWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionProxyScalarFieldEnum | Prisma.PromotionProxyScalarFieldEnum[];
};
export type PromotionProxyCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionProxyCreateInput, Prisma.PromotionProxyUncheckedCreateInput>;
};
export type PromotionProxyCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PromotionProxyCreateManyInput | Prisma.PromotionProxyCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionProxyCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    data: Prisma.PromotionProxyCreateManyInput | Prisma.PromotionProxyCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PromotionProxyIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PromotionProxyUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateInput, Prisma.PromotionProxyUncheckedUpdateInput>;
    where: Prisma.PromotionProxyWhereUniqueInput;
};
export type PromotionProxyUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PromotionProxyUpdateManyMutationInput, Prisma.PromotionProxyUncheckedUpdateManyInput>;
    where?: Prisma.PromotionProxyWhereInput;
    limit?: number;
};
export type PromotionProxyUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionProxyUpdateManyMutationInput, Prisma.PromotionProxyUncheckedUpdateManyInput>;
    where?: Prisma.PromotionProxyWhereInput;
    limit?: number;
    include?: Prisma.PromotionProxyIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PromotionProxyUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where: Prisma.PromotionProxyWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionProxyCreateInput, Prisma.PromotionProxyUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PromotionProxyUpdateInput, Prisma.PromotionProxyUncheckedUpdateInput>;
};
export type PromotionProxyDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
    where: Prisma.PromotionProxyWhereUniqueInput;
};
export type PromotionProxyDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionProxyWhereInput;
    limit?: number;
};
export type PromotionProxyDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionProxySelect<ExtArgs> | null;
    omit?: Prisma.PromotionProxyOmit<ExtArgs> | null;
    include?: Prisma.PromotionProxyInclude<ExtArgs> | null;
};
