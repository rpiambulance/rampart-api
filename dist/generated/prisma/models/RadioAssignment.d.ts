import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RadioAssignmentModel = runtime.Types.Result.DefaultSelection<Prisma.$RadioAssignmentPayload>;
export type AggregateRadioAssignment = {
    _count: RadioAssignmentCountAggregateOutputType | null;
    _avg: RadioAssignmentAvgAggregateOutputType | null;
    _sum: RadioAssignmentSumAggregateOutputType | null;
    _min: RadioAssignmentMinAggregateOutputType | null;
    _max: RadioAssignmentMaxAggregateOutputType | null;
};
export type RadioAssignmentAvgAggregateOutputType = {
    id: number | null;
    radioId: number | null;
    memberId: number | null;
};
export type RadioAssignmentSumAggregateOutputType = {
    id: number | null;
    radioId: number | null;
    memberId: number | null;
};
export type RadioAssignmentMinAggregateOutputType = {
    id: number | null;
    radioId: number | null;
    memberId: number | null;
    issuedAt: Date | null;
    returnedAt: Date | null;
};
export type RadioAssignmentMaxAggregateOutputType = {
    id: number | null;
    radioId: number | null;
    memberId: number | null;
    issuedAt: Date | null;
    returnedAt: Date | null;
};
export type RadioAssignmentCountAggregateOutputType = {
    id: number;
    radioId: number;
    memberId: number;
    issuedAt: number;
    returnedAt: number;
    _all: number;
};
export type RadioAssignmentAvgAggregateInputType = {
    id?: true;
    radioId?: true;
    memberId?: true;
};
export type RadioAssignmentSumAggregateInputType = {
    id?: true;
    radioId?: true;
    memberId?: true;
};
export type RadioAssignmentMinAggregateInputType = {
    id?: true;
    radioId?: true;
    memberId?: true;
    issuedAt?: true;
    returnedAt?: true;
};
export type RadioAssignmentMaxAggregateInputType = {
    id?: true;
    radioId?: true;
    memberId?: true;
    issuedAt?: true;
    returnedAt?: true;
};
export type RadioAssignmentCountAggregateInputType = {
    id?: true;
    radioId?: true;
    memberId?: true;
    issuedAt?: true;
    returnedAt?: true;
    _all?: true;
};
export type RadioAssignmentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioAssignmentWhereInput;
    orderBy?: Prisma.RadioAssignmentOrderByWithRelationInput | Prisma.RadioAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.RadioAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RadioAssignmentCountAggregateInputType;
    _avg?: RadioAssignmentAvgAggregateInputType;
    _sum?: RadioAssignmentSumAggregateInputType;
    _min?: RadioAssignmentMinAggregateInputType;
    _max?: RadioAssignmentMaxAggregateInputType;
};
export type GetRadioAssignmentAggregateType<T extends RadioAssignmentAggregateArgs> = {
    [P in keyof T & keyof AggregateRadioAssignment]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRadioAssignment[P]> : Prisma.GetScalarType<T[P], AggregateRadioAssignment[P]>;
};
export type RadioAssignmentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioAssignmentWhereInput;
    orderBy?: Prisma.RadioAssignmentOrderByWithAggregationInput | Prisma.RadioAssignmentOrderByWithAggregationInput[];
    by: Prisma.RadioAssignmentScalarFieldEnum[] | Prisma.RadioAssignmentScalarFieldEnum;
    having?: Prisma.RadioAssignmentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RadioAssignmentCountAggregateInputType | true;
    _avg?: RadioAssignmentAvgAggregateInputType;
    _sum?: RadioAssignmentSumAggregateInputType;
    _min?: RadioAssignmentMinAggregateInputType;
    _max?: RadioAssignmentMaxAggregateInputType;
};
export type RadioAssignmentGroupByOutputType = {
    id: number;
    radioId: number;
    memberId: number;
    issuedAt: Date;
    returnedAt: Date | null;
    _count: RadioAssignmentCountAggregateOutputType | null;
    _avg: RadioAssignmentAvgAggregateOutputType | null;
    _sum: RadioAssignmentSumAggregateOutputType | null;
    _min: RadioAssignmentMinAggregateOutputType | null;
    _max: RadioAssignmentMaxAggregateOutputType | null;
};
export type GetRadioAssignmentGroupByPayload<T extends RadioAssignmentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RadioAssignmentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RadioAssignmentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RadioAssignmentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RadioAssignmentGroupByOutputType[P]>;
}>>;
export type RadioAssignmentWhereInput = {
    AND?: Prisma.RadioAssignmentWhereInput | Prisma.RadioAssignmentWhereInput[];
    OR?: Prisma.RadioAssignmentWhereInput[];
    NOT?: Prisma.RadioAssignmentWhereInput | Prisma.RadioAssignmentWhereInput[];
    id?: Prisma.IntFilter<"RadioAssignment"> | number;
    radioId?: Prisma.IntFilter<"RadioAssignment"> | number;
    memberId?: Prisma.IntFilter<"RadioAssignment"> | number;
    issuedAt?: Prisma.DateTimeFilter<"RadioAssignment"> | Date | string;
    returnedAt?: Prisma.DateTimeNullableFilter<"RadioAssignment"> | Date | string | null;
    radio?: Prisma.XOR<Prisma.RadioScalarRelationFilter, Prisma.RadioWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type RadioAssignmentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    returnedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    radio?: Prisma.RadioOrderByWithRelationInput;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type RadioAssignmentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.RadioAssignmentWhereInput | Prisma.RadioAssignmentWhereInput[];
    OR?: Prisma.RadioAssignmentWhereInput[];
    NOT?: Prisma.RadioAssignmentWhereInput | Prisma.RadioAssignmentWhereInput[];
    radioId?: Prisma.IntFilter<"RadioAssignment"> | number;
    memberId?: Prisma.IntFilter<"RadioAssignment"> | number;
    issuedAt?: Prisma.DateTimeFilter<"RadioAssignment"> | Date | string;
    returnedAt?: Prisma.DateTimeNullableFilter<"RadioAssignment"> | Date | string | null;
    radio?: Prisma.XOR<Prisma.RadioScalarRelationFilter, Prisma.RadioWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "id">;
export type RadioAssignmentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    returnedAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.RadioAssignmentCountOrderByAggregateInput;
    _avg?: Prisma.RadioAssignmentAvgOrderByAggregateInput;
    _max?: Prisma.RadioAssignmentMaxOrderByAggregateInput;
    _min?: Prisma.RadioAssignmentMinOrderByAggregateInput;
    _sum?: Prisma.RadioAssignmentSumOrderByAggregateInput;
};
export type RadioAssignmentScalarWhereWithAggregatesInput = {
    AND?: Prisma.RadioAssignmentScalarWhereWithAggregatesInput | Prisma.RadioAssignmentScalarWhereWithAggregatesInput[];
    OR?: Prisma.RadioAssignmentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RadioAssignmentScalarWhereWithAggregatesInput | Prisma.RadioAssignmentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"RadioAssignment"> | number;
    radioId?: Prisma.IntWithAggregatesFilter<"RadioAssignment"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"RadioAssignment"> | number;
    issuedAt?: Prisma.DateTimeWithAggregatesFilter<"RadioAssignment"> | Date | string;
    returnedAt?: Prisma.DateTimeNullableWithAggregatesFilter<"RadioAssignment"> | Date | string | null;
};
export type RadioAssignmentCreateInput = {
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
    radio: Prisma.RadioCreateNestedOneWithoutAssignmentsInput;
    member: Prisma.MemberCreateNestedOneWithoutRadioAssignmentsInput;
};
export type RadioAssignmentUncheckedCreateInput = {
    id?: number;
    radioId: number;
    memberId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentUpdateInput = {
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    radio?: Prisma.RadioUpdateOneRequiredWithoutAssignmentsNestedInput;
    member?: Prisma.MemberUpdateOneRequiredWithoutRadioAssignmentsNestedInput;
};
export type RadioAssignmentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    radioId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentCreateManyInput = {
    id?: number;
    radioId: number;
    memberId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentUpdateManyMutationInput = {
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    radioId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentListRelationFilter = {
    every?: Prisma.RadioAssignmentWhereInput;
    some?: Prisma.RadioAssignmentWhereInput;
    none?: Prisma.RadioAssignmentWhereInput;
};
export type RadioAssignmentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type RadioAssignmentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    returnedAt?: Prisma.SortOrder;
};
export type RadioAssignmentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type RadioAssignmentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    returnedAt?: Prisma.SortOrder;
};
export type RadioAssignmentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    issuedAt?: Prisma.SortOrder;
    returnedAt?: Prisma.SortOrder;
};
export type RadioAssignmentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    radioId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type RadioAssignmentCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput> | Prisma.RadioAssignmentCreateWithoutMemberInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput | Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.RadioAssignmentCreateManyMemberInputEnvelope;
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
};
export type RadioAssignmentUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput> | Prisma.RadioAssignmentCreateWithoutMemberInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput | Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.RadioAssignmentCreateManyMemberInputEnvelope;
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
};
export type RadioAssignmentUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput> | Prisma.RadioAssignmentCreateWithoutMemberInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput | Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutMemberInput | Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.RadioAssignmentCreateManyMemberInputEnvelope;
    set?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    disconnect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    delete?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    update?: Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutMemberInput | Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.RadioAssignmentUpdateManyWithWhereWithoutMemberInput | Prisma.RadioAssignmentUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
};
export type RadioAssignmentUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput> | Prisma.RadioAssignmentCreateWithoutMemberInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput | Prisma.RadioAssignmentCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutMemberInput | Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.RadioAssignmentCreateManyMemberInputEnvelope;
    set?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    disconnect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    delete?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    update?: Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutMemberInput | Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.RadioAssignmentUpdateManyWithWhereWithoutMemberInput | Prisma.RadioAssignmentUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
};
export type RadioAssignmentCreateNestedManyWithoutRadioInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput> | Prisma.RadioAssignmentCreateWithoutRadioInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput | Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput[];
    createMany?: Prisma.RadioAssignmentCreateManyRadioInputEnvelope;
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
};
export type RadioAssignmentUncheckedCreateNestedManyWithoutRadioInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput> | Prisma.RadioAssignmentCreateWithoutRadioInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput | Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput[];
    createMany?: Prisma.RadioAssignmentCreateManyRadioInputEnvelope;
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
};
export type RadioAssignmentUpdateManyWithoutRadioNestedInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput> | Prisma.RadioAssignmentCreateWithoutRadioInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput | Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput[];
    upsert?: Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutRadioInput | Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutRadioInput[];
    createMany?: Prisma.RadioAssignmentCreateManyRadioInputEnvelope;
    set?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    disconnect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    delete?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    update?: Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutRadioInput | Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutRadioInput[];
    updateMany?: Prisma.RadioAssignmentUpdateManyWithWhereWithoutRadioInput | Prisma.RadioAssignmentUpdateManyWithWhereWithoutRadioInput[];
    deleteMany?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
};
export type RadioAssignmentUncheckedUpdateManyWithoutRadioNestedInput = {
    create?: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput> | Prisma.RadioAssignmentCreateWithoutRadioInput[] | Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput[];
    connectOrCreate?: Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput | Prisma.RadioAssignmentCreateOrConnectWithoutRadioInput[];
    upsert?: Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutRadioInput | Prisma.RadioAssignmentUpsertWithWhereUniqueWithoutRadioInput[];
    createMany?: Prisma.RadioAssignmentCreateManyRadioInputEnvelope;
    set?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    disconnect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    delete?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    connect?: Prisma.RadioAssignmentWhereUniqueInput | Prisma.RadioAssignmentWhereUniqueInput[];
    update?: Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutRadioInput | Prisma.RadioAssignmentUpdateWithWhereUniqueWithoutRadioInput[];
    updateMany?: Prisma.RadioAssignmentUpdateManyWithWhereWithoutRadioInput | Prisma.RadioAssignmentUpdateManyWithWhereWithoutRadioInput[];
    deleteMany?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
};
export type RadioAssignmentCreateWithoutMemberInput = {
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
    radio: Prisma.RadioCreateNestedOneWithoutAssignmentsInput;
};
export type RadioAssignmentUncheckedCreateWithoutMemberInput = {
    id?: number;
    radioId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentCreateOrConnectWithoutMemberInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput>;
};
export type RadioAssignmentCreateManyMemberInputEnvelope = {
    data: Prisma.RadioAssignmentCreateManyMemberInput | Prisma.RadioAssignmentCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type RadioAssignmentUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.RadioAssignmentUpdateWithoutMemberInput, Prisma.RadioAssignmentUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutMemberInput, Prisma.RadioAssignmentUncheckedCreateWithoutMemberInput>;
};
export type RadioAssignmentUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateWithoutMemberInput, Prisma.RadioAssignmentUncheckedUpdateWithoutMemberInput>;
};
export type RadioAssignmentUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.RadioAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateManyMutationInput, Prisma.RadioAssignmentUncheckedUpdateManyWithoutMemberInput>;
};
export type RadioAssignmentScalarWhereInput = {
    AND?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
    OR?: Prisma.RadioAssignmentScalarWhereInput[];
    NOT?: Prisma.RadioAssignmentScalarWhereInput | Prisma.RadioAssignmentScalarWhereInput[];
    id?: Prisma.IntFilter<"RadioAssignment"> | number;
    radioId?: Prisma.IntFilter<"RadioAssignment"> | number;
    memberId?: Prisma.IntFilter<"RadioAssignment"> | number;
    issuedAt?: Prisma.DateTimeFilter<"RadioAssignment"> | Date | string;
    returnedAt?: Prisma.DateTimeNullableFilter<"RadioAssignment"> | Date | string | null;
};
export type RadioAssignmentCreateWithoutRadioInput = {
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutRadioAssignmentsInput;
};
export type RadioAssignmentUncheckedCreateWithoutRadioInput = {
    id?: number;
    memberId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentCreateOrConnectWithoutRadioInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput>;
};
export type RadioAssignmentCreateManyRadioInputEnvelope = {
    data: Prisma.RadioAssignmentCreateManyRadioInput | Prisma.RadioAssignmentCreateManyRadioInput[];
    skipDuplicates?: boolean;
};
export type RadioAssignmentUpsertWithWhereUniqueWithoutRadioInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    update: Prisma.XOR<Prisma.RadioAssignmentUpdateWithoutRadioInput, Prisma.RadioAssignmentUncheckedUpdateWithoutRadioInput>;
    create: Prisma.XOR<Prisma.RadioAssignmentCreateWithoutRadioInput, Prisma.RadioAssignmentUncheckedCreateWithoutRadioInput>;
};
export type RadioAssignmentUpdateWithWhereUniqueWithoutRadioInput = {
    where: Prisma.RadioAssignmentWhereUniqueInput;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateWithoutRadioInput, Prisma.RadioAssignmentUncheckedUpdateWithoutRadioInput>;
};
export type RadioAssignmentUpdateManyWithWhereWithoutRadioInput = {
    where: Prisma.RadioAssignmentScalarWhereInput;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateManyMutationInput, Prisma.RadioAssignmentUncheckedUpdateManyWithoutRadioInput>;
};
export type RadioAssignmentCreateManyMemberInput = {
    id?: number;
    radioId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentUpdateWithoutMemberInput = {
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    radio?: Prisma.RadioUpdateOneRequiredWithoutAssignmentsNestedInput;
};
export type RadioAssignmentUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    radioId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    radioId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentCreateManyRadioInput = {
    id?: number;
    memberId: number;
    issuedAt?: Date | string;
    returnedAt?: Date | string | null;
};
export type RadioAssignmentUpdateWithoutRadioInput = {
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutRadioAssignmentsNestedInput;
};
export type RadioAssignmentUncheckedUpdateWithoutRadioInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentUncheckedUpdateManyWithoutRadioInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    issuedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    returnedAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type RadioAssignmentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    radioId?: boolean;
    memberId?: boolean;
    issuedAt?: boolean;
    returnedAt?: boolean;
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["radioAssignment"]>;
export type RadioAssignmentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    radioId?: boolean;
    memberId?: boolean;
    issuedAt?: boolean;
    returnedAt?: boolean;
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["radioAssignment"]>;
export type RadioAssignmentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    radioId?: boolean;
    memberId?: boolean;
    issuedAt?: boolean;
    returnedAt?: boolean;
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["radioAssignment"]>;
export type RadioAssignmentSelectScalar = {
    id?: boolean;
    radioId?: boolean;
    memberId?: boolean;
    issuedAt?: boolean;
    returnedAt?: boolean;
};
export type RadioAssignmentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "radioId" | "memberId" | "issuedAt" | "returnedAt", ExtArgs["result"]["radioAssignment"]>;
export type RadioAssignmentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type RadioAssignmentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type RadioAssignmentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    radio?: boolean | Prisma.RadioDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $RadioAssignmentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "RadioAssignment";
    objects: {
        radio: Prisma.$RadioPayload<ExtArgs>;
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        radioId: number;
        memberId: number;
        issuedAt: Date;
        returnedAt: Date | null;
    }, ExtArgs["result"]["radioAssignment"]>;
    composites: {};
};
export type RadioAssignmentGetPayload<S extends boolean | null | undefined | RadioAssignmentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload, S>;
export type RadioAssignmentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RadioAssignmentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RadioAssignmentCountAggregateInputType | true;
};
export interface RadioAssignmentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['RadioAssignment'];
        meta: {
            name: 'RadioAssignment';
        };
    };
    findUnique<T extends RadioAssignmentFindUniqueArgs>(args: Prisma.SelectSubset<T, RadioAssignmentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RadioAssignmentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RadioAssignmentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RadioAssignmentFindFirstArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentFindFirstArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RadioAssignmentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RadioAssignmentFindManyArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RadioAssignmentCreateArgs>(args: Prisma.SelectSubset<T, RadioAssignmentCreateArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RadioAssignmentCreateManyArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RadioAssignmentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RadioAssignmentDeleteArgs>(args: Prisma.SelectSubset<T, RadioAssignmentDeleteArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RadioAssignmentUpdateArgs>(args: Prisma.SelectSubset<T, RadioAssignmentUpdateArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RadioAssignmentDeleteManyArgs>(args?: Prisma.SelectSubset<T, RadioAssignmentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RadioAssignmentUpdateManyArgs>(args: Prisma.SelectSubset<T, RadioAssignmentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RadioAssignmentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RadioAssignmentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RadioAssignmentUpsertArgs>(args: Prisma.SelectSubset<T, RadioAssignmentUpsertArgs<ExtArgs>>): Prisma.Prisma__RadioAssignmentClient<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RadioAssignmentCountArgs>(args?: Prisma.Subset<T, RadioAssignmentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RadioAssignmentCountAggregateOutputType> : number>;
    aggregate<T extends RadioAssignmentAggregateArgs>(args: Prisma.Subset<T, RadioAssignmentAggregateArgs>): Prisma.PrismaPromise<GetRadioAssignmentAggregateType<T>>;
    groupBy<T extends RadioAssignmentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RadioAssignmentGroupByArgs['orderBy'];
    } : {
        orderBy?: RadioAssignmentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RadioAssignmentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRadioAssignmentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RadioAssignmentFieldRefs;
}
export interface Prisma__RadioAssignmentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    radio<T extends Prisma.RadioDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RadioDefaultArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RadioAssignmentFieldRefs {
    readonly id: Prisma.FieldRef<"RadioAssignment", 'Int'>;
    readonly radioId: Prisma.FieldRef<"RadioAssignment", 'Int'>;
    readonly memberId: Prisma.FieldRef<"RadioAssignment", 'Int'>;
    readonly issuedAt: Prisma.FieldRef<"RadioAssignment", 'DateTime'>;
    readonly returnedAt: Prisma.FieldRef<"RadioAssignment", 'DateTime'>;
}
export type RadioAssignmentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where: Prisma.RadioAssignmentWhereUniqueInput;
};
export type RadioAssignmentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where: Prisma.RadioAssignmentWhereUniqueInput;
};
export type RadioAssignmentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where?: Prisma.RadioAssignmentWhereInput;
    orderBy?: Prisma.RadioAssignmentOrderByWithRelationInput | Prisma.RadioAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.RadioAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioAssignmentScalarFieldEnum | Prisma.RadioAssignmentScalarFieldEnum[];
};
export type RadioAssignmentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where?: Prisma.RadioAssignmentWhereInput;
    orderBy?: Prisma.RadioAssignmentOrderByWithRelationInput | Prisma.RadioAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.RadioAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioAssignmentScalarFieldEnum | Prisma.RadioAssignmentScalarFieldEnum[];
};
export type RadioAssignmentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where?: Prisma.RadioAssignmentWhereInput;
    orderBy?: Prisma.RadioAssignmentOrderByWithRelationInput | Prisma.RadioAssignmentOrderByWithRelationInput[];
    cursor?: Prisma.RadioAssignmentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioAssignmentScalarFieldEnum | Prisma.RadioAssignmentScalarFieldEnum[];
};
export type RadioAssignmentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioAssignmentCreateInput, Prisma.RadioAssignmentUncheckedCreateInput>;
};
export type RadioAssignmentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RadioAssignmentCreateManyInput | Prisma.RadioAssignmentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RadioAssignmentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    data: Prisma.RadioAssignmentCreateManyInput | Prisma.RadioAssignmentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.RadioAssignmentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type RadioAssignmentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateInput, Prisma.RadioAssignmentUncheckedUpdateInput>;
    where: Prisma.RadioAssignmentWhereUniqueInput;
};
export type RadioAssignmentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateManyMutationInput, Prisma.RadioAssignmentUncheckedUpdateManyInput>;
    where?: Prisma.RadioAssignmentWhereInput;
    limit?: number;
};
export type RadioAssignmentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioAssignmentUpdateManyMutationInput, Prisma.RadioAssignmentUncheckedUpdateManyInput>;
    where?: Prisma.RadioAssignmentWhereInput;
    limit?: number;
    include?: Prisma.RadioAssignmentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type RadioAssignmentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where: Prisma.RadioAssignmentWhereUniqueInput;
    create: Prisma.XOR<Prisma.RadioAssignmentCreateInput, Prisma.RadioAssignmentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RadioAssignmentUpdateInput, Prisma.RadioAssignmentUncheckedUpdateInput>;
};
export type RadioAssignmentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
    where: Prisma.RadioAssignmentWhereUniqueInput;
};
export type RadioAssignmentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioAssignmentWhereInput;
    limit?: number;
};
export type RadioAssignmentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioAssignmentSelect<ExtArgs> | null;
    omit?: Prisma.RadioAssignmentOmit<ExtArgs> | null;
    include?: Prisma.RadioAssignmentInclude<ExtArgs> | null;
};
