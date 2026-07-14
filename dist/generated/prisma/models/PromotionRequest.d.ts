import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PromotionRequestModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionRequestPayload>;
export type AggregatePromotionRequest = {
    _count: PromotionRequestCountAggregateOutputType | null;
    _avg: PromotionRequestAvgAggregateOutputType | null;
    _sum: PromotionRequestSumAggregateOutputType | null;
    _min: PromotionRequestMinAggregateOutputType | null;
    _max: PromotionRequestMaxAggregateOutputType | null;
};
export type PromotionRequestAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    credentialTypeId: number | null;
};
export type PromotionRequestSumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    credentialTypeId: number | null;
};
export type PromotionRequestMinAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    credentialTypeId: number | null;
    status: $Enums.PromoStatus | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type PromotionRequestMaxAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    credentialTypeId: number | null;
    status: $Enums.PromoStatus | null;
    createdAt: Date | null;
    resolvedAt: Date | null;
};
export type PromotionRequestCountAggregateOutputType = {
    id: number;
    memberId: number;
    credentialTypeId: number;
    status: number;
    createdAt: number;
    resolvedAt: number;
    _all: number;
};
export type PromotionRequestAvgAggregateInputType = {
    id?: true;
    memberId?: true;
    credentialTypeId?: true;
};
export type PromotionRequestSumAggregateInputType = {
    id?: true;
    memberId?: true;
    credentialTypeId?: true;
};
export type PromotionRequestMinAggregateInputType = {
    id?: true;
    memberId?: true;
    credentialTypeId?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type PromotionRequestMaxAggregateInputType = {
    id?: true;
    memberId?: true;
    credentialTypeId?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
};
export type PromotionRequestCountAggregateInputType = {
    id?: true;
    memberId?: true;
    credentialTypeId?: true;
    status?: true;
    createdAt?: true;
    resolvedAt?: true;
    _all?: true;
};
export type PromotionRequestAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithRelationInput | Prisma.PromotionRequestOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PromotionRequestCountAggregateInputType;
    _avg?: PromotionRequestAvgAggregateInputType;
    _sum?: PromotionRequestSumAggregateInputType;
    _min?: PromotionRequestMinAggregateInputType;
    _max?: PromotionRequestMaxAggregateInputType;
};
export type GetPromotionRequestAggregateType<T extends PromotionRequestAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionRequest]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionRequest[P]> : Prisma.GetScalarType<T[P], AggregatePromotionRequest[P]>;
};
export type PromotionRequestGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithAggregationInput | Prisma.PromotionRequestOrderByWithAggregationInput[];
    by: Prisma.PromotionRequestScalarFieldEnum[] | Prisma.PromotionRequestScalarFieldEnum;
    having?: Prisma.PromotionRequestScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionRequestCountAggregateInputType | true;
    _avg?: PromotionRequestAvgAggregateInputType;
    _sum?: PromotionRequestSumAggregateInputType;
    _min?: PromotionRequestMinAggregateInputType;
    _max?: PromotionRequestMaxAggregateInputType;
};
export type PromotionRequestGroupByOutputType = {
    id: number;
    memberId: number;
    credentialTypeId: number;
    status: $Enums.PromoStatus;
    createdAt: Date;
    resolvedAt: Date | null;
    _count: PromotionRequestCountAggregateOutputType | null;
    _avg: PromotionRequestAvgAggregateOutputType | null;
    _sum: PromotionRequestSumAggregateOutputType | null;
    _min: PromotionRequestMinAggregateOutputType | null;
    _max: PromotionRequestMaxAggregateOutputType | null;
};
export type GetPromotionRequestGroupByPayload<T extends PromotionRequestGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionRequestGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionRequestGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionRequestGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionRequestGroupByOutputType[P]>;
}>>;
export type PromotionRequestWhereInput = {
    AND?: Prisma.PromotionRequestWhereInput | Prisma.PromotionRequestWhereInput[];
    OR?: Prisma.PromotionRequestWhereInput[];
    NOT?: Prisma.PromotionRequestWhereInput | Prisma.PromotionRequestWhereInput[];
    id?: Prisma.IntFilter<"PromotionRequest"> | number;
    memberId?: Prisma.IntFilter<"PromotionRequest"> | number;
    credentialTypeId?: Prisma.IntFilter<"PromotionRequest"> | number;
    status?: Prisma.EnumPromoStatusFilter<"PromotionRequest"> | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFilter<"PromotionRequest"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"PromotionRequest"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    votes?: Prisma.PromotionVoteListRelationFilter;
    proxies?: Prisma.PromotionProxyListRelationFilter;
    captainApproval?: Prisma.XOR<Prisma.PromotionApprovalNullableScalarRelationFilter, Prisma.PromotionApprovalWhereInput> | null;
    grantedCredentials?: Prisma.MemberCredentialListRelationFilter;
};
export type PromotionRequestOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
    credentialType?: Prisma.CredentialTypeOrderByWithRelationInput;
    votes?: Prisma.PromotionVoteOrderByRelationAggregateInput;
    proxies?: Prisma.PromotionProxyOrderByRelationAggregateInput;
    captainApproval?: Prisma.PromotionApprovalOrderByWithRelationInput;
    grantedCredentials?: Prisma.MemberCredentialOrderByRelationAggregateInput;
};
export type PromotionRequestWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.PromotionRequestWhereInput | Prisma.PromotionRequestWhereInput[];
    OR?: Prisma.PromotionRequestWhereInput[];
    NOT?: Prisma.PromotionRequestWhereInput | Prisma.PromotionRequestWhereInput[];
    memberId?: Prisma.IntFilter<"PromotionRequest"> | number;
    credentialTypeId?: Prisma.IntFilter<"PromotionRequest"> | number;
    status?: Prisma.EnumPromoStatusFilter<"PromotionRequest"> | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFilter<"PromotionRequest"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"PromotionRequest"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    votes?: Prisma.PromotionVoteListRelationFilter;
    proxies?: Prisma.PromotionProxyListRelationFilter;
    captainApproval?: Prisma.XOR<Prisma.PromotionApprovalNullableScalarRelationFilter, Prisma.PromotionApprovalWhereInput> | null;
    grantedCredentials?: Prisma.MemberCredentialListRelationFilter;
}, "id">;
export type PromotionRequestOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.PromotionRequestCountOrderByAggregateInput;
    _avg?: Prisma.PromotionRequestAvgOrderByAggregateInput;
    _max?: Prisma.PromotionRequestMaxOrderByAggregateInput;
    _min?: Prisma.PromotionRequestMinOrderByAggregateInput;
    _sum?: Prisma.PromotionRequestSumOrderByAggregateInput;
};
export type PromotionRequestScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionRequestScalarWhereWithAggregatesInput | Prisma.PromotionRequestScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionRequestScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionRequestScalarWhereWithAggregatesInput | Prisma.PromotionRequestScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"PromotionRequest"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"PromotionRequest"> | number;
    credentialTypeId?: Prisma.IntWithAggregatesFilter<"PromotionRequest"> | number;
    status?: Prisma.EnumPromoStatusWithAggregatesFilter<"PromotionRequest"> | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionRequest"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"PromotionRequest"> | Date | string | null;
};
export type PromotionRequestCreateInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUpdateInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestCreateManyInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type PromotionRequestUpdateManyMutationInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PromotionRequestUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PromotionRequestListRelationFilter = {
    every?: Prisma.PromotionRequestWhereInput;
    some?: Prisma.PromotionRequestWhereInput;
    none?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PromotionRequestNullableScalarRelationFilter = {
    is?: Prisma.PromotionRequestWhereInput | null;
    isNot?: Prisma.PromotionRequestWhereInput | null;
};
export type PromotionRequestCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type PromotionRequestAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
};
export type PromotionRequestMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type PromotionRequestMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    resolvedAt?: Prisma.SortOrder;
};
export type PromotionRequestSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
};
export type PromotionRequestScalarRelationFilter = {
    is?: Prisma.PromotionRequestWhereInput;
    isNot?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput> | Prisma.PromotionRequestCreateWithoutMemberInput[] | Prisma.PromotionRequestUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutMemberInput | Prisma.PromotionRequestCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.PromotionRequestCreateManyMemberInputEnvelope;
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
};
export type PromotionRequestUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput> | Prisma.PromotionRequestCreateWithoutMemberInput[] | Prisma.PromotionRequestUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutMemberInput | Prisma.PromotionRequestCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.PromotionRequestCreateManyMemberInputEnvelope;
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
};
export type PromotionRequestUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput> | Prisma.PromotionRequestCreateWithoutMemberInput[] | Prisma.PromotionRequestUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutMemberInput | Prisma.PromotionRequestCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.PromotionRequestUpsertWithWhereUniqueWithoutMemberInput | Prisma.PromotionRequestUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.PromotionRequestCreateManyMemberInputEnvelope;
    set?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    disconnect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    delete?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    update?: Prisma.PromotionRequestUpdateWithWhereUniqueWithoutMemberInput | Prisma.PromotionRequestUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.PromotionRequestUpdateManyWithWhereWithoutMemberInput | Prisma.PromotionRequestUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
};
export type PromotionRequestUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput> | Prisma.PromotionRequestCreateWithoutMemberInput[] | Prisma.PromotionRequestUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutMemberInput | Prisma.PromotionRequestCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.PromotionRequestUpsertWithWhereUniqueWithoutMemberInput | Prisma.PromotionRequestUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.PromotionRequestCreateManyMemberInputEnvelope;
    set?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    disconnect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    delete?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    update?: Prisma.PromotionRequestUpdateWithWhereUniqueWithoutMemberInput | Prisma.PromotionRequestUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.PromotionRequestUpdateManyWithWhereWithoutMemberInput | Prisma.PromotionRequestUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
};
export type PromotionRequestCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput> | Prisma.PromotionRequestCreateWithoutCredentialTypeInput[] | Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput | Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.PromotionRequestCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
};
export type PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput> | Prisma.PromotionRequestCreateWithoutCredentialTypeInput[] | Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput | Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.PromotionRequestCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
};
export type PromotionRequestUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput> | Prisma.PromotionRequestCreateWithoutCredentialTypeInput[] | Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput | Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.PromotionRequestUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.PromotionRequestUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.PromotionRequestCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    disconnect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    delete?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    update?: Prisma.PromotionRequestUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.PromotionRequestUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.PromotionRequestUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.PromotionRequestUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
};
export type PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput> | Prisma.PromotionRequestCreateWithoutCredentialTypeInput[] | Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput | Prisma.PromotionRequestCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.PromotionRequestUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.PromotionRequestUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.PromotionRequestCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    disconnect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    delete?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    connect?: Prisma.PromotionRequestWhereUniqueInput | Prisma.PromotionRequestWhereUniqueInput[];
    update?: Prisma.PromotionRequestUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.PromotionRequestUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.PromotionRequestUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.PromotionRequestUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
};
export type PromotionRequestCreateNestedOneWithoutGrantedCredentialsInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedCreateWithoutGrantedCredentialsInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutGrantedCredentialsInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestUpdateOneWithoutGrantedCredentialsNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedCreateWithoutGrantedCredentialsInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutGrantedCredentialsInput;
    upsert?: Prisma.PromotionRequestUpsertWithoutGrantedCredentialsInput;
    disconnect?: Prisma.PromotionRequestWhereInput | boolean;
    delete?: Prisma.PromotionRequestWhereInput | boolean;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionRequestUpdateToOneWithWhereWithoutGrantedCredentialsInput, Prisma.PromotionRequestUpdateWithoutGrantedCredentialsInput>, Prisma.PromotionRequestUncheckedUpdateWithoutGrantedCredentialsInput>;
};
export type EnumPromoStatusFieldUpdateOperationsInput = {
    set?: $Enums.PromoStatus;
};
export type PromotionRequestCreateNestedOneWithoutVotesInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutVotesInput, Prisma.PromotionRequestUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutVotesInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestUpdateOneRequiredWithoutVotesNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutVotesInput, Prisma.PromotionRequestUncheckedCreateWithoutVotesInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutVotesInput;
    upsert?: Prisma.PromotionRequestUpsertWithoutVotesInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionRequestUpdateToOneWithWhereWithoutVotesInput, Prisma.PromotionRequestUpdateWithoutVotesInput>, Prisma.PromotionRequestUncheckedUpdateWithoutVotesInput>;
};
export type PromotionRequestCreateNestedOneWithoutProxiesInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutProxiesInput, Prisma.PromotionRequestUncheckedCreateWithoutProxiesInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutProxiesInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestUpdateOneRequiredWithoutProxiesNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutProxiesInput, Prisma.PromotionRequestUncheckedCreateWithoutProxiesInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutProxiesInput;
    upsert?: Prisma.PromotionRequestUpsertWithoutProxiesInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionRequestUpdateToOneWithWhereWithoutProxiesInput, Prisma.PromotionRequestUpdateWithoutProxiesInput>, Prisma.PromotionRequestUncheckedUpdateWithoutProxiesInput>;
};
export type PromotionRequestCreateNestedOneWithoutCaptainApprovalInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedCreateWithoutCaptainApprovalInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCaptainApprovalInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestUpdateOneRequiredWithoutCaptainApprovalNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedCreateWithoutCaptainApprovalInput>;
    connectOrCreate?: Prisma.PromotionRequestCreateOrConnectWithoutCaptainApprovalInput;
    upsert?: Prisma.PromotionRequestUpsertWithoutCaptainApprovalInput;
    connect?: Prisma.PromotionRequestWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionRequestUpdateToOneWithWhereWithoutCaptainApprovalInput, Prisma.PromotionRequestUpdateWithoutCaptainApprovalInput>, Prisma.PromotionRequestUncheckedUpdateWithoutCaptainApprovalInput>;
};
export type PromotionRequestCreateWithoutMemberInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateWithoutMemberInput = {
    id?: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestCreateOrConnectWithoutMemberInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput>;
};
export type PromotionRequestCreateManyMemberInputEnvelope = {
    data: Prisma.PromotionRequestCreateManyMemberInput | Prisma.PromotionRequestCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type PromotionRequestUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutMemberInput, Prisma.PromotionRequestUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutMemberInput, Prisma.PromotionRequestUncheckedCreateWithoutMemberInput>;
};
export type PromotionRequestUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutMemberInput, Prisma.PromotionRequestUncheckedUpdateWithoutMemberInput>;
};
export type PromotionRequestUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.PromotionRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateManyMutationInput, Prisma.PromotionRequestUncheckedUpdateManyWithoutMemberInput>;
};
export type PromotionRequestScalarWhereInput = {
    AND?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
    OR?: Prisma.PromotionRequestScalarWhereInput[];
    NOT?: Prisma.PromotionRequestScalarWhereInput | Prisma.PromotionRequestScalarWhereInput[];
    id?: Prisma.IntFilter<"PromotionRequest"> | number;
    memberId?: Prisma.IntFilter<"PromotionRequest"> | number;
    credentialTypeId?: Prisma.IntFilter<"PromotionRequest"> | number;
    status?: Prisma.EnumPromoStatusFilter<"PromotionRequest"> | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFilter<"PromotionRequest"> | Date | string;
    resolvedAt?: Prisma.DateTimeNullableFilter<"PromotionRequest"> | Date | string | null;
};
export type PromotionRequestCreateWithoutCredentialTypeInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateWithoutCredentialTypeInput = {
    id?: number;
    memberId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestCreateOrConnectWithoutCredentialTypeInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput>;
};
export type PromotionRequestCreateManyCredentialTypeInputEnvelope = {
    data: Prisma.PromotionRequestCreateManyCredentialTypeInput | Prisma.PromotionRequestCreateManyCredentialTypeInput[];
    skipDuplicates?: boolean;
};
export type PromotionRequestUpsertWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedUpdateWithoutCredentialTypeInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedCreateWithoutCredentialTypeInput>;
};
export type PromotionRequestUpdateWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutCredentialTypeInput, Prisma.PromotionRequestUncheckedUpdateWithoutCredentialTypeInput>;
};
export type PromotionRequestUpdateManyWithWhereWithoutCredentialTypeInput = {
    where: Prisma.PromotionRequestScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateManyMutationInput, Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeInput>;
};
export type PromotionRequestCreateWithoutGrantedCredentialsInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
};
export type PromotionRequestUncheckedCreateWithoutGrantedCredentialsInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
};
export type PromotionRequestCreateOrConnectWithoutGrantedCredentialsInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedCreateWithoutGrantedCredentialsInput>;
};
export type PromotionRequestUpsertWithoutGrantedCredentialsInput = {
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedUpdateWithoutGrantedCredentialsInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedCreateWithoutGrantedCredentialsInput>;
    where?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestUpdateToOneWithWhereWithoutGrantedCredentialsInput = {
    where?: Prisma.PromotionRequestWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutGrantedCredentialsInput, Prisma.PromotionRequestUncheckedUpdateWithoutGrantedCredentialsInput>;
};
export type PromotionRequestUpdateWithoutGrantedCredentialsInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutGrantedCredentialsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
};
export type PromotionRequestCreateWithoutVotesInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateWithoutVotesInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestCreateOrConnectWithoutVotesInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutVotesInput, Prisma.PromotionRequestUncheckedCreateWithoutVotesInput>;
};
export type PromotionRequestUpsertWithoutVotesInput = {
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutVotesInput, Prisma.PromotionRequestUncheckedUpdateWithoutVotesInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutVotesInput, Prisma.PromotionRequestUncheckedCreateWithoutVotesInput>;
    where?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestUpdateToOneWithWhereWithoutVotesInput = {
    where?: Prisma.PromotionRequestWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutVotesInput, Prisma.PromotionRequestUncheckedUpdateWithoutVotesInput>;
};
export type PromotionRequestUpdateWithoutVotesInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutVotesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestCreateWithoutProxiesInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateWithoutProxiesInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestCreateOrConnectWithoutProxiesInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutProxiesInput, Prisma.PromotionRequestUncheckedCreateWithoutProxiesInput>;
};
export type PromotionRequestUpsertWithoutProxiesInput = {
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutProxiesInput, Prisma.PromotionRequestUncheckedUpdateWithoutProxiesInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutProxiesInput, Prisma.PromotionRequestUncheckedCreateWithoutProxiesInput>;
    where?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestUpdateToOneWithWhereWithoutProxiesInput = {
    where?: Prisma.PromotionRequestWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutProxiesInput, Prisma.PromotionRequestUncheckedUpdateWithoutProxiesInput>;
};
export type PromotionRequestUpdateWithoutProxiesInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutProxiesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestCreateWithoutCaptainApprovalInput = {
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutPromotionRequestsInput;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutPromotionRequestsInput;
    votes?: Prisma.PromotionVoteCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyCreateNestedManyWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestUncheckedCreateWithoutCaptainApprovalInput = {
    id?: number;
    memberId: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedCreateNestedManyWithoutRequestInput;
    proxies?: Prisma.PromotionProxyUncheckedCreateNestedManyWithoutRequestInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput;
};
export type PromotionRequestCreateOrConnectWithoutCaptainApprovalInput = {
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedCreateWithoutCaptainApprovalInput>;
};
export type PromotionRequestUpsertWithoutCaptainApprovalInput = {
    update: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedUpdateWithoutCaptainApprovalInput>;
    create: Prisma.XOR<Prisma.PromotionRequestCreateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedCreateWithoutCaptainApprovalInput>;
    where?: Prisma.PromotionRequestWhereInput;
};
export type PromotionRequestUpdateToOneWithWhereWithoutCaptainApprovalInput = {
    where?: Prisma.PromotionRequestWhereInput;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateWithoutCaptainApprovalInput, Prisma.PromotionRequestUncheckedUpdateWithoutCaptainApprovalInput>;
};
export type PromotionRequestUpdateWithoutCaptainApprovalInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutCaptainApprovalInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestCreateManyMemberInput = {
    id?: number;
    credentialTypeId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type PromotionRequestUpdateWithoutMemberInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PromotionRequestCreateManyCredentialTypeInput = {
    id?: number;
    memberId: number;
    status?: $Enums.PromoStatus;
    createdAt?: Date | string;
    resolvedAt?: Date | string | null;
};
export type PromotionRequestUpdateWithoutCredentialTypeInput = {
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutPromotionRequestsNestedInput;
    votes?: Prisma.PromotionVoteUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateWithoutCredentialTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    votes?: Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput;
    proxies?: Prisma.PromotionProxyUncheckedUpdateManyWithoutRequestNestedInput;
    captainApproval?: Prisma.PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput;
    grantedCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput;
};
export type PromotionRequestUncheckedUpdateManyWithoutCredentialTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumPromoStatusFieldUpdateOperationsInput | $Enums.PromoStatus;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    resolvedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type PromotionRequestCountOutputType = {
    votes: number;
    proxies: number;
    grantedCredentials: number;
};
export type PromotionRequestCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    votes?: boolean | PromotionRequestCountOutputTypeCountVotesArgs;
    proxies?: boolean | PromotionRequestCountOutputTypeCountProxiesArgs;
    grantedCredentials?: boolean | PromotionRequestCountOutputTypeCountGrantedCredentialsArgs;
};
export type PromotionRequestCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestCountOutputTypeSelect<ExtArgs> | null;
};
export type PromotionRequestCountOutputTypeCountVotesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionVoteWhereInput;
};
export type PromotionRequestCountOutputTypeCountProxiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionProxyWhereInput;
};
export type PromotionRequestCountOutputTypeCountGrantedCredentialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCredentialWhereInput;
};
export type PromotionRequestSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    credentialTypeId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    votes?: boolean | Prisma.PromotionRequest$votesArgs<ExtArgs>;
    proxies?: boolean | Prisma.PromotionRequest$proxiesArgs<ExtArgs>;
    captainApproval?: boolean | Prisma.PromotionRequest$captainApprovalArgs<ExtArgs>;
    grantedCredentials?: boolean | Prisma.PromotionRequest$grantedCredentialsArgs<ExtArgs>;
    _count?: boolean | Prisma.PromotionRequestCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionRequest"]>;
export type PromotionRequestSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    credentialTypeId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionRequest"]>;
export type PromotionRequestSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    credentialTypeId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionRequest"]>;
export type PromotionRequestSelectScalar = {
    id?: boolean;
    memberId?: boolean;
    credentialTypeId?: boolean;
    status?: boolean;
    createdAt?: boolean;
    resolvedAt?: boolean;
};
export type PromotionRequestOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "memberId" | "credentialTypeId" | "status" | "createdAt" | "resolvedAt", ExtArgs["result"]["promotionRequest"]>;
export type PromotionRequestInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    votes?: boolean | Prisma.PromotionRequest$votesArgs<ExtArgs>;
    proxies?: boolean | Prisma.PromotionRequest$proxiesArgs<ExtArgs>;
    captainApproval?: boolean | Prisma.PromotionRequest$captainApprovalArgs<ExtArgs>;
    grantedCredentials?: boolean | Prisma.PromotionRequest$grantedCredentialsArgs<ExtArgs>;
    _count?: boolean | Prisma.PromotionRequestCountOutputTypeDefaultArgs<ExtArgs>;
};
export type PromotionRequestIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
};
export type PromotionRequestIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
};
export type $PromotionRequestPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionRequest";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
        credentialType: Prisma.$CredentialTypePayload<ExtArgs>;
        votes: Prisma.$PromotionVotePayload<ExtArgs>[];
        proxies: Prisma.$PromotionProxyPayload<ExtArgs>[];
        captainApproval: Prisma.$PromotionApprovalPayload<ExtArgs> | null;
        grantedCredentials: Prisma.$MemberCredentialPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        memberId: number;
        credentialTypeId: number;
        status: $Enums.PromoStatus;
        createdAt: Date;
        resolvedAt: Date | null;
    }, ExtArgs["result"]["promotionRequest"]>;
    composites: {};
};
export type PromotionRequestGetPayload<S extends boolean | null | undefined | PromotionRequestDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload, S>;
export type PromotionRequestCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionRequestFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionRequestCountAggregateInputType | true;
};
export interface PromotionRequestDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionRequest'];
        meta: {
            name: 'PromotionRequest';
        };
    };
    findUnique<T extends PromotionRequestFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionRequestFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PromotionRequestFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionRequestFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PromotionRequestFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionRequestFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PromotionRequestFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionRequestFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PromotionRequestFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionRequestFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PromotionRequestCreateArgs>(args: Prisma.SelectSubset<T, PromotionRequestCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PromotionRequestCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionRequestCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PromotionRequestCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionRequestCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PromotionRequestDeleteArgs>(args: Prisma.SelectSubset<T, PromotionRequestDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PromotionRequestUpdateArgs>(args: Prisma.SelectSubset<T, PromotionRequestUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PromotionRequestDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionRequestDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PromotionRequestUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionRequestUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PromotionRequestUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionRequestUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PromotionRequestUpsertArgs>(args: Prisma.SelectSubset<T, PromotionRequestUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PromotionRequestCountArgs>(args?: Prisma.Subset<T, PromotionRequestCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionRequestCountAggregateOutputType> : number>;
    aggregate<T extends PromotionRequestAggregateArgs>(args: Prisma.Subset<T, PromotionRequestAggregateArgs>): Prisma.PrismaPromise<GetPromotionRequestAggregateType<T>>;
    groupBy<T extends PromotionRequestGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionRequestGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionRequestGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionRequestGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionRequestGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PromotionRequestFieldRefs;
}
export interface Prisma__PromotionRequestClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    credentialType<T extends Prisma.CredentialTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    votes<T extends Prisma.PromotionRequest$votesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequest$votesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    proxies<T extends Prisma.PromotionRequest$proxiesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequest$proxiesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionProxyPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    captainApproval<T extends Prisma.PromotionRequest$captainApprovalArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequest$captainApprovalArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    grantedCredentials<T extends Prisma.PromotionRequest$grantedCredentialsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequest$grantedCredentialsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PromotionRequestFieldRefs {
    readonly id: Prisma.FieldRef<"PromotionRequest", 'Int'>;
    readonly memberId: Prisma.FieldRef<"PromotionRequest", 'Int'>;
    readonly credentialTypeId: Prisma.FieldRef<"PromotionRequest", 'Int'>;
    readonly status: Prisma.FieldRef<"PromotionRequest", 'PromoStatus'>;
    readonly createdAt: Prisma.FieldRef<"PromotionRequest", 'DateTime'>;
    readonly resolvedAt: Prisma.FieldRef<"PromotionRequest", 'DateTime'>;
}
export type PromotionRequestFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithRelationInput | Prisma.PromotionRequestOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRequestScalarFieldEnum | Prisma.PromotionRequestScalarFieldEnum[];
};
export type PromotionRequestFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithRelationInput | Prisma.PromotionRequestOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRequestScalarFieldEnum | Prisma.PromotionRequestScalarFieldEnum[];
};
export type PromotionRequestFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithRelationInput | Prisma.PromotionRequestOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRequestScalarFieldEnum | Prisma.PromotionRequestScalarFieldEnum[];
};
export type PromotionRequestCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRequestCreateInput, Prisma.PromotionRequestUncheckedCreateInput>;
};
export type PromotionRequestCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PromotionRequestCreateManyInput | Prisma.PromotionRequestCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionRequestCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    data: Prisma.PromotionRequestCreateManyInput | Prisma.PromotionRequestCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PromotionRequestIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PromotionRequestUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateInput, Prisma.PromotionRequestUncheckedUpdateInput>;
    where: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PromotionRequestUpdateManyMutationInput, Prisma.PromotionRequestUncheckedUpdateManyInput>;
    where?: Prisma.PromotionRequestWhereInput;
    limit?: number;
};
export type PromotionRequestUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionRequestUpdateManyMutationInput, Prisma.PromotionRequestUncheckedUpdateManyInput>;
    where?: Prisma.PromotionRequestWhereInput;
    limit?: number;
    include?: Prisma.PromotionRequestIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PromotionRequestUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where: Prisma.PromotionRequestWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionRequestCreateInput, Prisma.PromotionRequestUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PromotionRequestUpdateInput, Prisma.PromotionRequestUncheckedUpdateInput>;
};
export type PromotionRequestDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where: Prisma.PromotionRequestWhereUniqueInput;
};
export type PromotionRequestDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRequestWhereInput;
    limit?: number;
};
export type PromotionRequest$votesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithRelationInput | Prisma.PromotionVoteOrderByWithRelationInput[];
    cursor?: Prisma.PromotionVoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionVoteScalarFieldEnum | Prisma.PromotionVoteScalarFieldEnum[];
};
export type PromotionRequest$proxiesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type PromotionRequest$captainApprovalArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where?: Prisma.PromotionApprovalWhereInput;
};
export type PromotionRequest$grantedCredentialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where?: Prisma.MemberCredentialWhereInput;
    orderBy?: Prisma.MemberCredentialOrderByWithRelationInput | Prisma.MemberCredentialOrderByWithRelationInput[];
    cursor?: Prisma.MemberCredentialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCredentialScalarFieldEnum | Prisma.MemberCredentialScalarFieldEnum[];
};
export type PromotionRequestDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
};
