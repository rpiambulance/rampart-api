import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MemberCertificationModel = runtime.Types.Result.DefaultSelection<Prisma.$MemberCertificationPayload>;
export type AggregateMemberCertification = {
    _count: MemberCertificationCountAggregateOutputType | null;
    _avg: MemberCertificationAvgAggregateOutputType | null;
    _sum: MemberCertificationSumAggregateOutputType | null;
    _min: MemberCertificationMinAggregateOutputType | null;
    _max: MemberCertificationMaxAggregateOutputType | null;
};
export type MemberCertificationAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    verifiedById: number | null;
};
export type MemberCertificationSumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    verifiedById: number | null;
};
export type MemberCertificationMinAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    identifier: string | null;
    issuedAt: Date | null;
    expiresAt: Date | null;
    status: $Enums.CertStatus | null;
    verifiedById: number | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MemberCertificationMaxAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    typeId: number | null;
    identifier: string | null;
    issuedAt: Date | null;
    expiresAt: Date | null;
    status: $Enums.CertStatus | null;
    verifiedById: number | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type MemberCertificationCountAggregateOutputType = {
    id: number;
    memberId: number;
    typeId: number;
    identifier: number;
    issuedAt: number;
    expiresAt: number;
    status: number;
    verifiedById: number;
    verifiedAt: number;
    rejectionReason: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type MemberCertificationAvgAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    verifiedById?: true;
};
export type MemberCertificationSumAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    verifiedById?: true;
};
export type MemberCertificationMinAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    identifier?: true;
    issuedAt?: true;
    expiresAt?: true;
    status?: true;
    verifiedById?: true;
    verifiedAt?: true;
    rejectionReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MemberCertificationMaxAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    identifier?: true;
    issuedAt?: true;
    expiresAt?: true;
    status?: true;
    verifiedById?: true;
    verifiedAt?: true;
    rejectionReason?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type MemberCertificationCountAggregateInputType = {
    id?: true;
    memberId?: true;
    typeId?: true;
    identifier?: true;
    issuedAt?: true;
    expiresAt?: true;
    status?: true;
    verifiedById?: true;
    verifiedAt?: true;
    rejectionReason?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type MemberCertificationAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithRelationInput | Prisma.MemberCertificationOrderByWithRelationInput[];
    cursor?: Prisma.MemberCertificationWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MemberCertificationCountAggregateInputType;
    _avg?: MemberCertificationAvgAggregateInputType;
    _sum?: MemberCertificationSumAggregateInputType;
    _min?: MemberCertificationMinAggregateInputType;
    _max?: MemberCertificationMaxAggregateInputType;
};
export type GetMemberCertificationAggregateType<T extends MemberCertificationAggregateArgs> = {
    [P in keyof T & keyof AggregateMemberCertification]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMemberCertification[P]> : Prisma.GetScalarType<T[P], AggregateMemberCertification[P]>;
};
export type MemberCertificationGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithAggregationInput | Prisma.MemberCertificationOrderByWithAggregationInput[];
    by: Prisma.MemberCertificationScalarFieldEnum[] | Prisma.MemberCertificationScalarFieldEnum;
    having?: Prisma.MemberCertificationScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MemberCertificationCountAggregateInputType | true;
    _avg?: MemberCertificationAvgAggregateInputType;
    _sum?: MemberCertificationSumAggregateInputType;
    _min?: MemberCertificationMinAggregateInputType;
    _max?: MemberCertificationMaxAggregateInputType;
};
export type MemberCertificationGroupByOutputType = {
    id: number;
    memberId: number;
    typeId: number;
    identifier: string | null;
    issuedAt: Date | null;
    expiresAt: Date | null;
    status: $Enums.CertStatus;
    verifiedById: number | null;
    verifiedAt: Date | null;
    rejectionReason: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: MemberCertificationCountAggregateOutputType | null;
    _avg: MemberCertificationAvgAggregateOutputType | null;
    _sum: MemberCertificationSumAggregateOutputType | null;
    _min: MemberCertificationMinAggregateOutputType | null;
    _max: MemberCertificationMaxAggregateOutputType | null;
};
export type GetMemberCertificationGroupByPayload<T extends MemberCertificationGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MemberCertificationGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MemberCertificationGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MemberCertificationGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MemberCertificationGroupByOutputType[P]>;
}>>;
export type MemberCertificationWhereInput = {
    AND?: Prisma.MemberCertificationWhereInput | Prisma.MemberCertificationWhereInput[];
    OR?: Prisma.MemberCertificationWhereInput[];
    NOT?: Prisma.MemberCertificationWhereInput | Prisma.MemberCertificationWhereInput[];
    id?: Prisma.IntFilter<"MemberCertification"> | number;
    memberId?: Prisma.IntFilter<"MemberCertification"> | number;
    typeId?: Prisma.IntFilter<"MemberCertification"> | number;
    identifier?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    issuedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    status?: Prisma.EnumCertStatusFilter<"MemberCertification"> | $Enums.CertStatus;
    verifiedById?: Prisma.IntNullableFilter<"MemberCertification"> | number | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    rejectionReason?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    type?: Prisma.XOR<Prisma.CertificationTypeScalarRelationFilter, Prisma.CertificationTypeWhereInput>;
    verifiedBy?: Prisma.XOR<Prisma.MemberNullableScalarRelationFilter, Prisma.MemberWhereInput> | null;
    documents?: Prisma.CertificationDocumentListRelationFilter;
};
export type MemberCertificationOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    identifier?: Prisma.SortOrderInput | Prisma.SortOrder;
    issuedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    rejectionReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
    type?: Prisma.CertificationTypeOrderByWithRelationInput;
    verifiedBy?: Prisma.MemberOrderByWithRelationInput;
    documents?: Prisma.CertificationDocumentOrderByRelationAggregateInput;
};
export type MemberCertificationWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MemberCertificationWhereInput | Prisma.MemberCertificationWhereInput[];
    OR?: Prisma.MemberCertificationWhereInput[];
    NOT?: Prisma.MemberCertificationWhereInput | Prisma.MemberCertificationWhereInput[];
    memberId?: Prisma.IntFilter<"MemberCertification"> | number;
    typeId?: Prisma.IntFilter<"MemberCertification"> | number;
    identifier?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    issuedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    status?: Prisma.EnumCertStatusFilter<"MemberCertification"> | $Enums.CertStatus;
    verifiedById?: Prisma.IntNullableFilter<"MemberCertification"> | number | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    rejectionReason?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    type?: Prisma.XOR<Prisma.CertificationTypeScalarRelationFilter, Prisma.CertificationTypeWhereInput>;
    verifiedBy?: Prisma.XOR<Prisma.MemberNullableScalarRelationFilter, Prisma.MemberWhereInput> | null;
    documents?: Prisma.CertificationDocumentListRelationFilter;
}, "id">;
export type MemberCertificationOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    identifier?: Prisma.SortOrderInput | Prisma.SortOrder;
    issuedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    expiresAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    status?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrderInput | Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    rejectionReason?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.MemberCertificationCountOrderByAggregateInput;
    _avg?: Prisma.MemberCertificationAvgOrderByAggregateInput;
    _max?: Prisma.MemberCertificationMaxOrderByAggregateInput;
    _min?: Prisma.MemberCertificationMinOrderByAggregateInput;
    _sum?: Prisma.MemberCertificationSumOrderByAggregateInput;
};
export type MemberCertificationScalarWhereWithAggregatesInput = {
    AND?: Prisma.MemberCertificationScalarWhereWithAggregatesInput | Prisma.MemberCertificationScalarWhereWithAggregatesInput[];
    OR?: Prisma.MemberCertificationScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MemberCertificationScalarWhereWithAggregatesInput | Prisma.MemberCertificationScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MemberCertification"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"MemberCertification"> | number;
    typeId?: Prisma.IntWithAggregatesFilter<"MemberCertification"> | number;
    identifier?: Prisma.StringNullableWithAggregatesFilter<"MemberCertification"> | string | null;
    issuedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberCertification"> | Date | string | null;
    expiresAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberCertification"> | Date | string | null;
    status?: Prisma.EnumCertStatusWithAggregatesFilter<"MemberCertification"> | $Enums.CertStatus;
    verifiedById?: Prisma.IntNullableWithAggregatesFilter<"MemberCertification"> | number | null;
    verifiedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberCertification"> | Date | string | null;
    rejectionReason?: Prisma.StringNullableWithAggregatesFilter<"MemberCertification"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"MemberCertification"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"MemberCertification"> | Date | string;
};
export type MemberCertificationCreateInput = {
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutCertificationsInput;
    type: Prisma.CertificationTypeCreateNestedOneWithoutMemberCertificationsInput;
    verifiedBy?: Prisma.MemberCreateNestedOneWithoutVerifiedCertsInput;
    documents?: Prisma.CertificationDocumentCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationUncheckedCreateInput = {
    id?: number;
    memberId: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documents?: Prisma.CertificationDocumentUncheckedCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationUpdateInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutCertificationsNestedInput;
    type?: Prisma.CertificationTypeUpdateOneRequiredWithoutMemberCertificationsNestedInput;
    verifiedBy?: Prisma.MemberUpdateOneWithoutVerifiedCertsNestedInput;
    documents?: Prisma.CertificationDocumentUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.CertificationDocumentUncheckedUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationCreateManyInput = {
    id?: number;
    memberId: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MemberCertificationUpdateManyMutationInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationListRelationFilter = {
    every?: Prisma.MemberCertificationWhereInput;
    some?: Prisma.MemberCertificationWhereInput;
    none?: Prisma.MemberCertificationWhereInput;
};
export type MemberCertificationOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MemberCertificationCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    identifier?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    rejectionReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MemberCertificationAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
};
export type MemberCertificationMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    identifier?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    rejectionReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MemberCertificationMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    identifier?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    expiresAt?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
    verifiedAt?: Prisma.SortOrder;
    rejectionReason?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type MemberCertificationSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    typeId?: Prisma.SortOrder;
    verifiedById?: Prisma.SortOrder;
};
export type MemberCertificationScalarRelationFilter = {
    is?: Prisma.MemberCertificationWhereInput;
    isNot?: Prisma.MemberCertificationWhereInput;
};
export type MemberCertificationCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput> | Prisma.MemberCertificationCreateWithoutMemberInput[] | Prisma.MemberCertificationUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutMemberInput | Prisma.MemberCertificationCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberCertificationCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationCreateNestedManyWithoutVerifiedByInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput> | Prisma.MemberCertificationCreateWithoutVerifiedByInput[] | Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput | Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput[];
    createMany?: Prisma.MemberCertificationCreateManyVerifiedByInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput> | Prisma.MemberCertificationCreateWithoutMemberInput[] | Prisma.MemberCertificationUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutMemberInput | Prisma.MemberCertificationCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberCertificationCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationUncheckedCreateNestedManyWithoutVerifiedByInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput> | Prisma.MemberCertificationCreateWithoutVerifiedByInput[] | Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput | Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput[];
    createMany?: Prisma.MemberCertificationCreateManyVerifiedByInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput> | Prisma.MemberCertificationCreateWithoutMemberInput[] | Prisma.MemberCertificationUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutMemberInput | Prisma.MemberCertificationCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberCertificationCreateManyMemberInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutMemberInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type MemberCertificationUpdateManyWithoutVerifiedByNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput> | Prisma.MemberCertificationCreateWithoutVerifiedByInput[] | Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput | Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutVerifiedByInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutVerifiedByInput[];
    createMany?: Prisma.MemberCertificationCreateManyVerifiedByInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutVerifiedByInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutVerifiedByInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutVerifiedByInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutVerifiedByInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type MemberCertificationUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput> | Prisma.MemberCertificationCreateWithoutMemberInput[] | Prisma.MemberCertificationUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutMemberInput | Prisma.MemberCertificationCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberCertificationCreateManyMemberInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutMemberInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type MemberCertificationUncheckedUpdateManyWithoutVerifiedByNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput> | Prisma.MemberCertificationCreateWithoutVerifiedByInput[] | Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput | Prisma.MemberCertificationCreateOrConnectWithoutVerifiedByInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutVerifiedByInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutVerifiedByInput[];
    createMany?: Prisma.MemberCertificationCreateManyVerifiedByInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutVerifiedByInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutVerifiedByInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutVerifiedByInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutVerifiedByInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type MemberCertificationCreateNestedManyWithoutTypeInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput> | Prisma.MemberCertificationCreateWithoutTypeInput[] | Prisma.MemberCertificationUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutTypeInput | Prisma.MemberCertificationCreateOrConnectWithoutTypeInput[];
    createMany?: Prisma.MemberCertificationCreateManyTypeInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationUncheckedCreateNestedManyWithoutTypeInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput> | Prisma.MemberCertificationCreateWithoutTypeInput[] | Prisma.MemberCertificationUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutTypeInput | Prisma.MemberCertificationCreateOrConnectWithoutTypeInput[];
    createMany?: Prisma.MemberCertificationCreateManyTypeInputEnvelope;
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
};
export type MemberCertificationUpdateManyWithoutTypeNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput> | Prisma.MemberCertificationCreateWithoutTypeInput[] | Prisma.MemberCertificationUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutTypeInput | Prisma.MemberCertificationCreateOrConnectWithoutTypeInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutTypeInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutTypeInput[];
    createMany?: Prisma.MemberCertificationCreateManyTypeInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutTypeInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutTypeInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutTypeInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutTypeInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type MemberCertificationUncheckedUpdateManyWithoutTypeNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput> | Prisma.MemberCertificationCreateWithoutTypeInput[] | Prisma.MemberCertificationUncheckedCreateWithoutTypeInput[];
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutTypeInput | Prisma.MemberCertificationCreateOrConnectWithoutTypeInput[];
    upsert?: Prisma.MemberCertificationUpsertWithWhereUniqueWithoutTypeInput | Prisma.MemberCertificationUpsertWithWhereUniqueWithoutTypeInput[];
    createMany?: Prisma.MemberCertificationCreateManyTypeInputEnvelope;
    set?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    disconnect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    delete?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    connect?: Prisma.MemberCertificationWhereUniqueInput | Prisma.MemberCertificationWhereUniqueInput[];
    update?: Prisma.MemberCertificationUpdateWithWhereUniqueWithoutTypeInput | Prisma.MemberCertificationUpdateWithWhereUniqueWithoutTypeInput[];
    updateMany?: Prisma.MemberCertificationUpdateManyWithWhereWithoutTypeInput | Prisma.MemberCertificationUpdateManyWithWhereWithoutTypeInput[];
    deleteMany?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
};
export type EnumCertStatusFieldUpdateOperationsInput = {
    set?: $Enums.CertStatus;
};
export type MemberCertificationCreateNestedOneWithoutDocumentsInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutDocumentsInput;
    connect?: Prisma.MemberCertificationWhereUniqueInput;
};
export type MemberCertificationUpdateOneRequiredWithoutDocumentsNestedInput = {
    create?: Prisma.XOR<Prisma.MemberCertificationCreateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedCreateWithoutDocumentsInput>;
    connectOrCreate?: Prisma.MemberCertificationCreateOrConnectWithoutDocumentsInput;
    upsert?: Prisma.MemberCertificationUpsertWithoutDocumentsInput;
    connect?: Prisma.MemberCertificationWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.MemberCertificationUpdateToOneWithWhereWithoutDocumentsInput, Prisma.MemberCertificationUpdateWithoutDocumentsInput>, Prisma.MemberCertificationUncheckedUpdateWithoutDocumentsInput>;
};
export type MemberCertificationCreateWithoutMemberInput = {
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    type: Prisma.CertificationTypeCreateNestedOneWithoutMemberCertificationsInput;
    verifiedBy?: Prisma.MemberCreateNestedOneWithoutVerifiedCertsInput;
    documents?: Prisma.CertificationDocumentCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationUncheckedCreateWithoutMemberInput = {
    id?: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documents?: Prisma.CertificationDocumentUncheckedCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationCreateOrConnectWithoutMemberInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput>;
};
export type MemberCertificationCreateManyMemberInputEnvelope = {
    data: Prisma.MemberCertificationCreateManyMemberInput | Prisma.MemberCertificationCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type MemberCertificationCreateWithoutVerifiedByInput = {
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutCertificationsInput;
    type: Prisma.CertificationTypeCreateNestedOneWithoutMemberCertificationsInput;
    documents?: Prisma.CertificationDocumentCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationUncheckedCreateWithoutVerifiedByInput = {
    id?: number;
    memberId: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documents?: Prisma.CertificationDocumentUncheckedCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationCreateOrConnectWithoutVerifiedByInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput>;
};
export type MemberCertificationCreateManyVerifiedByInputEnvelope = {
    data: Prisma.MemberCertificationCreateManyVerifiedByInput | Prisma.MemberCertificationCreateManyVerifiedByInput[];
    skipDuplicates?: boolean;
};
export type MemberCertificationUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutMemberInput, Prisma.MemberCertificationUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutMemberInput, Prisma.MemberCertificationUncheckedCreateWithoutMemberInput>;
};
export type MemberCertificationUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutMemberInput, Prisma.MemberCertificationUncheckedUpdateWithoutMemberInput>;
};
export type MemberCertificationUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.MemberCertificationScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateManyMutationInput, Prisma.MemberCertificationUncheckedUpdateManyWithoutMemberInput>;
};
export type MemberCertificationScalarWhereInput = {
    AND?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
    OR?: Prisma.MemberCertificationScalarWhereInput[];
    NOT?: Prisma.MemberCertificationScalarWhereInput | Prisma.MemberCertificationScalarWhereInput[];
    id?: Prisma.IntFilter<"MemberCertification"> | number;
    memberId?: Prisma.IntFilter<"MemberCertification"> | number;
    typeId?: Prisma.IntFilter<"MemberCertification"> | number;
    identifier?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    issuedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    expiresAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    status?: Prisma.EnumCertStatusFilter<"MemberCertification"> | $Enums.CertStatus;
    verifiedById?: Prisma.IntNullableFilter<"MemberCertification"> | number | null;
    verifiedAt?: Prisma.DateTimeNullableFilter<"MemberCertification"> | Date | string | null;
    rejectionReason?: Prisma.StringNullableFilter<"MemberCertification"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"MemberCertification"> | Date | string;
};
export type MemberCertificationUpsertWithWhereUniqueWithoutVerifiedByInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedUpdateWithoutVerifiedByInput>;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedCreateWithoutVerifiedByInput>;
};
export type MemberCertificationUpdateWithWhereUniqueWithoutVerifiedByInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutVerifiedByInput, Prisma.MemberCertificationUncheckedUpdateWithoutVerifiedByInput>;
};
export type MemberCertificationUpdateManyWithWhereWithoutVerifiedByInput = {
    where: Prisma.MemberCertificationScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateManyMutationInput, Prisma.MemberCertificationUncheckedUpdateManyWithoutVerifiedByInput>;
};
export type MemberCertificationCreateWithoutTypeInput = {
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutCertificationsInput;
    verifiedBy?: Prisma.MemberCreateNestedOneWithoutVerifiedCertsInput;
    documents?: Prisma.CertificationDocumentCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationUncheckedCreateWithoutTypeInput = {
    id?: number;
    memberId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    documents?: Prisma.CertificationDocumentUncheckedCreateNestedManyWithoutCertificationInput;
};
export type MemberCertificationCreateOrConnectWithoutTypeInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput>;
};
export type MemberCertificationCreateManyTypeInputEnvelope = {
    data: Prisma.MemberCertificationCreateManyTypeInput | Prisma.MemberCertificationCreateManyTypeInput[];
    skipDuplicates?: boolean;
};
export type MemberCertificationUpsertWithWhereUniqueWithoutTypeInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutTypeInput, Prisma.MemberCertificationUncheckedUpdateWithoutTypeInput>;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutTypeInput, Prisma.MemberCertificationUncheckedCreateWithoutTypeInput>;
};
export type MemberCertificationUpdateWithWhereUniqueWithoutTypeInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutTypeInput, Prisma.MemberCertificationUncheckedUpdateWithoutTypeInput>;
};
export type MemberCertificationUpdateManyWithWhereWithoutTypeInput = {
    where: Prisma.MemberCertificationScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateManyMutationInput, Prisma.MemberCertificationUncheckedUpdateManyWithoutTypeInput>;
};
export type MemberCertificationCreateWithoutDocumentsInput = {
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutCertificationsInput;
    type: Prisma.CertificationTypeCreateNestedOneWithoutMemberCertificationsInput;
    verifiedBy?: Prisma.MemberCreateNestedOneWithoutVerifiedCertsInput;
};
export type MemberCertificationUncheckedCreateWithoutDocumentsInput = {
    id?: number;
    memberId: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MemberCertificationCreateOrConnectWithoutDocumentsInput = {
    where: Prisma.MemberCertificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedCreateWithoutDocumentsInput>;
};
export type MemberCertificationUpsertWithoutDocumentsInput = {
    update: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedUpdateWithoutDocumentsInput>;
    create: Prisma.XOR<Prisma.MemberCertificationCreateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedCreateWithoutDocumentsInput>;
    where?: Prisma.MemberCertificationWhereInput;
};
export type MemberCertificationUpdateToOneWithWhereWithoutDocumentsInput = {
    where?: Prisma.MemberCertificationWhereInput;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateWithoutDocumentsInput, Prisma.MemberCertificationUncheckedUpdateWithoutDocumentsInput>;
};
export type MemberCertificationUpdateWithoutDocumentsInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutCertificationsNestedInput;
    type?: Prisma.CertificationTypeUpdateOneRequiredWithoutMemberCertificationsNestedInput;
    verifiedBy?: Prisma.MemberUpdateOneWithoutVerifiedCertsNestedInput;
};
export type MemberCertificationUncheckedUpdateWithoutDocumentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationCreateManyMemberInput = {
    id?: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MemberCertificationCreateManyVerifiedByInput = {
    id?: number;
    memberId: number;
    typeId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MemberCertificationUpdateWithoutMemberInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    type?: Prisma.CertificationTypeUpdateOneRequiredWithoutMemberCertificationsNestedInput;
    verifiedBy?: Prisma.MemberUpdateOneWithoutVerifiedCertsNestedInput;
    documents?: Prisma.CertificationDocumentUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.CertificationDocumentUncheckedUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationUpdateWithoutVerifiedByInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutCertificationsNestedInput;
    type?: Prisma.CertificationTypeUpdateOneRequiredWithoutMemberCertificationsNestedInput;
    documents?: Prisma.CertificationDocumentUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateWithoutVerifiedByInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.CertificationDocumentUncheckedUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateManyWithoutVerifiedByInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    typeId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationCreateManyTypeInput = {
    id?: number;
    memberId: number;
    identifier?: string | null;
    issuedAt?: Date | string | null;
    expiresAt?: Date | string | null;
    status?: $Enums.CertStatus;
    verifiedById?: number | null;
    verifiedAt?: Date | string | null;
    rejectionReason?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type MemberCertificationUpdateWithoutTypeInput = {
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutCertificationsNestedInput;
    verifiedBy?: Prisma.MemberUpdateOneWithoutVerifiedCertsNestedInput;
    documents?: Prisma.CertificationDocumentUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateWithoutTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    documents?: Prisma.CertificationDocumentUncheckedUpdateManyWithoutCertificationNestedInput;
};
export type MemberCertificationUncheckedUpdateManyWithoutTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    identifier?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    issuedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    expiresAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    status?: Prisma.EnumCertStatusFieldUpdateOperationsInput | $Enums.CertStatus;
    verifiedById?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    verifiedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    rejectionReason?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type MemberCertificationCountOutputType = {
    documents: number;
};
export type MemberCertificationCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    documents?: boolean | MemberCertificationCountOutputTypeCountDocumentsArgs;
};
export type MemberCertificationCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationCountOutputTypeSelect<ExtArgs> | null;
};
export type MemberCertificationCountOutputTypeCountDocumentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationDocumentWhereInput;
};
export type MemberCertificationSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    identifier?: boolean;
    issuedAt?: boolean;
    expiresAt?: boolean;
    status?: boolean;
    verifiedById?: boolean;
    verifiedAt?: boolean;
    rejectionReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
    documents?: boolean | Prisma.MemberCertification$documentsArgs<ExtArgs>;
    _count?: boolean | Prisma.MemberCertificationCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberCertification"]>;
export type MemberCertificationSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    identifier?: boolean;
    issuedAt?: boolean;
    expiresAt?: boolean;
    status?: boolean;
    verifiedById?: boolean;
    verifiedAt?: boolean;
    rejectionReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
}, ExtArgs["result"]["memberCertification"]>;
export type MemberCertificationSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    identifier?: boolean;
    issuedAt?: boolean;
    expiresAt?: boolean;
    status?: boolean;
    verifiedById?: boolean;
    verifiedAt?: boolean;
    rejectionReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
}, ExtArgs["result"]["memberCertification"]>;
export type MemberCertificationSelectScalar = {
    id?: boolean;
    memberId?: boolean;
    typeId?: boolean;
    identifier?: boolean;
    issuedAt?: boolean;
    expiresAt?: boolean;
    status?: boolean;
    verifiedById?: boolean;
    verifiedAt?: boolean;
    rejectionReason?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type MemberCertificationOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "memberId" | "typeId" | "identifier" | "issuedAt" | "expiresAt" | "status" | "verifiedById" | "verifiedAt" | "rejectionReason" | "createdAt" | "updatedAt", ExtArgs["result"]["memberCertification"]>;
export type MemberCertificationInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
    documents?: boolean | Prisma.MemberCertification$documentsArgs<ExtArgs>;
    _count?: boolean | Prisma.MemberCertificationCountOutputTypeDefaultArgs<ExtArgs>;
};
export type MemberCertificationIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
};
export type MemberCertificationIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    type?: boolean | Prisma.CertificationTypeDefaultArgs<ExtArgs>;
    verifiedBy?: boolean | Prisma.MemberCertification$verifiedByArgs<ExtArgs>;
};
export type $MemberCertificationPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MemberCertification";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
        type: Prisma.$CertificationTypePayload<ExtArgs>;
        verifiedBy: Prisma.$MemberPayload<ExtArgs> | null;
        documents: Prisma.$CertificationDocumentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        memberId: number;
        typeId: number;
        identifier: string | null;
        issuedAt: Date | null;
        expiresAt: Date | null;
        status: $Enums.CertStatus;
        verifiedById: number | null;
        verifiedAt: Date | null;
        rejectionReason: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["memberCertification"]>;
    composites: {};
};
export type MemberCertificationGetPayload<S extends boolean | null | undefined | MemberCertificationDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload, S>;
export type MemberCertificationCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MemberCertificationFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MemberCertificationCountAggregateInputType | true;
};
export interface MemberCertificationDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MemberCertification'];
        meta: {
            name: 'MemberCertification';
        };
    };
    findUnique<T extends MemberCertificationFindUniqueArgs>(args: Prisma.SelectSubset<T, MemberCertificationFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MemberCertificationFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MemberCertificationFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MemberCertificationFindFirstArgs>(args?: Prisma.SelectSubset<T, MemberCertificationFindFirstArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MemberCertificationFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MemberCertificationFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MemberCertificationFindManyArgs>(args?: Prisma.SelectSubset<T, MemberCertificationFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MemberCertificationCreateArgs>(args: Prisma.SelectSubset<T, MemberCertificationCreateArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MemberCertificationCreateManyArgs>(args?: Prisma.SelectSubset<T, MemberCertificationCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MemberCertificationCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MemberCertificationCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MemberCertificationDeleteArgs>(args: Prisma.SelectSubset<T, MemberCertificationDeleteArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MemberCertificationUpdateArgs>(args: Prisma.SelectSubset<T, MemberCertificationUpdateArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MemberCertificationDeleteManyArgs>(args?: Prisma.SelectSubset<T, MemberCertificationDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MemberCertificationUpdateManyArgs>(args: Prisma.SelectSubset<T, MemberCertificationUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MemberCertificationUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MemberCertificationUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MemberCertificationUpsertArgs>(args: Prisma.SelectSubset<T, MemberCertificationUpsertArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MemberCertificationCountArgs>(args?: Prisma.Subset<T, MemberCertificationCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MemberCertificationCountAggregateOutputType> : number>;
    aggregate<T extends MemberCertificationAggregateArgs>(args: Prisma.Subset<T, MemberCertificationAggregateArgs>): Prisma.PrismaPromise<GetMemberCertificationAggregateType<T>>;
    groupBy<T extends MemberCertificationGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MemberCertificationGroupByArgs['orderBy'];
    } : {
        orderBy?: MemberCertificationGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MemberCertificationGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberCertificationGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MemberCertificationFieldRefs;
}
export interface Prisma__MemberCertificationClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    type<T extends Prisma.CertificationTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CertificationTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    verifiedBy<T extends Prisma.MemberCertification$verifiedByArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberCertification$verifiedByArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    documents<T extends Prisma.MemberCertification$documentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberCertification$documentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MemberCertificationFieldRefs {
    readonly id: Prisma.FieldRef<"MemberCertification", 'Int'>;
    readonly memberId: Prisma.FieldRef<"MemberCertification", 'Int'>;
    readonly typeId: Prisma.FieldRef<"MemberCertification", 'Int'>;
    readonly identifier: Prisma.FieldRef<"MemberCertification", 'String'>;
    readonly issuedAt: Prisma.FieldRef<"MemberCertification", 'DateTime'>;
    readonly expiresAt: Prisma.FieldRef<"MemberCertification", 'DateTime'>;
    readonly status: Prisma.FieldRef<"MemberCertification", 'CertStatus'>;
    readonly verifiedById: Prisma.FieldRef<"MemberCertification", 'Int'>;
    readonly verifiedAt: Prisma.FieldRef<"MemberCertification", 'DateTime'>;
    readonly rejectionReason: Prisma.FieldRef<"MemberCertification", 'String'>;
    readonly createdAt: Prisma.FieldRef<"MemberCertification", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"MemberCertification", 'DateTime'>;
}
export type MemberCertificationFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where: Prisma.MemberCertificationWhereUniqueInput;
};
export type MemberCertificationFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where: Prisma.MemberCertificationWhereUniqueInput;
};
export type MemberCertificationFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithRelationInput | Prisma.MemberCertificationOrderByWithRelationInput[];
    cursor?: Prisma.MemberCertificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCertificationScalarFieldEnum | Prisma.MemberCertificationScalarFieldEnum[];
};
export type MemberCertificationFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithRelationInput | Prisma.MemberCertificationOrderByWithRelationInput[];
    cursor?: Prisma.MemberCertificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCertificationScalarFieldEnum | Prisma.MemberCertificationScalarFieldEnum[];
};
export type MemberCertificationFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithRelationInput | Prisma.MemberCertificationOrderByWithRelationInput[];
    cursor?: Prisma.MemberCertificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCertificationScalarFieldEnum | Prisma.MemberCertificationScalarFieldEnum[];
};
export type MemberCertificationCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCertificationCreateInput, Prisma.MemberCertificationUncheckedCreateInput>;
};
export type MemberCertificationCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MemberCertificationCreateManyInput | Prisma.MemberCertificationCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MemberCertificationCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    data: Prisma.MemberCertificationCreateManyInput | Prisma.MemberCertificationCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MemberCertificationIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MemberCertificationUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateInput, Prisma.MemberCertificationUncheckedUpdateInput>;
    where: Prisma.MemberCertificationWhereUniqueInput;
};
export type MemberCertificationUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MemberCertificationUpdateManyMutationInput, Prisma.MemberCertificationUncheckedUpdateManyInput>;
    where?: Prisma.MemberCertificationWhereInput;
    limit?: number;
};
export type MemberCertificationUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberCertificationUpdateManyMutationInput, Prisma.MemberCertificationUncheckedUpdateManyInput>;
    where?: Prisma.MemberCertificationWhereInput;
    limit?: number;
    include?: Prisma.MemberCertificationIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MemberCertificationUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where: Prisma.MemberCertificationWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberCertificationCreateInput, Prisma.MemberCertificationUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MemberCertificationUpdateInput, Prisma.MemberCertificationUncheckedUpdateInput>;
};
export type MemberCertificationDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where: Prisma.MemberCertificationWhereUniqueInput;
};
export type MemberCertificationDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCertificationWhereInput;
    limit?: number;
};
export type MemberCertification$verifiedByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberSelect<ExtArgs> | null;
    omit?: Prisma.MemberOmit<ExtArgs> | null;
    include?: Prisma.MemberInclude<ExtArgs> | null;
    where?: Prisma.MemberWhereInput;
};
export type MemberCertification$documentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithRelationInput | Prisma.CertificationDocumentOrderByWithRelationInput[];
    cursor?: Prisma.CertificationDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationDocumentScalarFieldEnum | Prisma.CertificationDocumentScalarFieldEnum[];
};
export type MemberCertificationDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
};
