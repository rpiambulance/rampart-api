import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PromotionApprovalModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionApprovalPayload>;
export type AggregatePromotionApproval = {
    _count: PromotionApprovalCountAggregateOutputType | null;
    _avg: PromotionApprovalAvgAggregateOutputType | null;
    _sum: PromotionApprovalSumAggregateOutputType | null;
    _min: PromotionApprovalMinAggregateOutputType | null;
    _max: PromotionApprovalMaxAggregateOutputType | null;
};
export type PromotionApprovalAvgAggregateOutputType = {
    requestId: number | null;
    approvedById: number | null;
};
export type PromotionApprovalSumAggregateOutputType = {
    requestId: number | null;
    approvedById: number | null;
};
export type PromotionApprovalMinAggregateOutputType = {
    requestId: number | null;
    approvedById: number | null;
    approved: boolean | null;
    notes: string | null;
    decidedAt: Date | null;
};
export type PromotionApprovalMaxAggregateOutputType = {
    requestId: number | null;
    approvedById: number | null;
    approved: boolean | null;
    notes: string | null;
    decidedAt: Date | null;
};
export type PromotionApprovalCountAggregateOutputType = {
    requestId: number;
    approvedById: number;
    approved: number;
    notes: number;
    decidedAt: number;
    _all: number;
};
export type PromotionApprovalAvgAggregateInputType = {
    requestId?: true;
    approvedById?: true;
};
export type PromotionApprovalSumAggregateInputType = {
    requestId?: true;
    approvedById?: true;
};
export type PromotionApprovalMinAggregateInputType = {
    requestId?: true;
    approvedById?: true;
    approved?: true;
    notes?: true;
    decidedAt?: true;
};
export type PromotionApprovalMaxAggregateInputType = {
    requestId?: true;
    approvedById?: true;
    approved?: true;
    notes?: true;
    decidedAt?: true;
};
export type PromotionApprovalCountAggregateInputType = {
    requestId?: true;
    approvedById?: true;
    approved?: true;
    notes?: true;
    decidedAt?: true;
    _all?: true;
};
export type PromotionApprovalAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionApprovalWhereInput;
    orderBy?: Prisma.PromotionApprovalOrderByWithRelationInput | Prisma.PromotionApprovalOrderByWithRelationInput[];
    cursor?: Prisma.PromotionApprovalWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PromotionApprovalCountAggregateInputType;
    _avg?: PromotionApprovalAvgAggregateInputType;
    _sum?: PromotionApprovalSumAggregateInputType;
    _min?: PromotionApprovalMinAggregateInputType;
    _max?: PromotionApprovalMaxAggregateInputType;
};
export type GetPromotionApprovalAggregateType<T extends PromotionApprovalAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionApproval]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionApproval[P]> : Prisma.GetScalarType<T[P], AggregatePromotionApproval[P]>;
};
export type PromotionApprovalGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionApprovalWhereInput;
    orderBy?: Prisma.PromotionApprovalOrderByWithAggregationInput | Prisma.PromotionApprovalOrderByWithAggregationInput[];
    by: Prisma.PromotionApprovalScalarFieldEnum[] | Prisma.PromotionApprovalScalarFieldEnum;
    having?: Prisma.PromotionApprovalScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionApprovalCountAggregateInputType | true;
    _avg?: PromotionApprovalAvgAggregateInputType;
    _sum?: PromotionApprovalSumAggregateInputType;
    _min?: PromotionApprovalMinAggregateInputType;
    _max?: PromotionApprovalMaxAggregateInputType;
};
export type PromotionApprovalGroupByOutputType = {
    requestId: number;
    approvedById: number;
    approved: boolean;
    notes: string | null;
    decidedAt: Date;
    _count: PromotionApprovalCountAggregateOutputType | null;
    _avg: PromotionApprovalAvgAggregateOutputType | null;
    _sum: PromotionApprovalSumAggregateOutputType | null;
    _min: PromotionApprovalMinAggregateOutputType | null;
    _max: PromotionApprovalMaxAggregateOutputType | null;
};
export type GetPromotionApprovalGroupByPayload<T extends PromotionApprovalGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionApprovalGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionApprovalGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionApprovalGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionApprovalGroupByOutputType[P]>;
}>>;
export type PromotionApprovalWhereInput = {
    AND?: Prisma.PromotionApprovalWhereInput | Prisma.PromotionApprovalWhereInput[];
    OR?: Prisma.PromotionApprovalWhereInput[];
    NOT?: Prisma.PromotionApprovalWhereInput | Prisma.PromotionApprovalWhereInput[];
    requestId?: Prisma.IntFilter<"PromotionApproval"> | number;
    approvedById?: Prisma.IntFilter<"PromotionApproval"> | number;
    approved?: Prisma.BoolFilter<"PromotionApproval"> | boolean;
    notes?: Prisma.StringNullableFilter<"PromotionApproval"> | string | null;
    decidedAt?: Prisma.DateTimeFilter<"PromotionApproval"> | Date | string;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
};
export type PromotionApprovalOrderByWithRelationInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    approved?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
    request?: Prisma.PromotionRequestOrderByWithRelationInput;
};
export type PromotionApprovalWhereUniqueInput = Prisma.AtLeast<{
    requestId?: number;
    AND?: Prisma.PromotionApprovalWhereInput | Prisma.PromotionApprovalWhereInput[];
    OR?: Prisma.PromotionApprovalWhereInput[];
    NOT?: Prisma.PromotionApprovalWhereInput | Prisma.PromotionApprovalWhereInput[];
    approvedById?: Prisma.IntFilter<"PromotionApproval"> | number;
    approved?: Prisma.BoolFilter<"PromotionApproval"> | boolean;
    notes?: Prisma.StringNullableFilter<"PromotionApproval"> | string | null;
    decidedAt?: Prisma.DateTimeFilter<"PromotionApproval"> | Date | string;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
}, "requestId">;
export type PromotionApprovalOrderByWithAggregationInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    approved?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
    _count?: Prisma.PromotionApprovalCountOrderByAggregateInput;
    _avg?: Prisma.PromotionApprovalAvgOrderByAggregateInput;
    _max?: Prisma.PromotionApprovalMaxOrderByAggregateInput;
    _min?: Prisma.PromotionApprovalMinOrderByAggregateInput;
    _sum?: Prisma.PromotionApprovalSumOrderByAggregateInput;
};
export type PromotionApprovalScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionApprovalScalarWhereWithAggregatesInput | Prisma.PromotionApprovalScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionApprovalScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionApprovalScalarWhereWithAggregatesInput | Prisma.PromotionApprovalScalarWhereWithAggregatesInput[];
    requestId?: Prisma.IntWithAggregatesFilter<"PromotionApproval"> | number;
    approvedById?: Prisma.IntWithAggregatesFilter<"PromotionApproval"> | number;
    approved?: Prisma.BoolWithAggregatesFilter<"PromotionApproval"> | boolean;
    notes?: Prisma.StringNullableWithAggregatesFilter<"PromotionApproval"> | string | null;
    decidedAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionApproval"> | Date | string;
};
export type PromotionApprovalCreateInput = {
    approvedById: number;
    approved: boolean;
    notes?: string | null;
    decidedAt?: Date | string;
    request: Prisma.PromotionRequestCreateNestedOneWithoutCaptainApprovalInput;
};
export type PromotionApprovalUncheckedCreateInput = {
    requestId: number;
    approvedById: number;
    approved: boolean;
    notes?: string | null;
    decidedAt?: Date | string;
};
export type PromotionApprovalUpdateInput = {
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutCaptainApprovalNestedInput;
};
export type PromotionApprovalUncheckedUpdateInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionApprovalCreateManyInput = {
    requestId: number;
    approvedById: number;
    approved: boolean;
    notes?: string | null;
    decidedAt?: Date | string;
};
export type PromotionApprovalUpdateManyMutationInput = {
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionApprovalUncheckedUpdateManyInput = {
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionApprovalNullableScalarRelationFilter = {
    is?: Prisma.PromotionApprovalWhereInput | null;
    isNot?: Prisma.PromotionApprovalWhereInput | null;
};
export type PromotionApprovalCountOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    approved?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type PromotionApprovalAvgOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
};
export type PromotionApprovalMaxOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    approved?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type PromotionApprovalMinOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
    approved?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    decidedAt?: Prisma.SortOrder;
};
export type PromotionApprovalSumOrderByAggregateInput = {
    requestId?: Prisma.SortOrder;
    approvedById?: Prisma.SortOrder;
};
export type PromotionApprovalCreateNestedOneWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
    connectOrCreate?: Prisma.PromotionApprovalCreateOrConnectWithoutRequestInput;
    connect?: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalUncheckedCreateNestedOneWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
    connectOrCreate?: Prisma.PromotionApprovalCreateOrConnectWithoutRequestInput;
    connect?: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalUpdateOneWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
    connectOrCreate?: Prisma.PromotionApprovalCreateOrConnectWithoutRequestInput;
    upsert?: Prisma.PromotionApprovalUpsertWithoutRequestInput;
    disconnect?: Prisma.PromotionApprovalWhereInput | boolean;
    delete?: Prisma.PromotionApprovalWhereInput | boolean;
    connect?: Prisma.PromotionApprovalWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionApprovalUpdateToOneWithWhereWithoutRequestInput, Prisma.PromotionApprovalUpdateWithoutRequestInput>, Prisma.PromotionApprovalUncheckedUpdateWithoutRequestInput>;
};
export type PromotionApprovalUncheckedUpdateOneWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
    connectOrCreate?: Prisma.PromotionApprovalCreateOrConnectWithoutRequestInput;
    upsert?: Prisma.PromotionApprovalUpsertWithoutRequestInput;
    disconnect?: Prisma.PromotionApprovalWhereInput | boolean;
    delete?: Prisma.PromotionApprovalWhereInput | boolean;
    connect?: Prisma.PromotionApprovalWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.PromotionApprovalUpdateToOneWithWhereWithoutRequestInput, Prisma.PromotionApprovalUpdateWithoutRequestInput>, Prisma.PromotionApprovalUncheckedUpdateWithoutRequestInput>;
};
export type PromotionApprovalCreateWithoutRequestInput = {
    approvedById: number;
    approved: boolean;
    notes?: string | null;
    decidedAt?: Date | string;
};
export type PromotionApprovalUncheckedCreateWithoutRequestInput = {
    approvedById: number;
    approved: boolean;
    notes?: string | null;
    decidedAt?: Date | string;
};
export type PromotionApprovalCreateOrConnectWithoutRequestInput = {
    where: Prisma.PromotionApprovalWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
};
export type PromotionApprovalUpsertWithoutRequestInput = {
    update: Prisma.XOR<Prisma.PromotionApprovalUpdateWithoutRequestInput, Prisma.PromotionApprovalUncheckedUpdateWithoutRequestInput>;
    create: Prisma.XOR<Prisma.PromotionApprovalCreateWithoutRequestInput, Prisma.PromotionApprovalUncheckedCreateWithoutRequestInput>;
    where?: Prisma.PromotionApprovalWhereInput;
};
export type PromotionApprovalUpdateToOneWithWhereWithoutRequestInput = {
    where?: Prisma.PromotionApprovalWhereInput;
    data: Prisma.XOR<Prisma.PromotionApprovalUpdateWithoutRequestInput, Prisma.PromotionApprovalUncheckedUpdateWithoutRequestInput>;
};
export type PromotionApprovalUpdateWithoutRequestInput = {
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionApprovalUncheckedUpdateWithoutRequestInput = {
    approvedById?: Prisma.IntFieldUpdateOperationsInput | number;
    approved?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    decidedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionApprovalSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    approvedById?: boolean;
    approved?: boolean;
    notes?: boolean;
    decidedAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionApproval"]>;
export type PromotionApprovalSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    approvedById?: boolean;
    approved?: boolean;
    notes?: boolean;
    decidedAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionApproval"]>;
export type PromotionApprovalSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    requestId?: boolean;
    approvedById?: boolean;
    approved?: boolean;
    notes?: boolean;
    decidedAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["promotionApproval"]>;
export type PromotionApprovalSelectScalar = {
    requestId?: boolean;
    approvedById?: boolean;
    approved?: boolean;
    notes?: boolean;
    decidedAt?: boolean;
};
export type PromotionApprovalOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"requestId" | "approvedById" | "approved" | "notes" | "decidedAt", ExtArgs["result"]["promotionApproval"]>;
export type PromotionApprovalInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
};
export type PromotionApprovalIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
};
export type PromotionApprovalIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
};
export type $PromotionApprovalPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionApproval";
    objects: {
        request: Prisma.$PromotionRequestPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        requestId: number;
        approvedById: number;
        approved: boolean;
        notes: string | null;
        decidedAt: Date;
    }, ExtArgs["result"]["promotionApproval"]>;
    composites: {};
};
export type PromotionApprovalGetPayload<S extends boolean | null | undefined | PromotionApprovalDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload, S>;
export type PromotionApprovalCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionApprovalFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionApprovalCountAggregateInputType | true;
};
export interface PromotionApprovalDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionApproval'];
        meta: {
            name: 'PromotionApproval';
        };
    };
    findUnique<T extends PromotionApprovalFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionApprovalFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PromotionApprovalFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionApprovalFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PromotionApprovalFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PromotionApprovalFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PromotionApprovalFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PromotionApprovalCreateArgs>(args: Prisma.SelectSubset<T, PromotionApprovalCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PromotionApprovalCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PromotionApprovalCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PromotionApprovalDeleteArgs>(args: Prisma.SelectSubset<T, PromotionApprovalDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PromotionApprovalUpdateArgs>(args: Prisma.SelectSubset<T, PromotionApprovalUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PromotionApprovalDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionApprovalDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PromotionApprovalUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionApprovalUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PromotionApprovalUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionApprovalUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PromotionApprovalUpsertArgs>(args: Prisma.SelectSubset<T, PromotionApprovalUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionApprovalClient<runtime.Types.Result.GetResult<Prisma.$PromotionApprovalPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PromotionApprovalCountArgs>(args?: Prisma.Subset<T, PromotionApprovalCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionApprovalCountAggregateOutputType> : number>;
    aggregate<T extends PromotionApprovalAggregateArgs>(args: Prisma.Subset<T, PromotionApprovalAggregateArgs>): Prisma.PrismaPromise<GetPromotionApprovalAggregateType<T>>;
    groupBy<T extends PromotionApprovalGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionApprovalGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionApprovalGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionApprovalGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionApprovalGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PromotionApprovalFieldRefs;
}
export interface Prisma__PromotionApprovalClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    request<T extends Prisma.PromotionRequestDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequestDefaultArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PromotionApprovalFieldRefs {
    readonly requestId: Prisma.FieldRef<"PromotionApproval", 'Int'>;
    readonly approvedById: Prisma.FieldRef<"PromotionApproval", 'Int'>;
    readonly approved: Prisma.FieldRef<"PromotionApproval", 'Boolean'>;
    readonly notes: Prisma.FieldRef<"PromotionApproval", 'String'>;
    readonly decidedAt: Prisma.FieldRef<"PromotionApproval", 'DateTime'>;
}
export type PromotionApprovalFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where?: Prisma.PromotionApprovalWhereInput;
    orderBy?: Prisma.PromotionApprovalOrderByWithRelationInput | Prisma.PromotionApprovalOrderByWithRelationInput[];
    cursor?: Prisma.PromotionApprovalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionApprovalScalarFieldEnum | Prisma.PromotionApprovalScalarFieldEnum[];
};
export type PromotionApprovalFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where?: Prisma.PromotionApprovalWhereInput;
    orderBy?: Prisma.PromotionApprovalOrderByWithRelationInput | Prisma.PromotionApprovalOrderByWithRelationInput[];
    cursor?: Prisma.PromotionApprovalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionApprovalScalarFieldEnum | Prisma.PromotionApprovalScalarFieldEnum[];
};
export type PromotionApprovalFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where?: Prisma.PromotionApprovalWhereInput;
    orderBy?: Prisma.PromotionApprovalOrderByWithRelationInput | Prisma.PromotionApprovalOrderByWithRelationInput[];
    cursor?: Prisma.PromotionApprovalWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionApprovalScalarFieldEnum | Prisma.PromotionApprovalScalarFieldEnum[];
};
export type PromotionApprovalCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionApprovalCreateInput, Prisma.PromotionApprovalUncheckedCreateInput>;
};
export type PromotionApprovalCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PromotionApprovalCreateManyInput | Prisma.PromotionApprovalCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionApprovalCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    data: Prisma.PromotionApprovalCreateManyInput | Prisma.PromotionApprovalCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PromotionApprovalIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PromotionApprovalUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionApprovalUpdateInput, Prisma.PromotionApprovalUncheckedUpdateInput>;
    where: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PromotionApprovalUpdateManyMutationInput, Prisma.PromotionApprovalUncheckedUpdateManyInput>;
    where?: Prisma.PromotionApprovalWhereInput;
    limit?: number;
};
export type PromotionApprovalUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionApprovalUpdateManyMutationInput, Prisma.PromotionApprovalUncheckedUpdateManyInput>;
    where?: Prisma.PromotionApprovalWhereInput;
    limit?: number;
    include?: Prisma.PromotionApprovalIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PromotionApprovalUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where: Prisma.PromotionApprovalWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionApprovalCreateInput, Prisma.PromotionApprovalUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PromotionApprovalUpdateInput, Prisma.PromotionApprovalUncheckedUpdateInput>;
};
export type PromotionApprovalDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
    where: Prisma.PromotionApprovalWhereUniqueInput;
};
export type PromotionApprovalDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionApprovalWhereInput;
    limit?: number;
};
export type PromotionApprovalDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionApprovalSelect<ExtArgs> | null;
    omit?: Prisma.PromotionApprovalOmit<ExtArgs> | null;
    include?: Prisma.PromotionApprovalInclude<ExtArgs> | null;
};
