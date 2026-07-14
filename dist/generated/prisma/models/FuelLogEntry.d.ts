import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type FuelLogEntryModel = runtime.Types.Result.DefaultSelection<Prisma.$FuelLogEntryPayload>;
export type AggregateFuelLogEntry = {
    _count: FuelLogEntryCountAggregateOutputType | null;
    _avg: FuelLogEntryAvgAggregateOutputType | null;
    _sum: FuelLogEntrySumAggregateOutputType | null;
    _min: FuelLogEntryMinAggregateOutputType | null;
    _max: FuelLogEntryMaxAggregateOutputType | null;
};
export type FuelLogEntryAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    amount: runtime.Decimal | null;
    mileage: number | null;
};
export type FuelLogEntrySumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    amount: runtime.Decimal | null;
    mileage: number | null;
};
export type FuelLogEntryMinAggregateOutputType = {
    id: number | null;
    loggedAt: Date | null;
    memberId: number | null;
    vehicle: string | null;
    amount: runtime.Decimal | null;
    mileage: number | null;
};
export type FuelLogEntryMaxAggregateOutputType = {
    id: number | null;
    loggedAt: Date | null;
    memberId: number | null;
    vehicle: string | null;
    amount: runtime.Decimal | null;
    mileage: number | null;
};
export type FuelLogEntryCountAggregateOutputType = {
    id: number;
    loggedAt: number;
    memberId: number;
    vehicle: number;
    amount: number;
    mileage: number;
    _all: number;
};
export type FuelLogEntryAvgAggregateInputType = {
    id?: true;
    memberId?: true;
    amount?: true;
    mileage?: true;
};
export type FuelLogEntrySumAggregateInputType = {
    id?: true;
    memberId?: true;
    amount?: true;
    mileage?: true;
};
export type FuelLogEntryMinAggregateInputType = {
    id?: true;
    loggedAt?: true;
    memberId?: true;
    vehicle?: true;
    amount?: true;
    mileage?: true;
};
export type FuelLogEntryMaxAggregateInputType = {
    id?: true;
    loggedAt?: true;
    memberId?: true;
    vehicle?: true;
    amount?: true;
    mileage?: true;
};
export type FuelLogEntryCountAggregateInputType = {
    id?: true;
    loggedAt?: true;
    memberId?: true;
    vehicle?: true;
    amount?: true;
    mileage?: true;
    _all?: true;
};
export type FuelLogEntryAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FuelLogEntryWhereInput;
    orderBy?: Prisma.FuelLogEntryOrderByWithRelationInput | Prisma.FuelLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.FuelLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | FuelLogEntryCountAggregateInputType;
    _avg?: FuelLogEntryAvgAggregateInputType;
    _sum?: FuelLogEntrySumAggregateInputType;
    _min?: FuelLogEntryMinAggregateInputType;
    _max?: FuelLogEntryMaxAggregateInputType;
};
export type GetFuelLogEntryAggregateType<T extends FuelLogEntryAggregateArgs> = {
    [P in keyof T & keyof AggregateFuelLogEntry]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateFuelLogEntry[P]> : Prisma.GetScalarType<T[P], AggregateFuelLogEntry[P]>;
};
export type FuelLogEntryGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FuelLogEntryWhereInput;
    orderBy?: Prisma.FuelLogEntryOrderByWithAggregationInput | Prisma.FuelLogEntryOrderByWithAggregationInput[];
    by: Prisma.FuelLogEntryScalarFieldEnum[] | Prisma.FuelLogEntryScalarFieldEnum;
    having?: Prisma.FuelLogEntryScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: FuelLogEntryCountAggregateInputType | true;
    _avg?: FuelLogEntryAvgAggregateInputType;
    _sum?: FuelLogEntrySumAggregateInputType;
    _min?: FuelLogEntryMinAggregateInputType;
    _max?: FuelLogEntryMaxAggregateInputType;
};
export type FuelLogEntryGroupByOutputType = {
    id: number;
    loggedAt: Date;
    memberId: number;
    vehicle: string;
    amount: runtime.Decimal;
    mileage: number;
    _count: FuelLogEntryCountAggregateOutputType | null;
    _avg: FuelLogEntryAvgAggregateOutputType | null;
    _sum: FuelLogEntrySumAggregateOutputType | null;
    _min: FuelLogEntryMinAggregateOutputType | null;
    _max: FuelLogEntryMaxAggregateOutputType | null;
};
export type GetFuelLogEntryGroupByPayload<T extends FuelLogEntryGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<FuelLogEntryGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof FuelLogEntryGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], FuelLogEntryGroupByOutputType[P]> : Prisma.GetScalarType<T[P], FuelLogEntryGroupByOutputType[P]>;
}>>;
export type FuelLogEntryWhereInput = {
    AND?: Prisma.FuelLogEntryWhereInput | Prisma.FuelLogEntryWhereInput[];
    OR?: Prisma.FuelLogEntryWhereInput[];
    NOT?: Prisma.FuelLogEntryWhereInput | Prisma.FuelLogEntryWhereInput[];
    id?: Prisma.IntFilter<"FuelLogEntry"> | number;
    loggedAt?: Prisma.DateTimeFilter<"FuelLogEntry"> | Date | string;
    memberId?: Prisma.IntFilter<"FuelLogEntry"> | number;
    vehicle?: Prisma.StringFilter<"FuelLogEntry"> | string;
    amount?: Prisma.DecimalFilter<"FuelLogEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFilter<"FuelLogEntry"> | number;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type FuelLogEntryOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    vehicle?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type FuelLogEntryWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.FuelLogEntryWhereInput | Prisma.FuelLogEntryWhereInput[];
    OR?: Prisma.FuelLogEntryWhereInput[];
    NOT?: Prisma.FuelLogEntryWhereInput | Prisma.FuelLogEntryWhereInput[];
    loggedAt?: Prisma.DateTimeFilter<"FuelLogEntry"> | Date | string;
    memberId?: Prisma.IntFilter<"FuelLogEntry"> | number;
    vehicle?: Prisma.StringFilter<"FuelLogEntry"> | string;
    amount?: Prisma.DecimalFilter<"FuelLogEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFilter<"FuelLogEntry"> | number;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "id">;
export type FuelLogEntryOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    vehicle?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
    _count?: Prisma.FuelLogEntryCountOrderByAggregateInput;
    _avg?: Prisma.FuelLogEntryAvgOrderByAggregateInput;
    _max?: Prisma.FuelLogEntryMaxOrderByAggregateInput;
    _min?: Prisma.FuelLogEntryMinOrderByAggregateInput;
    _sum?: Prisma.FuelLogEntrySumOrderByAggregateInput;
};
export type FuelLogEntryScalarWhereWithAggregatesInput = {
    AND?: Prisma.FuelLogEntryScalarWhereWithAggregatesInput | Prisma.FuelLogEntryScalarWhereWithAggregatesInput[];
    OR?: Prisma.FuelLogEntryScalarWhereWithAggregatesInput[];
    NOT?: Prisma.FuelLogEntryScalarWhereWithAggregatesInput | Prisma.FuelLogEntryScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"FuelLogEntry"> | number;
    loggedAt?: Prisma.DateTimeWithAggregatesFilter<"FuelLogEntry"> | Date | string;
    memberId?: Prisma.IntWithAggregatesFilter<"FuelLogEntry"> | number;
    vehicle?: Prisma.StringWithAggregatesFilter<"FuelLogEntry"> | string;
    amount?: Prisma.DecimalWithAggregatesFilter<"FuelLogEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntWithAggregatesFilter<"FuelLogEntry"> | number;
};
export type FuelLogEntryCreateInput = {
    loggedAt: Date | string;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
    member: Prisma.MemberCreateNestedOneWithoutFuelLogEntriesInput;
};
export type FuelLogEntryUncheckedCreateInput = {
    id?: number;
    loggedAt: Date | string;
    memberId: number;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
};
export type FuelLogEntryUpdateInput = {
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
    member?: Prisma.MemberUpdateOneRequiredWithoutFuelLogEntriesNestedInput;
};
export type FuelLogEntryUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntryCreateManyInput = {
    id?: number;
    loggedAt: Date | string;
    memberId: number;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
};
export type FuelLogEntryUpdateManyMutationInput = {
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntryUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntryListRelationFilter = {
    every?: Prisma.FuelLogEntryWhereInput;
    some?: Prisma.FuelLogEntryWhereInput;
    none?: Prisma.FuelLogEntryWhereInput;
};
export type FuelLogEntryOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type FuelLogEntryCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    vehicle?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
};
export type FuelLogEntryAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
};
export type FuelLogEntryMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    vehicle?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
};
export type FuelLogEntryMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    loggedAt?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    vehicle?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
};
export type FuelLogEntrySumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    amount?: Prisma.SortOrder;
    mileage?: Prisma.SortOrder;
};
export type FuelLogEntryCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput> | Prisma.FuelLogEntryCreateWithoutMemberInput[] | Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput | Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.FuelLogEntryCreateManyMemberInputEnvelope;
    connect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
};
export type FuelLogEntryUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput> | Prisma.FuelLogEntryCreateWithoutMemberInput[] | Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput | Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.FuelLogEntryCreateManyMemberInputEnvelope;
    connect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
};
export type FuelLogEntryUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput> | Prisma.FuelLogEntryCreateWithoutMemberInput[] | Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput | Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.FuelLogEntryUpsertWithWhereUniqueWithoutMemberInput | Prisma.FuelLogEntryUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.FuelLogEntryCreateManyMemberInputEnvelope;
    set?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    disconnect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    delete?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    connect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    update?: Prisma.FuelLogEntryUpdateWithWhereUniqueWithoutMemberInput | Prisma.FuelLogEntryUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.FuelLogEntryUpdateManyWithWhereWithoutMemberInput | Prisma.FuelLogEntryUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.FuelLogEntryScalarWhereInput | Prisma.FuelLogEntryScalarWhereInput[];
};
export type FuelLogEntryUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput> | Prisma.FuelLogEntryCreateWithoutMemberInput[] | Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput | Prisma.FuelLogEntryCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.FuelLogEntryUpsertWithWhereUniqueWithoutMemberInput | Prisma.FuelLogEntryUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.FuelLogEntryCreateManyMemberInputEnvelope;
    set?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    disconnect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    delete?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    connect?: Prisma.FuelLogEntryWhereUniqueInput | Prisma.FuelLogEntryWhereUniqueInput[];
    update?: Prisma.FuelLogEntryUpdateWithWhereUniqueWithoutMemberInput | Prisma.FuelLogEntryUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.FuelLogEntryUpdateManyWithWhereWithoutMemberInput | Prisma.FuelLogEntryUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.FuelLogEntryScalarWhereInput | Prisma.FuelLogEntryScalarWhereInput[];
};
export type DecimalFieldUpdateOperationsInput = {
    set?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    increment?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    decrement?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    multiply?: runtime.Decimal | runtime.DecimalJsLike | number | string;
    divide?: runtime.Decimal | runtime.DecimalJsLike | number | string;
};
export type FuelLogEntryCreateWithoutMemberInput = {
    loggedAt: Date | string;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
};
export type FuelLogEntryUncheckedCreateWithoutMemberInput = {
    id?: number;
    loggedAt: Date | string;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
};
export type FuelLogEntryCreateOrConnectWithoutMemberInput = {
    where: Prisma.FuelLogEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput>;
};
export type FuelLogEntryCreateManyMemberInputEnvelope = {
    data: Prisma.FuelLogEntryCreateManyMemberInput | Prisma.FuelLogEntryCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type FuelLogEntryUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.FuelLogEntryWhereUniqueInput;
    update: Prisma.XOR<Prisma.FuelLogEntryUpdateWithoutMemberInput, Prisma.FuelLogEntryUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.FuelLogEntryCreateWithoutMemberInput, Prisma.FuelLogEntryUncheckedCreateWithoutMemberInput>;
};
export type FuelLogEntryUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.FuelLogEntryWhereUniqueInput;
    data: Prisma.XOR<Prisma.FuelLogEntryUpdateWithoutMemberInput, Prisma.FuelLogEntryUncheckedUpdateWithoutMemberInput>;
};
export type FuelLogEntryUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.FuelLogEntryScalarWhereInput;
    data: Prisma.XOR<Prisma.FuelLogEntryUpdateManyMutationInput, Prisma.FuelLogEntryUncheckedUpdateManyWithoutMemberInput>;
};
export type FuelLogEntryScalarWhereInput = {
    AND?: Prisma.FuelLogEntryScalarWhereInput | Prisma.FuelLogEntryScalarWhereInput[];
    OR?: Prisma.FuelLogEntryScalarWhereInput[];
    NOT?: Prisma.FuelLogEntryScalarWhereInput | Prisma.FuelLogEntryScalarWhereInput[];
    id?: Prisma.IntFilter<"FuelLogEntry"> | number;
    loggedAt?: Prisma.DateTimeFilter<"FuelLogEntry"> | Date | string;
    memberId?: Prisma.IntFilter<"FuelLogEntry"> | number;
    vehicle?: Prisma.StringFilter<"FuelLogEntry"> | string;
    amount?: Prisma.DecimalFilter<"FuelLogEntry"> | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFilter<"FuelLogEntry"> | number;
};
export type FuelLogEntryCreateManyMemberInput = {
    id?: number;
    loggedAt: Date | string;
    vehicle: string;
    amount: runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage: number;
};
export type FuelLogEntryUpdateWithoutMemberInput = {
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntryUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntryUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    loggedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    vehicle?: Prisma.StringFieldUpdateOperationsInput | string;
    amount?: Prisma.DecimalFieldUpdateOperationsInput | runtime.Decimal | runtime.DecimalJsLike | number | string;
    mileage?: Prisma.IntFieldUpdateOperationsInput | number;
};
export type FuelLogEntrySelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    loggedAt?: boolean;
    memberId?: boolean;
    vehicle?: boolean;
    amount?: boolean;
    mileage?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fuelLogEntry"]>;
export type FuelLogEntrySelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    loggedAt?: boolean;
    memberId?: boolean;
    vehicle?: boolean;
    amount?: boolean;
    mileage?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fuelLogEntry"]>;
export type FuelLogEntrySelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    loggedAt?: boolean;
    memberId?: boolean;
    vehicle?: boolean;
    amount?: boolean;
    mileage?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["fuelLogEntry"]>;
export type FuelLogEntrySelectScalar = {
    id?: boolean;
    loggedAt?: boolean;
    memberId?: boolean;
    vehicle?: boolean;
    amount?: boolean;
    mileage?: boolean;
};
export type FuelLogEntryOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "loggedAt" | "memberId" | "vehicle" | "amount" | "mileage", ExtArgs["result"]["fuelLogEntry"]>;
export type FuelLogEntryInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type FuelLogEntryIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type FuelLogEntryIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $FuelLogEntryPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "FuelLogEntry";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        loggedAt: Date;
        memberId: number;
        vehicle: string;
        amount: runtime.Decimal;
        mileage: number;
    }, ExtArgs["result"]["fuelLogEntry"]>;
    composites: {};
};
export type FuelLogEntryGetPayload<S extends boolean | null | undefined | FuelLogEntryDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload, S>;
export type FuelLogEntryCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<FuelLogEntryFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: FuelLogEntryCountAggregateInputType | true;
};
export interface FuelLogEntryDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['FuelLogEntry'];
        meta: {
            name: 'FuelLogEntry';
        };
    };
    findUnique<T extends FuelLogEntryFindUniqueArgs>(args: Prisma.SelectSubset<T, FuelLogEntryFindUniqueArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends FuelLogEntryFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, FuelLogEntryFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends FuelLogEntryFindFirstArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryFindFirstArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends FuelLogEntryFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends FuelLogEntryFindManyArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends FuelLogEntryCreateArgs>(args: Prisma.SelectSubset<T, FuelLogEntryCreateArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends FuelLogEntryCreateManyArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends FuelLogEntryCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends FuelLogEntryDeleteArgs>(args: Prisma.SelectSubset<T, FuelLogEntryDeleteArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends FuelLogEntryUpdateArgs>(args: Prisma.SelectSubset<T, FuelLogEntryUpdateArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends FuelLogEntryDeleteManyArgs>(args?: Prisma.SelectSubset<T, FuelLogEntryDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends FuelLogEntryUpdateManyArgs>(args: Prisma.SelectSubset<T, FuelLogEntryUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends FuelLogEntryUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, FuelLogEntryUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends FuelLogEntryUpsertArgs>(args: Prisma.SelectSubset<T, FuelLogEntryUpsertArgs<ExtArgs>>): Prisma.Prisma__FuelLogEntryClient<runtime.Types.Result.GetResult<Prisma.$FuelLogEntryPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends FuelLogEntryCountArgs>(args?: Prisma.Subset<T, FuelLogEntryCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], FuelLogEntryCountAggregateOutputType> : number>;
    aggregate<T extends FuelLogEntryAggregateArgs>(args: Prisma.Subset<T, FuelLogEntryAggregateArgs>): Prisma.PrismaPromise<GetFuelLogEntryAggregateType<T>>;
    groupBy<T extends FuelLogEntryGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: FuelLogEntryGroupByArgs['orderBy'];
    } : {
        orderBy?: FuelLogEntryGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, FuelLogEntryGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetFuelLogEntryGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: FuelLogEntryFieldRefs;
}
export interface Prisma__FuelLogEntryClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface FuelLogEntryFieldRefs {
    readonly id: Prisma.FieldRef<"FuelLogEntry", 'Int'>;
    readonly loggedAt: Prisma.FieldRef<"FuelLogEntry", 'DateTime'>;
    readonly memberId: Prisma.FieldRef<"FuelLogEntry", 'Int'>;
    readonly vehicle: Prisma.FieldRef<"FuelLogEntry", 'String'>;
    readonly amount: Prisma.FieldRef<"FuelLogEntry", 'Decimal'>;
    readonly mileage: Prisma.FieldRef<"FuelLogEntry", 'Int'>;
}
export type FuelLogEntryFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where: Prisma.FuelLogEntryWhereUniqueInput;
};
export type FuelLogEntryFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where: Prisma.FuelLogEntryWhereUniqueInput;
};
export type FuelLogEntryFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where?: Prisma.FuelLogEntryWhereInput;
    orderBy?: Prisma.FuelLogEntryOrderByWithRelationInput | Prisma.FuelLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.FuelLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FuelLogEntryScalarFieldEnum | Prisma.FuelLogEntryScalarFieldEnum[];
};
export type FuelLogEntryFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where?: Prisma.FuelLogEntryWhereInput;
    orderBy?: Prisma.FuelLogEntryOrderByWithRelationInput | Prisma.FuelLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.FuelLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FuelLogEntryScalarFieldEnum | Prisma.FuelLogEntryScalarFieldEnum[];
};
export type FuelLogEntryFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where?: Prisma.FuelLogEntryWhereInput;
    orderBy?: Prisma.FuelLogEntryOrderByWithRelationInput | Prisma.FuelLogEntryOrderByWithRelationInput[];
    cursor?: Prisma.FuelLogEntryWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.FuelLogEntryScalarFieldEnum | Prisma.FuelLogEntryScalarFieldEnum[];
};
export type FuelLogEntryCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FuelLogEntryCreateInput, Prisma.FuelLogEntryUncheckedCreateInput>;
};
export type FuelLogEntryCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.FuelLogEntryCreateManyInput | Prisma.FuelLogEntryCreateManyInput[];
    skipDuplicates?: boolean;
};
export type FuelLogEntryCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    data: Prisma.FuelLogEntryCreateManyInput | Prisma.FuelLogEntryCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.FuelLogEntryIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type FuelLogEntryUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FuelLogEntryUpdateInput, Prisma.FuelLogEntryUncheckedUpdateInput>;
    where: Prisma.FuelLogEntryWhereUniqueInput;
};
export type FuelLogEntryUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.FuelLogEntryUpdateManyMutationInput, Prisma.FuelLogEntryUncheckedUpdateManyInput>;
    where?: Prisma.FuelLogEntryWhereInput;
    limit?: number;
};
export type FuelLogEntryUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.FuelLogEntryUpdateManyMutationInput, Prisma.FuelLogEntryUncheckedUpdateManyInput>;
    where?: Prisma.FuelLogEntryWhereInput;
    limit?: number;
    include?: Prisma.FuelLogEntryIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type FuelLogEntryUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where: Prisma.FuelLogEntryWhereUniqueInput;
    create: Prisma.XOR<Prisma.FuelLogEntryCreateInput, Prisma.FuelLogEntryUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.FuelLogEntryUpdateInput, Prisma.FuelLogEntryUncheckedUpdateInput>;
};
export type FuelLogEntryDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
    where: Prisma.FuelLogEntryWhereUniqueInput;
};
export type FuelLogEntryDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.FuelLogEntryWhereInput;
    limit?: number;
};
export type FuelLogEntryDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.FuelLogEntrySelect<ExtArgs> | null;
    omit?: Prisma.FuelLogEntryOmit<ExtArgs> | null;
    include?: Prisma.FuelLogEntryInclude<ExtArgs> | null;
};
