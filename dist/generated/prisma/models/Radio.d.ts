import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type RadioModel = runtime.Types.Result.DefaultSelection<Prisma.$RadioPayload>;
export type AggregateRadio = {
    _count: RadioCountAggregateOutputType | null;
    _avg: RadioAvgAggregateOutputType | null;
    _sum: RadioSumAggregateOutputType | null;
    _min: RadioMinAggregateOutputType | null;
    _max: RadioMaxAggregateOutputType | null;
};
export type RadioAvgAggregateOutputType = {
    id: number | null;
};
export type RadioSumAggregateOutputType = {
    id: number | null;
};
export type RadioMinAggregateOutputType = {
    id: number | null;
    number: string | null;
    model: string | null;
    serial: string | null;
    retired: boolean | null;
};
export type RadioMaxAggregateOutputType = {
    id: number | null;
    number: string | null;
    model: string | null;
    serial: string | null;
    retired: boolean | null;
};
export type RadioCountAggregateOutputType = {
    id: number;
    number: number;
    model: number;
    serial: number;
    accessories: number;
    retired: number;
    _all: number;
};
export type RadioAvgAggregateInputType = {
    id?: true;
};
export type RadioSumAggregateInputType = {
    id?: true;
};
export type RadioMinAggregateInputType = {
    id?: true;
    number?: true;
    model?: true;
    serial?: true;
    retired?: true;
};
export type RadioMaxAggregateInputType = {
    id?: true;
    number?: true;
    model?: true;
    serial?: true;
    retired?: true;
};
export type RadioCountAggregateInputType = {
    id?: true;
    number?: true;
    model?: true;
    serial?: true;
    accessories?: true;
    retired?: true;
    _all?: true;
};
export type RadioAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioWhereInput;
    orderBy?: Prisma.RadioOrderByWithRelationInput | Prisma.RadioOrderByWithRelationInput[];
    cursor?: Prisma.RadioWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | RadioCountAggregateInputType;
    _avg?: RadioAvgAggregateInputType;
    _sum?: RadioSumAggregateInputType;
    _min?: RadioMinAggregateInputType;
    _max?: RadioMaxAggregateInputType;
};
export type GetRadioAggregateType<T extends RadioAggregateArgs> = {
    [P in keyof T & keyof AggregateRadio]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateRadio[P]> : Prisma.GetScalarType<T[P], AggregateRadio[P]>;
};
export type RadioGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioWhereInput;
    orderBy?: Prisma.RadioOrderByWithAggregationInput | Prisma.RadioOrderByWithAggregationInput[];
    by: Prisma.RadioScalarFieldEnum[] | Prisma.RadioScalarFieldEnum;
    having?: Prisma.RadioScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: RadioCountAggregateInputType | true;
    _avg?: RadioAvgAggregateInputType;
    _sum?: RadioSumAggregateInputType;
    _min?: RadioMinAggregateInputType;
    _max?: RadioMaxAggregateInputType;
};
export type RadioGroupByOutputType = {
    id: number;
    number: string;
    model: string | null;
    serial: string | null;
    accessories: runtime.JsonValue | null;
    retired: boolean;
    _count: RadioCountAggregateOutputType | null;
    _avg: RadioAvgAggregateOutputType | null;
    _sum: RadioSumAggregateOutputType | null;
    _min: RadioMinAggregateOutputType | null;
    _max: RadioMaxAggregateOutputType | null;
};
export type GetRadioGroupByPayload<T extends RadioGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<RadioGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof RadioGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], RadioGroupByOutputType[P]> : Prisma.GetScalarType<T[P], RadioGroupByOutputType[P]>;
}>>;
export type RadioWhereInput = {
    AND?: Prisma.RadioWhereInput | Prisma.RadioWhereInput[];
    OR?: Prisma.RadioWhereInput[];
    NOT?: Prisma.RadioWhereInput | Prisma.RadioWhereInput[];
    id?: Prisma.IntFilter<"Radio"> | number;
    number?: Prisma.StringFilter<"Radio"> | string;
    model?: Prisma.StringNullableFilter<"Radio"> | string | null;
    serial?: Prisma.StringNullableFilter<"Radio"> | string | null;
    accessories?: Prisma.JsonNullableFilter<"Radio">;
    retired?: Prisma.BoolFilter<"Radio"> | boolean;
    assignments?: Prisma.RadioAssignmentListRelationFilter;
};
export type RadioOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    model?: Prisma.SortOrderInput | Prisma.SortOrder;
    serial?: Prisma.SortOrderInput | Prisma.SortOrder;
    accessories?: Prisma.SortOrderInput | Prisma.SortOrder;
    retired?: Prisma.SortOrder;
    assignments?: Prisma.RadioAssignmentOrderByRelationAggregateInput;
};
export type RadioWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    number?: string;
    AND?: Prisma.RadioWhereInput | Prisma.RadioWhereInput[];
    OR?: Prisma.RadioWhereInput[];
    NOT?: Prisma.RadioWhereInput | Prisma.RadioWhereInput[];
    model?: Prisma.StringNullableFilter<"Radio"> | string | null;
    serial?: Prisma.StringNullableFilter<"Radio"> | string | null;
    accessories?: Prisma.JsonNullableFilter<"Radio">;
    retired?: Prisma.BoolFilter<"Radio"> | boolean;
    assignments?: Prisma.RadioAssignmentListRelationFilter;
}, "id" | "number">;
export type RadioOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    model?: Prisma.SortOrderInput | Prisma.SortOrder;
    serial?: Prisma.SortOrderInput | Prisma.SortOrder;
    accessories?: Prisma.SortOrderInput | Prisma.SortOrder;
    retired?: Prisma.SortOrder;
    _count?: Prisma.RadioCountOrderByAggregateInput;
    _avg?: Prisma.RadioAvgOrderByAggregateInput;
    _max?: Prisma.RadioMaxOrderByAggregateInput;
    _min?: Prisma.RadioMinOrderByAggregateInput;
    _sum?: Prisma.RadioSumOrderByAggregateInput;
};
export type RadioScalarWhereWithAggregatesInput = {
    AND?: Prisma.RadioScalarWhereWithAggregatesInput | Prisma.RadioScalarWhereWithAggregatesInput[];
    OR?: Prisma.RadioScalarWhereWithAggregatesInput[];
    NOT?: Prisma.RadioScalarWhereWithAggregatesInput | Prisma.RadioScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Radio"> | number;
    number?: Prisma.StringWithAggregatesFilter<"Radio"> | string;
    model?: Prisma.StringNullableWithAggregatesFilter<"Radio"> | string | null;
    serial?: Prisma.StringNullableWithAggregatesFilter<"Radio"> | string | null;
    accessories?: Prisma.JsonNullableWithAggregatesFilter<"Radio">;
    retired?: Prisma.BoolWithAggregatesFilter<"Radio"> | boolean;
};
export type RadioCreateInput = {
    number: string;
    model?: string | null;
    serial?: string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: boolean;
    assignments?: Prisma.RadioAssignmentCreateNestedManyWithoutRadioInput;
};
export type RadioUncheckedCreateInput = {
    id?: number;
    number: string;
    model?: string | null;
    serial?: string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: boolean;
    assignments?: Prisma.RadioAssignmentUncheckedCreateNestedManyWithoutRadioInput;
};
export type RadioUpdateInput = {
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignments?: Prisma.RadioAssignmentUpdateManyWithoutRadioNestedInput;
};
export type RadioUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    assignments?: Prisma.RadioAssignmentUncheckedUpdateManyWithoutRadioNestedInput;
};
export type RadioCreateManyInput = {
    id?: number;
    number: string;
    model?: string | null;
    serial?: string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: boolean;
};
export type RadioUpdateManyMutationInput = {
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RadioUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RadioCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    accessories?: Prisma.SortOrder;
    retired?: Prisma.SortOrder;
};
export type RadioAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RadioMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    retired?: Prisma.SortOrder;
};
export type RadioMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    number?: Prisma.SortOrder;
    model?: Prisma.SortOrder;
    serial?: Prisma.SortOrder;
    retired?: Prisma.SortOrder;
};
export type RadioSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type RadioScalarRelationFilter = {
    is?: Prisma.RadioWhereInput;
    isNot?: Prisma.RadioWhereInput;
};
export type RadioCreateNestedOneWithoutAssignmentsInput = {
    create?: Prisma.XOR<Prisma.RadioCreateWithoutAssignmentsInput, Prisma.RadioUncheckedCreateWithoutAssignmentsInput>;
    connectOrCreate?: Prisma.RadioCreateOrConnectWithoutAssignmentsInput;
    connect?: Prisma.RadioWhereUniqueInput;
};
export type RadioUpdateOneRequiredWithoutAssignmentsNestedInput = {
    create?: Prisma.XOR<Prisma.RadioCreateWithoutAssignmentsInput, Prisma.RadioUncheckedCreateWithoutAssignmentsInput>;
    connectOrCreate?: Prisma.RadioCreateOrConnectWithoutAssignmentsInput;
    upsert?: Prisma.RadioUpsertWithoutAssignmentsInput;
    connect?: Prisma.RadioWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.RadioUpdateToOneWithWhereWithoutAssignmentsInput, Prisma.RadioUpdateWithoutAssignmentsInput>, Prisma.RadioUncheckedUpdateWithoutAssignmentsInput>;
};
export type RadioCreateWithoutAssignmentsInput = {
    number: string;
    model?: string | null;
    serial?: string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: boolean;
};
export type RadioUncheckedCreateWithoutAssignmentsInput = {
    id?: number;
    number: string;
    model?: string | null;
    serial?: string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: boolean;
};
export type RadioCreateOrConnectWithoutAssignmentsInput = {
    where: Prisma.RadioWhereUniqueInput;
    create: Prisma.XOR<Prisma.RadioCreateWithoutAssignmentsInput, Prisma.RadioUncheckedCreateWithoutAssignmentsInput>;
};
export type RadioUpsertWithoutAssignmentsInput = {
    update: Prisma.XOR<Prisma.RadioUpdateWithoutAssignmentsInput, Prisma.RadioUncheckedUpdateWithoutAssignmentsInput>;
    create: Prisma.XOR<Prisma.RadioCreateWithoutAssignmentsInput, Prisma.RadioUncheckedCreateWithoutAssignmentsInput>;
    where?: Prisma.RadioWhereInput;
};
export type RadioUpdateToOneWithWhereWithoutAssignmentsInput = {
    where?: Prisma.RadioWhereInput;
    data: Prisma.XOR<Prisma.RadioUpdateWithoutAssignmentsInput, Prisma.RadioUncheckedUpdateWithoutAssignmentsInput>;
};
export type RadioUpdateWithoutAssignmentsInput = {
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RadioUncheckedUpdateWithoutAssignmentsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    number?: Prisma.StringFieldUpdateOperationsInput | string;
    model?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    serial?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    accessories?: Prisma.NullableJsonNullValueInput | runtime.InputJsonValue;
    retired?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type RadioCountOutputType = {
    assignments: number;
};
export type RadioCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assignments?: boolean | RadioCountOutputTypeCountAssignmentsArgs;
};
export type RadioCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioCountOutputTypeSelect<ExtArgs> | null;
};
export type RadioCountOutputTypeCountAssignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioAssignmentWhereInput;
};
export type RadioSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    number?: boolean;
    model?: boolean;
    serial?: boolean;
    accessories?: boolean;
    retired?: boolean;
    assignments?: boolean | Prisma.Radio$assignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.RadioCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["radio"]>;
export type RadioSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    number?: boolean;
    model?: boolean;
    serial?: boolean;
    accessories?: boolean;
    retired?: boolean;
}, ExtArgs["result"]["radio"]>;
export type RadioSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    number?: boolean;
    model?: boolean;
    serial?: boolean;
    accessories?: boolean;
    retired?: boolean;
}, ExtArgs["result"]["radio"]>;
export type RadioSelectScalar = {
    id?: boolean;
    number?: boolean;
    model?: boolean;
    serial?: boolean;
    accessories?: boolean;
    retired?: boolean;
};
export type RadioOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "number" | "model" | "serial" | "accessories" | "retired", ExtArgs["result"]["radio"]>;
export type RadioInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    assignments?: boolean | Prisma.Radio$assignmentsArgs<ExtArgs>;
    _count?: boolean | Prisma.RadioCountOutputTypeDefaultArgs<ExtArgs>;
};
export type RadioIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type RadioIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $RadioPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Radio";
    objects: {
        assignments: Prisma.$RadioAssignmentPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        number: string;
        model: string | null;
        serial: string | null;
        accessories: runtime.JsonValue | null;
        retired: boolean;
    }, ExtArgs["result"]["radio"]>;
    composites: {};
};
export type RadioGetPayload<S extends boolean | null | undefined | RadioDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$RadioPayload, S>;
export type RadioCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<RadioFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: RadioCountAggregateInputType | true;
};
export interface RadioDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Radio'];
        meta: {
            name: 'Radio';
        };
    };
    findUnique<T extends RadioFindUniqueArgs>(args: Prisma.SelectSubset<T, RadioFindUniqueArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends RadioFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, RadioFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends RadioFindFirstArgs>(args?: Prisma.SelectSubset<T, RadioFindFirstArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends RadioFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, RadioFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends RadioFindManyArgs>(args?: Prisma.SelectSubset<T, RadioFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends RadioCreateArgs>(args: Prisma.SelectSubset<T, RadioCreateArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends RadioCreateManyArgs>(args?: Prisma.SelectSubset<T, RadioCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends RadioCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, RadioCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends RadioDeleteArgs>(args: Prisma.SelectSubset<T, RadioDeleteArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends RadioUpdateArgs>(args: Prisma.SelectSubset<T, RadioUpdateArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends RadioDeleteManyArgs>(args?: Prisma.SelectSubset<T, RadioDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends RadioUpdateManyArgs>(args: Prisma.SelectSubset<T, RadioUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends RadioUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, RadioUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends RadioUpsertArgs>(args: Prisma.SelectSubset<T, RadioUpsertArgs<ExtArgs>>): Prisma.Prisma__RadioClient<runtime.Types.Result.GetResult<Prisma.$RadioPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends RadioCountArgs>(args?: Prisma.Subset<T, RadioCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], RadioCountAggregateOutputType> : number>;
    aggregate<T extends RadioAggregateArgs>(args: Prisma.Subset<T, RadioAggregateArgs>): Prisma.PrismaPromise<GetRadioAggregateType<T>>;
    groupBy<T extends RadioGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: RadioGroupByArgs['orderBy'];
    } : {
        orderBy?: RadioGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, RadioGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetRadioGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: RadioFieldRefs;
}
export interface Prisma__RadioClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    assignments<T extends Prisma.Radio$assignmentsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Radio$assignmentsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$RadioAssignmentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface RadioFieldRefs {
    readonly id: Prisma.FieldRef<"Radio", 'Int'>;
    readonly number: Prisma.FieldRef<"Radio", 'String'>;
    readonly model: Prisma.FieldRef<"Radio", 'String'>;
    readonly serial: Prisma.FieldRef<"Radio", 'String'>;
    readonly accessories: Prisma.FieldRef<"Radio", 'Json'>;
    readonly retired: Prisma.FieldRef<"Radio", 'Boolean'>;
}
export type RadioFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where: Prisma.RadioWhereUniqueInput;
};
export type RadioFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where: Prisma.RadioWhereUniqueInput;
};
export type RadioFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where?: Prisma.RadioWhereInput;
    orderBy?: Prisma.RadioOrderByWithRelationInput | Prisma.RadioOrderByWithRelationInput[];
    cursor?: Prisma.RadioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioScalarFieldEnum | Prisma.RadioScalarFieldEnum[];
};
export type RadioFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where?: Prisma.RadioWhereInput;
    orderBy?: Prisma.RadioOrderByWithRelationInput | Prisma.RadioOrderByWithRelationInput[];
    cursor?: Prisma.RadioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioScalarFieldEnum | Prisma.RadioScalarFieldEnum[];
};
export type RadioFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where?: Prisma.RadioWhereInput;
    orderBy?: Prisma.RadioOrderByWithRelationInput | Prisma.RadioOrderByWithRelationInput[];
    cursor?: Prisma.RadioWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.RadioScalarFieldEnum | Prisma.RadioScalarFieldEnum[];
};
export type RadioCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioCreateInput, Prisma.RadioUncheckedCreateInput>;
};
export type RadioCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.RadioCreateManyInput | Prisma.RadioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RadioCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    data: Prisma.RadioCreateManyInput | Prisma.RadioCreateManyInput[];
    skipDuplicates?: boolean;
};
export type RadioUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioUpdateInput, Prisma.RadioUncheckedUpdateInput>;
    where: Prisma.RadioWhereUniqueInput;
};
export type RadioUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.RadioUpdateManyMutationInput, Prisma.RadioUncheckedUpdateManyInput>;
    where?: Prisma.RadioWhereInput;
    limit?: number;
};
export type RadioUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.RadioUpdateManyMutationInput, Prisma.RadioUncheckedUpdateManyInput>;
    where?: Prisma.RadioWhereInput;
    limit?: number;
};
export type RadioUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where: Prisma.RadioWhereUniqueInput;
    create: Prisma.XOR<Prisma.RadioCreateInput, Prisma.RadioUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.RadioUpdateInput, Prisma.RadioUncheckedUpdateInput>;
};
export type RadioDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
    where: Prisma.RadioWhereUniqueInput;
};
export type RadioDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.RadioWhereInput;
    limit?: number;
};
export type Radio$assignmentsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type RadioDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.RadioSelect<ExtArgs> | null;
    omit?: Prisma.RadioOmit<ExtArgs> | null;
    include?: Prisma.RadioInclude<ExtArgs> | null;
};
