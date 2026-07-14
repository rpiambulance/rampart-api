import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MemberCredentialModel = runtime.Types.Result.DefaultSelection<Prisma.$MemberCredentialPayload>;
export type AggregateMemberCredential = {
    _count: MemberCredentialCountAggregateOutputType | null;
    _avg: MemberCredentialAvgAggregateOutputType | null;
    _sum: MemberCredentialSumAggregateOutputType | null;
    _min: MemberCredentialMinAggregateOutputType | null;
    _max: MemberCredentialMaxAggregateOutputType | null;
};
export type MemberCredentialAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    grantedViaId: number | null;
};
export type MemberCredentialSumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    grantedViaId: number | null;
};
export type MemberCredentialMinAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    status: $Enums.CredentialStatus | null;
    title: string | null;
    grantedAt: Date | null;
    grantedViaId: number | null;
    revokedAt: Date | null;
};
export type MemberCredentialMaxAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    status: $Enums.CredentialStatus | null;
    title: string | null;
    grantedAt: Date | null;
    grantedViaId: number | null;
    revokedAt: Date | null;
};
export type MemberCredentialCountAggregateOutputType = {
    id: number;
    memberId: number;
    typeId: number;
    status: number;
    title: number;
    grantedAt: number;
    grantedViaId: number;
    revokedAt: number;
    _all: number;
};
export type MemberCredentialAvgAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    grantedViaId?: true;
};
export type MemberCredentialSumAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    grantedViaId?: true;
};
export type MemberCredentialMinAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    status?: true;
    title?: true;
    grantedAt?: true;
    grantedViaId?: true;
    revokedAt?: true;
};
export type MemberCredentialMaxAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    status?: true;
    title?: true;
    grantedAt?: true;
    grantedViaId?: true;
    revokedAt?: true;
};
export type MemberCredentialCountAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    status?: true;
    title?: true;
    grantedAt?: true;
    grantedViaId?: true;
    revokedAt?: true;
    _all?: true;
};
export type MemberCredentialAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCredentialWhereInput;
    orderBy?: Prisma.MemberCredentialOrderByWithRelationInput | Prisma.MemberCredentialOrderByWithRelationInput[];
    cursor?: Prisma.MemberCredentialWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MemberCredentialCountAggregateInputType;
    _avg?: MemberCredentialAvgAggregateInputType;
    _sum?: MemberCredentialSumAggregateInputType;
    _min?: MemberCredentialMinAggregateInputType;
    _max?: MemberCredentialMaxAggregateInputType;
};
export type GetMemberCredentialAggregateType<T extends MemberCredentialAggregateArgs> = {
    [P in keyof T & keyof AggregateMemberCredential]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMemberCredential[P]> : Prisma.GetScalarType<T[P], AggregateMemberCredential[P]>;
};
export type MemberCredentialGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCredentialWhereInput;
    orderBy?: Prisma.MemberCredentialOrderByWithAggregationInput | Prisma.MemberCredentialOrderByWithAggregationInput[];
    by: Prisma.MemberCredentialScalarFieldEnum[] | Prisma.MemberCredentialScalarFieldEnum;
    having?: Prisma.MemberCredentialScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MemberCredentialCountAggregateInputType | true;
    _avg?: MemberCredentialAvgAggregateInputType;
    _sum?: MemberCredentialSumAggregateInputType;
    _min?: MemberCredentialMinAggregateInputType;
    _max?: MemberCredentialMaxAggregateInputType;
};
export type MemberCredentialGroupByOutputType = {
    id: number;
    memberId: number;
    typeId: number;
    status: $Enums.CredentialStatus;
    title: string | null;
    grantedAt: Date;
    grantedViaId: number | null;
    revokedAt: Date | null;
    _count: MemberCredentialCountAggregateOutputType | null;
    _avg: MemberCredentialAvgAggregateOutputType | null;
    _sum: MemberCredentialSumAggregateOutputType | null;
    _min: MemberCredentialMinAggregateOutputType | null;
    _max: MemberCredentialMaxAggregateOutputType | null;
};
export type GetMemberCredentialGroupByPayload<T extends MemberCredentialGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MemberCredentialGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MemberCredentialGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MemberCredentialGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MemberCredentialGroupByOutputType[P]>;
}>>;
export type MemberCredentialWhereInput = {
    AND?: Prisma.MemberCredentialWhereInput | Prisma.MemberCredentialWhereInput[];
    OR?: Prisma.MemberCredentialWhereInput[];
    NOT?: Prisma.MemberCredentialWhereInput | Prisma.MemberCredentialWhereInput[];
    id?: Prisma.IntFilter<"MemberCredential"> | number;
    memberId?: Prisma.IntFilter<"MemberCredential"> | number;
    typeId?: Prisma.IntFilter<"MemberCredential"> | number;
    status?: Prisma.EnumCredentialStatusFilter<"MemberCredential"> | $Enums.CredentialStatus;
    title?: Prisma.StringNullableFilter<"MemberCredential"> | string | null;
    grantedAt?: Prisma.DateTimeFilter<"MemberCredential"> | Date | string;
    grantedViaId?: Prisma.IntNullableFilter<"MemberCredential"> | number | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"MemberCredential"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    type?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    grantedVia?: Prisma.XOR<Prisma.PromotionRequestNullableScalarRelationFilter, Prisma.PromotionRequestWhereInput> | null;
};
export type MemberCredentialOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    grantedAt?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
    type?: Prisma.CredentialTypeOrderByWithRelationInput;
    grantedVia?: Prisma.PromotionRequestOrderByWithRelationInput;
};
export type MemberCredentialWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    memberId_typeId?: Prisma.MemberCredentialMemberIdTypeIdCompoundUniqueInput;
    AND?: Prisma.MemberCredentialWhereInput | Prisma.MemberCredentialWhereInput[];
    OR?: Prisma.MemberCredentialWhereInput[];
    NOT?: Prisma.MemberCredentialWhereInput | Prisma.MemberCredentialWhereInput[];
    memberId?: Prisma.IntFilter<"MemberCredential"> | number;
    typeId?: Prisma.IntFilter<"MemberCredential"> | number;
    status?: Prisma.EnumCredentialStatusFilter<"MemberCredential"> | $Enums.CredentialStatus;
    title?: Prisma.StringNullableFilter<"MemberCredential"> | string | null;
    grantedAt?: Prisma.DateTimeFilter<"MemberCredential"> | Date | string;
    grantedViaId?: Prisma.IntNullableFilter<"MemberCredential"> | number | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"MemberCredential"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    type?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    grantedVia?: Prisma.XOR<Prisma.PromotionRequestNullableScalarRelationFilter, Prisma.PromotionRequestWhereInput> | null;
}, "id" | "memberId_typeId">;
export type MemberCredentialOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    title?: Prisma.SortOrderInput | Prisma.SortOrder;
    grantedAt?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrderInput | Prisma.SortOrder;
    revokedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MemberCredentialCountOrderByAggregateInput;
    _avg?: Prisma.MemberCredentialAvgOrderByAggregateInput;
    _max?: Prisma.MemberCredentialMaxOrderByAggregateInput;
    _min?: Prisma.MemberCredentialMinOrderByAggregateInput;
    _sum?: Prisma.MemberCredentialSumOrderByAggregateInput;
};
export type MemberCredentialScalarWhereWithAggregatesInput = {
    AND?: Prisma.MemberCredentialScalarWhereWithAggregatesInput | Prisma.MemberCredentialScalarWhereWithAggregatesInput[];
    OR?: Prisma.MemberCredentialScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MemberCredentialScalarWhereWithAggregatesInput | Prisma.MemberCredentialScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MemberCredential"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"MemberCredential"> | number;
    typeId?: Prisma.IntWithAggregatesFilter<"MemberCredential"> | number;
    status?: Prisma.EnumCredentialStatusWithAggregatesFilter<"MemberCredential"> | $Enums.CredentialStatus;
    title?: Prisma.StringNullableWithAggregatesFilter<"MemberCredential"> | string | null;
    grantedAt?: Prisma.DateTimeWithAggregatesFilter<"MemberCredential"> | Date | string;
    grantedViaId?: Prisma.IntNullableWithAggregatesFilter<"MemberCredential"> | number | null;
    revokedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberCredential"> | Date | string | null;
};
export type MemberCredentialCreateInput = {
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutCredentialsInput;
    type: Prisma.CredentialTypeCreateNestedOneWithoutMemberCredentialsInput;
    grantedVia?: Prisma.PromotionRequestCreateNestedOneWithoutGrantedCredentialsInput;
};
export type MemberCredentialUncheckedCreateInput = {
    id?: number;
    memberId: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialUpdateInput = {
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutCredentialsNestedInput;
    type?: Prisma.CredentialTypeUpdateOneRequiredWithoutMemberCredentialsNestedInput;
    grantedVia?: Prisma.PromotionRequestUpdateOneWithoutGrantedCredentialsNestedInput;
};
export type MemberCredentialUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialCreateManyInput = {
    id?: number;
    memberId: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialUpdateManyMutationInput = {
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialListRelationFilter = {
    every?: Prisma.MemberCredentialWhereInput;
    some?: Prisma.MemberCredentialWhereInput;
    none?: Prisma.MemberCredentialWhereInput;
};
export type MemberCredentialOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MemberCredentialMemberIdTypeIdCompoundUniqueInput = {
    memberId: number;
    typeId: number;
};
export type MemberCredentialCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    grantedAt?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
};
export type MemberCredentialAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrder;
};
export type MemberCredentialMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    grantedAt?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
};
export type MemberCredentialMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    grantedAt?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrder;
    revokedAt?: Prisma.SortOrder;
};
export type MemberCredentialSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    grantedViaId?: Prisma.SortOrder;
};
export type MemberCredentialCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput> | Prisma.MemberCredentialCreateWithoutMemberInput[] | Prisma.MemberCredentialUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutMemberInput | Prisma.MemberCredentialCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberCredentialCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput> | Prisma.MemberCredentialCreateWithoutMemberInput[] | Prisma.MemberCredentialUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutMemberInput | Prisma.MemberCredentialCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberCredentialCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput> | Prisma.MemberCredentialCreateWithoutMemberInput[] | Prisma.MemberCredentialUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutMemberInput | Prisma.MemberCredentialCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberCredentialCreateManyMemberInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutMemberInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type MemberCredentialUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput> | Prisma.MemberCredentialCreateWithoutMemberInput[] | Prisma.MemberCredentialUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutMemberInput | Prisma.MemberCredentialCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberCredentialCreateManyMemberInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutMemberInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type MemberCredentialCreateNestedManyWithoutTypeInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput> | Prisma.MemberCredentialCreateWithoutTypeInput[] | Prisma.MemberCredentialUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutTypeInput | Prisma.MemberCredentialCreateOrConnectWithoutTypeInput[];
    createMany?: Prisma.MemberCredentialCreateManyTypeInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUncheckedCreateNestedManyWithoutTypeInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput> | Prisma.MemberCredentialCreateWithoutTypeInput[] | Prisma.MemberCredentialUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutTypeInput | Prisma.MemberCredentialCreateOrConnectWithoutTypeInput[];
    createMany?: Prisma.MemberCredentialCreateManyTypeInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUpdateManyWithoutTypeNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput> | Prisma.MemberCredentialCreateWithoutTypeInput[] | Prisma.MemberCredentialUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutTypeInput | Prisma.MemberCredentialCreateOrConnectWithoutTypeInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutTypeInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutTypeInput[];
    createMany?: Prisma.MemberCredentialCreateManyTypeInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutTypeInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutTypeInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutTypeInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutTypeInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput> | Prisma.MemberCredentialCreateWithoutTypeInput[] | Prisma.MemberCredentialUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutTypeInput | Prisma.MemberCredentialCreateOrConnectWithoutTypeInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutTypeInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutTypeInput[];
    createMany?: Prisma.MemberCredentialCreateManyTypeInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutTypeInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutTypeInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutTypeInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutTypeInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type EnumCredentialStatusFieldUpdateOperationsInput = {
    set?: $Enums.CredentialStatus;
};
export type MemberCredentialCreateNestedManyWithoutGrantedViaInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput> | Prisma.MemberCredentialCreateWithoutGrantedViaInput[] | Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput | Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput[];
    createMany?: Prisma.MemberCredentialCreateManyGrantedViaInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUncheckedCreateNestedManyWithoutGrantedViaInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput> | Prisma.MemberCredentialCreateWithoutGrantedViaInput[] | Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput | Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput[];
    createMany?: Prisma.MemberCredentialCreateManyGrantedViaInputEnvelope;
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
};
export type MemberCredentialUpdateManyWithoutGrantedViaNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput> | Prisma.MemberCredentialCreateWithoutGrantedViaInput[] | Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput | Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutGrantedViaInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutGrantedViaInput[];
    createMany?: Prisma.MemberCredentialCreateManyGrantedViaInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutGrantedViaInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutGrantedViaInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutGrantedViaInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutGrantedViaInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type MemberCredentialUncheckedUpdateManyWithoutGrantedViaNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput> | Prisma.MemberCredentialCreateWithoutGrantedViaInput[] | Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput[];
    connectOrCreate?: Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput | Prisma.MemberCredentialCreateOrConnectWithoutGrantedViaInput[];
    upsert?: Prisma.MemberCredentialUpsertWithWhereUniqueWithoutGrantedViaInput | Prisma.MemberCredentialUpsertWithWhereUniqueWithoutGrantedViaInput[];
    createMany?: Prisma.MemberCredentialCreateManyGrantedViaInputEnvelope;
    set?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    disconnect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    delete?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    connect?: Prisma.MemberCredentialWhereUniqueInput | Prisma.MemberCredentialWhereUniqueInput[];
    update?: Prisma.MemberCredentialUpdateWithWhereUniqueWithoutGrantedViaInput | Prisma.MemberCredentialUpdateWithWhereUniqueWithoutGrantedViaInput[];
    updateMany?: Prisma.MemberCredentialUpdateManyWithWhereWithoutGrantedViaInput | Prisma.MemberCredentialUpdateManyWithWhereWithoutGrantedViaInput[];
    deleteMany?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
};
export type MemberCredentialCreateWithoutMemberInput = {
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
    type: Prisma.CredentialTypeCreateNestedOneWithoutMemberCredentialsInput;
    grantedVia?: Prisma.PromotionRequestCreateNestedOneWithoutGrantedCredentialsInput;
};
export type MemberCredentialUncheckedCreateWithoutMemberInput = {
    id?: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialCreateOrConnectWithoutMemberInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput>;
};
export type MemberCredentialCreateManyMemberInputEnvelope = {
    data: Prisma.MemberCredentialCreateManyMemberInput | Prisma.MemberCredentialCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type MemberCredentialUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutMemberInput, Prisma.MemberCredentialUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutMemberInput, Prisma.MemberCredentialUncheckedCreateWithoutMemberInput>;
};
export type MemberCredentialUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutMemberInput, Prisma.MemberCredentialUncheckedUpdateWithoutMemberInput>;
};
export type MemberCredentialUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.MemberCredentialScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateManyMutationInput, Prisma.MemberCredentialUncheckedUpdateManyWithoutMemberInput>;
};
export type MemberCredentialScalarWhereInput = {
    AND?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
    OR?: Prisma.MemberCredentialScalarWhereInput[];
    NOT?: Prisma.MemberCredentialScalarWhereInput | Prisma.MemberCredentialScalarWhereInput[];
    id?: Prisma.IntFilter<"MemberCredential"> | number;
    memberId?: Prisma.IntFilter<"MemberCredential"> | number;
    typeId?: Prisma.IntFilter<"MemberCredential"> | number;
    status?: Prisma.EnumCredentialStatusFilter<"MemberCredential"> | $Enums.CredentialStatus;
    title?: Prisma.StringNullableFilter<"MemberCredential"> | string | null;
    grantedAt?: Prisma.DateTimeFilter<"MemberCredential"> | Date | string;
    grantedViaId?: Prisma.IntNullableFilter<"MemberCredential"> | number | null;
    revokedAt?: Prisma.DateTimeNullableFilter<"MemberCredential"> | Date | string | null;
};
export type MemberCredentialCreateWithoutTypeInput = {
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutCredentialsInput;
    grantedVia?: Prisma.PromotionRequestCreateNestedOneWithoutGrantedCredentialsInput;
};
export type MemberCredentialUncheckedCreateWithoutTypeInput = {
    id?: number;
    memberId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialCreateOrConnectWithoutTypeInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput>;
};
export type MemberCredentialCreateManyTypeInputEnvelope = {
    data: Prisma.MemberCredentialCreateManyTypeInput | Prisma.MemberCredentialCreateManyTypeInput[];
    skipDuplicates?: boolean;
};
export type MemberCredentialUpsertWithWhereUniqueWithoutTypeInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutTypeInput, Prisma.MemberCredentialUncheckedUpdateWithoutTypeInput>;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutTypeInput, Prisma.MemberCredentialUncheckedCreateWithoutTypeInput>;
};
export type MemberCredentialUpdateWithWhereUniqueWithoutTypeInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutTypeInput, Prisma.MemberCredentialUncheckedUpdateWithoutTypeInput>;
};
export type MemberCredentialUpdateManyWithWhereWithoutTypeInput = {
    where: Prisma.MemberCredentialScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateManyMutationInput, Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeInput>;
};
export type MemberCredentialCreateWithoutGrantedViaInput = {
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutCredentialsInput;
    type: Prisma.CredentialTypeCreateNestedOneWithoutMemberCredentialsInput;
};
export type MemberCredentialUncheckedCreateWithoutGrantedViaInput = {
    id?: number;
    memberId: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
};
export type MemberCredentialCreateOrConnectWithoutGrantedViaInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput>;
};
export type MemberCredentialCreateManyGrantedViaInputEnvelope = {
    data: Prisma.MemberCredentialCreateManyGrantedViaInput | Prisma.MemberCredentialCreateManyGrantedViaInput[];
    skipDuplicates?: boolean;
};
export type MemberCredentialUpsertWithWhereUniqueWithoutGrantedViaInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedUpdateWithoutGrantedViaInput>;
    create: Prisma.XOR<Prisma.MemberCredentialCreateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedCreateWithoutGrantedViaInput>;
};
export type MemberCredentialUpdateWithWhereUniqueWithoutGrantedViaInput = {
    where: Prisma.MemberCredentialWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateWithoutGrantedViaInput, Prisma.MemberCredentialUncheckedUpdateWithoutGrantedViaInput>;
};
export type MemberCredentialUpdateManyWithWhereWithoutGrantedViaInput = {
    where: Prisma.MemberCredentialScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateManyMutationInput, Prisma.MemberCredentialUncheckedUpdateManyWithoutGrantedViaInput>;
};
export type MemberCredentialCreateManyMemberInput = {
    id?: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialUpdateWithoutMemberInput = {
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    type?: Prisma.CredentialTypeUpdateOneRequiredWithoutMemberCredentialsNestedInput;
    grantedVia?: Prisma.PromotionRequestUpdateOneWithoutGrantedCredentialsNestedInput;
};
export type MemberCredentialUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialCreateManyTypeInput = {
    id?: number;
    memberId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    grantedViaId?: number | null;
    revokedAt?: Date | string | null;
};
export type MemberCredentialUpdateWithoutTypeInput = {
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutCredentialsNestedInput;
    grantedVia?: Prisma.PromotionRequestUpdateOneWithoutGrantedCredentialsNestedInput;
};
export type MemberCredentialUncheckedUpdateWithoutTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialUncheckedUpdateManyWithoutTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    grantedViaId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialCreateManyGrantedViaInput = {
    id?: number;
    memberId: number;
    typeId: number;
    status?: $Enums.CredentialStatus;
    title?: string | null;
    grantedAt?: Date | string;
    revokedAt?: Date | string | null;
};
export type MemberCredentialUpdateWithoutGrantedViaInput = {
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutCredentialsNestedInput;
    type?: Prisma.CredentialTypeUpdateOneRequiredWithoutMemberCredentialsNestedInput;
};
export type MemberCredentialUncheckedUpdateWithoutGrantedViaInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialUncheckedUpdateManyWithoutGrantedViaInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumCredentialStatusFieldUpdateOperationsInput | $Enums.CredentialStatus;
    title?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    grantedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    revokedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberCredentialSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    status?: boolean;
    title?: boolean;
    grantedAt?: boolean;
    grantedViaId?: boolean;
    revokedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
}, ExtArgs["result"]["memberCredential"]>;
export type MemberCredentialSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    status?: boolean;
    title?: boolean;
    grantedAt?: boolean;
    grantedViaId?: boolean;
    revokedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
}, ExtArgs["result"]["memberCredential"]>;
export type MemberCredentialSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    status?: boolean;
    title?: boolean;
    grantedAt?: boolean;
    grantedViaId?: boolean;
    revokedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
}, ExtArgs["result"]["memberCredential"]>;
export type MemberCredentialSelectScalar = {
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    status?: boolean;
    title?: boolean;
    grantedAt?: boolean;
    grantedViaId?: boolean;
    revokedAt?: boolean;
};
export type MemberCredentialOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "memberId" | "typeId" | "status" | "title" | "grantedAt" | "grantedViaId" | "revokedAt", ExtArgs["result"]["memberCredential"]>;
export type MemberCredentialInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
};
export type MemberCredentialIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
};
export type MemberCredentialIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    grantedVia?: boolean | Prisma.MemberCredential$grantedViaArgs<ExtArgs>;
};
export type $MemberCredentialPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MemberCredential";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
        type: Prisma.$CredentialTypePayload<ExtArgs>;
        grantedVia: Prisma.$PromotionRequestPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        memberId: number;
        typeId: number;
        status: $Enums.CredentialStatus;
        title: string | null;
        grantedAt: Date;
        grantedViaId: number | null;
        revokedAt: Date | null;
    }, ExtArgs["result"]["memberCredential"]>;
    composites: {};
};
export type MemberCredentialGetPayload<S extends boolean | null | undefined | MemberCredentialDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload, S>;
export type MemberCredentialCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MemberCredentialFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MemberCredentialCountAggregateInputType | true;
};
export interface MemberCredentialDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MemberCredential'];
        meta: {
            name: 'MemberCredential';
        };
    };
    findUnique<T extends MemberCredentialFindUniqueArgs>(args: Prisma.SelectSubset<T, MemberCredentialFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MemberCredentialFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MemberCredentialFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MemberCredentialFindFirstArgs>(args?: Prisma.SelectSubset<T, MemberCredentialFindFirstArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MemberCredentialFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MemberCredentialFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MemberCredentialFindManyArgs>(args?: Prisma.SelectSubset<T, MemberCredentialFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MemberCredentialCreateArgs>(args: Prisma.SelectSubset<T, MemberCredentialCreateArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MemberCredentialCreateManyArgs>(args?: Prisma.SelectSubset<T, MemberCredentialCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MemberCredentialCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MemberCredentialCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MemberCredentialDeleteArgs>(args: Prisma.SelectSubset<T, MemberCredentialDeleteArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MemberCredentialUpdateArgs>(args: Prisma.SelectSubset<T, MemberCredentialUpdateArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MemberCredentialDeleteManyArgs>(args?: Prisma.SelectSubset<T, MemberCredentialDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MemberCredentialUpdateManyArgs>(args: Prisma.SelectSubset<T, MemberCredentialUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MemberCredentialUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MemberCredentialUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MemberCredentialUpsertArgs>(args: Prisma.SelectSubset<T, MemberCredentialUpsertArgs<ExtArgs>>): Prisma.Prisma__MemberCredentialClient<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MemberCredentialCountArgs>(args?: Prisma.Subset<T, MemberCredentialCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MemberCredentialCountAggregateOutputType> : number>;
    aggregate<T extends MemberCredentialAggregateArgs>(args: Prisma.Subset<T, MemberCredentialAggregateArgs>): Prisma.PrismaPromise<GetMemberCredentialAggregateType<T>>;
    groupBy<T extends MemberCredentialGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MemberCredentialGroupByArgs['orderBy'];
    } : {
        orderBy?: MemberCredentialGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MemberCredentialGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberCredentialGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MemberCredentialFieldRefs;
}
export interface Prisma__MemberCredentialClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    type<T extends Prisma.CredentialTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    grantedVia<T extends Prisma.MemberCredential$grantedViaArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberCredential$grantedViaArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MemberCredentialFieldRefs {
    readonly id: Prisma.FieldRef<"MemberCredential", 'Int'>;
    readonly memberId: Prisma.FieldRef<"MemberCredential", 'Int'>;
    readonly typeId: Prisma.FieldRef<"MemberCredential", 'Int'>;
    readonly status: Prisma.FieldRef<"MemberCredential", 'CredentialStatus'>;
    readonly title: Prisma.FieldRef<"MemberCredential", 'String'>;
    readonly grantedAt: Prisma.FieldRef<"MemberCredential", 'DateTime'>;
    readonly grantedViaId: Prisma.FieldRef<"MemberCredential", 'Int'>;
    readonly revokedAt: Prisma.FieldRef<"MemberCredential", 'DateTime'>;
}
export type MemberCredentialFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where: Prisma.MemberCredentialWhereUniqueInput;
};
export type MemberCredentialFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where: Prisma.MemberCredentialWhereUniqueInput;
};
export type MemberCredentialFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MemberCredentialFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MemberCredentialFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type MemberCredentialCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCredentialCreateInput, Prisma.MemberCredentialUncheckedCreateInput>;
};
export type MemberCredentialCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MemberCredentialCreateManyInput | Prisma.MemberCredentialCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MemberCredentialCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    data: Prisma.MemberCredentialCreateManyInput | Prisma.MemberCredentialCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MemberCredentialIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MemberCredentialUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateInput, Prisma.MemberCredentialUncheckedUpdateInput>;
    where: Prisma.MemberCredentialWhereUniqueInput;
};
export type MemberCredentialUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MemberCredentialUpdateManyMutationInput, Prisma.MemberCredentialUncheckedUpdateManyInput>;
    where?: Prisma.MemberCredentialWhereInput;
    limit?: number;
};
export type MemberCredentialUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCredentialUpdateManyMutationInput, Prisma.MemberCredentialUncheckedUpdateManyInput>;
    where?: Prisma.MemberCredentialWhereInput;
    limit?: number;
    include?: Prisma.MemberCredentialIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MemberCredentialUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where: Prisma.MemberCredentialWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCredentialCreateInput, Prisma.MemberCredentialUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MemberCredentialUpdateInput, Prisma.MemberCredentialUncheckedUpdateInput>;
};
export type MemberCredentialDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where: Prisma.MemberCredentialWhereUniqueInput;
};
export type MemberCredentialDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCredentialWhereInput;
    limit?: number;
};
export type MemberCredential$grantedViaArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where?: Prisma.PromotionRequestWhereInput;
};
export type MemberCredentialDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
};
