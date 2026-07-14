import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventPositionModel = runtime.Types.Result.DefaultSelection<Prisma.$EventPositionPayload>;
export type AggregateEventPosition = {
    _count: EventPositionCountAggregateOutputType | null;
    _avg: EventPositionAvgAggregateOutputType | null;
    _sum: EventPositionSumAggregateOutputType | null;
    _min: EventPositionMinAggregateOutputType | null;
    _max: EventPositionMaxAggregateOutputType | null;
};
export type EventPositionAvgAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    count: number | null;
};
export type EventPositionSumAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    count: number | null;
};
export type EventPositionMinAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    position: string | null;
    count: number | null;
    requiredCredentialKey: string | null;
};
export type EventPositionMaxAggregateOutputType = {
    id: number | null;
    eventId: number | null;
    position: string | null;
    count: number | null;
    requiredCredentialKey: string | null;
};
export type EventPositionCountAggregateOutputType = {
    id: number;
    eventId: number;
    position: number;
    count: number;
    requiredCredentialKey: number;
    _all: number;
};
export type EventPositionAvgAggregateInputType = {
    id?: true;
    eventId?: true;
    count?: true;
};
export type EventPositionSumAggregateInputType = {
    id?: true;
    eventId?: true;
    count?: true;
};
export type EventPositionMinAggregateInputType = {
    id?: true;
    eventId?: true;
    position?: true;
    count?: true;
    requiredCredentialKey?: true;
};
export type EventPositionMaxAggregateInputType = {
    id?: true;
    eventId?: true;
    position?: true;
    count?: true;
    requiredCredentialKey?: true;
};
export type EventPositionCountAggregateInputType = {
    id?: true;
    eventId?: true;
    position?: true;
    count?: true;
    requiredCredentialKey?: true;
    _all?: true;
};
export type EventPositionAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithRelationInput | Prisma.EventPositionOrderByWithRelationInput[];
    cursor?: Prisma.EventPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventPositionCountAggregateInputType;
    _avg?: EventPositionAvgAggregateInputType;
    _sum?: EventPositionSumAggregateInputType;
    _min?: EventPositionMinAggregateInputType;
    _max?: EventPositionMaxAggregateInputType;
};
export type GetEventPositionAggregateType<T extends EventPositionAggregateArgs> = {
    [P in keyof T & keyof AggregateEventPosition]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEventPosition[P]> : Prisma.GetScalarType<T[P], AggregateEventPosition[P]>;
};
export type EventPositionGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithAggregationInput | Prisma.EventPositionOrderByWithAggregationInput[];
    by: Prisma.EventPositionScalarFieldEnum[] | Prisma.EventPositionScalarFieldEnum;
    having?: Prisma.EventPositionScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventPositionCountAggregateInputType | true;
    _avg?: EventPositionAvgAggregateInputType;
    _sum?: EventPositionSumAggregateInputType;
    _min?: EventPositionMinAggregateInputType;
    _max?: EventPositionMaxAggregateInputType;
};
export type EventPositionGroupByOutputType = {
    id: number;
    eventId: number;
    position: string;
    count: number;
    requiredCredentialKey: string | null;
    _count: EventPositionCountAggregateOutputType | null;
    _avg: EventPositionAvgAggregateOutputType | null;
    _sum: EventPositionSumAggregateOutputType | null;
    _min: EventPositionMinAggregateOutputType | null;
    _max: EventPositionMaxAggregateOutputType | null;
};
export type GetEventPositionGroupByPayload<T extends EventPositionGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventPositionGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventPositionGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventPositionGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventPositionGroupByOutputType[P]>;
}>>;
export type EventPositionWhereInput = {
    AND?: Prisma.EventPositionWhereInput | Prisma.EventPositionWhereInput[];
    OR?: Prisma.EventPositionWhereInput[];
    NOT?: Prisma.EventPositionWhereInput | Prisma.EventPositionWhereInput[];
    id?: Prisma.IntFilter<"EventPosition"> | number;
    eventId?: Prisma.IntFilter<"EventPosition"> | number;
    position?: Prisma.StringFilter<"EventPosition"> | string;
    count?: Prisma.IntFilter<"EventPosition"> | number;
    requiredCredentialKey?: Prisma.StringNullableFilter<"EventPosition"> | string | null;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
};
export type EventPositionOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    requiredCredentialKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    event?: Prisma.EventOrderByWithRelationInput;
};
export type EventPositionWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    eventId_position?: Prisma.EventPositionEventIdPositionCompoundUniqueInput;
    AND?: Prisma.EventPositionWhereInput | Prisma.EventPositionWhereInput[];
    OR?: Prisma.EventPositionWhereInput[];
    NOT?: Prisma.EventPositionWhereInput | Prisma.EventPositionWhereInput[];
    eventId?: Prisma.IntFilter<"EventPosition"> | number;
    position?: Prisma.StringFilter<"EventPosition"> | string;
    count?: Prisma.IntFilter<"EventPosition"> | number;
    requiredCredentialKey?: Prisma.StringNullableFilter<"EventPosition"> | string | null;
    event?: Prisma.XOR<Prisma.EventScalarRelationFilter, Prisma.EventWhereInput>;
}, "id" | "eventId_position">;
export type EventPositionOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    requiredCredentialKey?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.EventPositionCountOrderByAggregateInput;
    _avg?: Prisma.EventPositionAvgOrderByAggregateInput;
    _max?: Prisma.EventPositionMaxOrderByAggregateInput;
    _min?: Prisma.EventPositionMinOrderByAggregateInput;
    _sum?: Prisma.EventPositionSumOrderByAggregateInput;
};
export type EventPositionScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventPositionScalarWhereWithAggregatesInput | Prisma.EventPositionScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventPositionScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventPositionScalarWhereWithAggregatesInput | Prisma.EventPositionScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EventPosition"> | number;
    eventId?: Prisma.IntWithAggregatesFilter<"EventPosition"> | number;
    position?: Prisma.StringWithAggregatesFilter<"EventPosition"> | string;
    count?: Prisma.IntWithAggregatesFilter<"EventPosition"> | number;
    requiredCredentialKey?: Prisma.StringNullableWithAggregatesFilter<"EventPosition"> | string | null;
};
export type EventPositionCreateInput = {
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
    event: Prisma.EventCreateNestedOneWithoutPositionsInput;
};
export type EventPositionUncheckedCreateInput = {
    id?: number;
    eventId: number;
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
};
export type EventPositionUpdateInput = {
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    event?: Prisma.EventUpdateOneRequiredWithoutPositionsNestedInput;
};
export type EventPositionUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionCreateManyInput = {
    id?: number;
    eventId: number;
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
};
export type EventPositionUpdateManyMutationInput = {
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    eventId?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionListRelationFilter = {
    every?: Prisma.EventPositionWhereInput;
    some?: Prisma.EventPositionWhereInput;
    none?: Prisma.EventPositionWhereInput;
};
export type EventPositionOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventPositionEventIdPositionCompoundUniqueInput = {
    eventId: number;
    position: string;
};
export type EventPositionCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    requiredCredentialKey?: Prisma.SortOrder;
};
export type EventPositionAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
};
export type EventPositionMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    requiredCredentialKey?: Prisma.SortOrder;
};
export type EventPositionMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    requiredCredentialKey?: Prisma.SortOrder;
};
export type EventPositionSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    eventId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
};
export type EventPositionCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput> | Prisma.EventPositionCreateWithoutEventInput[] | Prisma.EventPositionUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPositionCreateOrConnectWithoutEventInput | Prisma.EventPositionCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventPositionCreateManyEventInputEnvelope;
    connect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
};
export type EventPositionUncheckedCreateNestedManyWithoutEventInput = {
    create?: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput> | Prisma.EventPositionCreateWithoutEventInput[] | Prisma.EventPositionUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPositionCreateOrConnectWithoutEventInput | Prisma.EventPositionCreateOrConnectWithoutEventInput[];
    createMany?: Prisma.EventPositionCreateManyEventInputEnvelope;
    connect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
};
export type EventPositionUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput> | Prisma.EventPositionCreateWithoutEventInput[] | Prisma.EventPositionUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPositionCreateOrConnectWithoutEventInput | Prisma.EventPositionCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventPositionUpsertWithWhereUniqueWithoutEventInput | Prisma.EventPositionUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventPositionCreateManyEventInputEnvelope;
    set?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    disconnect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    delete?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    connect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    update?: Prisma.EventPositionUpdateWithWhereUniqueWithoutEventInput | Prisma.EventPositionUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventPositionUpdateManyWithWhereWithoutEventInput | Prisma.EventPositionUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventPositionScalarWhereInput | Prisma.EventPositionScalarWhereInput[];
};
export type EventPositionUncheckedUpdateManyWithoutEventNestedInput = {
    create?: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput> | Prisma.EventPositionCreateWithoutEventInput[] | Prisma.EventPositionUncheckedCreateWithoutEventInput[];
    connectOrCreate?: Prisma.EventPositionCreateOrConnectWithoutEventInput | Prisma.EventPositionCreateOrConnectWithoutEventInput[];
    upsert?: Prisma.EventPositionUpsertWithWhereUniqueWithoutEventInput | Prisma.EventPositionUpsertWithWhereUniqueWithoutEventInput[];
    createMany?: Prisma.EventPositionCreateManyEventInputEnvelope;
    set?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    disconnect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    delete?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    connect?: Prisma.EventPositionWhereUniqueInput | Prisma.EventPositionWhereUniqueInput[];
    update?: Prisma.EventPositionUpdateWithWhereUniqueWithoutEventInput | Prisma.EventPositionUpdateWithWhereUniqueWithoutEventInput[];
    updateMany?: Prisma.EventPositionUpdateManyWithWhereWithoutEventInput | Prisma.EventPositionUpdateManyWithWhereWithoutEventInput[];
    deleteMany?: Prisma.EventPositionScalarWhereInput | Prisma.EventPositionScalarWhereInput[];
};
export type EventPositionCreateWithoutEventInput = {
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
};
export type EventPositionUncheckedCreateWithoutEventInput = {
    id?: number;
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
};
export type EventPositionCreateOrConnectWithoutEventInput = {
    where: Prisma.EventPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput>;
};
export type EventPositionCreateManyEventInputEnvelope = {
    data: Prisma.EventPositionCreateManyEventInput | Prisma.EventPositionCreateManyEventInput[];
    skipDuplicates?: boolean;
};
export type EventPositionUpsertWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventPositionWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventPositionUpdateWithoutEventInput, Prisma.EventPositionUncheckedUpdateWithoutEventInput>;
    create: Prisma.XOR<Prisma.EventPositionCreateWithoutEventInput, Prisma.EventPositionUncheckedCreateWithoutEventInput>;
};
export type EventPositionUpdateWithWhereUniqueWithoutEventInput = {
    where: Prisma.EventPositionWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventPositionUpdateWithoutEventInput, Prisma.EventPositionUncheckedUpdateWithoutEventInput>;
};
export type EventPositionUpdateManyWithWhereWithoutEventInput = {
    where: Prisma.EventPositionScalarWhereInput;
    data: Prisma.XOR<Prisma.EventPositionUpdateManyMutationInput, Prisma.EventPositionUncheckedUpdateManyWithoutEventInput>;
};
export type EventPositionScalarWhereInput = {
    AND?: Prisma.EventPositionScalarWhereInput | Prisma.EventPositionScalarWhereInput[];
    OR?: Prisma.EventPositionScalarWhereInput[];
    NOT?: Prisma.EventPositionScalarWhereInput | Prisma.EventPositionScalarWhereInput[];
    id?: Prisma.IntFilter<"EventPosition"> | number;
    eventId?: Prisma.IntFilter<"EventPosition"> | number;
    position?: Prisma.StringFilter<"EventPosition"> | string;
    count?: Prisma.IntFilter<"EventPosition"> | number;
    requiredCredentialKey?: Prisma.StringNullableFilter<"EventPosition"> | string | null;
};
export type EventPositionCreateManyEventInput = {
    id?: number;
    position: string;
    count: number;
    requiredCredentialKey?: string | null;
};
export type EventPositionUpdateWithoutEventInput = {
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionUncheckedUpdateWithoutEventInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionUncheckedUpdateManyWithoutEventInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.StringFieldUpdateOperationsInput | string;
    count?: Prisma.IntFieldUpdateOperationsInput | number;
    requiredCredentialKey?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type EventPositionSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    position?: boolean;
    count?: boolean;
    requiredCredentialKey?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPosition"]>;
export type EventPositionSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    position?: boolean;
    count?: boolean;
    requiredCredentialKey?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPosition"]>;
export type EventPositionSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    eventId?: boolean;
    position?: boolean;
    count?: boolean;
    requiredCredentialKey?: boolean;
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventPosition"]>;
export type EventPositionSelectScalar = {
    id?: boolean;
    eventId?: boolean;
    position?: boolean;
    count?: boolean;
    requiredCredentialKey?: boolean;
};
export type EventPositionOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "eventId" | "position" | "count" | "requiredCredentialKey", ExtArgs["result"]["eventPosition"]>;
export type EventPositionInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type EventPositionIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type EventPositionIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    event?: boolean | Prisma.EventDefaultArgs<ExtArgs>;
};
export type $EventPositionPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EventPosition";
    objects: {
        event: Prisma.$EventPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        eventId: number;
        position: string;
        count: number;
        requiredCredentialKey: string | null;
    }, ExtArgs["result"]["eventPosition"]>;
    composites: {};
};
export type EventPositionGetPayload<S extends boolean | null | undefined | EventPositionDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventPositionPayload, S>;
export type EventPositionCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventPositionFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventPositionCountAggregateInputType | true;
};
export interface EventPositionDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EventPosition'];
        meta: {
            name: 'EventPosition';
        };
    };
    findUnique<T extends EventPositionFindUniqueArgs>(args: Prisma.SelectSubset<T, EventPositionFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventPositionFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventPositionFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventPositionFindFirstArgs>(args?: Prisma.SelectSubset<T, EventPositionFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventPositionFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventPositionFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventPositionFindManyArgs>(args?: Prisma.SelectSubset<T, EventPositionFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventPositionCreateArgs>(args: Prisma.SelectSubset<T, EventPositionCreateArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventPositionCreateManyArgs>(args?: Prisma.SelectSubset<T, EventPositionCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventPositionCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventPositionCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventPositionDeleteArgs>(args: Prisma.SelectSubset<T, EventPositionDeleteArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventPositionUpdateArgs>(args: Prisma.SelectSubset<T, EventPositionUpdateArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventPositionDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventPositionDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventPositionUpdateManyArgs>(args: Prisma.SelectSubset<T, EventPositionUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventPositionUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventPositionUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventPositionUpsertArgs>(args: Prisma.SelectSubset<T, EventPositionUpsertArgs<ExtArgs>>): Prisma.Prisma__EventPositionClient<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventPositionCountArgs>(args?: Prisma.Subset<T, EventPositionCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventPositionCountAggregateOutputType> : number>;
    aggregate<T extends EventPositionAggregateArgs>(args: Prisma.Subset<T, EventPositionAggregateArgs>): Prisma.PrismaPromise<GetEventPositionAggregateType<T>>;
    groupBy<T extends EventPositionGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventPositionGroupByArgs['orderBy'];
    } : {
        orderBy?: EventPositionGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventPositionGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventPositionGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventPositionFieldRefs;
}
export interface Prisma__EventPositionClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    event<T extends Prisma.EventDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventDefaultArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventPositionFieldRefs {
    readonly id: Prisma.FieldRef<"EventPosition", 'Int'>;
    readonly eventId: Prisma.FieldRef<"EventPosition", 'Int'>;
    readonly position: Prisma.FieldRef<"EventPosition", 'String'>;
    readonly count: Prisma.FieldRef<"EventPosition", 'Int'>;
    readonly requiredCredentialKey: Prisma.FieldRef<"EventPosition", 'String'>;
}
export type EventPositionFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where: Prisma.EventPositionWhereUniqueInput;
};
export type EventPositionFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where: Prisma.EventPositionWhereUniqueInput;
};
export type EventPositionFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithRelationInput | Prisma.EventPositionOrderByWithRelationInput[];
    cursor?: Prisma.EventPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPositionScalarFieldEnum | Prisma.EventPositionScalarFieldEnum[];
};
export type EventPositionFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithRelationInput | Prisma.EventPositionOrderByWithRelationInput[];
    cursor?: Prisma.EventPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPositionScalarFieldEnum | Prisma.EventPositionScalarFieldEnum[];
};
export type EventPositionFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithRelationInput | Prisma.EventPositionOrderByWithRelationInput[];
    cursor?: Prisma.EventPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPositionScalarFieldEnum | Prisma.EventPositionScalarFieldEnum[];
};
export type EventPositionCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPositionCreateInput, Prisma.EventPositionUncheckedCreateInput>;
};
export type EventPositionCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventPositionCreateManyInput | Prisma.EventPositionCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventPositionCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    data: Prisma.EventPositionCreateManyInput | Prisma.EventPositionCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventPositionIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventPositionUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPositionUpdateInput, Prisma.EventPositionUncheckedUpdateInput>;
    where: Prisma.EventPositionWhereUniqueInput;
};
export type EventPositionUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventPositionUpdateManyMutationInput, Prisma.EventPositionUncheckedUpdateManyInput>;
    where?: Prisma.EventPositionWhereInput;
    limit?: number;
};
export type EventPositionUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventPositionUpdateManyMutationInput, Prisma.EventPositionUncheckedUpdateManyInput>;
    where?: Prisma.EventPositionWhereInput;
    limit?: number;
    include?: Prisma.EventPositionIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventPositionUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where: Prisma.EventPositionWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventPositionCreateInput, Prisma.EventPositionUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventPositionUpdateInput, Prisma.EventPositionUncheckedUpdateInput>;
};
export type EventPositionDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where: Prisma.EventPositionWhereUniqueInput;
};
export type EventPositionDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPositionWhereInput;
    limit?: number;
};
export type EventPositionDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
};
