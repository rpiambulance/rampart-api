import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventSignupModel = runtime.Types.Result.DefaultSelection<Prisma.$EventSignupPayload>;
export type AggregateEventSignup = {
    _count: EventSignupCountAggregateOutputType | null;
    _avg: EventSignupAvgAggregateOutputType | null;
    _sum: EventSignupSumAggregateOutputType | null;
    _min: EventSignupMinAggregateOutputType | null;
    _max: EventSignupMaxAggregateOutputType | null;
};
export type EventSignupAvgAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    memberId: number | null;
};
export type EventSignupSumAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    memberId: number | null;
};
export type EventSignupMinAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    memberId: number | null;
    position: string | null;
    createdAt: Date | null;
};
export type EventSignupMaxAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    memberId: number | null;
    position: string | null;
    createdAt: Date | null;
};
export type EventSignupCountAggregateOutputType = {
    id: number;
    eventId: number;
    memberId: number;
    position: number;
    createdAt: number;
    _all: number;
};
export type EventSignupAvgAggregateInputType = {
    id?: true;
    eventId?: true;
    memberId?: true;
};
export type EventSignupSumAggregateInputType = {
    id?: true;
    eventId?: true;
    memberId?: true;
};
export type EventSignupMinAggregateInputType = {
    id?: true;
    eventId?: true;
    memberId?: true;
    position?: true;
    createdAt?: true;
};
export type EventSignupMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    memberId?: true;
    position?: true;
    createdAt?: true;
};
export type EventSignupCountAggregateInputType = {
    id?: true;
    eventId?: true;
    memberId?: true;
    position?: true;
    createdAt?: true;
    _all?: true;
};
export type EventSignupAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithRelationInput | Prisma.EventSignupOrderByWithRelationInput[];
    cursor?: Prisma.EventSignupWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventSignupCountAggregateInputType;
    _avg?: EventSignupAvgAggregateInputType;
    _sum?: EventSignupSumAggregateInputType;
    _min?: EventSignupMinAggregateInputType;
    _max?: EventSignupMaxAggregateInputType;
};
export type GetEventSignupAggregateType<T extends EventSignupAggregateArgs> = {
    [P in keyof T & keyof AggregateEventSignup]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEventSignup[P]> : Prisma.GetScalarType<T[P], AggregateEventSignup[P]>;
};
export type EventSignupGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithAggregationInput | Prisma.EventSignupOrderByWithAggregationInput[];
    by: Prisma.EventSignupScalarFieldEnum[] | Prisma.EventSignupScalarFieldEnum;
    having?: Prisma.EventSignupScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventSignupCountAggregateInputType | true;
    _avg?: EventSignupAvgAggregateInputType;
    _sum?: EventSignupSumAggregateInputType;
    _min?: EventSignupMinAggregateInputType;
    _max?: EventSignupMaxAggregateInputType;
};
export type EventSignupGroupByOutputType = {
    id: number;
    eventId: number;
    memberId: number;
    position: string | null;
    createdAt: Date;
    _count: EventSignupCountAggregateOutputType | null;
    _avg: EventSignupAvgAggregateOutputType | null;
    _sum: EventSignupSumAggregateOutputType | null;
    _min: EventSignupMinAggregateOutputType | null;
    _max: EventSignupMaxAggregateOutputType | null;
};
export type GetEventSignupGroupByPayload<T extends EventSignupGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventSignupGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventSignupGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventSignupGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventSignupGroupByOutputType[P]>;
}>>;
export type EventSignupWhereInput = {
    AND?: Prisma.EventSignupWhereInput | Prisma.EventSignupWhereInput[];
    OR?: Prisma.EventSignupWhereInput[];
    NOT?: Prisma.EventSignupWhereInput | Prisma.EventSignupWhereInput[];
    id?: Prisma.IntFilter<"EventSignup"> | number;
    eventId?: Prisma.IntFilter<"EventSignup"> | number;
    memberId?: Prisma.IntFilter<"EventSignup"> | number;
    position?: Prisma.StringNullableFilter<"EventSignup"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventSignup"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type EventSignupOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type EventSignupWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    eventId_memberId?: Prisma.EventSignupEventIdMemberIdCompoundUniqueInput;
    AND?: Prisma.EventSignupWhereInput | Prisma.EventSignupWhereInput[];
    OR?: Prisma.EventSignupWhereInput[];
    NOT?: Prisma.EventSignupWhereInput | Prisma.EventSignupWhereInput[];
    eventId?: Prisma.IntFilter<"EventSignup"> | number;
    memberId?: Prisma.IntFilter<"EventSignup"> | number;
    position?: Prisma.StringNullableFilter<"EventSignup"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventSignup"> | Date | string;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "id" | "eventId_memberId">;
export type EventSignupOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    position?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.EventSignupCountOrderByAggregateInput;
    _avg?: Prisma.EventSignupAvgOrderByAggregateInput;
    _max?: Prisma.EventSignupMaxOrderByAggregateInput;
    _min?: Prisma.EventSignupMinOrderByAggregateInput;
    _sum?: Prisma.EventSignupSumOrderByAggregateInput;
};
export type EventSignupScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventSignupScalarWhereWithAggregatesInput | Prisma.EventSignupScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventSignupScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventSignupScalarWhereWithAggregatesInput | Prisma.EventSignupScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EventSignup"> | number;
    eventId?: Prisma.IntWithAggregatesFilter<"EventSignup"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"EventSignup"> | number;
    position?: Prisma.StringNullableWithAggregatesFilter<"EventSignup"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"EventSignup"> | Date | string;
};
export type EventSignupCreateInput = {
    position?: string | null;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutSignupsInput;
    member: Prisma.MemberCreateNestedOneWithoutEventSignupsInput;
};
export type EventSignupUncheckedCreateInput = {
    id?: number;
    eventId: number;
    memberId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupUpdateInput = {
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutSignupsNestedInput;
    member?: Prisma.MemberUpdateOneRequiredWithoutEventSignupsNestedInput;
};
export type EventSignupUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupCreateManyInput = {
    id?: number;
    eventId: number;
    memberId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupUpdateManyMutationInput = {
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupListRelationFilter = {
    every?: Prisma.EventSignupWhereInput;
    some?: Prisma.EventSignupWhereInput;
    none?: Prisma.EventSignupWhereInput;
};
export type EventSignupOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventSignupEventIdMemberIdCompoundUniqueInput = {
    eventId: number;
    memberId: number;
};
export type EventSignupCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventSignupAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type EventSignupMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventSignupMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type EventSignupSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type EventSignupCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput> | Prisma.EventSignupCreateWithoutMemberInput[] | Prisma.EventSignupUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutMemberInput | Prisma.EventSignupCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.EventSignupCreateManyMemberInputEnvelope;
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
};
export type EventSignupUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput> | Prisma.EventSignupCreateWithoutMemberInput[] | Prisma.EventSignupUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutMemberInput | Prisma.EventSignupCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.EventSignupCreateManyMemberInputEnvelope;
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
};
export type EventSignupUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput> | Prisma.EventSignupCreateWithoutMemberInput[] | Prisma.EventSignupUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutMemberInput | Prisma.EventSignupCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.EventSignupUpsertWithWhereUniqueWithoutMemberInput | Prisma.EventSignupUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.EventSignupCreateManyMemberInputEnvelope;
    set?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    disconnect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    delete?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    update?: Prisma.EventSignupUpdateWithWhereUniqueWithoutMemberInput | Prisma.EventSignupUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.EventSignupUpdateManyWithWhereWithoutMemberInput | Prisma.EventSignupUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
};
export type EventSignupUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput> | Prisma.EventSignupCreateWithoutMemberInput[] | Prisma.EventSignupUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutMemberInput | Prisma.EventSignupCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.EventSignupUpsertWithWhereUniqueWithoutMemberInput | Prisma.EventSignupUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.EventSignupCreateManyMemberInputEnvelope;
    set?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    disconnect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    delete?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    update?: Prisma.EventSignupUpdateWithWhereUniqueWithoutMemberInput | Prisma.EventSignupUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.EventSignupUpdateManyWithWhereWithoutMemberInput | Prisma.EventSignupUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
};
export type EventSignupCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput> | Prisma.EventSignupCreateWithoutEventInput[] | Prisma.EventSignupUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutEventInput | Prisma.EventSignupCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventSignupCreateManyEventInputEnvelope;
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
};
export type EventSignupUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput> | Prisma.EventSignupCreateWithoutEventInput[] | Prisma.EventSignupUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutEventInput | Prisma.EventSignupCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventSignupCreateManyEventInputEnvelope;
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
};
export type EventSignupUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput> | Prisma.EventSignupCreateWithoutEventInput[] | Prisma.EventSignupUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutEventInput | Prisma.EventSignupCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventSignupUpsertWithWhereUniqueWithoutEventInput | Prisma.EventSignupUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventSignupCreateManyEventInputEnvelope;
    set?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    disconnect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    delete?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    update?: Prisma.EventSignupUpdateWithWhereUniqueWithoutEventInput | Prisma.EventSignupUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventSignupUpdateManyWithWhereWithoutEventInput | Prisma.EventSignupUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
};
export type EventSignupUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput> | Prisma.EventSignupCreateWithoutEventInput[] | Prisma.EventSignupUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventSignupCreateOrConnectWithoutEventInput | Prisma.EventSignupCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventSignupUpsertWithWhereUniqueWithoutEventInput | Prisma.EventSignupUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventSignupCreateManyEventInputEnvelope;
    set?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    disconnect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    delete?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    connect?: Prisma.EventSignupWhereUniqueInput | Prisma.EventSignupWhereUniqueInput[];
    update?: Prisma.EventSignupUpdateWithWhereUniqueWithoutEventInput | Prisma.EventSignupUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventSignupUpdateManyWithWhereWithoutEventInput | Prisma.EventSignupUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
};
export type EventSignupCreateWithoutMemberInput = {
    position?: string | null;
    createdAt?: Date | string;
    event: Prisma.EventCreateNestedOneWithoutSignupsInput;
};
export type EventSignupUncheckedCreateWithoutMemberInput = {
    id?: number;
    eventId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupCreateOrConnectWithoutMemberInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput>;
};
export type EventSignupCreateManyMemberInputEnvelope = {
    data: Prisma.EventSignupCreateManyMemberInput | Prisma.EventSignupCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type EventSignupUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventSignupUpdateWithoutMemberInput, Prisma.EventSignupUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.EventSignupCreateWithoutMemberInput, Prisma.EventSignupUncheckedCreateWithoutMemberInput>;
};
export type EventSignupUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventSignupUpdateWithoutMemberInput, Prisma.EventSignupUncheckedUpdateWithoutMemberInput>;
};
export type EventSignupUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.EventSignupScalarWhereInput;
    data: Prisma.XOR<Prisma.EventSignupUpdateManyMutationInput, Prisma.EventSignupUncheckedUpdateManyWithoutMemberInput>;
};
export type EventSignupScalarWhereInput = {
    AND?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
    OR?: Prisma.EventSignupScalarWhereInput[];
    NOT?: Prisma.EventSignupScalarWhereInput | Prisma.EventSignupScalarWhereInput[];
    id?: Prisma.IntFilter<"EventSignup"> | number;
    eventId?: Prisma.IntFilter<"EventSignup"> | number;
    memberId?: Prisma.IntFilter<"EventSignup"> | number;
    position?: Prisma.StringNullableFilter<"EventSignup"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"EventSignup"> | Date | string;
};
export type EventSignupCreateWithoutEventInput = {
    position?: string | null;
    createdAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutEventSignupsInput;
};
export type EventSignupUncheckedCreateWithoutEventInput = {
    id?: number;
    memberId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupCreateOrConnectWithoutEventInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput>;
};
export type EventSignupCreateManyEventInputEnvelope = {
    data: Prisma.EventSignupCreateManyEventInput | Prisma.EventSignupCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type EventSignupUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventSignupUpdateWithoutEventInput, Prisma.EventSignupUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.EventSignupCreateWithoutEventInput, Prisma.EventSignupUncheckedCreateWithoutEventInput>;
};
export type EventSignupUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventSignupWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventSignupUpdateWithoutEventInput, Prisma.EventSignupUncheckedUpdateWithoutEventInput>;
};
export type EventSignupUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.EventSignupScalarWhereInput;
    data: Prisma.XOR<Prisma.EventSignupUpdateManyMutationInput, Prisma.EventSignupUncheckedUpdateManyWithoutEventInput>;
};
export type EventSignupCreateManyMemberInput = {
    id?: number;
    eventId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupUpdateWithoutMemberInput = {
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    event?: Prisma.EventUpdateOneRequiredWithoutSignupsNestedInput;
};
export type EventSignupUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupCreateManyEventInput = {
    id?: number;
    memberId: number;
    position?: string | null;
    createdAt?: Date | string;
};
export type EventSignupUpdateWithoutEventInput = {
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutEventSignupsNestedInput;
};
export type EventSignupUncheckedUpdateWithoutEventInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventSignupSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    memberId?: boolean;
    position?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventSignup"]>;
export type EventSignupSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    memberId?: boolean;
    position?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventSignup"]>;
export type EventSignupSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    memberId?: boolean;
    position?: boolean;
    createdAt?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventSignup"]>;
export type EventSignupSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    memberId?: boolean;
    position?: boolean;
    createdAt?: boolean;
};
export type EventSignupOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "memberId" | "position" | "createdAt", ExtArgs["result"]["eventSignup"]>;
export type EventSignupInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type EventSignupIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type EventSignupIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $EventSignupPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EventSignup";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        eventId: number;
        memberId: number;
        position: string | null;
        createdAt: Date;
    }, ExtArgs["result"]["eventSignup"]>;
    composites: {};
};
export type EventSignupGetPayload<S extends boolean | null | undefined | EventSignupDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventSignupPayload, S>;
export type EventSignupCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventSignupFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventSignupCountAggregateInputType | true;
};
export interface EventSignupDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EventSignup'];
        meta: {
            name: 'EventSignup';
        };
    };
    findUnique<T extends EventSignupFindUniqueArgs>(args: Prisma.SelectSubset<T, EventSignupFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventSignupFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventSignupFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventSignupFindFirstArgs>(args?: Prisma.SelectSubset<T, EventSignupFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventSignupFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventSignupFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventSignupFindManyArgs>(args?: Prisma.SelectSubset<T, EventSignupFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventSignupCreateArgs>(args: Prisma.SelectSubset<T, EventSignupCreateArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventSignupCreateManyArgs>(args?: Prisma.SelectSubset<T, EventSignupCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventSignupCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventSignupCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventSignupDeleteArgs>(args: Prisma.SelectSubset<T, EventSignupDeleteArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventSignupUpdateArgs>(args: Prisma.SelectSubset<T, EventSignupUpdateArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventSignupDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventSignupDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventSignupUpdateManyArgs>(args: Prisma.SelectSubset<T, EventSignupUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventSignupUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventSignupUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventSignupUpsertArgs>(args: Prisma.SelectSubset<T, EventSignupUpsertArgs<ExtArgs>>): Prisma.Prisma__EventSignupClient<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventSignupCountArgs>(args?: Prisma.Subset<T, EventSignupCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventSignupCountAggregateOutputType> : number>;
    aggregate<T extends EventSignupAggregateArgs>(args: Prisma.Subset<T, EventSignupAggregateArgs>): Prisma.PrismaPromise<GetEventSignupAggregateType<T>>;
    groupBy<T extends EventSignupGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventSignupGroupByArgs['orderBy'];
    } : {
        orderBy?: EventSignupGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventSignupGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventSignupGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventSignupFieldRefs;
}
export interface Prisma__EventSignupClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventSignupFieldRefs {
    readonly id: Prisma.FieldRef<"EventSignup", 'Int'>;
    readonly eventId: Prisma.FieldRef<"EventSignup", 'Int'>;
    readonly memberId: Prisma.FieldRef<"EventSignup", 'Int'>;
    readonly position: Prisma.FieldRef<"EventSignup", 'String'>;
    readonly createdAt: Prisma.FieldRef<"EventSignup", 'DateTime'>;
}
export type EventSignupFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where: Prisma.EventSignupWhereUniqueInput;
};
export type EventSignupFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where: Prisma.EventSignupWhereUniqueInput;
};
export type EventSignupFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithRelationInput | Prisma.EventSignupOrderByWithRelationInput[];
    cursor?: Prisma.EventSignupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventSignupScalarFieldEnum | Prisma.EventSignupScalarFieldEnum[];
};
export type EventSignupFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithRelationInput | Prisma.EventSignupOrderByWithRelationInput[];
    cursor?: Prisma.EventSignupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventSignupScalarFieldEnum | Prisma.EventSignupScalarFieldEnum[];
};
export type EventSignupFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithRelationInput | Prisma.EventSignupOrderByWithRelationInput[];
    cursor?: Prisma.EventSignupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventSignupScalarFieldEnum | Prisma.EventSignupScalarFieldEnum[];
};
export type EventSignupCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventSignupCreateInput, Prisma.EventSignupUncheckedCreateInput>;
};
export type EventSignupCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventSignupCreateManyInput | Prisma.EventSignupCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventSignupCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    data: Prisma.EventSignupCreateManyInput | Prisma.EventSignupCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventSignupIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventSignupUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventSignupUpdateInput, Prisma.EventSignupUncheckedUpdateInput>;
    where: Prisma.EventSignupWhereUniqueInput;
};
export type EventSignupUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventSignupUpdateManyMutationInput, Prisma.EventSignupUncheckedUpdateManyInput>;
    where?: Prisma.EventSignupWhereInput;
    limit?: number;
};
export type EventSignupUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventSignupUpdateManyMutationInput, Prisma.EventSignupUncheckedUpdateManyInput>;
    where?: Prisma.EventSignupWhereInput;
    limit?: number;
    include?: Prisma.EventSignupIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventSignupUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where: Prisma.EventSignupWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventSignupCreateInput, Prisma.EventSignupUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventSignupUpdateInput, Prisma.EventSignupUncheckedUpdateInput>;
};
export type EventSignupDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where: Prisma.EventSignupWhereUniqueInput;
};
export type EventSignupDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventSignupWhereInput;
    limit?: number;
};
export type EventSignupDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
};
