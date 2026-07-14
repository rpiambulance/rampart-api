import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type ClassAttendanceModel = runtime.Types.Result.DefaultSelection<Prisma.$ClassAttendancePayload>;
export type AggregateClassAttendance = {
    _count: ClassAttendanceCountAggregateOutputType | null;
    _avg: ClassAttendanceAvgAggregateOutputType | null;
    _sum: ClassAttendanceSumAggregateOutputType | null;
    _min: ClassAttendanceMinAggregateOutputType | null;
    _max: ClassAttendanceMaxAggregateOutputType | null;
};
export type ClassAttendanceAvgAggregateOutputType = {
    classId: number | null;
    memberId: number | null;
};
export type ClassAttendanceSumAggregateOutputType = {
    classId: number | null;
    memberId: number | null;
};
export type ClassAttendanceMinAggregateOutputType = {
    classId: number | null;
    memberId: number | null;
    status: $Enums.AttendanceStatus | null;
};
export type ClassAttendanceMaxAggregateOutputType = {
    classId: number | null;
    memberId: number | null;
    status: $Enums.AttendanceStatus | null;
};
export type ClassAttendanceCountAggregateOutputType = {
    classId: number;
    memberId: number;
    status: number;
    _all: number;
};
export type ClassAttendanceAvgAggregateInputType = {
    classId?: true;
    memberId?: true;
};
export type ClassAttendanceSumAggregateInputType = {
    classId?: true;
    memberId?: true;
};
export type ClassAttendanceMinAggregateInputType = {
    classId?: true;
    memberId?: true;
    status?: true;
};
export type ClassAttendanceMaxAggregateInputType = {
    classId?: true;
    memberId?: true;
    status?: true;
};
export type ClassAttendanceCountAggregateInputType = {
    classId?: true;
    memberId?: true;
    status?: true;
    _all?: true;
};
export type ClassAttendanceAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithRelationInput | Prisma.ClassAttendanceOrderByWithRelationInput[];
    cursor?: Prisma.ClassAttendanceWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | ClassAttendanceCountAggregateInputType;
    _avg?: ClassAttendanceAvgAggregateInputType;
    _sum?: ClassAttendanceSumAggregateInputType;
    _min?: ClassAttendanceMinAggregateInputType;
    _max?: ClassAttendanceMaxAggregateInputType;
};
export type GetClassAttendanceAggregateType<T extends ClassAttendanceAggregateArgs> = {
    [P in keyof T & keyof AggregateClassAttendance]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateClassAttendance[P]> : Prisma.GetScalarType<T[P], AggregateClassAttendance[P]>;
};
export type ClassAttendanceGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithAggregationInput | Prisma.ClassAttendanceOrderByWithAggregationInput[];
    by: Prisma.ClassAttendanceScalarFieldEnum[] | Prisma.ClassAttendanceScalarFieldEnum;
    having?: Prisma.ClassAttendanceScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: ClassAttendanceCountAggregateInputType | true;
    _avg?: ClassAttendanceAvgAggregateInputType;
    _sum?: ClassAttendanceSumAggregateInputType;
    _min?: ClassAttendanceMinAggregateInputType;
    _max?: ClassAttendanceMaxAggregateInputType;
};
export type ClassAttendanceGroupByOutputType = {
    classId: number;
    memberId: number;
    status: $Enums.AttendanceStatus;
    _count: ClassAttendanceCountAggregateOutputType | null;
    _avg: ClassAttendanceAvgAggregateOutputType | null;
    _sum: ClassAttendanceSumAggregateOutputType | null;
    _min: ClassAttendanceMinAggregateOutputType | null;
    _max: ClassAttendanceMaxAggregateOutputType | null;
};
export type GetClassAttendanceGroupByPayload<T extends ClassAttendanceGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<ClassAttendanceGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof ClassAttendanceGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], ClassAttendanceGroupByOutputType[P]> : Prisma.GetScalarType<T[P], ClassAttendanceGroupByOutputType[P]>;
}>>;
export type ClassAttendanceWhereInput = {
    AND?: Prisma.ClassAttendanceWhereInput | Prisma.ClassAttendanceWhereInput[];
    OR?: Prisma.ClassAttendanceWhereInput[];
    NOT?: Prisma.ClassAttendanceWhereInput | Prisma.ClassAttendanceWhereInput[];
    classId?: Prisma.IntFilter<"ClassAttendance"> | number;
    memberId?: Prisma.IntFilter<"ClassAttendance"> | number;
    status?: Prisma.EnumAttendanceStatusFilter<"ClassAttendance"> | $Enums.AttendanceStatus;
    class?: Prisma.XOR<Prisma.TrainingClassScalarRelationFilter, Prisma.TrainingClassWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type ClassAttendanceOrderByWithRelationInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    class?: Prisma.TrainingClassOrderByWithRelationInput;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type ClassAttendanceWhereUniqueInput = Prisma.AtLeast<{
    classId_memberId?: Prisma.ClassAttendanceClassIdMemberIdCompoundUniqueInput;
    AND?: Prisma.ClassAttendanceWhereInput | Prisma.ClassAttendanceWhereInput[];
    OR?: Prisma.ClassAttendanceWhereInput[];
    NOT?: Prisma.ClassAttendanceWhereInput | Prisma.ClassAttendanceWhereInput[];
    classId?: Prisma.IntFilter<"ClassAttendance"> | number;
    memberId?: Prisma.IntFilter<"ClassAttendance"> | number;
    status?: Prisma.EnumAttendanceStatusFilter<"ClassAttendance"> | $Enums.AttendanceStatus;
    class?: Prisma.XOR<Prisma.TrainingClassScalarRelationFilter, Prisma.TrainingClassWhereInput>;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "classId_memberId">;
export type ClassAttendanceOrderByWithAggregationInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
    _count?: Prisma.ClassAttendanceCountOrderByAggregateInput;
    _avg?: Prisma.ClassAttendanceAvgOrderByAggregateInput;
    _max?: Prisma.ClassAttendanceMaxOrderByAggregateInput;
    _min?: Prisma.ClassAttendanceMinOrderByAggregateInput;
    _sum?: Prisma.ClassAttendanceSumOrderByAggregateInput;
};
export type ClassAttendanceScalarWhereWithAggregatesInput = {
    AND?: Prisma.ClassAttendanceScalarWhereWithAggregatesInput | Prisma.ClassAttendanceScalarWhereWithAggregatesInput[];
    OR?: Prisma.ClassAttendanceScalarWhereWithAggregatesInput[];
    NOT?: Prisma.ClassAttendanceScalarWhereWithAggregatesInput | Prisma.ClassAttendanceScalarWhereWithAggregatesInput[];
    classId?: Prisma.IntWithAggregatesFilter<"ClassAttendance"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"ClassAttendance"> | number;
    status?: Prisma.EnumAttendanceStatusWithAggregatesFilter<"ClassAttendance"> | $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateInput = {
    status?: $Enums.AttendanceStatus;
    class: Prisma.TrainingClassCreateNestedOneWithoutAttendanceInput;
    member: Prisma.MemberCreateNestedOneWithoutClassAttendanceInput;
};
export type ClassAttendanceUncheckedCreateInput = {
    classId: number;
    memberId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceUpdateInput = {
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
    class?: Prisma.TrainingClassUpdateOneRequiredWithoutAttendanceNestedInput;
    member?: Prisma.MemberUpdateOneRequiredWithoutClassAttendanceNestedInput;
};
export type ClassAttendanceUncheckedUpdateInput = {
    classId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateManyInput = {
    classId: number;
    memberId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceUpdateManyMutationInput = {
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceUncheckedUpdateManyInput = {
    classId?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceListRelationFilter = {
    every?: Prisma.ClassAttendanceWhereInput;
    some?: Prisma.ClassAttendanceWhereInput;
    none?: Prisma.ClassAttendanceWhereInput;
};
export type ClassAttendanceOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type ClassAttendanceClassIdMemberIdCompoundUniqueInput = {
    classId: number;
    memberId: number;
};
export type ClassAttendanceCountOrderByAggregateInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ClassAttendanceAvgOrderByAggregateInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type ClassAttendanceMaxOrderByAggregateInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ClassAttendanceMinOrderByAggregateInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    status?: Prisma.SortOrder;
};
export type ClassAttendanceSumOrderByAggregateInput = {
    classId?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type ClassAttendanceCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput> | Prisma.ClassAttendanceCreateWithoutMemberInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput | Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.ClassAttendanceCreateManyMemberInputEnvelope;
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
};
export type ClassAttendanceUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput> | Prisma.ClassAttendanceCreateWithoutMemberInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput | Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.ClassAttendanceCreateManyMemberInputEnvelope;
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
};
export type ClassAttendanceUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput> | Prisma.ClassAttendanceCreateWithoutMemberInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput | Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutMemberInput | Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.ClassAttendanceCreateManyMemberInputEnvelope;
    set?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    disconnect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    delete?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    update?: Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutMemberInput | Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.ClassAttendanceUpdateManyWithWhereWithoutMemberInput | Prisma.ClassAttendanceUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
};
export type ClassAttendanceUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput> | Prisma.ClassAttendanceCreateWithoutMemberInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput | Prisma.ClassAttendanceCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutMemberInput | Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.ClassAttendanceCreateManyMemberInputEnvelope;
    set?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    disconnect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    delete?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    update?: Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutMemberInput | Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.ClassAttendanceUpdateManyWithWhereWithoutMemberInput | Prisma.ClassAttendanceUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
};
export type ClassAttendanceCreateNestedManyWithoutClassInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput> | Prisma.ClassAttendanceCreateWithoutClassInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutClassInput | Prisma.ClassAttendanceCreateOrConnectWithoutClassInput[];
    createMany?: Prisma.ClassAttendanceCreateManyClassInputEnvelope;
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
};
export type ClassAttendanceUncheckedCreateNestedManyWithoutClassInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput> | Prisma.ClassAttendanceCreateWithoutClassInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutClassInput | Prisma.ClassAttendanceCreateOrConnectWithoutClassInput[];
    createMany?: Prisma.ClassAttendanceCreateManyClassInputEnvelope;
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
};
export type ClassAttendanceUpdateManyWithoutClassNestedInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput> | Prisma.ClassAttendanceCreateWithoutClassInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutClassInput | Prisma.ClassAttendanceCreateOrConnectWithoutClassInput[];
    upsert?: Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutClassInput | Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutClassInput[];
    createMany?: Prisma.ClassAttendanceCreateManyClassInputEnvelope;
    set?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    disconnect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    delete?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    update?: Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutClassInput | Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutClassInput[];
    updateMany?: Prisma.ClassAttendanceUpdateManyWithWhereWithoutClassInput | Prisma.ClassAttendanceUpdateManyWithWhereWithoutClassInput[];
    deleteMany?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
};
export type ClassAttendanceUncheckedUpdateManyWithoutClassNestedInput = {
    create?: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput> | Prisma.ClassAttendanceCreateWithoutClassInput[] | Prisma.ClassAttendanceUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.ClassAttendanceCreateOrConnectWithoutClassInput | Prisma.ClassAttendanceCreateOrConnectWithoutClassInput[];
    upsert?: Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutClassInput | Prisma.ClassAttendanceUpsertWithWhereUniqueWithoutClassInput[];
    createMany?: Prisma.ClassAttendanceCreateManyClassInputEnvelope;
    set?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    disconnect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    delete?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    connect?: Prisma.ClassAttendanceWhereUniqueInput | Prisma.ClassAttendanceWhereUniqueInput[];
    update?: Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutClassInput | Prisma.ClassAttendanceUpdateWithWhereUniqueWithoutClassInput[];
    updateMany?: Prisma.ClassAttendanceUpdateManyWithWhereWithoutClassInput | Prisma.ClassAttendanceUpdateManyWithWhereWithoutClassInput[];
    deleteMany?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
};
export type EnumAttendanceStatusFieldUpdateOperationsInput = {
    set?: $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateWithoutMemberInput = {
    status?: $Enums.AttendanceStatus;
    class: Prisma.TrainingClassCreateNestedOneWithoutAttendanceInput;
};
export type ClassAttendanceUncheckedCreateWithoutMemberInput = {
    classId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateOrConnectWithoutMemberInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput>;
};
export type ClassAttendanceCreateManyMemberInputEnvelope = {
    data: Prisma.ClassAttendanceCreateManyMemberInput | Prisma.ClassAttendanceCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type ClassAttendanceUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClassAttendanceUpdateWithoutMemberInput, Prisma.ClassAttendanceUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutMemberInput, Prisma.ClassAttendanceUncheckedCreateWithoutMemberInput>;
};
export type ClassAttendanceUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateWithoutMemberInput, Prisma.ClassAttendanceUncheckedUpdateWithoutMemberInput>;
};
export type ClassAttendanceUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.ClassAttendanceScalarWhereInput;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateManyMutationInput, Prisma.ClassAttendanceUncheckedUpdateManyWithoutMemberInput>;
};
export type ClassAttendanceScalarWhereInput = {
    AND?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
    OR?: Prisma.ClassAttendanceScalarWhereInput[];
    NOT?: Prisma.ClassAttendanceScalarWhereInput | Prisma.ClassAttendanceScalarWhereInput[];
    classId?: Prisma.IntFilter<"ClassAttendance"> | number;
    memberId?: Prisma.IntFilter<"ClassAttendance"> | number;
    status?: Prisma.EnumAttendanceStatusFilter<"ClassAttendance"> | $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateWithoutClassInput = {
    status?: $Enums.AttendanceStatus;
    member: Prisma.MemberCreateNestedOneWithoutClassAttendanceInput;
};
export type ClassAttendanceUncheckedCreateWithoutClassInput = {
    memberId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateOrConnectWithoutClassInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput>;
};
export type ClassAttendanceCreateManyClassInputEnvelope = {
    data: Prisma.ClassAttendanceCreateManyClassInput | Prisma.ClassAttendanceCreateManyClassInput[];
    skipDuplicates?: boolean;
};
export type ClassAttendanceUpsertWithWhereUniqueWithoutClassInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    update: Prisma.XOR<Prisma.ClassAttendanceUpdateWithoutClassInput, Prisma.ClassAttendanceUncheckedUpdateWithoutClassInput>;
    create: Prisma.XOR<Prisma.ClassAttendanceCreateWithoutClassInput, Prisma.ClassAttendanceUncheckedCreateWithoutClassInput>;
};
export type ClassAttendanceUpdateWithWhereUniqueWithoutClassInput = {
    where: Prisma.ClassAttendanceWhereUniqueInput;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateWithoutClassInput, Prisma.ClassAttendanceUncheckedUpdateWithoutClassInput>;
};
export type ClassAttendanceUpdateManyWithWhereWithoutClassInput = {
    where: Prisma.ClassAttendanceScalarWhereInput;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateManyMutationInput, Prisma.ClassAttendanceUncheckedUpdateManyWithoutClassInput>;
};
export type ClassAttendanceCreateManyMemberInput = {
    classId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceUpdateWithoutMemberInput = {
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
    class?: Prisma.TrainingClassUpdateOneRequiredWithoutAttendanceNestedInput;
};
export type ClassAttendanceUncheckedUpdateWithoutMemberInput = {
    classId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceUncheckedUpdateManyWithoutMemberInput = {
    classId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceCreateManyClassInput = {
    memberId: number;
    status?: $Enums.AttendanceStatus;
};
export type ClassAttendanceUpdateWithoutClassInput = {
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
    member?: Prisma.MemberUpdateOneRequiredWithoutClassAttendanceNestedInput;
};
export type ClassAttendanceUncheckedUpdateWithoutClassInput = {
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceUncheckedUpdateManyWithoutClassInput = {
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    status?: Prisma.EnumAttendanceStatusFieldUpdateOperationsInput | $Enums.AttendanceStatus;
};
export type ClassAttendanceSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    classId?: boolean;
    memberId?: boolean;
    status?: boolean;
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classAttendance"]>;
export type ClassAttendanceSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    classId?: boolean;
    memberId?: boolean;
    status?: boolean;
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classAttendance"]>;
export type ClassAttendanceSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    classId?: boolean;
    memberId?: boolean;
    status?: boolean;
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["classAttendance"]>;
export type ClassAttendanceSelectScalar = {
    classId?: boolean;
    memberId?: boolean;
    status?: boolean;
};
export type ClassAttendanceOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"classId" | "memberId" | "status", ExtArgs["result"]["classAttendance"]>;
export type ClassAttendanceInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type ClassAttendanceIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type ClassAttendanceIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    class?: boolean | Prisma.TrainingClassDefaultArgs<ExtArgs>;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $ClassAttendancePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "ClassAttendance";
    objects: {
        class: Prisma.$TrainingClassPayload<ExtArgs>;
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        classId: number;
        memberId: number;
        status: $Enums.AttendanceStatus;
    }, ExtArgs["result"]["classAttendance"]>;
    composites: {};
};
export type ClassAttendanceGetPayload<S extends boolean | null | undefined | ClassAttendanceDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload, S>;
export type ClassAttendanceCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<ClassAttendanceFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: ClassAttendanceCountAggregateInputType | true;
};
export interface ClassAttendanceDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['ClassAttendance'];
        meta: {
            name: 'ClassAttendance';
        };
    };
    findUnique<T extends ClassAttendanceFindUniqueArgs>(args: Prisma.SelectSubset<T, ClassAttendanceFindUniqueArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends ClassAttendanceFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, ClassAttendanceFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends ClassAttendanceFindFirstArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceFindFirstArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends ClassAttendanceFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends ClassAttendanceFindManyArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends ClassAttendanceCreateArgs>(args: Prisma.SelectSubset<T, ClassAttendanceCreateArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends ClassAttendanceCreateManyArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends ClassAttendanceCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends ClassAttendanceDeleteArgs>(args: Prisma.SelectSubset<T, ClassAttendanceDeleteArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends ClassAttendanceUpdateArgs>(args: Prisma.SelectSubset<T, ClassAttendanceUpdateArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends ClassAttendanceDeleteManyArgs>(args?: Prisma.SelectSubset<T, ClassAttendanceDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends ClassAttendanceUpdateManyArgs>(args: Prisma.SelectSubset<T, ClassAttendanceUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends ClassAttendanceUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, ClassAttendanceUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends ClassAttendanceUpsertArgs>(args: Prisma.SelectSubset<T, ClassAttendanceUpsertArgs<ExtArgs>>): Prisma.Prisma__ClassAttendanceClient<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends ClassAttendanceCountArgs>(args?: Prisma.Subset<T, ClassAttendanceCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], ClassAttendanceCountAggregateOutputType> : number>;
    aggregate<T extends ClassAttendanceAggregateArgs>(args: Prisma.Subset<T, ClassAttendanceAggregateArgs>): Prisma.PrismaPromise<GetClassAttendanceAggregateType<T>>;
    groupBy<T extends ClassAttendanceGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: ClassAttendanceGroupByArgs['orderBy'];
    } : {
        orderBy?: ClassAttendanceGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, ClassAttendanceGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetClassAttendanceGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: ClassAttendanceFieldRefs;
}
export interface Prisma__ClassAttendanceClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    class<T extends Prisma.TrainingClassDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TrainingClassDefaultArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface ClassAttendanceFieldRefs {
    readonly classId: Prisma.FieldRef<"ClassAttendance", 'Int'>;
    readonly memberId: Prisma.FieldRef<"ClassAttendance", 'Int'>;
    readonly status: Prisma.FieldRef<"ClassAttendance", 'AttendanceStatus'>;
}
export type ClassAttendanceFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where: Prisma.ClassAttendanceWhereUniqueInput;
};
export type ClassAttendanceFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where: Prisma.ClassAttendanceWhereUniqueInput;
};
export type ClassAttendanceFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithRelationInput | Prisma.ClassAttendanceOrderByWithRelationInput[];
    cursor?: Prisma.ClassAttendanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClassAttendanceScalarFieldEnum | Prisma.ClassAttendanceScalarFieldEnum[];
};
export type ClassAttendanceFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithRelationInput | Prisma.ClassAttendanceOrderByWithRelationInput[];
    cursor?: Prisma.ClassAttendanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClassAttendanceScalarFieldEnum | Prisma.ClassAttendanceScalarFieldEnum[];
};
export type ClassAttendanceFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithRelationInput | Prisma.ClassAttendanceOrderByWithRelationInput[];
    cursor?: Prisma.ClassAttendanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClassAttendanceScalarFieldEnum | Prisma.ClassAttendanceScalarFieldEnum[];
};
export type ClassAttendanceCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClassAttendanceCreateInput, Prisma.ClassAttendanceUncheckedCreateInput>;
};
export type ClassAttendanceCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.ClassAttendanceCreateManyInput | Prisma.ClassAttendanceCreateManyInput[];
    skipDuplicates?: boolean;
};
export type ClassAttendanceCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    data: Prisma.ClassAttendanceCreateManyInput | Prisma.ClassAttendanceCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.ClassAttendanceIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type ClassAttendanceUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateInput, Prisma.ClassAttendanceUncheckedUpdateInput>;
    where: Prisma.ClassAttendanceWhereUniqueInput;
};
export type ClassAttendanceUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateManyMutationInput, Prisma.ClassAttendanceUncheckedUpdateManyInput>;
    where?: Prisma.ClassAttendanceWhereInput;
    limit?: number;
};
export type ClassAttendanceUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.ClassAttendanceUpdateManyMutationInput, Prisma.ClassAttendanceUncheckedUpdateManyInput>;
    where?: Prisma.ClassAttendanceWhereInput;
    limit?: number;
    include?: Prisma.ClassAttendanceIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type ClassAttendanceUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where: Prisma.ClassAttendanceWhereUniqueInput;
    create: Prisma.XOR<Prisma.ClassAttendanceCreateInput, Prisma.ClassAttendanceUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.ClassAttendanceUpdateInput, Prisma.ClassAttendanceUncheckedUpdateInput>;
};
export type ClassAttendanceDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where: Prisma.ClassAttendanceWhereUniqueInput;
};
export type ClassAttendanceDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassAttendanceWhereInput;
    limit?: number;
};
export type ClassAttendanceDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
};
