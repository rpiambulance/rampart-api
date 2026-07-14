import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type SchedulingSettingModel = runtime.Types.Result.DefaultSelection<Prisma.$SchedulingSettingPayload>;
export type AggregateSchedulingSetting = {
    _count: SchedulingSettingCountAggregateOutputType | null;
    _min: SchedulingSettingMinAggregateOutputType | null;
    _max: SchedulingSettingMaxAggregateOutputType | null;
};
export type SchedulingSettingMinAggregateOutputType = {
    key: string | null;
};
export type SchedulingSettingMaxAggregateOutputType = {
    key: string | null;
};
export type SchedulingSettingCountAggregateOutputType = {
    key: number;
    value: number;
    _all: number;
};
export type SchedulingSettingMinAggregateInputType = {
    key?: true;
};
export type SchedulingSettingMaxAggregateInputType = {
    key?: true;
};
export type SchedulingSettingCountAggregateInputType = {
    key?: true;
    value?: true;
    _all?: true;
};
export type SchedulingSettingAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SchedulingSettingWhereInput;
    orderBy?: Prisma.SchedulingSettingOrderByWithRelationInput | Prisma.SchedulingSettingOrderByWithRelationInput[];
    cursor?: Prisma.SchedulingSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | SchedulingSettingCountAggregateInputType;
    _min?: SchedulingSettingMinAggregateInputType;
    _max?: SchedulingSettingMaxAggregateInputType;
};
export type GetSchedulingSettingAggregateType<T extends SchedulingSettingAggregateArgs> = {
    [P in keyof T & keyof AggregateSchedulingSetting]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateSchedulingSetting[P]> : Prisma.GetScalarType<T[P], AggregateSchedulingSetting[P]>;
};
export type SchedulingSettingGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SchedulingSettingWhereInput;
    orderBy?: Prisma.SchedulingSettingOrderByWithAggregationInput | Prisma.SchedulingSettingOrderByWithAggregationInput[];
    by: Prisma.SchedulingSettingScalarFieldEnum[] | Prisma.SchedulingSettingScalarFieldEnum;
    having?: Prisma.SchedulingSettingScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: SchedulingSettingCountAggregateInputType | true;
    _min?: SchedulingSettingMinAggregateInputType;
    _max?: SchedulingSettingMaxAggregateInputType;
};
export type SchedulingSettingGroupByOutputType = {
    key: string;
    value: runtime.JsonValue;
    _count: SchedulingSettingCountAggregateOutputType | null;
    _min: SchedulingSettingMinAggregateOutputType | null;
    _max: SchedulingSettingMaxAggregateOutputType | null;
};
export type GetSchedulingSettingGroupByPayload<T extends SchedulingSettingGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<SchedulingSettingGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof SchedulingSettingGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], SchedulingSettingGroupByOutputType[P]> : Prisma.GetScalarType<T[P], SchedulingSettingGroupByOutputType[P]>;
}>>;
export type SchedulingSettingWhereInput = {
    AND?: Prisma.SchedulingSettingWhereInput | Prisma.SchedulingSettingWhereInput[];
    OR?: Prisma.SchedulingSettingWhereInput[];
    NOT?: Prisma.SchedulingSettingWhereInput | Prisma.SchedulingSettingWhereInput[];
    key?: Prisma.StringFilter<"SchedulingSetting"> | string;
    value?: Prisma.JsonFilter<"SchedulingSetting">;
};
export type SchedulingSettingOrderByWithRelationInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
};
export type SchedulingSettingWhereUniqueInput = Prisma.AtLeast<{
    key?: string;
    AND?: Prisma.SchedulingSettingWhereInput | Prisma.SchedulingSettingWhereInput[];
    OR?: Prisma.SchedulingSettingWhereInput[];
    NOT?: Prisma.SchedulingSettingWhereInput | Prisma.SchedulingSettingWhereInput[];
    value?: Prisma.JsonFilter<"SchedulingSetting">;
}, "key">;
export type SchedulingSettingOrderByWithAggregationInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
    _count?: Prisma.SchedulingSettingCountOrderByAggregateInput;
    _max?: Prisma.SchedulingSettingMaxOrderByAggregateInput;
    _min?: Prisma.SchedulingSettingMinOrderByAggregateInput;
};
export type SchedulingSettingScalarWhereWithAggregatesInput = {
    AND?: Prisma.SchedulingSettingScalarWhereWithAggregatesInput | Prisma.SchedulingSettingScalarWhereWithAggregatesInput[];
    OR?: Prisma.SchedulingSettingScalarWhereWithAggregatesInput[];
    NOT?: Prisma.SchedulingSettingScalarWhereWithAggregatesInput | Prisma.SchedulingSettingScalarWhereWithAggregatesInput[];
    key?: Prisma.StringWithAggregatesFilter<"SchedulingSetting"> | string;
    value?: Prisma.JsonWithAggregatesFilter<"SchedulingSetting">;
};
export type SchedulingSettingCreateInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingUncheckedCreateInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingUncheckedUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingCreateManyInput = {
    key: string;
    value: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingUncheckedUpdateManyInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    value?: Prisma.JsonNullValueInput | runtime.InputJsonValue;
};
export type SchedulingSettingCountOrderByAggregateInput = {
    key?: Prisma.SortOrder;
    value?: Prisma.SortOrder;
};
export type SchedulingSettingMaxOrderByAggregateInput = {
    key?: Prisma.SortOrder;
};
export type SchedulingSettingMinOrderByAggregateInput = {
    key?: Prisma.SortOrder;
};
export type SchedulingSettingSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
}, ExtArgs["result"]["schedulingSetting"]>;
export type SchedulingSettingSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
}, ExtArgs["result"]["schedulingSetting"]>;
export type SchedulingSettingSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    key?: boolean;
    value?: boolean;
}, ExtArgs["result"]["schedulingSetting"]>;
export type SchedulingSettingSelectScalar = {
    key?: boolean;
    value?: boolean;
};
export type SchedulingSettingOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"key" | "value", ExtArgs["result"]["schedulingSetting"]>;
export type $SchedulingSettingPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "SchedulingSetting";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        key: string;
        value: runtime.JsonValue;
    }, ExtArgs["result"]["schedulingSetting"]>;
    composites: {};
};
export type SchedulingSettingGetPayload<S extends boolean | null | undefined | SchedulingSettingDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload, S>;
export type SchedulingSettingCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<SchedulingSettingFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: SchedulingSettingCountAggregateInputType | true;
};
export interface SchedulingSettingDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['SchedulingSetting'];
        meta: {
            name: 'SchedulingSetting';
        };
    };
    findUnique<T extends SchedulingSettingFindUniqueArgs>(args: Prisma.SelectSubset<T, SchedulingSettingFindUniqueArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends SchedulingSettingFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, SchedulingSettingFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends SchedulingSettingFindFirstArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingFindFirstArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends SchedulingSettingFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends SchedulingSettingFindManyArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends SchedulingSettingCreateArgs>(args: Prisma.SelectSubset<T, SchedulingSettingCreateArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends SchedulingSettingCreateManyArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends SchedulingSettingCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends SchedulingSettingDeleteArgs>(args: Prisma.SelectSubset<T, SchedulingSettingDeleteArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends SchedulingSettingUpdateArgs>(args: Prisma.SelectSubset<T, SchedulingSettingUpdateArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends SchedulingSettingDeleteManyArgs>(args?: Prisma.SelectSubset<T, SchedulingSettingDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends SchedulingSettingUpdateManyArgs>(args: Prisma.SelectSubset<T, SchedulingSettingUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends SchedulingSettingUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, SchedulingSettingUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends SchedulingSettingUpsertArgs>(args: Prisma.SelectSubset<T, SchedulingSettingUpsertArgs<ExtArgs>>): Prisma.Prisma__SchedulingSettingClient<runtime.Types.Result.GetResult<Prisma.$SchedulingSettingPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends SchedulingSettingCountArgs>(args?: Prisma.Subset<T, SchedulingSettingCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], SchedulingSettingCountAggregateOutputType> : number>;
    aggregate<T extends SchedulingSettingAggregateArgs>(args: Prisma.Subset<T, SchedulingSettingAggregateArgs>): Prisma.PrismaPromise<GetSchedulingSettingAggregateType<T>>;
    groupBy<T extends SchedulingSettingGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: SchedulingSettingGroupByArgs['orderBy'];
    } : {
        orderBy?: SchedulingSettingGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, SchedulingSettingGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetSchedulingSettingGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: SchedulingSettingFieldRefs;
}
export interface Prisma__SchedulingSettingClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface SchedulingSettingFieldRefs {
    readonly key: Prisma.FieldRef<"SchedulingSetting", 'String'>;
    readonly value: Prisma.FieldRef<"SchedulingSetting", 'Json'>;
}
export type SchedulingSettingFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where: Prisma.SchedulingSettingWhereUniqueInput;
};
export type SchedulingSettingFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where: Prisma.SchedulingSettingWhereUniqueInput;
};
export type SchedulingSettingFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where?: Prisma.SchedulingSettingWhereInput;
    orderBy?: Prisma.SchedulingSettingOrderByWithRelationInput | Prisma.SchedulingSettingOrderByWithRelationInput[];
    cursor?: Prisma.SchedulingSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SchedulingSettingScalarFieldEnum | Prisma.SchedulingSettingScalarFieldEnum[];
};
export type SchedulingSettingFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where?: Prisma.SchedulingSettingWhereInput;
    orderBy?: Prisma.SchedulingSettingOrderByWithRelationInput | Prisma.SchedulingSettingOrderByWithRelationInput[];
    cursor?: Prisma.SchedulingSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SchedulingSettingScalarFieldEnum | Prisma.SchedulingSettingScalarFieldEnum[];
};
export type SchedulingSettingFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where?: Prisma.SchedulingSettingWhereInput;
    orderBy?: Prisma.SchedulingSettingOrderByWithRelationInput | Prisma.SchedulingSettingOrderByWithRelationInput[];
    cursor?: Prisma.SchedulingSettingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.SchedulingSettingScalarFieldEnum | Prisma.SchedulingSettingScalarFieldEnum[];
};
export type SchedulingSettingCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SchedulingSettingCreateInput, Prisma.SchedulingSettingUncheckedCreateInput>;
};
export type SchedulingSettingCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.SchedulingSettingCreateManyInput | Prisma.SchedulingSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SchedulingSettingCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    data: Prisma.SchedulingSettingCreateManyInput | Prisma.SchedulingSettingCreateManyInput[];
    skipDuplicates?: boolean;
};
export type SchedulingSettingUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SchedulingSettingUpdateInput, Prisma.SchedulingSettingUncheckedUpdateInput>;
    where: Prisma.SchedulingSettingWhereUniqueInput;
};
export type SchedulingSettingUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.SchedulingSettingUpdateManyMutationInput, Prisma.SchedulingSettingUncheckedUpdateManyInput>;
    where?: Prisma.SchedulingSettingWhereInput;
    limit?: number;
};
export type SchedulingSettingUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.SchedulingSettingUpdateManyMutationInput, Prisma.SchedulingSettingUncheckedUpdateManyInput>;
    where?: Prisma.SchedulingSettingWhereInput;
    limit?: number;
};
export type SchedulingSettingUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where: Prisma.SchedulingSettingWhereUniqueInput;
    create: Prisma.XOR<Prisma.SchedulingSettingCreateInput, Prisma.SchedulingSettingUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.SchedulingSettingUpdateInput, Prisma.SchedulingSettingUncheckedUpdateInput>;
};
export type SchedulingSettingDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
    where: Prisma.SchedulingSettingWhereUniqueInput;
};
export type SchedulingSettingDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.SchedulingSettingWhereInput;
    limit?: number;
};
export type SchedulingSettingDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.SchedulingSettingSelect<ExtArgs> | null;
    omit?: Prisma.SchedulingSettingOmit<ExtArgs> | null;
};
