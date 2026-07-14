import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type DefaultCrewTemplateModel = runtime.Types.Result.DefaultSelection<Prisma.$DefaultCrewTemplatePayload>;
export type AggregateDefaultCrewTemplate = {
    _count: DefaultCrewTemplateCountAggregateOutputType | null;
    _avg: DefaultCrewTemplateAvgAggregateOutputType | null;
    _sum: DefaultCrewTemplateSumAggregateOutputType | null;
    _min: DefaultCrewTemplateMinAggregateOutputType | null;
    _max: DefaultCrewTemplateMaxAggregateOutputType | null;
};
export type DefaultCrewTemplateAvgAggregateOutputType = {
    id: number | null;
    weekday: number | null;
    memberId: number | null;
};
export type DefaultCrewTemplateSumAggregateOutputType = {
    id: number | null;
    weekday: number | null;
    memberId: number | null;
};
export type DefaultCrewTemplateMinAggregateOutputType = {
    id: number | null;
    weekday: number | null;
    position: $Enums.CrewPosition | null;
    memberId: number | null;
    placeholder: string | null;
};
export type DefaultCrewTemplateMaxAggregateOutputType = {
    id: number | null;
    weekday: number | null;
    position: $Enums.CrewPosition | null;
    memberId: number | null;
    placeholder: string | null;
};
export type DefaultCrewTemplateCountAggregateOutputType = {
    id: number;
    weekday: number;
    position: number;
    memberId: number;
    placeholder: number;
    _all: number;
};
export type DefaultCrewTemplateAvgAggregateInputType = {
    id?: true;
    weekday?: true;
    memberId?: true;
};
export type DefaultCrewTemplateSumAggregateInputType = {
    id?: true;
    weekday?: true;
    memberId?: true;
};
export type DefaultCrewTemplateMinAggregateInputType = {
    id?: true;
    weekday?: true;
    position?: true;
    memberId?: true;
    placeholder?: true;
};
export type DefaultCrewTemplateMaxAggregateInputType = {
    id?: true;
    weekday?: true;
    position?: true;
    memberId?: true;
    placeholder?: true;
};
export type DefaultCrewTemplateCountAggregateInputType = {
    id?: true;
    weekday?: true;
    position?: true;
    memberId?: true;
    placeholder?: true;
    _all?: true;
};
export type DefaultCrewTemplateAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DefaultCrewTemplateWhereInput;
    orderBy?: Prisma.DefaultCrewTemplateOrderByWithRelationInput | Prisma.DefaultCrewTemplateOrderByWithRelationInput[];
    cursor?: Prisma.DefaultCrewTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | DefaultCrewTemplateCountAggregateInputType;
    _avg?: DefaultCrewTemplateAvgAggregateInputType;
    _sum?: DefaultCrewTemplateSumAggregateInputType;
    _min?: DefaultCrewTemplateMinAggregateInputType;
    _max?: DefaultCrewTemplateMaxAggregateInputType;
};
export type GetDefaultCrewTemplateAggregateType<T extends DefaultCrewTemplateAggregateArgs> = {
    [P in keyof T & keyof AggregateDefaultCrewTemplate]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateDefaultCrewTemplate[P]> : Prisma.GetScalarType<T[P], AggregateDefaultCrewTemplate[P]>;
};
export type DefaultCrewTemplateGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DefaultCrewTemplateWhereInput;
    orderBy?: Prisma.DefaultCrewTemplateOrderByWithAggregationInput | Prisma.DefaultCrewTemplateOrderByWithAggregationInput[];
    by: Prisma.DefaultCrewTemplateScalarFieldEnum[] | Prisma.DefaultCrewTemplateScalarFieldEnum;
    having?: Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: DefaultCrewTemplateCountAggregateInputType | true;
    _avg?: DefaultCrewTemplateAvgAggregateInputType;
    _sum?: DefaultCrewTemplateSumAggregateInputType;
    _min?: DefaultCrewTemplateMinAggregateInputType;
    _max?: DefaultCrewTemplateMaxAggregateInputType;
};
export type DefaultCrewTemplateGroupByOutputType = {
    id: number;
    weekday: number;
    position: $Enums.CrewPosition;
    memberId: number | null;
    placeholder: string | null;
    _count: DefaultCrewTemplateCountAggregateOutputType | null;
    _avg: DefaultCrewTemplateAvgAggregateOutputType | null;
    _sum: DefaultCrewTemplateSumAggregateOutputType | null;
    _min: DefaultCrewTemplateMinAggregateOutputType | null;
    _max: DefaultCrewTemplateMaxAggregateOutputType | null;
};
export type GetDefaultCrewTemplateGroupByPayload<T extends DefaultCrewTemplateGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<DefaultCrewTemplateGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof DefaultCrewTemplateGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], DefaultCrewTemplateGroupByOutputType[P]> : Prisma.GetScalarType<T[P], DefaultCrewTemplateGroupByOutputType[P]>;
}>>;
export type DefaultCrewTemplateWhereInput = {
    AND?: Prisma.DefaultCrewTemplateWhereInput | Prisma.DefaultCrewTemplateWhereInput[];
    OR?: Prisma.DefaultCrewTemplateWhereInput[];
    NOT?: Prisma.DefaultCrewTemplateWhereInput | Prisma.DefaultCrewTemplateWhereInput[];
    id?: Prisma.IntFilter<"DefaultCrewTemplate"> | number;
    weekday?: Prisma.IntFilter<"DefaultCrewTemplate"> | number;
    position?: Prisma.EnumCrewPositionFilter<"DefaultCrewTemplate"> | $Enums.CrewPosition;
    memberId?: Prisma.IntNullableFilter<"DefaultCrewTemplate"> | number | null;
    placeholder?: Prisma.StringNullableFilter<"DefaultCrewTemplate"> | string | null;
};
export type DefaultCrewTemplateOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    memberId?: Prisma.SortOrderInput | Prisma.SortOrder;
    placeholder?: Prisma.SortOrderInput | Prisma.SortOrder;
};
export type DefaultCrewTemplateWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    weekday_position?: Prisma.DefaultCrewTemplateWeekdayPositionCompoundUniqueInput;
    AND?: Prisma.DefaultCrewTemplateWhereInput | Prisma.DefaultCrewTemplateWhereInput[];
    OR?: Prisma.DefaultCrewTemplateWhereInput[];
    NOT?: Prisma.DefaultCrewTemplateWhereInput | Prisma.DefaultCrewTemplateWhereInput[];
    weekday?: Prisma.IntFilter<"DefaultCrewTemplate"> | number;
    position?: Prisma.EnumCrewPositionFilter<"DefaultCrewTemplate"> | $Enums.CrewPosition;
    memberId?: Prisma.IntNullableFilter<"DefaultCrewTemplate"> | number | null;
    placeholder?: Prisma.StringNullableFilter<"DefaultCrewTemplate"> | string | null;
}, "id" | "weekday_position">;
export type DefaultCrewTemplateOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    memberId?: Prisma.SortOrderInput | Prisma.SortOrder;
    placeholder?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.DefaultCrewTemplateCountOrderByAggregateInput;
    _avg?: Prisma.DefaultCrewTemplateAvgOrderByAggregateInput;
    _max?: Prisma.DefaultCrewTemplateMaxOrderByAggregateInput;
    _min?: Prisma.DefaultCrewTemplateMinOrderByAggregateInput;
    _sum?: Prisma.DefaultCrewTemplateSumOrderByAggregateInput;
};
export type DefaultCrewTemplateScalarWhereWithAggregatesInput = {
    AND?: Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput | Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput[];
    OR?: Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput[];
    NOT?: Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput | Prisma.DefaultCrewTemplateScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"DefaultCrewTemplate"> | number;
    weekday?: Prisma.IntWithAggregatesFilter<"DefaultCrewTemplate"> | number;
    position?: Prisma.EnumCrewPositionWithAggregatesFilter<"DefaultCrewTemplate"> | $Enums.CrewPosition;
    memberId?: Prisma.IntNullableWithAggregatesFilter<"DefaultCrewTemplate"> | number | null;
    placeholder?: Prisma.StringNullableWithAggregatesFilter<"DefaultCrewTemplate"> | string | null;
};
export type DefaultCrewTemplateCreateInput = {
    weekday: number;
    position: $Enums.CrewPosition;
    memberId?: number | null;
    placeholder?: string | null;
};
export type DefaultCrewTemplateUncheckedCreateInput = {
    id?: number;
    weekday: number;
    position: $Enums.CrewPosition;
    memberId?: number | null;
    placeholder?: string | null;
};
export type DefaultCrewTemplateUpdateInput = {
    weekday?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumCrewPositionFieldUpdateOperationsInput | $Enums.CrewPosition;
    memberId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    placeholder?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DefaultCrewTemplateUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekday?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumCrewPositionFieldUpdateOperationsInput | $Enums.CrewPosition;
    memberId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    placeholder?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DefaultCrewTemplateCreateManyInput = {
    id?: number;
    weekday: number;
    position: $Enums.CrewPosition;
    memberId?: number | null;
    placeholder?: string | null;
};
export type DefaultCrewTemplateUpdateManyMutationInput = {
    weekday?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumCrewPositionFieldUpdateOperationsInput | $Enums.CrewPosition;
    memberId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    placeholder?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DefaultCrewTemplateUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    weekday?: Prisma.IntFieldUpdateOperationsInput | number;
    position?: Prisma.EnumCrewPositionFieldUpdateOperationsInput | $Enums.CrewPosition;
    memberId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    placeholder?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type DefaultCrewTemplateWeekdayPositionCompoundUniqueInput = {
    weekday: number;
    position: $Enums.CrewPosition;
};
export type DefaultCrewTemplateCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    placeholder?: Prisma.SortOrder;
};
export type DefaultCrewTemplateAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type DefaultCrewTemplateMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    placeholder?: Prisma.SortOrder;
};
export type DefaultCrewTemplateMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    position?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    placeholder?: Prisma.SortOrder;
};
export type DefaultCrewTemplateSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    weekday?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type DefaultCrewTemplateSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekday?: boolean;
    position?: boolean;
    memberId?: boolean;
    placeholder?: boolean;
}, ExtArgs["result"]["defaultCrewTemplate"]>;
export type DefaultCrewTemplateSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekday?: boolean;
    position?: boolean;
    memberId?: boolean;
    placeholder?: boolean;
}, ExtArgs["result"]["defaultCrewTemplate"]>;
export type DefaultCrewTemplateSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    weekday?: boolean;
    position?: boolean;
    memberId?: boolean;
    placeholder?: boolean;
}, ExtArgs["result"]["defaultCrewTemplate"]>;
export type DefaultCrewTemplateSelectScalar = {
    id?: boolean;
    weekday?: boolean;
    position?: boolean;
    memberId?: boolean;
    placeholder?: boolean;
};
export type DefaultCrewTemplateOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "weekday" | "position" | "memberId" | "placeholder", ExtArgs["result"]["defaultCrewTemplate"]>;
export type $DefaultCrewTemplatePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "DefaultCrewTemplate";
    objects: {};
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        weekday: number;
        position: $Enums.CrewPosition;
        memberId: number | null;
        placeholder: string | null;
    }, ExtArgs["result"]["defaultCrewTemplate"]>;
    composites: {};
};
export type DefaultCrewTemplateGetPayload<S extends boolean | null | undefined | DefaultCrewTemplateDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload, S>;
export type DefaultCrewTemplateCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<DefaultCrewTemplateFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: DefaultCrewTemplateCountAggregateInputType | true;
};
export interface DefaultCrewTemplateDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['DefaultCrewTemplate'];
        meta: {
            name: 'DefaultCrewTemplate';
        };
    };
    findUnique<T extends DefaultCrewTemplateFindUniqueArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateFindUniqueArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends DefaultCrewTemplateFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends DefaultCrewTemplateFindFirstArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateFindFirstArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends DefaultCrewTemplateFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends DefaultCrewTemplateFindManyArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends DefaultCrewTemplateCreateArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateCreateArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends DefaultCrewTemplateCreateManyArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends DefaultCrewTemplateCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends DefaultCrewTemplateDeleteArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateDeleteArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends DefaultCrewTemplateUpdateArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateUpdateArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends DefaultCrewTemplateDeleteManyArgs>(args?: Prisma.SelectSubset<T, DefaultCrewTemplateDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends DefaultCrewTemplateUpdateManyArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends DefaultCrewTemplateUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends DefaultCrewTemplateUpsertArgs>(args: Prisma.SelectSubset<T, DefaultCrewTemplateUpsertArgs<ExtArgs>>): Prisma.Prisma__DefaultCrewTemplateClient<runtime.Types.Result.GetResult<Prisma.$DefaultCrewTemplatePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends DefaultCrewTemplateCountArgs>(args?: Prisma.Subset<T, DefaultCrewTemplateCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], DefaultCrewTemplateCountAggregateOutputType> : number>;
    aggregate<T extends DefaultCrewTemplateAggregateArgs>(args: Prisma.Subset<T, DefaultCrewTemplateAggregateArgs>): Prisma.PrismaPromise<GetDefaultCrewTemplateAggregateType<T>>;
    groupBy<T extends DefaultCrewTemplateGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: DefaultCrewTemplateGroupByArgs['orderBy'];
    } : {
        orderBy?: DefaultCrewTemplateGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, DefaultCrewTemplateGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetDefaultCrewTemplateGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: DefaultCrewTemplateFieldRefs;
}
export interface Prisma__DefaultCrewTemplateClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface DefaultCrewTemplateFieldRefs {
    readonly id: Prisma.FieldRef<"DefaultCrewTemplate", 'Int'>;
    readonly weekday: Prisma.FieldRef<"DefaultCrewTemplate", 'Int'>;
    readonly position: Prisma.FieldRef<"DefaultCrewTemplate", 'CrewPosition'>;
    readonly memberId: Prisma.FieldRef<"DefaultCrewTemplate", 'Int'>;
    readonly placeholder: Prisma.FieldRef<"DefaultCrewTemplate", 'String'>;
}
export type DefaultCrewTemplateFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where: Prisma.DefaultCrewTemplateWhereUniqueInput;
};
export type DefaultCrewTemplateFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where: Prisma.DefaultCrewTemplateWhereUniqueInput;
};
export type DefaultCrewTemplateFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where?: Prisma.DefaultCrewTemplateWhereInput;
    orderBy?: Prisma.DefaultCrewTemplateOrderByWithRelationInput | Prisma.DefaultCrewTemplateOrderByWithRelationInput[];
    cursor?: Prisma.DefaultCrewTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DefaultCrewTemplateScalarFieldEnum | Prisma.DefaultCrewTemplateScalarFieldEnum[];
};
export type DefaultCrewTemplateFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where?: Prisma.DefaultCrewTemplateWhereInput;
    orderBy?: Prisma.DefaultCrewTemplateOrderByWithRelationInput | Prisma.DefaultCrewTemplateOrderByWithRelationInput[];
    cursor?: Prisma.DefaultCrewTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DefaultCrewTemplateScalarFieldEnum | Prisma.DefaultCrewTemplateScalarFieldEnum[];
};
export type DefaultCrewTemplateFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where?: Prisma.DefaultCrewTemplateWhereInput;
    orderBy?: Prisma.DefaultCrewTemplateOrderByWithRelationInput | Prisma.DefaultCrewTemplateOrderByWithRelationInput[];
    cursor?: Prisma.DefaultCrewTemplateWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.DefaultCrewTemplateScalarFieldEnum | Prisma.DefaultCrewTemplateScalarFieldEnum[];
};
export type DefaultCrewTemplateCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DefaultCrewTemplateCreateInput, Prisma.DefaultCrewTemplateUncheckedCreateInput>;
};
export type DefaultCrewTemplateCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.DefaultCrewTemplateCreateManyInput | Prisma.DefaultCrewTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DefaultCrewTemplateCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    data: Prisma.DefaultCrewTemplateCreateManyInput | Prisma.DefaultCrewTemplateCreateManyInput[];
    skipDuplicates?: boolean;
};
export type DefaultCrewTemplateUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DefaultCrewTemplateUpdateInput, Prisma.DefaultCrewTemplateUncheckedUpdateInput>;
    where: Prisma.DefaultCrewTemplateWhereUniqueInput;
};
export type DefaultCrewTemplateUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.DefaultCrewTemplateUpdateManyMutationInput, Prisma.DefaultCrewTemplateUncheckedUpdateManyInput>;
    where?: Prisma.DefaultCrewTemplateWhereInput;
    limit?: number;
};
export type DefaultCrewTemplateUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.DefaultCrewTemplateUpdateManyMutationInput, Prisma.DefaultCrewTemplateUncheckedUpdateManyInput>;
    where?: Prisma.DefaultCrewTemplateWhereInput;
    limit?: number;
};
export type DefaultCrewTemplateUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where: Prisma.DefaultCrewTemplateWhereUniqueInput;
    create: Prisma.XOR<Prisma.DefaultCrewTemplateCreateInput, Prisma.DefaultCrewTemplateUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.DefaultCrewTemplateUpdateInput, Prisma.DefaultCrewTemplateUncheckedUpdateInput>;
};
export type DefaultCrewTemplateDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
    where: Prisma.DefaultCrewTemplateWhereUniqueInput;
};
export type DefaultCrewTemplateDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.DefaultCrewTemplateWhereInput;
    limit?: number;
};
export type DefaultCrewTemplateDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.DefaultCrewTemplateSelect<ExtArgs> | null;
    omit?: Prisma.DefaultCrewTemplateOmit<ExtArgs> | null;
};
