import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type AnnualTrainingRequirementModel = runtime.Types.Result.DefaultSelection<Prisma.$AnnualTrainingRequirementPayload>;
export type AggregateAnnualTrainingRequirement = {
    _count: AnnualTrainingRequirementCountAggregateOutputType | null;
    _avg: AnnualTrainingRequirementAvgAggregateOutputType | null;
    _sum: AnnualTrainingRequirementSumAggregateOutputType | null;
    _min: AnnualTrainingRequirementMinAggregateOutputType | null;
    _max: AnnualTrainingRequirementMaxAggregateOutputType | null;
};
export type AnnualTrainingRequirementAvgAggregateOutputType = {
    id: number | null;
    year: number | null;
};
export type AnnualTrainingRequirementSumAggregateOutputType = {
    id: number | null;
    year: number | null;
};
export type AnnualTrainingRequirementMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    year: number | null;
    alertOnLapse: boolean | null;
    active: boolean | null;
};
export type AnnualTrainingRequirementMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    year: number | null;
    alertOnLapse: boolean | null;
    active: boolean | null;
};
export type AnnualTrainingRequirementCountAggregateOutputType = {
    id: number;
    name: number;
    year: number;
    alertOnLapse: number;
    active: number;
    _all: number;
};
export type AnnualTrainingRequirementAvgAggregateInputType = {
    id?: true;
    year?: true;
};
export type AnnualTrainingRequirementSumAggregateInputType = {
    id?: true;
    year?: true;
};
export type AnnualTrainingRequirementMinAggregateInputType = {
    id?: true;
    name?: true;
    year?: true;
    alertOnLapse?: true;
    active?: true;
};
export type AnnualTrainingRequirementMaxAggregateInputType = {
    id?: true;
    name?: true;
    year?: true;
    alertOnLapse?: true;
    active?: true;
};
export type AnnualTrainingRequirementCountAggregateInputType = {
    id?: true;
    name?: true;
    year?: true;
    alertOnLapse?: true;
    active?: true;
    _all?: true;
};
export type AnnualTrainingRequirementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    orderBy?: Prisma.AnnualTrainingRequirementOrderByWithRelationInput | Prisma.AnnualTrainingRequirementOrderByWithRelationInput[];
    cursor?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | AnnualTrainingRequirementCountAggregateInputType;
    _avg?: AnnualTrainingRequirementAvgAggregateInputType;
    _sum?: AnnualTrainingRequirementSumAggregateInputType;
    _min?: AnnualTrainingRequirementMinAggregateInputType;
    _max?: AnnualTrainingRequirementMaxAggregateInputType;
};
export type GetAnnualTrainingRequirementAggregateType<T extends AnnualTrainingRequirementAggregateArgs> = {
    [P in keyof T & keyof AggregateAnnualTrainingRequirement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateAnnualTrainingRequirement[P]> : Prisma.GetScalarType<T[P], AggregateAnnualTrainingRequirement[P]>;
};
export type AnnualTrainingRequirementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    orderBy?: Prisma.AnnualTrainingRequirementOrderByWithAggregationInput | Prisma.AnnualTrainingRequirementOrderByWithAggregationInput[];
    by: Prisma.AnnualTrainingRequirementScalarFieldEnum[] | Prisma.AnnualTrainingRequirementScalarFieldEnum;
    having?: Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: AnnualTrainingRequirementCountAggregateInputType | true;
    _avg?: AnnualTrainingRequirementAvgAggregateInputType;
    _sum?: AnnualTrainingRequirementSumAggregateInputType;
    _min?: AnnualTrainingRequirementMinAggregateInputType;
    _max?: AnnualTrainingRequirementMaxAggregateInputType;
};
export type AnnualTrainingRequirementGroupByOutputType = {
    id: number;
    name: string;
    year: number;
    alertOnLapse: boolean;
    active: boolean;
    _count: AnnualTrainingRequirementCountAggregateOutputType | null;
    _avg: AnnualTrainingRequirementAvgAggregateOutputType | null;
    _sum: AnnualTrainingRequirementSumAggregateOutputType | null;
    _min: AnnualTrainingRequirementMinAggregateOutputType | null;
    _max: AnnualTrainingRequirementMaxAggregateOutputType | null;
};
export type GetAnnualTrainingRequirementGroupByPayload<T extends AnnualTrainingRequirementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<AnnualTrainingRequirementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof AnnualTrainingRequirementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], AnnualTrainingRequirementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], AnnualTrainingRequirementGroupByOutputType[P]>;
}>>;
export type AnnualTrainingRequirementWhereInput = {
    AND?: Prisma.AnnualTrainingRequirementWhereInput | Prisma.AnnualTrainingRequirementWhereInput[];
    OR?: Prisma.AnnualTrainingRequirementWhereInput[];
    NOT?: Prisma.AnnualTrainingRequirementWhereInput | Prisma.AnnualTrainingRequirementWhereInput[];
    id?: Prisma.IntFilter<"AnnualTrainingRequirement"> | number;
    name?: Prisma.StringFilter<"AnnualTrainingRequirement"> | string;
    year?: Prisma.IntFilter<"AnnualTrainingRequirement"> | number;
    alertOnLapse?: Prisma.BoolFilter<"AnnualTrainingRequirement"> | boolean;
    active?: Prisma.BoolFilter<"AnnualTrainingRequirement"> | boolean;
    completions?: Prisma.MemberAnnualTrainingListRelationFilter;
};
export type AnnualTrainingRequirementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    alertOnLapse?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    completions?: Prisma.MemberAnnualTrainingOrderByRelationAggregateInput;
};
export type AnnualTrainingRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name_year?: Prisma.AnnualTrainingRequirementNameYearCompoundUniqueInput;
    AND?: Prisma.AnnualTrainingRequirementWhereInput | Prisma.AnnualTrainingRequirementWhereInput[];
    OR?: Prisma.AnnualTrainingRequirementWhereInput[];
    NOT?: Prisma.AnnualTrainingRequirementWhereInput | Prisma.AnnualTrainingRequirementWhereInput[];
    name?: Prisma.StringFilter<"AnnualTrainingRequirement"> | string;
    year?: Prisma.IntFilter<"AnnualTrainingRequirement"> | number;
    alertOnLapse?: Prisma.BoolFilter<"AnnualTrainingRequirement"> | boolean;
    active?: Prisma.BoolFilter<"AnnualTrainingRequirement"> | boolean;
    completions?: Prisma.MemberAnnualTrainingListRelationFilter;
}, "id" | "name_year">;
export type AnnualTrainingRequirementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    alertOnLapse?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.AnnualTrainingRequirementCountOrderByAggregateInput;
    _avg?: Prisma.AnnualTrainingRequirementAvgOrderByAggregateInput;
    _max?: Prisma.AnnualTrainingRequirementMaxOrderByAggregateInput;
    _min?: Prisma.AnnualTrainingRequirementMinOrderByAggregateInput;
    _sum?: Prisma.AnnualTrainingRequirementSumOrderByAggregateInput;
};
export type AnnualTrainingRequirementScalarWhereWithAggregatesInput = {
    AND?: Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput | Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput[];
    OR?: Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput | Prisma.AnnualTrainingRequirementScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"AnnualTrainingRequirement"> | number;
    name?: Prisma.StringWithAggregatesFilter<"AnnualTrainingRequirement"> | string;
    year?: Prisma.IntWithAggregatesFilter<"AnnualTrainingRequirement"> | number;
    alertOnLapse?: Prisma.BoolWithAggregatesFilter<"AnnualTrainingRequirement"> | boolean;
    active?: Prisma.BoolWithAggregatesFilter<"AnnualTrainingRequirement"> | boolean;
};
export type AnnualTrainingRequirementCreateInput = {
    name: string;
    year: number;
    alertOnLapse?: boolean;
    active?: boolean;
    completions?: Prisma.MemberAnnualTrainingCreateNestedManyWithoutRequirementInput;
};
export type AnnualTrainingRequirementUncheckedCreateInput = {
    id?: number;
    name: string;
    year: number;
    alertOnLapse?: boolean;
    active?: boolean;
    completions?: Prisma.MemberAnnualTrainingUncheckedCreateNestedManyWithoutRequirementInput;
};
export type AnnualTrainingRequirementUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completions?: Prisma.MemberAnnualTrainingUpdateManyWithoutRequirementNestedInput;
};
export type AnnualTrainingRequirementUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    completions?: Prisma.MemberAnnualTrainingUncheckedUpdateManyWithoutRequirementNestedInput;
};
export type AnnualTrainingRequirementCreateManyInput = {
    id?: number;
    name: string;
    year: number;
    alertOnLapse?: boolean;
    active?: boolean;
};
export type AnnualTrainingRequirementUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AnnualTrainingRequirementUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AnnualTrainingRequirementNameYearCompoundUniqueInput = {
    name: string;
    year: number;
};
export type AnnualTrainingRequirementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    alertOnLapse?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type AnnualTrainingRequirementAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
};
export type AnnualTrainingRequirementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    alertOnLapse?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type AnnualTrainingRequirementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
    alertOnLapse?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type AnnualTrainingRequirementSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    year?: Prisma.SortOrder;
};
export type AnnualTrainingRequirementScalarRelationFilter = {
    is?: Prisma.AnnualTrainingRequirementWhereInput;
    isNot?: Prisma.AnnualTrainingRequirementWhereInput;
};
export type AnnualTrainingRequirementCreateNestedOneWithoutCompletionsInput = {
    create?: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedCreateWithoutCompletionsInput>;
    connectOrCreate?: Prisma.AnnualTrainingRequirementCreateOrConnectWithoutCompletionsInput;
    connect?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
};
export type AnnualTrainingRequirementUpdateOneRequiredWithoutCompletionsNestedInput = {
    create?: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedCreateWithoutCompletionsInput>;
    connectOrCreate?: Prisma.AnnualTrainingRequirementCreateOrConnectWithoutCompletionsInput;
    upsert?: Prisma.AnnualTrainingRequirementUpsertWithoutCompletionsInput;
    connect?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateToOneWithWhereWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUpdateWithoutCompletionsInput>, Prisma.AnnualTrainingRequirementUncheckedUpdateWithoutCompletionsInput>;
};
export type AnnualTrainingRequirementCreateWithoutCompletionsInput = {
    name: string;
    year: number;
    alertOnLapse?: boolean;
    active?: boolean;
};
export type AnnualTrainingRequirementUncheckedCreateWithoutCompletionsInput = {
    id?: number;
    name: string;
    year: number;
    alertOnLapse?: boolean;
    active?: boolean;
};
export type AnnualTrainingRequirementCreateOrConnectWithoutCompletionsInput = {
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedCreateWithoutCompletionsInput>;
};
export type AnnualTrainingRequirementUpsertWithoutCompletionsInput = {
    update: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedUpdateWithoutCompletionsInput>;
    create: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedCreateWithoutCompletionsInput>;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
};
export type AnnualTrainingRequirementUpdateToOneWithWhereWithoutCompletionsInput = {
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    data: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateWithoutCompletionsInput, Prisma.AnnualTrainingRequirementUncheckedUpdateWithoutCompletionsInput>;
};
export type AnnualTrainingRequirementUpdateWithoutCompletionsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AnnualTrainingRequirementUncheckedUpdateWithoutCompletionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    year?: Prisma.IntFieldUpdateOperationsInput | number;
    alertOnLapse?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type AnnualTrainingRequirementCountOutputType = {
    completions: number;
};
export type AnnualTrainingRequirementCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    completions?: boolean | AnnualTrainingRequirementCountOutputTypeCountCompletionsArgs;
};
export type AnnualTrainingRequirementCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementCountOutputTypeSelect<ExtArgs> | null;
};
export type AnnualTrainingRequirementCountOutputTypeCountCompletionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberAnnualTrainingWhereInput;
};
export type AnnualTrainingRequirementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    year?: boolean;
    alertOnLapse?: boolean;
    active?: boolean;
    completions?: boolean | Prisma.AnnualTrainingRequirement$completionsArgs<ExtArgs>;
    _count?: boolean | Prisma.AnnualTrainingRequirementCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["annualTrainingRequirement"]>;
export type AnnualTrainingRequirementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    year?: boolean;
    alertOnLapse?: boolean;
    active?: boolean;
}, ExtArgs["result"]["annualTrainingRequirement"]>;
export type AnnualTrainingRequirementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    year?: boolean;
    alertOnLapse?: boolean;
    active?: boolean;
}, ExtArgs["result"]["annualTrainingRequirement"]>;
export type AnnualTrainingRequirementSelectScalar = {
    id?: boolean;
    name?: boolean;
    year?: boolean;
    alertOnLapse?: boolean;
    active?: boolean;
};
export type AnnualTrainingRequirementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "year" | "alertOnLapse" | "active", ExtArgs["result"]["annualTrainingRequirement"]>;
export type AnnualTrainingRequirementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    completions?: boolean | Prisma.AnnualTrainingRequirement$completionsArgs<ExtArgs>;
    _count?: boolean | Prisma.AnnualTrainingRequirementCountOutputTypeDefaultArgs<ExtArgs>;
};
export type AnnualTrainingRequirementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type AnnualTrainingRequirementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $AnnualTrainingRequirementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "AnnualTrainingRequirement";
    objects: {
        completions: Prisma.$MemberAnnualTrainingPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        year: number;
        alertOnLapse: boolean;
        active: boolean;
    }, ExtArgs["result"]["annualTrainingRequirement"]>;
    composites: {};
};
export type AnnualTrainingRequirementGetPayload<S extends boolean | null | undefined | AnnualTrainingRequirementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload, S>;
export type AnnualTrainingRequirementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<AnnualTrainingRequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: AnnualTrainingRequirementCountAggregateInputType | true;
};
export interface AnnualTrainingRequirementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['AnnualTrainingRequirement'];
        meta: {
            name: 'AnnualTrainingRequirement';
        };
    };
    findUnique<T extends AnnualTrainingRequirementFindUniqueArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends AnnualTrainingRequirementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends AnnualTrainingRequirementFindFirstArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementFindFirstArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends AnnualTrainingRequirementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends AnnualTrainingRequirementFindManyArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends AnnualTrainingRequirementCreateArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementCreateArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends AnnualTrainingRequirementCreateManyArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends AnnualTrainingRequirementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends AnnualTrainingRequirementDeleteArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementDeleteArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends AnnualTrainingRequirementUpdateArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementUpdateArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends AnnualTrainingRequirementDeleteManyArgs>(args?: Prisma.SelectSubset<T, AnnualTrainingRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends AnnualTrainingRequirementUpdateManyArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends AnnualTrainingRequirementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends AnnualTrainingRequirementUpsertArgs>(args: Prisma.SelectSubset<T, AnnualTrainingRequirementUpsertArgs<ExtArgs>>): Prisma.Prisma__AnnualTrainingRequirementClient<runtime.Types.Result.GetResult<Prisma.$AnnualTrainingRequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends AnnualTrainingRequirementCountArgs>(args?: Prisma.Subset<T, AnnualTrainingRequirementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], AnnualTrainingRequirementCountAggregateOutputType> : number>;
    aggregate<T extends AnnualTrainingRequirementAggregateArgs>(args: Prisma.Subset<T, AnnualTrainingRequirementAggregateArgs>): Prisma.PrismaPromise<GetAnnualTrainingRequirementAggregateType<T>>;
    groupBy<T extends AnnualTrainingRequirementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: AnnualTrainingRequirementGroupByArgs['orderBy'];
    } : {
        orderBy?: AnnualTrainingRequirementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, AnnualTrainingRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetAnnualTrainingRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: AnnualTrainingRequirementFieldRefs;
}
export interface Prisma__AnnualTrainingRequirementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    completions<T extends Prisma.AnnualTrainingRequirement$completionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.AnnualTrainingRequirement$completionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberAnnualTrainingPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface AnnualTrainingRequirementFieldRefs {
    readonly id: Prisma.FieldRef<"AnnualTrainingRequirement", 'Int'>;
    readonly name: Prisma.FieldRef<"AnnualTrainingRequirement", 'String'>;
    readonly year: Prisma.FieldRef<"AnnualTrainingRequirement", 'Int'>;
    readonly alertOnLapse: Prisma.FieldRef<"AnnualTrainingRequirement", 'Boolean'>;
    readonly active: Prisma.FieldRef<"AnnualTrainingRequirement", 'Boolean'>;
}
export type AnnualTrainingRequirementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
};
export type AnnualTrainingRequirementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
};
export type AnnualTrainingRequirementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    orderBy?: Prisma.AnnualTrainingRequirementOrderByWithRelationInput | Prisma.AnnualTrainingRequirementOrderByWithRelationInput[];
    cursor?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnualTrainingRequirementScalarFieldEnum | Prisma.AnnualTrainingRequirementScalarFieldEnum[];
};
export type AnnualTrainingRequirementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    orderBy?: Prisma.AnnualTrainingRequirementOrderByWithRelationInput | Prisma.AnnualTrainingRequirementOrderByWithRelationInput[];
    cursor?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnualTrainingRequirementScalarFieldEnum | Prisma.AnnualTrainingRequirementScalarFieldEnum[];
};
export type AnnualTrainingRequirementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    orderBy?: Prisma.AnnualTrainingRequirementOrderByWithRelationInput | Prisma.AnnualTrainingRequirementOrderByWithRelationInput[];
    cursor?: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.AnnualTrainingRequirementScalarFieldEnum | Prisma.AnnualTrainingRequirementScalarFieldEnum[];
};
export type AnnualTrainingRequirementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateInput, Prisma.AnnualTrainingRequirementUncheckedCreateInput>;
};
export type AnnualTrainingRequirementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.AnnualTrainingRequirementCreateManyInput | Prisma.AnnualTrainingRequirementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AnnualTrainingRequirementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    data: Prisma.AnnualTrainingRequirementCreateManyInput | Prisma.AnnualTrainingRequirementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type AnnualTrainingRequirementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateInput, Prisma.AnnualTrainingRequirementUncheckedUpdateInput>;
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
};
export type AnnualTrainingRequirementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateManyMutationInput, Prisma.AnnualTrainingRequirementUncheckedUpdateManyInput>;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    limit?: number;
};
export type AnnualTrainingRequirementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateManyMutationInput, Prisma.AnnualTrainingRequirementUncheckedUpdateManyInput>;
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    limit?: number;
};
export type AnnualTrainingRequirementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.AnnualTrainingRequirementCreateInput, Prisma.AnnualTrainingRequirementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.AnnualTrainingRequirementUpdateInput, Prisma.AnnualTrainingRequirementUncheckedUpdateInput>;
};
export type AnnualTrainingRequirementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
    where: Prisma.AnnualTrainingRequirementWhereUniqueInput;
};
export type AnnualTrainingRequirementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.AnnualTrainingRequirementWhereInput;
    limit?: number;
};
export type AnnualTrainingRequirement$completionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberAnnualTrainingSelect<ExtArgs> | null;
    omit?: Prisma.MemberAnnualTrainingOmit<ExtArgs> | null;
    include?: Prisma.MemberAnnualTrainingInclude<ExtArgs> | null;
    where?: Prisma.MemberAnnualTrainingWhereInput;
    orderBy?: Prisma.MemberAnnualTrainingOrderByWithRelationInput | Prisma.MemberAnnualTrainingOrderByWithRelationInput[];
    cursor?: Prisma.MemberAnnualTrainingWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberAnnualTrainingScalarFieldEnum | Prisma.MemberAnnualTrainingScalarFieldEnum[];
};
export type AnnualTrainingRequirementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.AnnualTrainingRequirementSelect<ExtArgs> | null;
    omit?: Prisma.AnnualTrainingRequirementOmit<ExtArgs> | null;
    include?: Prisma.AnnualTrainingRequirementInclude<ExtArgs> | null;
};
