import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventKindModel = runtime.Types.Result.DefaultSelection<Prisma.$EventKindPayload>;
export type AggregateEventKind = {
    _count: EventKindCountAggregateOutputType | null;
    _avg: EventKindAvgAggregateOutputType | null;
    _sum: EventKindSumAggregateOutputType | null;
    _min: EventKindMinAggregateOutputType | null;
    _max: EventKindMaxAggregateOutputType | null;
};
export type EventKindAvgAggregateOutputType = {
    id: number | null;
};
export type EventKindSumAggregateOutputType = {
    id: number | null;
};
export type EventKindMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    active: boolean | null;
};
export type EventKindMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    active: boolean | null;
};
export type EventKindCountAggregateOutputType = {
    id: number;
    name: number;
    defaults: number;
    active: number;
    _all: number;
};
export type EventKindAvgAggregateInputType = {
    id?: true;
};
export type EventKindSumAggregateInputType = {
    id?: true;
};
export type EventKindMinAggregateInputType = {
    id?: true;
    name?: true;
    active?: true;
};
export type EventKindMaxAggregateInputType = {
    id?: true;
    name?: true;
    active?: true;
};
export type EventKindCountAggregateInputType = {
    id?: true;
    name?: true;
    defaults?: true;
    active?: true;
    _all?: true;
};
export type EventKindAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventKindWhereInput;
    orderBy?: Prisma.EventKindOrderByWithRelationInput | Prisma.EventKindOrderByWithRelationInput[];
    cursor?: Prisma.EventKindWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventKindCountAggregateInputType;
    _avg?: EventKindAvgAggregateInputType;
    _sum?: EventKindSumAggregateInputType;
    _min?: EventKindMinAggregateInputType;
    _max?: EventKindMaxAggregateInputType;
};
export type GetEventKindAggregateType<T extends EventKindAggregateArgs> = {
    [P in keyof T & keyof AggregateEventKind]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEventKind[P]> : Prisma.GetScalarType<T[P], AggregateEventKind[P]>;
};
export type EventKindGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventKindWhereInput;
    orderBy?: Prisma.EventKindOrderByWithAggregationInput | Prisma.EventKindOrderByWithAggregationInput[];
    by: Prisma.EventKindScalarFieldEnum[] | Prisma.EventKindScalarFieldEnum;
    having?: Prisma.EventKindScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventKindCountAggregateInputType | true;
    _avg?: EventKindAvgAggregateInputType;
    _sum?: EventKindSumAggregateInputType;
    _min?: EventKindMinAggregateInputType;
    _max?: EventKindMaxAggregateInputType;
};
export type EventKindGroupByOutputType = {
    id: number;
    name: string;
    defaults: runtime.JsonValue | null;
    active: boolean;
    _count: EventKindCountAggregateOutputType | null;
    _avg: EventKindAvgAggregateOutputType | null;
    _sum: EventKindSumAggregateOutputType | null;
    _min: EventKindMinAggregateOutputType | null;
    _max: EventKindMaxAggregateOutputType | null;
};
export type GetEventKindGroupByPayload<T extends EventKindGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventKindGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventKindGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventKindGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventKindGroupByOutputType[P]>;
}>>;
export type EventKindWhereInput = {
    AND?: Prisma.EventKindWhereInput | Prisma.EventKindWhereInput[];
    OR?: Prisma.EventKindWhereInput[];
    NOT?: Prisma.EventKindWhereInput | Prisma.EventKindWhereInput[];
    id?: Prisma.IntFilter<"EventKind"> | number;
    name?: Prisma.StringFilter<"EventKind"> | string;
    defaults?: Prisma.JsonNullableFilter<"EventKind">;
    active?: Prisma.BoolFilter<"EventKind"> | boolean;
    events?: Prisma.EventListRelationFilter;
};
export type EventKindOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    defaults?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    events?: Prisma.EventOrderByRelationAggregateInput;
};
export type EventKindWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.EventKindWhereInput | Prisma.EventKindWhereInput[];
    OR?: Prisma.EventKindWhereInput[];
    NOT?: Prisma.EventKindWhereInput | Prisma.EventKindWhereInput[];
    defaults?: Prisma.JsonNullableFilter<"EventKind">;
    active?: Prisma.BoolFilter<"EventKind"> | boolean;
    events?: Prisma.EventListRelationFilter;
}, "id" | "name">;
export type EventKindOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    defaults?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.EventKindCountOrderByAggregateInput;
    _avg?: Prisma.EventKindAvgOrderByAggregateInput;
    _max?: Prisma.EventKindMaxOrderByAggregateInput;
    _min?: Prisma.EventKindMinOrderByAggregateInput;
    _sum?: Prisma.EventKindSumOrderByAggregateInput;
};
export type EventKindScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventKindScalarWhereWithAggregatesInput | Prisma.EventKindScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventKindScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventKindScalarWhereWithAggregatesInput | Prisma.EventKindScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"EventKind"> | number;
    name?: Prisma.StringWithAggregatesFilter<"EventKind"> | string;
    defaults?: Prisma.JsonNullableWithAggregatesFilter<"EventKind">;
    active?: Prisma.BoolWithAggregatesFilter<"EventKind"> | boolean;
};
export type EventKindCreateInput = {
    name: string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    events?: Prisma.EventCreateNestedManyWithoutKindInput;
};
export type EventKindUncheckedCreateInput = {
    id?: number;
    name: string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
    events?: Prisma.EventUncheckedCreateNestedManyWithoutKindInput;
};
export type EventKindUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    events?: Prisma.EventUpdateManyWithoutKindNestedInput;
};
export type EventKindUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    events?: Prisma.EventUncheckedUpdateManyWithoutKindNestedInput;
};
export type EventKindCreateManyInput = {
    id?: number;
    name: string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
};
export type EventKindUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type EventKindUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type EventKindCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    defaults?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type EventKindAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type EventKindMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type EventKindMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type EventKindSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type EventKindScalarRelationFilter = {
    is?: Prisma.EventKindWhereInput;
    isNot?: Prisma.EventKindWhereInput;
};
export type EventKindCreateNestedOneWithoutEventsInput = {
    create?: Prisma.XOR<Prisma.EventKindCreateWithoutEventsInput, Prisma.EventKindUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.EventKindCreateOrConnectWithoutEventsInput;
    connect?: Prisma.EventKindWhereUniqueInput;
};
export type EventKindUpdateOneRequiredWithoutEventsNestedInput = {
    create?: Prisma.XOR<Prisma.EventKindCreateWithoutEventsInput, Prisma.EventKindUncheckedCreateWithoutEventsInput>;
    connectOrCreate?: Prisma.EventKindCreateOrConnectWithoutEventsInput;
    upsert?: Prisma.EventKindUpsertWithoutEventsInput;
    connect?: Prisma.EventKindWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventKindUpdateToOneWithWhereWithoutEventsInput, Prisma.EventKindUpdateWithoutEventsInput>, Prisma.EventKindUncheckedUpdateWithoutEventsInput>;
};
export type EventKindCreateWithoutEventsInput = {
    name: string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
};
export type EventKindUncheckedCreateWithoutEventsInput = {
    id?: number;
    name: string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: boolean;
};
export type EventKindCreateOrConnectWithoutEventsInput = {
    where: Prisma.EventKindWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventKindCreateWithoutEventsInput, Prisma.EventKindUncheckedCreateWithoutEventsInput>;
};
export type EventKindUpsertWithoutEventsInput = {
    update: Prisma.XOR<Prisma.EventKindUpdateWithoutEventsInput, Prisma.EventKindUncheckedUpdateWithoutEventsInput>;
    create: Prisma.XOR<Prisma.EventKindCreateWithoutEventsInput, Prisma.EventKindUncheckedCreateWithoutEventsInput>;
    where?: Prisma.EventKindWhereInput;
};
export type EventKindUpdateToOneWithWhereWithoutEventsInput = {
    where?: Prisma.EventKindWhereInput;
    data: Prisma.XOR<Prisma.EventKindUpdateWithoutEventsInput, Prisma.EventKindUncheckedUpdateWithoutEventsInput>;
};
export type EventKindUpdateWithoutEventsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type EventKindUncheckedUpdateWithoutEventsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    defaults?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type EventKindCountOutputType = {
    events: number;
};
export type EventKindCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | EventKindCountOutputTypeCountEventsArgs;
};
export type EventKindCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindCountOutputTypeSelect<ExtArgs> | null;
};
export type EventKindCountOutputTypeCountEventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
};
export type EventKindSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    defaults?: boolean;
    active?: boolean;
    events?: boolean | Prisma.EventKind$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventKindCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["eventKind"]>;
export type EventKindSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    defaults?: boolean;
    active?: boolean;
}, ExtArgs["result"]["eventKind"]>;
export type EventKindSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    defaults?: boolean;
    active?: boolean;
}, ExtArgs["result"]["eventKind"]>;
export type EventKindSelectScalar = {
    id?: boolean;
    name?: boolean;
    defaults?: boolean;
    active?: boolean;
};
export type EventKindOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "defaults" | "active", ExtArgs["result"]["eventKind"]>;
export type EventKindInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    events?: boolean | Prisma.EventKind$eventsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventKindCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EventKindIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type EventKindIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $EventKindPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "EventKind";
    objects: {
        events: Prisma.$EventPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        defaults: runtime.JsonValue | null;
        active: boolean;
    }, ExtArgs["result"]["eventKind"]>;
    composites: {};
};
export type EventKindGetPayload<S extends boolean | null | undefined | EventKindDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventKindPayload, S>;
export type EventKindCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventKindFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventKindCountAggregateInputType | true;
};
export interface EventKindDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['EventKind'];
        meta: {
            name: 'EventKind';
        };
    };
    findUnique<T extends EventKindFindUniqueArgs>(args: Prisma.SelectSubset<T, EventKindFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventKindFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventKindFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventKindFindFirstArgs>(args?: Prisma.SelectSubset<T, EventKindFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventKindFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventKindFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventKindFindManyArgs>(args?: Prisma.SelectSubset<T, EventKindFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventKindCreateArgs>(args: Prisma.SelectSubset<T, EventKindCreateArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventKindCreateManyArgs>(args?: Prisma.SelectSubset<T, EventKindCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventKindCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventKindCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventKindDeleteArgs>(args: Prisma.SelectSubset<T, EventKindDeleteArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventKindUpdateArgs>(args: Prisma.SelectSubset<T, EventKindUpdateArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventKindDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventKindDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventKindUpdateManyArgs>(args: Prisma.SelectSubset<T, EventKindUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventKindUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventKindUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventKindUpsertArgs>(args: Prisma.SelectSubset<T, EventKindUpsertArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventKindCountArgs>(args?: Prisma.Subset<T, EventKindCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventKindCountAggregateOutputType> : number>;
    aggregate<T extends EventKindAggregateArgs>(args: Prisma.Subset<T, EventKindAggregateArgs>): Prisma.PrismaPromise<GetEventKindAggregateType<T>>;
    groupBy<T extends EventKindGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventKindGroupByArgs['orderBy'];
    } : {
        orderBy?: EventKindGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventKindGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventKindGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventKindFieldRefs;
}
export interface Prisma__EventKindClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    events<T extends Prisma.EventKind$eventsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventKind$eventsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventKindFieldRefs {
    readonly id: Prisma.FieldRef<"EventKind", 'Int'>;
    readonly name: Prisma.FieldRef<"EventKind", 'String'>;
    readonly defaults: Prisma.FieldRef<"EventKind", 'Json'>;
    readonly active: Prisma.FieldRef<"EventKind", 'Boolean'>;
}
export type EventKindFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where: Prisma.EventKindWhereUniqueInput;
};
export type EventKindFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where: Prisma.EventKindWhereUniqueInput;
};
export type EventKindFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where?: Prisma.EventKindWhereInput;
    orderBy?: Prisma.EventKindOrderByWithRelationInput | Prisma.EventKindOrderByWithRelationInput[];
    cursor?: Prisma.EventKindWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventKindScalarFieldEnum | Prisma.EventKindScalarFieldEnum[];
};
export type EventKindFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where?: Prisma.EventKindWhereInput;
    orderBy?: Prisma.EventKindOrderByWithRelationInput | Prisma.EventKindOrderByWithRelationInput[];
    cursor?: Prisma.EventKindWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventKindScalarFieldEnum | Prisma.EventKindScalarFieldEnum[];
};
export type EventKindFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where?: Prisma.EventKindWhereInput;
    orderBy?: Prisma.EventKindOrderByWithRelationInput | Prisma.EventKindOrderByWithRelationInput[];
    cursor?: Prisma.EventKindWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventKindScalarFieldEnum | Prisma.EventKindScalarFieldEnum[];
};
export type EventKindCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventKindCreateInput, Prisma.EventKindUncheckedCreateInput>;
};
export type EventKindCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventKindCreateManyInput | Prisma.EventKindCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventKindCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    data: Prisma.EventKindCreateManyInput | Prisma.EventKindCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventKindUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventKindUpdateInput, Prisma.EventKindUncheckedUpdateInput>;
    where: Prisma.EventKindWhereUniqueInput;
};
export type EventKindUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventKindUpdateManyMutationInput, Prisma.EventKindUncheckedUpdateManyInput>;
    where?: Prisma.EventKindWhereInput;
    limit?: number;
};
export type EventKindUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventKindUpdateManyMutationInput, Prisma.EventKindUncheckedUpdateManyInput>;
    where?: Prisma.EventKindWhereInput;
    limit?: number;
};
export type EventKindUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where: Prisma.EventKindWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventKindCreateInput, Prisma.EventKindUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventKindUpdateInput, Prisma.EventKindUncheckedUpdateInput>;
};
export type EventKindDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
    where: Prisma.EventKindWhereUniqueInput;
};
export type EventKindDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventKindWhereInput;
    limit?: number;
};
export type EventKind$eventsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventKindDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventKindSelect<ExtArgs> | null;
    omit?: Prisma.EventKindOmit<ExtArgs> | null;
    include?: Prisma.EventKindInclude<ExtArgs> | null;
};
