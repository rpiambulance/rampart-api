import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ApiTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$ApiTokenPayload>;
export type AggregateApiToken = {
    _count: ApiTokenCountAggregateOutputType | null;
    _avg: ApiTokenAvgAggregateOutputType | null;
    _sum: ApiTokenSumAggregateOutputType | null;
    _min: ApiTokenMinAggregateOutputType | null;
    _max: ApiTokenMaxAggregateOutputType | null;
};
export type ApiTokenAvgAggregateOutputType = {
    id: number | null;
    ownerId: number | null;
};
export type ApiTokenSumAggregateOutputType = {
    id: number | null;
    ownerId: number | null;
};
export type ApiTokenMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    tokenHash: string | null;
    ownerId: number | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
    createdAt: Date | null;
};
export type ApiTokenMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    tokenHash: string | null;
    ownerId: number | null;
    expiresAt: Date | null;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
    createdAt: Date | null;
};
export type ApiTokenCountAggregateOutputType = {
    id: number;
    name: number;
    tokenHash: number;
    ownerId: number;
    permissions: number;
    expiresAt: number;
    revokedAt: number;
    lastUsedAt: number;
    createdAt: number;
    _all: number;
};
export type ApiTokenAvgAggregateInputType = {
    id?: true;
    ownerId?: true;
};
export type ApiTokenSumAggregateInputType = {
    id?: true;
    ownerId?: true;
};
export type ApiTokenMinAggregateInputType = {
    id?: true;
    name?: true;
    tokenHash?: true;
    ownerId?: true;
    expiresAt?: true;
    revokedAt?: true;
    lastUsedAt?: true;
    createdAt?: true;
};
export type ApiTokenMaxAggregateInputType = {
    id?: true;
    name?: true;
    tokenHash?: true;
    ownerId?: true;
    expiresAt?: true;
    revokedAt?: true;
    lastUsedAt?: true;
    createdAt?: true;
};
export type ApiTokenCountAggregateInputType = {
    id?: true;
    name?: true;
    tokenHash?: true;
    ownerId?: true;
    permissions?: true;
    expiresAt?: true;
    revokedAt?: true;
    lastUsedAt?: true;
    createdAt?: true;
    _all?: true;
};
export type ApiTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ApiTokenWhereInput;
    orderBy?: Prisma.ApiTokenOrderByWithRelationInput | Prisma.ApiTokenOrderByWithRelationInput[];
    cursor?: Prisma.ApiTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ApiTokenCountAggregateInputType;
    _avg?: ApiTokenAvgAggregateInputType;
    _sum?: ApiTokenSumAggregateInputType;
    _min?: ApiTokenMinAggregateInputType;
    _max?: ApiTokenMaxAggregateInputType;
};
export type GetApiTokenAggregateType<T extends ApiTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateApiToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateApiToken[P]> : Prisma.GetScalarType<T[P], AggregateApiToken[P]>;
};
export type ApiTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ApiTokenWhereInput;
    orderBy?: Prisma.ApiTokenOrderByWithAggregationInput | Prisma.ApiTokenOrderByWithAggregationInput[];
    by: Prisma.ApiTokenScalarFieldEnum[] | Prisma.ApiTokenScalarFieldEnum;
    having?: Prisma.ApiTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ApiTokenCountAggregateInputType | true;
    _avg?: ApiTokenAvgAggregateInputType;
    _sum?: ApiTokenSumAggregateInputType;
    _min?: ApiTokenMinAggregateInputType;
    _max?: ApiTokenMaxAggregateInputType;
};
export type ApiTokenGroupByOutputType = {
    id: number;
    name: string;
    tokenHash: string;
    ownerId: number;
    permissions: string[];
    expiresAt: Date | null;
    revokedAt: Date | null;
    lastUsedAt: Date | null;
    createdAt: Date;
    _count: ApiTokenCountAggregateOutputType | null;
    _avg: ApiTokenAvgAggregateOutputType | null;
    _sum: ApiTokenSumAggregateOutputType | null;
    _min: ApiTokenMinAggregateOutputType | null;
    _max: ApiTokenMaxAggregateOutputType | null;
};
export type GetApiTokenGroupByPayload<T extends ApiTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ApiTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ApiTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ApiTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ApiTokenGroupByOutputType[P]>;
}>>;
export type ApiTokenWhereInput = {
    AND?: Prisma.ApiTokenWhereInput | Prisma.ApiTokenWhereInput[];
    OR?: Prisma.ApiTokenWhereInput[];
    NOT?: Prisma.ApiTokenWhereInput | Prisma.ApiTokenWhereInput[];
    id?: Prisma.IntFilter<"ApiToken"> | number;
    name?: Prisma.StringFilter<"ApiToken"> | string;
    tokenHash?: Prisma.StringFilter<"ApiToken"> | string;
    ownerId?: Prisma.IntFilter<"ApiToken"> | number;
    permissions?: Prisma.StringNullableListFilter<"ApiToken">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    lastUsedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ApiToken"> | Date | string;
    owner?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type ApiTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastUsedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    owner?: Prisma.MemberOrderByWithRelationInput;
};
export type ApiTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    tokenHash?: string;
    AND?: Prisma.ApiTokenWhereInput | Prisma.ApiTokenWhereInput[];
    OR?: Prisma.ApiTokenWhereInput[];
    NOT?: Prisma.ApiTokenWhereInput | Prisma.ApiTokenWhereInput[];
    name?: Prisma.StringFilter<"ApiToken"> | string;
    ownerId?: Prisma.IntFilter<"ApiToken"> | number;
    permissions?: Prisma.StringNullableListFilter<"ApiToken">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    lastUsedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ApiToken"> | Date | string;
    owner?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "id" | "tokenHash">;
export type ApiTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    lastUsedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.ApiTokenCountOrderByAggregateInput;
    _avg?: Prisma.ApiTokenAvgOrderByAggregateInput;
    _max?: Prisma.ApiTokenMaxOrderByAggregateInput;
    _min?: Prisma.ApiTokenMinOrderByAggregateInput;
    _sum?: Prisma.ApiTokenSumOrderByAggregateInput;
};
export type ApiTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.ApiTokenScalarWhereWithAggregatesInput | Prisma.ApiTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.ApiTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ApiTokenScalarWhereWithAggregatesInput | Prisma.ApiTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"ApiToken"> | number;
    name?: Prisma.StringWithAggregatesFilter<"ApiToken"> | string;
    tokenHash?: Prisma.StringWithAggregatesFilter<"ApiToken"> | string;
    ownerId?: Prisma.IntWithAggregatesFilter<"ApiToken"> | number;
    permissions?: Prisma.StringNullableListFilter<"ApiToken">;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ApiToken"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ApiToken"> | Date | string | null;
    lastUsedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"ApiToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"ApiToken"> | Date | string;
};
export type ApiTokenCreateInput = {
    name: string;
    tokenHash: string;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
    owner: Prisma.MemberCreateNestedOneWithoutApiTokensInput;
};
export type ApiTokenUncheckedCreateInput = {
    id?: number;
    name: string;
    tokenHash: string;
    ownerId: number;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ApiTokenUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    owner?: Prisma.MemberUpdateOneRequiredWithoutApiTokensNestedInput;
};
export type ApiTokenUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.IntFieldUpdateOperationsInput | number;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenCreateManyInput = {
    id?: number;
    name: string;
    tokenHash: string;
    ownerId: number;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ApiTokenUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    ownerId?: Prisma.IntFieldUpdateOperationsInput | number;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenListRelationFilter = {
    every?: Prisma.ApiTokenWhereInput;
    some?: Prisma.ApiTokenWhereInput;
    none?: Prisma.ApiTokenWhereInput;
};
export type ApiTokenOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type StringNullableListFilter<$PrismaModel = never> = {
    equals?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel> | null;
    has?: string | Prisma.StringFieldRefInput<$PrismaModel> | null;
    hasEvery?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    hasSome?: string[] | Prisma.ListStringFieldRefInput<$PrismaModel>;
    isEmpty?: boolean;
};
export type ApiTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    permissions?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    lastUsedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ApiTokenAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
};
export type ApiTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    lastUsedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ApiTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    tokenHash?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
    lastUsedAt?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type ApiTokenSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    ownerId?: Prisma.SortOrder;
};
export type ApiTokenCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput> | Prisma.ApiTokenCreateWithoutOwnerInput[] | Prisma.ApiTokenUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ApiTokenCreateOrConnectWithoutOwnerInput | Prisma.ApiTokenCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ApiTokenCreateManyOwnerInputEnvelope;
    connect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
};
export type ApiTokenUncheckedCreateNestedManyWithoutOwnerInput = {
    create?: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput> | Prisma.ApiTokenCreateWithoutOwnerInput[] | Prisma.ApiTokenUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ApiTokenCreateOrConnectWithoutOwnerInput | Prisma.ApiTokenCreateOrConnectWithoutOwnerInput[];
    createMany?: Prisma.ApiTokenCreateManyOwnerInputEnvelope;
    connect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
};
export type ApiTokenUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput> | Prisma.ApiTokenCreateWithoutOwnerInput[] | Prisma.ApiTokenUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ApiTokenCreateOrConnectWithoutOwnerInput | Prisma.ApiTokenCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ApiTokenUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ApiTokenUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ApiTokenCreateManyOwnerInputEnvelope;
    set?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    disconnect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    delete?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    connect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    update?: Prisma.ApiTokenUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ApiTokenUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ApiTokenUpdateManyWithWhereWithoutOwnerInput | Prisma.ApiTokenUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ApiTokenScalarWhereInput | Prisma.ApiTokenScalarWhereInput[];
};
export type ApiTokenUncheckedUpdateManyWithoutOwnerNestedInput = {
    create?: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput> | Prisma.ApiTokenCreateWithoutOwnerInput[] | Prisma.ApiTokenUncheckedCreateWithoutOwnerInput[];
    connectOrCreate?: Prisma.ApiTokenCreateOrConnectWithoutOwnerInput | Prisma.ApiTokenCreateOrConnectWithoutOwnerInput[];
    upsert?: Prisma.ApiTokenUpsertWithWhereUniqueWithoutOwnerInput | Prisma.ApiTokenUpsertWithWhereUniqueWithoutOwnerInput[];
    createMany?: Prisma.ApiTokenCreateManyOwnerInputEnvelope;
    set?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    disconnect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    delete?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    connect?: Prisma.ApiTokenWhereUniqueInput | Prisma.ApiTokenWhereUniqueInput[];
    update?: Prisma.ApiTokenUpdateWithWhereUniqueWithoutOwnerInput | Prisma.ApiTokenUpdateWithWhereUniqueWithoutOwnerInput[];
    updateMany?: Prisma.ApiTokenUpdateManyWithWhereWithoutOwnerInput | Prisma.ApiTokenUpdateManyWithWhereWithoutOwnerInput[];
    deleteMany?: Prisma.ApiTokenScalarWhereInput | Prisma.ApiTokenScalarWhereInput[];
};
export type ApiTokenCreatepermissionsInput = {
    set: string[];
};
export type ApiTokenUpdatepermissionsInput = {
    set?: string[];
    push?: string | string[];
};
export type ApiTokenCreateWithoutOwnerInput = {
    name: string;
    tokenHash: string;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ApiTokenUncheckedCreateWithoutOwnerInput = {
    id?: number;
    name: string;
    tokenHash: string;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ApiTokenCreateOrConnectWithoutOwnerInput = {
    where: Prisma.ApiTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput>;
};
export type ApiTokenCreateManyOwnerInputEnvelope = {
    data: Prisma.ApiTokenCreateManyOwnerInput | Prisma.ApiTokenCreateManyOwnerInput[];
    skipDuplicates?: boolean;
};
export type ApiTokenUpsertWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ApiTokenWhereUniqueInput;
    update: Prisma.XOR<Prisma.ApiTokenUpdateWithoutOwnerInput, Prisma.ApiTokenUncheckedUpdateWithoutOwnerInput>;
    create: Prisma.XOR<Prisma.ApiTokenCreateWithoutOwnerInput, Prisma.ApiTokenUncheckedCreateWithoutOwnerInput>;
};
export type ApiTokenUpdateWithWhereUniqueWithoutOwnerInput = {
    where: Prisma.ApiTokenWhereUniqueInput;
    data: Prisma.XOR<Prisma.ApiTokenUpdateWithoutOwnerInput, Prisma.ApiTokenUncheckedUpdateWithoutOwnerInput>;
};
export type ApiTokenUpdateManyWithWhereWithoutOwnerInput = {
    where: Prisma.ApiTokenScalarWhereInput;
    data: Prisma.XOR<Prisma.ApiTokenUpdateManyMutationInput, Prisma.ApiTokenUncheckedUpdateManyWithoutOwnerInput>;
};
export type ApiTokenScalarWhereInput = {
    AND?: Prisma.ApiTokenScalarWhereInput | Prisma.ApiTokenScalarWhereInput[];
    OR?: Prisma.ApiTokenScalarWhereInput[];
    NOT?: Prisma.ApiTokenScalarWhereInput | Prisma.ApiTokenScalarWhereInput[];
    id?: Prisma.IntFilter<"ApiToken"> | number;
    name?: Prisma.StringFilter<"ApiToken"> | string;
    tokenHash?: Prisma.StringFilter<"ApiToken"> | string;
    ownerId?: Prisma.IntFilter<"ApiToken"> | number;
    permissions?: Prisma.StringNullableListFilter<"ApiToken">;
    expiresAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    lastUsedAt?: Prisma.DateTimeNullableFilter<"ApiToken"> | Date | string | null;
    createdAt?: Prisma.DateTimeFilter<"ApiToken"> | Date | string;
};
export type ApiTokenCreateManyOwnerInput = {
    id?: number;
    name: string;
    tokenHash: string;
    permissions?: Prisma.ApiTokenCreatepermissionsInput | string[];
    expiresAt?: Date | string | null;
    revokedAt?: Date | string | null;
    lastUsedAt?: Date | string | null;
    createdAt?: Date | string;
};
export type ApiTokenUpdateWithoutOwnerInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenUncheckedUpdateWithoutOwnerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenUncheckedUpdateManyWithoutOwnerInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    tokenHash?: Prisma.StringFieldUpdateOperationsInput | string;
    permissions?: Prisma.ApiTokenUpdatepermissionsInput | string[];
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    lastUsedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type ApiTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tokenHash?: boolean;
    ownerId?: boolean;
    permissions?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    lastUsedAt?: boolean;
    createdAt?: boolean;
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["apiToken"]>;
export type ApiTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tokenHash?: boolean;
    ownerId?: boolean;
    permissions?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    lastUsedAt?: boolean;
    createdAt?: boolean;
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["apiToken"]>;
export type ApiTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    tokenHash?: boolean;
    ownerId?: boolean;
    permissions?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    lastUsedAt?: boolean;
    createdAt?: boolean;
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["apiToken"]>;
export type ApiTokenSelectScalar = {
    id?: boolean;
    name?: boolean;
    tokenHash?: boolean;
    ownerId?: boolean;
    permissions?: boolean;
    expiresAt?: boolean;
    revokedAt?: boolean;
    lastUsedAt?: boolean;
    createdAt?: boolean;
};
export type ApiTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "tokenHash" | "ownerId" | "permissions" | "expiresAt" | "revokedAt" | "lastUsedAt" | "createdAt", ExtArgs["result"]["apiToken"]>;
export type ApiTokenInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type ApiTokenIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type ApiTokenIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    owner?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $ApiTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ApiToken";
    objects: {
        owner: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        tokenHash: string;
        ownerId: number;
        permissions: string[];
        expiresAt: Date | null;
        revokedAt: Date | null;
        lastUsedAt: Date | null;
        createdAt: Date;
    }, ExtArgs["result"]["apiToken"]>;
    composites: {};
};
export type ApiTokenGetPayload<S extends boolean | null | undefined | ApiTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload, S>;
export type ApiTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ApiTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ApiTokenCountAggregateInputType | true;
};
export interface ApiTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ApiToken'];
        meta: {
            name: 'ApiToken';
        };
    };
    findUnique<T extends ApiTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, ApiTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ApiTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ApiTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ApiTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, ApiTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ApiTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ApiTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ApiTokenFindManyArgs>(args?: Prisma.SelectSubset<T, ApiTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ApiTokenCreateArgs>(args: Prisma.SelectSubset<T, ApiTokenCreateArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ApiTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, ApiTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ApiTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ApiTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ApiTokenDeleteArgs>(args: Prisma.SelectSubset<T, ApiTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ApiTokenUpdateArgs>(args: Prisma.SelectSubset<T, ApiTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ApiTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, ApiTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ApiTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, ApiTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ApiTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ApiTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ApiTokenUpsertArgs>(args: Prisma.SelectSubset<T, ApiTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__ApiTokenClient<runtime.Types.Result.GetResult<Prisma.$ApiTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ApiTokenCountArgs>(args?: Prisma.Subset<T, ApiTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ApiTokenCountAggregateOutputType> : number>;
    aggregate<T extends ApiTokenAggregateArgs>(args: Prisma.Subset<T, ApiTokenAggregateArgs>): Prisma.PrismaPromise<GetApiTokenAggregateType<T>>;
    groupBy<T extends ApiTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ApiTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: ApiTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ApiTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetApiTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ApiTokenFieldRefs;
}
export interface Prisma__ApiTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    owner<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ApiTokenFieldRefs {
    readonly id: Prisma.FieldRef<"ApiToken", 'Int'>;
    readonly name: Prisma.FieldRef<"ApiToken", 'String'>;
    readonly tokenHash: Prisma.FieldRef<"ApiToken", 'String'>;
    readonly ownerId: Prisma.FieldRef<"ApiToken", 'Int'>;
    readonly permissions: Prisma.FieldRef<"ApiToken", 'String[]'>;
    readonly expiresAt: Prisma.FieldRef<"ApiToken", 'DateTime'>;
    readonly revokedAt: Prisma.FieldRef<"ApiToken", 'DateTime'>;
    readonly lastUsedAt: Prisma.FieldRef<"ApiToken", 'DateTime'>;
    readonly createdAt: Prisma.FieldRef<"ApiToken", 'DateTime'>;
}
export type ApiTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where: Prisma.ApiTokenWhereUniqueInput;
};
export type ApiTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where: Prisma.ApiTokenWhereUniqueInput;
};
export type ApiTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where?: Prisma.ApiTokenWhereInput;
    orderBy?: Prisma.ApiTokenOrderByWithRelationInput | Prisma.ApiTokenOrderByWithRelationInput[];
    cursor?: Prisma.ApiTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ApiTokenScalarFieldEnum | Prisma.ApiTokenScalarFieldEnum[];
};
export type ApiTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where?: Prisma.ApiTokenWhereInput;
    orderBy?: Prisma.ApiTokenOrderByWithRelationInput | Prisma.ApiTokenOrderByWithRelationInput[];
    cursor?: Prisma.ApiTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ApiTokenScalarFieldEnum | Prisma.ApiTokenScalarFieldEnum[];
};
export type ApiTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where?: Prisma.ApiTokenWhereInput;
    orderBy?: Prisma.ApiTokenOrderByWithRelationInput | Prisma.ApiTokenOrderByWithRelationInput[];
    cursor?: Prisma.ApiTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ApiTokenScalarFieldEnum | Prisma.ApiTokenScalarFieldEnum[];
};
export type ApiTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ApiTokenCreateInput, Prisma.ApiTokenUncheckedCreateInput>;
};
export type ApiTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ApiTokenCreateManyInput | Prisma.ApiTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ApiTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    data: Prisma.ApiTokenCreateManyInput | Prisma.ApiTokenCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ApiTokenIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ApiTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ApiTokenUpdateInput, Prisma.ApiTokenUncheckedUpdateInput>;
    where: Prisma.ApiTokenWhereUniqueInput;
};
export type ApiTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ApiTokenUpdateManyMutationInput, Prisma.ApiTokenUncheckedUpdateManyInput>;
    where?: Prisma.ApiTokenWhereInput;
    limit?: number;
};
export type ApiTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ApiTokenUpdateManyMutationInput, Prisma.ApiTokenUncheckedUpdateManyInput>;
    where?: Prisma.ApiTokenWhereInput;
    limit?: number;
    include?: Prisma.ApiTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ApiTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where: Prisma.ApiTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.ApiTokenCreateInput, Prisma.ApiTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ApiTokenUpdateInput, Prisma.ApiTokenUncheckedUpdateInput>;
};
export type ApiTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
    where: Prisma.ApiTokenWhereUniqueInput;
};
export type ApiTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ApiTokenWhereInput;
    limit?: number;
};
export type ApiTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ApiTokenSelect<ExtArgs> | null;
    omit?: Prisma.ApiTokenOmit<ExtArgs> | null;
    include?: Prisma.ApiTokenInclude<ExtArgs> | null;
};
