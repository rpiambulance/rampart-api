import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type IcsTokenModel = runtime.Types.Result.DefaultSelection<Prisma.$IcsTokenPayload>;
export type AggregateIcsToken = {
    _count: IcsTokenCountAggregateOutputType | null;
    _avg: IcsTokenAvgAggregateOutputType | null;
    _sum: IcsTokenSumAggregateOutputType | null;
    _min: IcsTokenMinAggregateOutputType | null;
    _max: IcsTokenMaxAggregateOutputType | null;
};
export type IcsTokenAvgAggregateOutputType = {
    id: number | null;
    memberId: number | null;
};
export type IcsTokenSumAggregateOutputType = {
    id: number | null;
    memberId: number | null;
};
export type IcsTokenMinAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    token: string | null;
    scope: $Enums.IcsScope | null;
    createdAt: Date | null;
};
export type IcsTokenMaxAggregateOutputType = {
    id: number | null;
    memberId: number | null;
    token: string | null;
    scope: $Enums.IcsScope | null;
    createdAt: Date | null;
};
export type IcsTokenCountAggregateOutputType = {
    id: number;
    memberId: number;
    token: number;
    scope: number;
    createdAt: number;
    _all: number;
};
export type IcsTokenAvgAggregateInputType = {
    id?: true;
    memberId?: true;
};
export type IcsTokenSumAggregateInputType = {
    id?: true;
    memberId?: true;
};
export type IcsTokenMinAggregateInputType = {
    id?: true;
    memberId?: true;
    token?: true;
    scope?: true;
    createdAt?: true;
};
export type IcsTokenMaxAggregateInputType = {
    id?: true;
    memberId?: true;
    token?: true;
    scope?: true;
    createdAt?: true;
};
export type IcsTokenCountAggregateInputType = {
    id?: true;
    memberId?: true;
    token?: true;
    scope?: true;
    createdAt?: true;
    _all?: true;
};
export type IcsTokenAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IcsTokenWhereInput;
    orderBy?: Prisma.IcsTokenOrderByWithRelationInput | Prisma.IcsTokenOrderByWithRelationInput[];
    cursor?: Prisma.IcsTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | IcsTokenCountAggregateInputType;
    _avg?: IcsTokenAvgAggregateInputType;
    _sum?: IcsTokenSumAggregateInputType;
    _min?: IcsTokenMinAggregateInputType;
    _max?: IcsTokenMaxAggregateInputType;
};
export type GetIcsTokenAggregateType<T extends IcsTokenAggregateArgs> = {
    [P in keyof T & keyof AggregateIcsToken]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateIcsToken[P]> : Prisma.GetScalarType<T[P], AggregateIcsToken[P]>;
};
export type IcsTokenGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IcsTokenWhereInput;
    orderBy?: Prisma.IcsTokenOrderByWithAggregationInput | Prisma.IcsTokenOrderByWithAggregationInput[];
    by: Prisma.IcsTokenScalarFieldEnum[] | Prisma.IcsTokenScalarFieldEnum;
    having?: Prisma.IcsTokenScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: IcsTokenCountAggregateInputType | true;
    _avg?: IcsTokenAvgAggregateInputType;
    _sum?: IcsTokenSumAggregateInputType;
    _min?: IcsTokenMinAggregateInputType;
    _max?: IcsTokenMaxAggregateInputType;
};
export type IcsTokenGroupByOutputType = {
    id: number;
    memberId: number;
    token: string;
    scope: $Enums.IcsScope;
    createdAt: Date;
    _count: IcsTokenCountAggregateOutputType | null;
    _avg: IcsTokenAvgAggregateOutputType | null;
    _sum: IcsTokenSumAggregateOutputType | null;
    _min: IcsTokenMinAggregateOutputType | null;
    _max: IcsTokenMaxAggregateOutputType | null;
};
export type GetIcsTokenGroupByPayload<T extends IcsTokenGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<IcsTokenGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof IcsTokenGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], IcsTokenGroupByOutputType[P]> : Prisma.GetScalarType<T[P], IcsTokenGroupByOutputType[P]>;
}>>;
export type IcsTokenWhereInput = {
    AND?: Prisma.IcsTokenWhereInput | Prisma.IcsTokenWhereInput[];
    OR?: Prisma.IcsTokenWhereInput[];
    NOT?: Prisma.IcsTokenWhereInput | Prisma.IcsTokenWhereInput[];
    id?: Prisma.IntFilter<"IcsToken"> | number;
    memberId?: Prisma.IntFilter<"IcsToken"> | number;
    token?: Prisma.StringFilter<"IcsToken"> | string;
    scope?: Prisma.EnumIcsScopeFilter<"IcsToken"> | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFilter<"IcsToken"> | Date | string;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
};
export type IcsTokenOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    member?: Prisma.MemberOrderByWithRelationInput;
};
export type IcsTokenWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    token?: string;
    AND?: Prisma.IcsTokenWhereInput | Prisma.IcsTokenWhereInput[];
    OR?: Prisma.IcsTokenWhereInput[];
    NOT?: Prisma.IcsTokenWhereInput | Prisma.IcsTokenWhereInput[];
    memberId?: Prisma.IntFilter<"IcsToken"> | number;
    scope?: Prisma.EnumIcsScopeFilter<"IcsToken"> | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFilter<"IcsToken"> | Date | string;
    member?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
}, "id" | "token">;
export type IcsTokenOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    _count?: Prisma.IcsTokenCountOrderByAggregateInput;
    _avg?: Prisma.IcsTokenAvgOrderByAggregateInput;
    _max?: Prisma.IcsTokenMaxOrderByAggregateInput;
    _min?: Prisma.IcsTokenMinOrderByAggregateInput;
    _sum?: Prisma.IcsTokenSumOrderByAggregateInput;
};
export type IcsTokenScalarWhereWithAggregatesInput = {
    AND?: Prisma.IcsTokenScalarWhereWithAggregatesInput | Prisma.IcsTokenScalarWhereWithAggregatesInput[];
    OR?: Prisma.IcsTokenScalarWhereWithAggregatesInput[];
    NOT?: Prisma.IcsTokenScalarWhereWithAggregatesInput | Prisma.IcsTokenScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"IcsToken"> | number;
    memberId?: Prisma.IntWithAggregatesFilter<"IcsToken"> | number;
    token?: Prisma.StringWithAggregatesFilter<"IcsToken"> | string;
    scope?: Prisma.EnumIcsScopeWithAggregatesFilter<"IcsToken"> | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"IcsToken"> | Date | string;
};
export type IcsTokenCreateInput = {
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
    member: Prisma.MemberCreateNestedOneWithoutIcsTokensInput;
};
export type IcsTokenUncheckedCreateInput = {
    id?: number;
    memberId: number;
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
};
export type IcsTokenUpdateInput = {
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    member?: Prisma.MemberUpdateOneRequiredWithoutIcsTokensNestedInput;
};
export type IcsTokenUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenCreateManyInput = {
    id?: number;
    memberId: number;
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
};
export type IcsTokenUpdateManyMutationInput = {
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    memberId?: Prisma.IntFieldUpdateOperationsInput | number;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenListRelationFilter = {
    every?: Prisma.IcsTokenWhereInput;
    some?: Prisma.IcsTokenWhereInput;
    none?: Prisma.IcsTokenWhereInput;
};
export type IcsTokenOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type IcsTokenCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IcsTokenAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type IcsTokenMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IcsTokenMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
    token?: Prisma.SortOrder;
    scope?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
};
export type IcsTokenSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    memberId?: Prisma.SortOrder;
};
export type IcsTokenCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput> | Prisma.IcsTokenCreateWithoutMemberInput[] | Prisma.IcsTokenUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.IcsTokenCreateOrConnectWithoutMemberInput | Prisma.IcsTokenCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.IcsTokenCreateManyMemberInputEnvelope;
    connect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
};
export type IcsTokenUncheckedCreateNestedManyWithoutMemberInput = {
    create?: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput> | Prisma.IcsTokenCreateWithoutMemberInput[] | Prisma.IcsTokenUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.IcsTokenCreateOrConnectWithoutMemberInput | Prisma.IcsTokenCreateOrConnectWithoutMemberInput[];
    createMany?: Prisma.IcsTokenCreateManyMemberInputEnvelope;
    connect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
};
export type IcsTokenUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput> | Prisma.IcsTokenCreateWithoutMemberInput[] | Prisma.IcsTokenUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.IcsTokenCreateOrConnectWithoutMemberInput | Prisma.IcsTokenCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.IcsTokenUpsertWithWhereUniqueWithoutMemberInput | Prisma.IcsTokenUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.IcsTokenCreateManyMemberInputEnvelope;
    set?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    disconnect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    delete?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    connect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    update?: Prisma.IcsTokenUpdateWithWhereUniqueWithoutMemberInput | Prisma.IcsTokenUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.IcsTokenUpdateManyWithWhereWithoutMemberInput | Prisma.IcsTokenUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.IcsTokenScalarWhereInput | Prisma.IcsTokenScalarWhereInput[];
};
export type IcsTokenUncheckedUpdateManyWithoutMemberNestedInput = {
    create?: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput> | Prisma.IcsTokenCreateWithoutMemberInput[] | Prisma.IcsTokenUncheckedCreateWithoutMemberInput[];
    connectOrCreate?: Prisma.IcsTokenCreateOrConnectWithoutMemberInput | Prisma.IcsTokenCreateOrConnectWithoutMemberInput[];
    upsert?: Prisma.IcsTokenUpsertWithWhereUniqueWithoutMemberInput | Prisma.IcsTokenUpsertWithWhereUniqueWithoutMemberInput[];
    createMany?: Prisma.IcsTokenCreateManyMemberInputEnvelope;
    set?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    disconnect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    delete?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    connect?: Prisma.IcsTokenWhereUniqueInput | Prisma.IcsTokenWhereUniqueInput[];
    update?: Prisma.IcsTokenUpdateWithWhereUniqueWithoutMemberInput | Prisma.IcsTokenUpdateWithWhereUniqueWithoutMemberInput[];
    updateMany?: Prisma.IcsTokenUpdateManyWithWhereWithoutMemberInput | Prisma.IcsTokenUpdateManyWithWhereWithoutMemberInput[];
    deleteMany?: Prisma.IcsTokenScalarWhereInput | Prisma.IcsTokenScalarWhereInput[];
};
export type EnumIcsScopeFieldUpdateOperationsInput = {
    set?: $Enums.IcsScope;
};
export type IcsTokenCreateWithoutMemberInput = {
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
};
export type IcsTokenUncheckedCreateWithoutMemberInput = {
    id?: number;
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
};
export type IcsTokenCreateOrConnectWithoutMemberInput = {
    where: Prisma.IcsTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput>;
};
export type IcsTokenCreateManyMemberInputEnvelope = {
    data: Prisma.IcsTokenCreateManyMemberInput | Prisma.IcsTokenCreateManyMemberInput[];
    skipDuplicates?: boolean;
};
export type IcsTokenUpsertWithWhereUniqueWithoutMemberInput = {
    where: Prisma.IcsTokenWhereUniqueInput;
    update: Prisma.XOR<Prisma.IcsTokenUpdateWithoutMemberInput, Prisma.IcsTokenUncheckedUpdateWithoutMemberInput>;
    create: Prisma.XOR<Prisma.IcsTokenCreateWithoutMemberInput, Prisma.IcsTokenUncheckedCreateWithoutMemberInput>;
};
export type IcsTokenUpdateWithWhereUniqueWithoutMemberInput = {
    where: Prisma.IcsTokenWhereUniqueInput;
    data: Prisma.XOR<Prisma.IcsTokenUpdateWithoutMemberInput, Prisma.IcsTokenUncheckedUpdateWithoutMemberInput>;
};
export type IcsTokenUpdateManyWithWhereWithoutMemberInput = {
    where: Prisma.IcsTokenScalarWhereInput;
    data: Prisma.XOR<Prisma.IcsTokenUpdateManyMutationInput, Prisma.IcsTokenUncheckedUpdateManyWithoutMemberInput>;
};
export type IcsTokenScalarWhereInput = {
    AND?: Prisma.IcsTokenScalarWhereInput | Prisma.IcsTokenScalarWhereInput[];
    OR?: Prisma.IcsTokenScalarWhereInput[];
    NOT?: Prisma.IcsTokenScalarWhereInput | Prisma.IcsTokenScalarWhereInput[];
    id?: Prisma.IntFilter<"IcsToken"> | number;
    memberId?: Prisma.IntFilter<"IcsToken"> | number;
    token?: Prisma.StringFilter<"IcsToken"> | string;
    scope?: Prisma.EnumIcsScopeFilter<"IcsToken"> | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFilter<"IcsToken"> | Date | string;
};
export type IcsTokenCreateManyMemberInput = {
    id?: number;
    token: string;
    scope: $Enums.IcsScope;
    createdAt?: Date | string;
};
export type IcsTokenUpdateWithoutMemberInput = {
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenUncheckedUpdateWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenUncheckedUpdateManyWithoutMemberInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    token?: Prisma.StringFieldUpdateOperationsInput | string;
    scope?: Prisma.EnumIcsScopeFieldUpdateOperationsInput | $Enums.IcsScope;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type IcsTokenSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    token?: boolean;
    scope?: boolean;
    createdAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["icsToken"]>;
export type IcsTokenSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    token?: boolean;
    scope?: boolean;
    createdAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["icsToken"]>;
export type IcsTokenSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    memberId?: boolean;
    token?: boolean;
    scope?: boolean;
    createdAt?: boolean;
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["icsToken"]>;
export type IcsTokenSelectScalar = {
    id?: boolean;
    memberId?: boolean;
    token?: boolean;
    scope?: boolean;
    createdAt?: boolean;
};
export type IcsTokenOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "memberId" | "token" | "scope" | "createdAt", ExtArgs["result"]["icsToken"]>;
export type IcsTokenInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type IcsTokenIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type IcsTokenIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    member?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
};
export type $IcsTokenPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "IcsToken";
    objects: {
        member: Prisma.$MemberPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        memberId: number;
        token: string;
        scope: $Enums.IcsScope;
        createdAt: Date;
    }, ExtArgs["result"]["icsToken"]>;
    composites: {};
};
export type IcsTokenGetPayload<S extends boolean | null | undefined | IcsTokenDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload, S>;
export type IcsTokenCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<IcsTokenFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: IcsTokenCountAggregateInputType | true;
};
export interface IcsTokenDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['IcsToken'];
        meta: {
            name: 'IcsToken';
        };
    };
    findUnique<T extends IcsTokenFindUniqueArgs>(args: Prisma.SelectSubset<T, IcsTokenFindUniqueArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends IcsTokenFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, IcsTokenFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends IcsTokenFindFirstArgs>(args?: Prisma.SelectSubset<T, IcsTokenFindFirstArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends IcsTokenFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, IcsTokenFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends IcsTokenFindManyArgs>(args?: Prisma.SelectSubset<T, IcsTokenFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends IcsTokenCreateArgs>(args: Prisma.SelectSubset<T, IcsTokenCreateArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends IcsTokenCreateManyArgs>(args?: Prisma.SelectSubset<T, IcsTokenCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends IcsTokenCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, IcsTokenCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends IcsTokenDeleteArgs>(args: Prisma.SelectSubset<T, IcsTokenDeleteArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends IcsTokenUpdateArgs>(args: Prisma.SelectSubset<T, IcsTokenUpdateArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends IcsTokenDeleteManyArgs>(args?: Prisma.SelectSubset<T, IcsTokenDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends IcsTokenUpdateManyArgs>(args: Prisma.SelectSubset<T, IcsTokenUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends IcsTokenUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, IcsTokenUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends IcsTokenUpsertArgs>(args: Prisma.SelectSubset<T, IcsTokenUpsertArgs<ExtArgs>>): Prisma.Prisma__IcsTokenClient<runtime.Types.Result.GetResult<Prisma.$IcsTokenPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends IcsTokenCountArgs>(args?: Prisma.Subset<T, IcsTokenCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], IcsTokenCountAggregateOutputType> : number>;
    aggregate<T extends IcsTokenAggregateArgs>(args: Prisma.Subset<T, IcsTokenAggregateArgs>): Prisma.PrismaPromise<GetIcsTokenAggregateType<T>>;
    groupBy<T extends IcsTokenGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: IcsTokenGroupByArgs['orderBy'];
    } : {
        orderBy?: IcsTokenGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, IcsTokenGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetIcsTokenGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: IcsTokenFieldRefs;
}
export interface Prisma__IcsTokenClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    member<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface IcsTokenFieldRefs {
    readonly id: Prisma.FieldRef<"IcsToken", 'Int'>;
    readonly memberId: Prisma.FieldRef<"IcsToken", 'Int'>;
    readonly token: Prisma.FieldRef<"IcsToken", 'String'>;
    readonly scope: Prisma.FieldRef<"IcsToken", 'IcsScope'>;
    readonly createdAt: Prisma.FieldRef<"IcsToken", 'DateTime'>;
}
export type IcsTokenFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where: Prisma.IcsTokenWhereUniqueInput;
};
export type IcsTokenFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where: Prisma.IcsTokenWhereUniqueInput;
};
export type IcsTokenFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where?: Prisma.IcsTokenWhereInput;
    orderBy?: Prisma.IcsTokenOrderByWithRelationInput | Prisma.IcsTokenOrderByWithRelationInput[];
    cursor?: Prisma.IcsTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IcsTokenScalarFieldEnum | Prisma.IcsTokenScalarFieldEnum[];
};
export type IcsTokenFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where?: Prisma.IcsTokenWhereInput;
    orderBy?: Prisma.IcsTokenOrderByWithRelationInput | Prisma.IcsTokenOrderByWithRelationInput[];
    cursor?: Prisma.IcsTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IcsTokenScalarFieldEnum | Prisma.IcsTokenScalarFieldEnum[];
};
export type IcsTokenFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where?: Prisma.IcsTokenWhereInput;
    orderBy?: Prisma.IcsTokenOrderByWithRelationInput | Prisma.IcsTokenOrderByWithRelationInput[];
    cursor?: Prisma.IcsTokenWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.IcsTokenScalarFieldEnum | Prisma.IcsTokenScalarFieldEnum[];
};
export type IcsTokenCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IcsTokenCreateInput, Prisma.IcsTokenUncheckedCreateInput>;
};
export type IcsTokenCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.IcsTokenCreateManyInput | Prisma.IcsTokenCreateManyInput[];
    skipDuplicates?: boolean;
};
export type IcsTokenCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    data: Prisma.IcsTokenCreateManyInput | Prisma.IcsTokenCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.IcsTokenIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type IcsTokenUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IcsTokenUpdateInput, Prisma.IcsTokenUncheckedUpdateInput>;
    where: Prisma.IcsTokenWhereUniqueInput;
};
export type IcsTokenUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.IcsTokenUpdateManyMutationInput, Prisma.IcsTokenUncheckedUpdateManyInput>;
    where?: Prisma.IcsTokenWhereInput;
    limit?: number;
};
export type IcsTokenUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.IcsTokenUpdateManyMutationInput, Prisma.IcsTokenUncheckedUpdateManyInput>;
    where?: Prisma.IcsTokenWhereInput;
    limit?: number;
    include?: Prisma.IcsTokenIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type IcsTokenUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where: Prisma.IcsTokenWhereUniqueInput;
    create: Prisma.XOR<Prisma.IcsTokenCreateInput, Prisma.IcsTokenUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.IcsTokenUpdateInput, Prisma.IcsTokenUncheckedUpdateInput>;
};
export type IcsTokenDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
    where: Prisma.IcsTokenWhereUniqueInput;
};
export type IcsTokenDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.IcsTokenWhereInput;
    limit?: number;
};
export type IcsTokenDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.IcsTokenSelect<ExtArgs> | null;
    omit?: Prisma.IcsTokenOmit<ExtArgs> | null;
    include?: Prisma.IcsTokenInclude<ExtArgs> | null;
};
