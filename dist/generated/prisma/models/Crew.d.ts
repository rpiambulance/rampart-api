import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CrewModel = runtime.Types.Result.DefaultSelection<Prisma.$CrewPayload>;
export type AggregateCrew = {
    _count: CrewCountAggregateOutputType | null;
    _avg: CrewAvgAggregateOutputType | null;
    _sum: CrewSumAggregateOutputType | null;
    _min: CrewMinAggregateOutputType | null;
    _max: CrewMaxAggregateOutputType | null;
};
export type CrewAvgAggregateOutputType = {
    id: number | null;
};
export type CrewSumAggregateOutputType = {
    id: number | null;
};
export type CrewMinAggregateOutputType = {
    id: number | null;
    date: Date | null;
};
export type CrewMaxAggregateOutputType = {
    id: number | null;
    date: Date | null;
};
export type CrewCountAggregateOutputType = {
    id: number;
    date: number;
    _all: number;
};
export type CrewAvgAggregateInputType = {
    id?: true;
};
export type CrewSumAggregateInputType = {
    id?: true;
};
export type CrewMinAggregateInputType = {
    id?: true;
    date?: true;
};
export type CrewMaxAggregateInputType = {
    id?: true;
    date?: true;
};
export type CrewCountAggregateInputType = {
    id?: true;
    date?: true;
    _all?: true;
};
export type CrewAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrewWhereInput;
    orderBy?: Prisma.CrewOrderByWithRelationInput | Prisma.CrewOrderByWithRelationInput[];
    cursor?: Prisma.CrewWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CrewCountAggregateInputType;
    _avg?: CrewAvgAggregateInputType;
    _sum?: CrewSumAggregateInputType;
    _min?: CrewMinAggregateInputType;
    _max?: CrewMaxAggregateInputType;
};
export type GetCrewAggregateType<T extends CrewAggregateArgs> = {
    [P in keyof T & keyof AggregateCrew]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCrew[P]> : Prisma.GetScalarType<T[P], AggregateCrew[P]>;
};
export type CrewGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrewWhereInput;
    orderBy?: Prisma.CrewOrderByWithAggregationInput | Prisma.CrewOrderByWithAggregationInput[];
    by: Prisma.CrewScalarFieldEnum[] | Prisma.CrewScalarFieldEnum;
    having?: Prisma.CrewScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CrewCountAggregateInputType | true;
    _avg?: CrewAvgAggregateInputType;
    _sum?: CrewSumAggregateInputType;
    _min?: CrewMinAggregateInputType;
    _max?: CrewMaxAggregateInputType;
};
export type CrewGroupByOutputType = {
    id: number;
    date: Date;
    _count: CrewCountAggregateOutputType | null;
    _avg: CrewAvgAggregateOutputType | null;
    _sum: CrewSumAggregateOutputType | null;
    _min: CrewMinAggregateOutputType | null;
    _max: CrewMaxAggregateOutputType | null;
};
export type GetCrewGroupByPayload<T extends CrewGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CrewGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CrewGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CrewGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CrewGroupByOutputType[P]>;
}>>;
export type CrewWhereInput = {
    AND?: Prisma.CrewWhereInput | Prisma.CrewWhereInput[];
    OR?: Prisma.CrewWhereInput[];
    NOT?: Prisma.CrewWhereInput | Prisma.CrewWhereInput[];
    id?: Prisma.IntFilter<"Crew"> | number;
    date?: Prisma.DateTimeFilter<"Crew"> | Date | string;
    slots?: Prisma.CrewSlotListRelationFilter;
};
export type CrewOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    slots?: Prisma.CrewSlotOrderByRelationAggregateInput;
};
export type CrewWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    date?: Date | string;
    AND?: Prisma.CrewWhereInput | Prisma.CrewWhereInput[];
    OR?: Prisma.CrewWhereInput[];
    NOT?: Prisma.CrewWhereInput | Prisma.CrewWhereInput[];
    slots?: Prisma.CrewSlotListRelationFilter;
}, "id" | "date">;
export type CrewOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
    _count?: Prisma.CrewCountOrderByAggregateInput;
    _avg?: Prisma.CrewAvgOrderByAggregateInput;
    _max?: Prisma.CrewMaxOrderByAggregateInput;
    _min?: Prisma.CrewMinOrderByAggregateInput;
    _sum?: Prisma.CrewSumOrderByAggregateInput;
};
export type CrewScalarWhereWithAggregatesInput = {
    AND?: Prisma.CrewScalarWhereWithAggregatesInput | Prisma.CrewScalarWhereWithAggregatesInput[];
    OR?: Prisma.CrewScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CrewScalarWhereWithAggregatesInput | Prisma.CrewScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Crew"> | number;
    date?: Prisma.DateTimeWithAggregatesFilter<"Crew"> | Date | string;
};
export type CrewCreateInput = {
    date: Date | string;
    slots?: Prisma.CrewSlotCreateNestedManyWithoutCrewInput;
};
export type CrewUncheckedCreateInput = {
    id?: number;
    date: Date | string;
    slots?: Prisma.CrewSlotUncheckedCreateNestedManyWithoutCrewInput;
};
export type CrewUpdateInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    slots?: Prisma.CrewSlotUpdateManyWithoutCrewNestedInput;
};
export type CrewUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    slots?: Prisma.CrewSlotUncheckedUpdateManyWithoutCrewNestedInput;
};
export type CrewCreateManyInput = {
    id?: number;
    date: Date | string;
};
export type CrewUpdateManyMutationInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrewUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrewCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type CrewAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type CrewMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type CrewMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    date?: Prisma.SortOrder;
};
export type CrewSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type CrewScalarRelationFilter = {
    is?: Prisma.CrewWhereInput;
    isNot?: Prisma.CrewWhereInput;
};
export type CrewCreateNestedOneWithoutSlotsInput = {
    create?: Prisma.XOR<Prisma.CrewCreateWithoutSlotsInput, Prisma.CrewUncheckedCreateWithoutSlotsInput>;
    connectOrCreate?: Prisma.CrewCreateOrConnectWithoutSlotsInput;
    connect?: Prisma.CrewWhereUniqueInput;
};
export type CrewUpdateOneRequiredWithoutSlotsNestedInput = {
    create?: Prisma.XOR<Prisma.CrewCreateWithoutSlotsInput, Prisma.CrewUncheckedCreateWithoutSlotsInput>;
    connectOrCreate?: Prisma.CrewCreateOrConnectWithoutSlotsInput;
    upsert?: Prisma.CrewUpsertWithoutSlotsInput;
    connect?: Prisma.CrewWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CrewUpdateToOneWithWhereWithoutSlotsInput, Prisma.CrewUpdateWithoutSlotsInput>, Prisma.CrewUncheckedUpdateWithoutSlotsInput>;
};
export type CrewCreateWithoutSlotsInput = {
    date: Date | string;
};
export type CrewUncheckedCreateWithoutSlotsInput = {
    id?: number;
    date: Date | string;
};
export type CrewCreateOrConnectWithoutSlotsInput = {
    where: Prisma.CrewWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrewCreateWithoutSlotsInput, Prisma.CrewUncheckedCreateWithoutSlotsInput>;
};
export type CrewUpsertWithoutSlotsInput = {
    update: Prisma.XOR<Prisma.CrewUpdateWithoutSlotsInput, Prisma.CrewUncheckedUpdateWithoutSlotsInput>;
    create: Prisma.XOR<Prisma.CrewCreateWithoutSlotsInput, Prisma.CrewUncheckedCreateWithoutSlotsInput>;
    where?: Prisma.CrewWhereInput;
};
export type CrewUpdateToOneWithWhereWithoutSlotsInput = {
    where?: Prisma.CrewWhereInput;
    data: Prisma.XOR<Prisma.CrewUpdateWithoutSlotsInput, Prisma.CrewUncheckedUpdateWithoutSlotsInput>;
};
export type CrewUpdateWithoutSlotsInput = {
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrewUncheckedUpdateWithoutSlotsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    date?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CrewCountOutputType = {
    slots: number;
};
export type CrewCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    slots?: boolean | CrewCountOutputTypeCountSlotsArgs;
};
export type CrewCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewCountOutputTypeSelect<ExtArgs> | null;
};
export type CrewCountOutputTypeCountSlotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrewSlotWhereInput;
};
export type CrewSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
    slots?: boolean | Prisma.Crew$slotsArgs<ExtArgs>;
    _count?: boolean | Prisma.CrewCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["crew"]>;
export type CrewSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
}, ExtArgs["result"]["crew"]>;
export type CrewSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    date?: boolean;
}, ExtArgs["result"]["crew"]>;
export type CrewSelectScalar = {
    id?: boolean;
    date?: boolean;
};
export type CrewOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "date", ExtArgs["result"]["crew"]>;
export type CrewInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    slots?: boolean | Prisma.Crew$slotsArgs<ExtArgs>;
    _count?: boolean | Prisma.CrewCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CrewIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type CrewIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $CrewPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Crew";
    objects: {
        slots: Prisma.$CrewSlotPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        date: Date;
    }, ExtArgs["result"]["crew"]>;
    composites: {};
};
export type CrewGetPayload<S extends boolean | null | undefined | CrewDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CrewPayload, S>;
export type CrewCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CrewFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CrewCountAggregateInputType | true;
};
export interface CrewDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Crew'];
        meta: {
            name: 'Crew';
        };
    };
    findUnique<T extends CrewFindUniqueArgs>(args: Prisma.SelectSubset<T, CrewFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CrewFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CrewFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CrewFindFirstArgs>(args?: Prisma.SelectSubset<T, CrewFindFirstArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CrewFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CrewFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CrewFindManyArgs>(args?: Prisma.SelectSubset<T, CrewFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CrewCreateArgs>(args: Prisma.SelectSubset<T, CrewCreateArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CrewCreateManyArgs>(args?: Prisma.SelectSubset<T, CrewCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CrewCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CrewCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CrewDeleteArgs>(args: Prisma.SelectSubset<T, CrewDeleteArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CrewUpdateArgs>(args: Prisma.SelectSubset<T, CrewUpdateArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CrewDeleteManyArgs>(args?: Prisma.SelectSubset<T, CrewDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CrewUpdateManyArgs>(args: Prisma.SelectSubset<T, CrewUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CrewUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CrewUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CrewUpsertArgs>(args: Prisma.SelectSubset<T, CrewUpsertArgs<ExtArgs>>): Prisma.Prisma__CrewClient<runtime.Types.Result.GetResult<Prisma.$CrewPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CrewCountArgs>(args?: Prisma.Subset<T, CrewCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CrewCountAggregateOutputType> : number>;
    aggregate<T extends CrewAggregateArgs>(args: Prisma.Subset<T, CrewAggregateArgs>): Prisma.PrismaPromise<GetCrewAggregateType<T>>;
    groupBy<T extends CrewGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CrewGroupByArgs['orderBy'];
    } : {
        orderBy?: CrewGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CrewGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCrewGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CrewFieldRefs;
}
export interface Prisma__CrewClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    slots<T extends Prisma.Crew$slotsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Crew$slotsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CrewSlotPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CrewFieldRefs {
    readonly id: Prisma.FieldRef<"Crew", 'Int'>;
    readonly date: Prisma.FieldRef<"Crew", 'DateTime'>;
}
export type CrewFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where: Prisma.CrewWhereUniqueInput;
};
export type CrewFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where: Prisma.CrewWhereUniqueInput;
};
export type CrewFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where?: Prisma.CrewWhereInput;
    orderBy?: Prisma.CrewOrderByWithRelationInput | Prisma.CrewOrderByWithRelationInput[];
    cursor?: Prisma.CrewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrewScalarFieldEnum | Prisma.CrewScalarFieldEnum[];
};
export type CrewFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where?: Prisma.CrewWhereInput;
    orderBy?: Prisma.CrewOrderByWithRelationInput | Prisma.CrewOrderByWithRelationInput[];
    cursor?: Prisma.CrewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrewScalarFieldEnum | Prisma.CrewScalarFieldEnum[];
};
export type CrewFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where?: Prisma.CrewWhereInput;
    orderBy?: Prisma.CrewOrderByWithRelationInput | Prisma.CrewOrderByWithRelationInput[];
    cursor?: Prisma.CrewWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrewScalarFieldEnum | Prisma.CrewScalarFieldEnum[];
};
export type CrewCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrewCreateInput, Prisma.CrewUncheckedCreateInput>;
};
export type CrewCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CrewCreateManyInput | Prisma.CrewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CrewCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    data: Prisma.CrewCreateManyInput | Prisma.CrewCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CrewUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrewUpdateInput, Prisma.CrewUncheckedUpdateInput>;
    where: Prisma.CrewWhereUniqueInput;
};
export type CrewUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CrewUpdateManyMutationInput, Prisma.CrewUncheckedUpdateManyInput>;
    where?: Prisma.CrewWhereInput;
    limit?: number;
};
export type CrewUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CrewUpdateManyMutationInput, Prisma.CrewUncheckedUpdateManyInput>;
    where?: Prisma.CrewWhereInput;
    limit?: number;
};
export type CrewUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where: Prisma.CrewWhereUniqueInput;
    create: Prisma.XOR<Prisma.CrewCreateInput, Prisma.CrewUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CrewUpdateInput, Prisma.CrewUncheckedUpdateInput>;
};
export type CrewDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
    where: Prisma.CrewWhereUniqueInput;
};
export type CrewDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CrewWhereInput;
    limit?: number;
};
export type Crew$slotsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSlotSelect<ExtArgs> | null;
    omit?: Prisma.CrewSlotOmit<ExtArgs> | null;
    include?: Prisma.CrewSlotInclude<ExtArgs> | null;
    where?: Prisma.CrewSlotWhereInput;
    orderBy?: Prisma.CrewSlotOrderByWithRelationInput | Prisma.CrewSlotOrderByWithRelationInput[];
    cursor?: Prisma.CrewSlotWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CrewSlotScalarFieldEnum | Prisma.CrewSlotScalarFieldEnum[];
};
export type CrewDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CrewSelect<ExtArgs> | null;
    omit?: Prisma.CrewOmit<ExtArgs> | null;
    include?: Prisma.CrewInclude<ExtArgs> | null;
};
