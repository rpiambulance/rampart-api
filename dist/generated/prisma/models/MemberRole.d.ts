import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type MemberRoleModel = runtime.Types.Result.DefaultSelection<Prisma.$MemberRolePayload>;
export type AggregateMemberRole = {
    _count: MemberRoleCountAggregateOutputType | null;
    _avg: MemberRoleAvgAggregateOutputType | null;
    _sum: MemberRoleSumAggregateOutputType | null;
    _min: MemberRoleMinAggregateOutputType | null;
    _max: MemberRoleMaxAggregateOutputType | null;
};
export type MemberRoleAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    roleId: number | null;
};
export type MemberRoleSumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    roleId: number | null;
};
export type MemberRoleMinAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    roleId: number | null;
    startDate: Date | null;
    endDate: Date | null;
};
export type MemberRoleMaxAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    roleId: number | null;
    startDate: Date | null;
    endDate: Date | null;
};
export type MemberRoleCountAggregateOutputType = {
    id: number;
    memberId: number;
    roleId: number;
    startDate: number;
    endDate: number;
    _all: number;
};
export type MemberRoleAvgAggregateInputType = {
    id?: true;
    memberId?: true;
    roleId?: true;
};
export type MemberRoleSumAggregateInputType = {
    id?: true;
    memberId?: true;
    roleId?: true;
};
export type MemberRoleMinAggregateInputType = {
    id?: true;
    memberId?: true;
    roleId?: true;
    startDate?: true;
    endDate?: true;
};
export type MemberRoleMaxAggregateInputType = {
    id?: true;
    memberId?: true;
    roleId?: true;
    startDate?: true;
    endDate?: true;
};
export type MemberRoleCountAggregateInputType = {
    id?: true;
    memberId?: true;
    roleId?: true;
    startDate?: true;
    endDate?: true;
    _all?: true;
};
export type MemberRoleAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberRoleWhereInput;
    orderBy?: Prisma.MemberRoleOrderByWithRelationInput | Prisma.MemberRoleOrderByWithRelationInput[];
    cursor?: Prisma.MemberRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | MemberRoleCountAggregateInputType;
    _avg?: MemberRoleAvgAggregateInputType;
    _sum?: MemberRoleSumAggregateInputType;
    _min?: MemberRoleMinAggregateInputType;
    _max?: MemberRoleMaxAggregateInputType;
};
export type GetMemberRoleAggregateType<T extends MemberRoleAggregateArgs> = {
    [P in keyof T & keyof AggregateMemberRole]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateMemberRole[P]> : Prisma.GetScalarType<T[P], AggregateMemberRole[P]>;
};
export type MemberRoleGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberRoleWhereInput;
    orderBy?: Prisma.MemberRoleOrderByWithAggregationInput | Prisma.MemberRoleOrderByWithAggregationInput[];
    by: Prisma.MemberRoleScalarFieldEnum[] | Prisma.MemberRoleScalarFieldEnum;
    having?: Prisma.MemberRoleScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: MemberRoleCountAggregateInputType | true;
    _avg?: MemberRoleAvgAggregateInputType;
    _sum?: MemberRoleSumAggregateInputType;
    _min?: MemberRoleMinAggregateInputType;
    _max?: MemberRoleMaxAggregateInputType;
};
export type MemberRoleGroupByOutputType = {
    id: number;
    memberId: number;
    roleId: number;
    startDate: Date;
    endDate: Date | null;
    _count: MemberRoleCountAggregateOutputType | null;
    _avg: MemberRoleAvgAggregateOutputType | null;
    _sum: MemberRoleSumAggregateOutputType | null;
    _min: MemberRoleMinAggregateOutputType | null;
    _max: MemberRoleMaxAggregateOutputType | null;
};
export type GetMemberRoleGroupByPayload<T extends MemberRoleGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<MemberRoleGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof MemberRoleGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], MemberRoleGroupByOutputType[P]> : Prisma.GetScalarType<T[P], MemberRoleGroupByOutputType[P]>;
}>>;
export type MemberRoleWhereInput = {
    AND?: Prisma.MemberRoleWhereInput | Prisma.MemberRoleWhereInput[];
    OR?: Prisma.MemberRoleWhereInput[];
    NOT?: Prisma.MemberRoleWhereInput | Prisma.MemberRoleWhereInput[];
    id?: Prisma.IntFilter<"MemberRole"> | number;
    memberId?: Prisma.IntFilter<"MemberRole"> | number;
    roleId?: Prisma.IntFilter<"MemberRole"> | number;
    startDate?: Prisma.DateTimeFilter<"MemberRole"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"MemberRole"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
};
export type MemberRoleOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
    role?: Prisma.RoleOrderByWithRelationInput;
};
export type MemberRoleWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.MemberRoleWhereInput | Prisma.MemberRoleWhereInput[];
    OR?: Prisma.MemberRoleWhereInput[];
    NOT?: Prisma.MemberRoleWhereInput | Prisma.MemberRoleWhereInput[];
    memberId?: Prisma.IntFilter<"MemberRole"> | number;
    roleId?: Prisma.IntFilter<"MemberRole"> | number;
    startDate?: Prisma.DateTimeFilter<"MemberRole"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"MemberRole"> | Date | string | null;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    role?: Prisma.XOR<Prisma.RoleScalarRelationFilter, Prisma.RoleWhereInput>;
}, "id">;
export type MemberRoleOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.MemberRoleCountOrderByAggregateInput;
    _avg?: Prisma.MemberRoleAvgOrderByAggregateInput;
    _max?: Prisma.MemberRoleMaxOrderByAggregateInput;
    _min?: Prisma.MemberRoleMinOrderByAggregateInput;
    _sum?: Prisma.MemberRoleSumOrderByAggregateInput;
};
export type MemberRoleScalarWhereWithAggregatesInput = {
    AND?: Prisma.MemberRoleScalarWhereWithAggregatesInput | Prisma.MemberRoleScalarWhereWithAggregatesInput[];
    OR?: Prisma.MemberRoleScalarWhereWithAggregatesInput[];
    NOT?: Prisma.MemberRoleScalarWhereWithAggregatesInput | Prisma.MemberRoleScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"MemberRole"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"MemberRole"> | number;
    roleId?: Prisma.IntWithAggregatesFilter<"MemberRole"> | number;
    startDate?: Prisma.DateTimeWithAggregatesFilter<"MemberRole"> | Date | string;
    endDate?: Prisma.DateTimeNullableWithAggregatesFilter<"MemberRole"> | Date | string | null;
};
export type MemberRoleCreateInput = {
    startDate: Date | string;
    endDate?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutRolesInput;
    role: Prisma.RoleCreateNestedOneWithoutMembersInput;
};
export type MemberRoleUncheckedCreateInput = {
    id?: number;
    memberId: number;
    roleId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleUpdateInput = {
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutRolesNestedInput;
    role?: Prisma.RoleUpdateOneRequiredWithoutMembersNestedInput;
};
export type MemberRoleUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    roleId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleCreateManyInput = {
    id?: number;
    memberId: number;
    roleId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleUpdateManyMutationInput = {
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    roleId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleListRelationFilter = {
    every?: Prisma.MemberRoleWhereInput;
    some?: Prisma.MemberRoleWhereInput;
    none?: Prisma.MemberRoleWhereInput;
};
export type MemberRoleOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type MemberRoleCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
};
export type MemberRoleAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
};
export type MemberRoleMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
};
export type MemberRoleMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
    startDate?: Prisma.SortOrder;
    endDate?: Prisma.SortOrder;
};
export type MemberRoleSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    roleId?: Prisma.SortOrder;
};
export type MemberRoleCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput> | Prisma.MemberRoleCreateWithoutMemberInput[] | Prisma.MemberRoleUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutMemberInput | Prisma.MemberRoleCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberRoleCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
};
export type MemberRoleUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput> | Prisma.MemberRoleCreateWithoutMemberInput[] | Prisma.MemberRoleUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutMemberInput | Prisma.MemberRoleCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.MemberRoleCreateManyMemberInputEnvelope;
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
};
export type MemberRoleUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput> | Prisma.MemberRoleCreateWithoutMemberInput[] | Prisma.MemberRoleUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutMemberInput | Prisma.MemberRoleCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberRoleUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberRoleUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberRoleCreateManyMemberInputEnvelope;
    set?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    disconnect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    delete?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    update?: Prisma.MemberRoleUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberRoleUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberRoleUpdateManyWithWhereWithoutMemberInput | Prisma.MemberRoleUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
};
export type MemberRoleUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput> | Prisma.MemberRoleCreateWithoutMemberInput[] | Prisma.MemberRoleUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutMemberInput | Prisma.MemberRoleCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.MemberRoleUpsertWithWhereUniqueWithoutMemberInput | Prisma.MemberRoleUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.MemberRoleCreateManyMemberInputEnvelope;
    set?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    disconnect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    delete?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    update?: Prisma.MemberRoleUpdateWithWhereUniqueWithoutMemberInput | Prisma.MemberRoleUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.MemberRoleUpdateManyWithWhereWithoutMemberInput | Prisma.MemberRoleUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
};
export type MemberRoleCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput> | Prisma.MemberRoleCreateWithoutRoleInput[] | Prisma.MemberRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutRoleInput | Prisma.MemberRoleCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.MemberRoleCreateManyRoleInputEnvelope;
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
};
export type MemberRoleUncheckedCreateNestedManyWithoutRoleInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput> | Prisma.MemberRoleCreateWithoutRoleInput[] | Prisma.MemberRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutRoleInput | Prisma.MemberRoleCreateOrConnectWithoutRoleInput[];
    createMany?: Prisma.MemberRoleCreateManyRoleInputEnvelope;
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
};
export type MemberRoleUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput> | Prisma.MemberRoleCreateWithoutRoleInput[] | Prisma.MemberRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutRoleInput | Prisma.MemberRoleCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.MemberRoleUpsertWithWhereUniqueWithoutRoleInput | Prisma.MemberRoleUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.MemberRoleCreateManyRoleInputEnvelope;
    set?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    disconnect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    delete?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    update?: Prisma.MemberRoleUpdateWithWhereUniqueWithoutRoleInput | Prisma.MemberRoleUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.MemberRoleUpdateManyWithWhereWithoutRoleInput | Prisma.MemberRoleUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
};
export type MemberRoleUncheckedUpdateManyWithoutRoleNestedInput = {
    create?: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput> | Prisma.MemberRoleCreateWithoutRoleInput[] | Prisma.MemberRoleUncheckedCreateWithoutRoleInput[];
    connectOrCreate?: Prisma.MemberRoleCreateOrConnectWithoutRoleInput | Prisma.MemberRoleCreateOrConnectWithoutRoleInput[];
    upsert?: Prisma.MemberRoleUpsertWithWhereUniqueWithoutRoleInput | Prisma.MemberRoleUpsertWithWhereUniqueWithoutRoleInput[];
    createMany?: Prisma.MemberRoleCreateManyRoleInputEnvelope;
    set?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    disconnect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    delete?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    connect?: Prisma.MemberRoleWhereUniqueInput | Prisma.MemberRoleWhereUniqueInput[];
    update?: Prisma.MemberRoleUpdateWithWhereUniqueWithoutRoleInput | Prisma.MemberRoleUpdateWithWhereUniqueWithoutRoleInput[];
    updateMany?: Prisma.MemberRoleUpdateManyWithWhereWithoutRoleInput | Prisma.MemberRoleUpdateManyWithWhereWithoutRoleInput[];
    deleteMany?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
};
export type MemberRoleCreateWithoutMemberInput = {
    startDate: Date | string;
    endDate?: Date | string | null;
    role: Prisma.RoleCreateNestedOneWithoutMembersInput;
};
export type MemberRoleUncheckedCreateWithoutMemberInput = {
    id?: number;
    roleId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleCreateOrConnectWithoutMemberInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput>;
};
export type MemberRoleCreateManyMemberInputEnvelope = {
    data: Prisma.MemberRoleCreateManyMemberInput | Prisma.MemberRoleCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type MemberRoleUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberRoleUpdateWithoutMemberInput, Prisma.MemberRoleUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.MemberRoleCreateWithoutMemberInput, Prisma.MemberRoleUncheckedCreateWithoutMemberInput>;
};
export type MemberRoleUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberRoleUpdateWithoutMemberInput, Prisma.MemberRoleUncheckedUpdateWithoutMemberInput>;
};
export type MemberRoleUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.MemberRoleScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberRoleUpdateManyMutationInput, Prisma.MemberRoleUncheckedUpdateManyWithoutMemberInput>;
};
export type MemberRoleScalarWhereInput = {
    AND?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
    OR?: Prisma.MemberRoleScalarWhereInput[];
    NOT?: Prisma.MemberRoleScalarWhereInput | Prisma.MemberRoleScalarWhereInput[];
    id?: Prisma.IntFilter<"MemberRole"> | number;
    memberId?: Prisma.IntFilter<"MemberRole"> | number;
    roleId?: Prisma.IntFilter<"MemberRole"> | number;
    startDate?: Prisma.DateTimeFilter<"MemberRole"> | Date | string;
    endDate?: Prisma.DateTimeNullableFilter<"MemberRole"> | Date | string | null;
};
export type MemberRoleCreateWithoutRoleInput = {
    startDate: Date | string;
    endDate?: Date | string | null;
    member: Prisma.MemberCreateNestedOneWithoutRolesInput;
};
export type MemberRoleUncheckedCreateWithoutRoleInput = {
    id?: number;
    memberId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleCreateOrConnectWithoutRoleInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput>;
};
export type MemberRoleCreateManyRoleInputEnvelope = {
    data: Prisma.MemberRoleCreateManyRoleInput | Prisma.MemberRoleCreateManyRoleInput[];
    skipDuplicates?: boolean;
};
export type MemberRoleUpsertWithWhereUniqueWithoutRoleInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    update: Prisma.XOR<Prisma.MemberRoleUpdateWithoutRoleInput, Prisma.MemberRoleUncheckedUpdateWithoutRoleInput>;
    create: Prisma.XOR<Prisma.MemberRoleCreateWithoutRoleInput, Prisma.MemberRoleUncheckedCreateWithoutRoleInput>;
};
export type MemberRoleUpdateWithWhereUniqueWithoutRoleInput = {
    where: Prisma.MemberRoleWhereUniqueInput;
    data: Prisma.XOR<Prisma.MemberRoleUpdateWithoutRoleInput, Prisma.MemberRoleUncheckedUpdateWithoutRoleInput>;
};
export type MemberRoleUpdateManyWithWhereWithoutRoleInput = {
    where: Prisma.MemberRoleScalarWhereInput;
    data: Prisma.XOR<Prisma.MemberRoleUpdateManyMutationInput, Prisma.MemberRoleUncheckedUpdateManyWithoutRoleInput>;
};
export type MemberRoleCreateManyMemberInput = {
    id?: number;
    roleId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleUpdateWithoutMemberInput = {
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    role?: Prisma.RoleUpdateOneRequiredWithoutMembersNestedInput;
};
export type MemberRoleUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roleId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    roleId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleCreateManyRoleInput = {
    id?: number;
    memberId: number;
    startDate: Date | string;
    endDate?: Date | string | null;
};
export type MemberRoleUpdateWithoutRoleInput = {
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    member?: Prisma.MemberUpdateOneRequiredWithoutRolesNestedInput;
};
export type MemberRoleUncheckedUpdateWithoutRoleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleUncheckedUpdateManyWithoutRoleInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    startDate?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endDate?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
};
export type MemberRoleSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    roleId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberRole"]>;
export type MemberRoleSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    roleId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberRole"]>;
export type MemberRoleSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    roleId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["memberRole"]>;
export type MemberRoleSelectScalar = {
    id?: boolean;
    memberId?: boolean;
    roleId?: boolean;
    startDate?: boolean;
    endDate?: boolean;
};
export type MemberRoleOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "memberId" | "roleId" | "startDate" | "endDate", ExtArgs["result"]["memberRole"]>;
export type MemberRoleInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type MemberRoleIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type MemberRoleIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    role?: boolean | Prisma.RoleDefaultArgs<ExtArgs>;
};
export type $MemberRolePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "MemberRole";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
        role: Prisma.$RolePayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        memberId: number;
        roleId: number;
        startDate: Date;
        endDate: Date | null;
    }, ExtArgs["result"]["memberRole"]>;
    composites: {};
};
export type MemberRoleGetPayload<S extends boolean | null | undefined | MemberRoleDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$MemberRolePayload, S>;
export type MemberRoleCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<MemberRoleFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: MemberRoleCountAggregateInputType | true;
};
export interface MemberRoleDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['MemberRole'];
        meta: {
            name: 'MemberRole';
        };
    };
    findUnique<T extends MemberRoleFindUniqueArgs>(args: Prisma.SelectSubset<T, MemberRoleFindUniqueArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends MemberRoleFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, MemberRoleFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends MemberRoleFindFirstArgs>(args?: Prisma.SelectSubset<T, MemberRoleFindFirstArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends MemberRoleFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, MemberRoleFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends MemberRoleFindManyArgs>(args?: Prisma.SelectSubset<T, MemberRoleFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends MemberRoleCreateArgs>(args: Prisma.SelectSubset<T, MemberRoleCreateArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends MemberRoleCreateManyArgs>(args?: Prisma.SelectSubset<T, MemberRoleCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends MemberRoleCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, MemberRoleCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends MemberRoleDeleteArgs>(args: Prisma.SelectSubset<T, MemberRoleDeleteArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends MemberRoleUpdateArgs>(args: Prisma.SelectSubset<T, MemberRoleUpdateArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends MemberRoleDeleteManyArgs>(args?: Prisma.SelectSubset<T, MemberRoleDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends MemberRoleUpdateManyArgs>(args: Prisma.SelectSubset<T, MemberRoleUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends MemberRoleUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, MemberRoleUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends MemberRoleUpsertArgs>(args: Prisma.SelectSubset<T, MemberRoleUpsertArgs<ExtArgs>>): Prisma.Prisma__MemberRoleClient<runtime.Types.Result.GetResult<Prisma.$MemberRolePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends MemberRoleCountArgs>(args?: Prisma.Subset<T, MemberRoleCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], MemberRoleCountAggregateOutputType> : number>;
    aggregate<T extends MemberRoleAggregateArgs>(args: Prisma.Subset<T, MemberRoleAggregateArgs>): Prisma.PrismaPromise<GetMemberRoleAggregateType<T>>;
    groupBy<T extends MemberRoleGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: MemberRoleGroupByArgs['orderBy'];
    } : {
        orderBy?: MemberRoleGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, MemberRoleGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetMemberRoleGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: MemberRoleFieldRefs;
}
export interface Prisma__MemberRoleClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    role<T extends Prisma.RoleDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.RoleDefaultArgs<ExtArgs>>): Prisma.Prisma__RoleClient<runtime.Types.Result.GetResult<Prisma.$RolePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface MemberRoleFieldRefs {
    readonly id: Prisma.FieldRef<"MemberRole", 'Int'>;
    readonly memberId: Prisma.FieldRef<"MemberRole", 'Int'>;
    readonly roleId: Prisma.FieldRef<"MemberRole", 'Int'>;
    readonly startDate: Prisma.FieldRef<"MemberRole", 'DateTime'>;
    readonly endDate: Prisma.FieldRef<"MemberRole", 'DateTime'>;
}
export type MemberRoleFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where: Prisma.MemberRoleWhereUniqueInput;
};
export type MemberRoleFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where: Prisma.MemberRoleWhereUniqueInput;
};
export type MemberRoleFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where?: Prisma.MemberRoleWhereInput;
    orderBy?: Prisma.MemberRoleOrderByWithRelationInput | Prisma.MemberRoleOrderByWithRelationInput[];
    cursor?: Prisma.MemberRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberRoleScalarFieldEnum | Prisma.MemberRoleScalarFieldEnum[];
};
export type MemberRoleFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where?: Prisma.MemberRoleWhereInput;
    orderBy?: Prisma.MemberRoleOrderByWithRelationInput | Prisma.MemberRoleOrderByWithRelationInput[];
    cursor?: Prisma.MemberRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberRoleScalarFieldEnum | Prisma.MemberRoleScalarFieldEnum[];
};
export type MemberRoleFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where?: Prisma.MemberRoleWhereInput;
    orderBy?: Prisma.MemberRoleOrderByWithRelationInput | Prisma.MemberRoleOrderByWithRelationInput[];
    cursor?: Prisma.MemberRoleWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberRoleScalarFieldEnum | Prisma.MemberRoleScalarFieldEnum[];
};
export type MemberRoleCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberRoleCreateInput, Prisma.MemberRoleUncheckedCreateInput>;
};
export type MemberRoleCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.MemberRoleCreateManyInput | Prisma.MemberRoleCreateManyInput[];
    skipDuplicates?: boolean;
};
export type MemberRoleCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    data: Prisma.MemberRoleCreateManyInput | Prisma.MemberRoleCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.MemberRoleIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type MemberRoleUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberRoleUpdateInput, Prisma.MemberRoleUncheckedUpdateInput>;
    where: Prisma.MemberRoleWhereUniqueInput;
};
export type MemberRoleUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.MemberRoleUpdateManyMutationInput, Prisma.MemberRoleUncheckedUpdateManyInput>;
    where?: Prisma.MemberRoleWhereInput;
    limit?: number;
};
export type MemberRoleUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.MemberRoleUpdateManyMutationInput, Prisma.MemberRoleUncheckedUpdateManyInput>;
    where?: Prisma.MemberRoleWhereInput;
    limit?: number;
    include?: Prisma.MemberRoleIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type MemberRoleUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where: Prisma.MemberRoleWhereUniqueInput;
    create: Prisma.XOR<Prisma.MemberRoleCreateInput, Prisma.MemberRoleUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.MemberRoleUpdateInput, Prisma.MemberRoleUncheckedUpdateInput>;
};
export type MemberRoleDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
    where: Prisma.MemberRoleWhereUniqueInput;
};
export type MemberRoleDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberRoleWhereInput;
    limit?: number;
};
export type MemberRoleDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberRoleSelect<ExtArgs> | null;
    omit?: Prisma.MemberRoleOmit<ExtArgs> | null;
    include?: Prisma.MemberRoleInclude<ExtArgs> | null;
};
