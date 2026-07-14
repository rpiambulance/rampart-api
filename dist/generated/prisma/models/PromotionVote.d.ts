import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type PromotionVoteModel = runtime.Types.Result.DefaultSelection<Prisma.$PromotionVotePayload>;
export type AggregatePromotionVote = {
    _count: PromotionVoteCountAggregateOutputType | null;
    _avg: PromotionVoteAvgAggregateOutputType | null;
    _sum: PromotionVoteSumAggregateOutputType | null;
    _min: PromotionVoteMinAggregateOutputType | null;
    _max: PromotionVoteMaxAggregateOutputType | null;
};
export type PromotionVoteAvgAggregateOutputType = {
    id: number | null;
    requestId: number | null;
    voterId: number | null;
    proxyForId: number | null;
};
export type PromotionVoteSumAggregateOutputType = {
    id: number | null;
    requestId: number | null;
    voterId: number | null;
    proxyForId: number | null;
};
export type PromotionVoteMinAggregateOutputType = {
    id: number | null;
    requestId: number | null;
    voterId: number | null;
    proxyForId: number | null;
    vote: $Enums.VoteChoice | null;
    notes: string | null;
    castAt: Date | null;
};
export type PromotionVoteMaxAggregateOutputType = {
    id: number | null;
    requestId: number | null;
    voterId: number | null;
    proxyForId: number | null;
    vote: $Enums.VoteChoice | null;
    notes: string | null;
    castAt: Date | null;
};
export type PromotionVoteCountAggregateOutputType = {
    id: number;
    requestId: number;
    voterId: number;
    proxyForId: number;
    vote: number;
    notes: number;
    castAt: number;
    _all: number;
};
export type PromotionVoteAvgAggregateInputType = {
    id?: true;
    requestId?: true;
    voterId?: true;
    proxyForId?: true;
};
export type PromotionVoteSumAggregateInputType = {
    id?: true;
    requestId?: true;
    voterId?: true;
    proxyForId?: true;
};
export type PromotionVoteMinAggregateInputType = {
    id?: true;
    requestId?: true;
    voterId?: true;
    proxyForId?: true;
    vote?: true;
    notes?: true;
    castAt?: true;
};
export type PromotionVoteMaxAggregateInputType = {
    id?: true;
    requestId?: true;
    voterId?: true;
    proxyForId?: true;
    vote?: true;
    notes?: true;
    castAt?: true;
};
export type PromotionVoteCountAggregateInputType = {
    id?: true;
    requestId?: true;
    voterId?: true;
    proxyForId?: true;
    vote?: true;
    notes?: true;
    castAt?: true;
    _all?: true;
};
export type PromotionVoteAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithRelationInput | Prisma.PromotionVoteOrderByWithRelationInput[];
    cursor?: Prisma.PromotionVoteWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | PromotionVoteCountAggregateInputType;
    _avg?: PromotionVoteAvgAggregateInputType;
    _sum?: PromotionVoteSumAggregateInputType;
    _min?: PromotionVoteMinAggregateInputType;
    _max?: PromotionVoteMaxAggregateInputType;
};
export type GetPromotionVoteAggregateType<T extends PromotionVoteAggregateArgs> = {
    [P in keyof T & keyof AggregatePromotionVote]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregatePromotionVote[P]> : Prisma.GetScalarType<T[P], AggregatePromotionVote[P]>;
};
export type PromotionVoteGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithAggregationInput | Prisma.PromotionVoteOrderByWithAggregationInput[];
    by: Prisma.PromotionVoteScalarFieldEnum[] | Prisma.PromotionVoteScalarFieldEnum;
    having?: Prisma.PromotionVoteScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: PromotionVoteCountAggregateInputType | true;
    _avg?: PromotionVoteAvgAggregateInputType;
    _sum?: PromotionVoteSumAggregateInputType;
    _min?: PromotionVoteMinAggregateInputType;
    _max?: PromotionVoteMaxAggregateInputType;
};
export type PromotionVoteGroupByOutputType = {
    id: number;
    requestId: number;
    voterId: number;
    proxyForId: number | null;
    vote: $Enums.VoteChoice;
    notes: string | null;
    castAt: Date;
    _count: PromotionVoteCountAggregateOutputType | null;
    _avg: PromotionVoteAvgAggregateOutputType | null;
    _sum: PromotionVoteSumAggregateOutputType | null;
    _min: PromotionVoteMinAggregateOutputType | null;
    _max: PromotionVoteMaxAggregateOutputType | null;
};
export type GetPromotionVoteGroupByPayload<T extends PromotionVoteGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<PromotionVoteGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof PromotionVoteGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], PromotionVoteGroupByOutputType[P]> : Prisma.GetScalarType<T[P], PromotionVoteGroupByOutputType[P]>;
}>>;
export type PromotionVoteWhereInput = {
    AND?: Prisma.PromotionVoteWhereInput | Prisma.PromotionVoteWhereInput[];
    OR?: Prisma.PromotionVoteWhereInput[];
    NOT?: Prisma.PromotionVoteWhereInput | Prisma.PromotionVoteWhereInput[];
    id?: Prisma.IntFilter<"PromotionVote"> | number;
    requestId?: Prisma.IntFilter<"PromotionVote"> | number;
    voterId?: Prisma.IntFilter<"PromotionVote"> | number;
    proxyForId?: Prisma.IntNullableFilter<"PromotionVote"> | number | null;
    vote?: Prisma.EnumVoteChoiceFilter<"PromotionVote"> | $Enums.VoteChoice;
    notes?: Prisma.StringNullableFilter<"PromotionVote"> | string | null;
    castAt?: Prisma.DateTimeFilter<"PromotionVote"> | Date | string;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
    voter?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    proxyFor?: Prisma.XOR<Prisma.MemberNullableScalarRelationFilter, Prisma.MemberWhereInput> | null;
};
export type PromotionVoteOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vote?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    castAt?: Prisma.SortOrder;
    request?: Prisma.PromotionRequestOrderByWithRelationInput;
    voter?: Prisma.MemberOrderByWithRelationInput;
    proxyFor?: Prisma.MemberOrderByWithRelationInput;
};
export type PromotionVoteWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    requestId_voterId_proxyForId?: Prisma.PromotionVoteRequestIdVoterIdProxyForIdCompoundUniqueInput;
    AND?: Prisma.PromotionVoteWhereInput | Prisma.PromotionVoteWhereInput[];
    OR?: Prisma.PromotionVoteWhereInput[];
    NOT?: Prisma.PromotionVoteWhereInput | Prisma.PromotionVoteWhereInput[];
    requestId?: Prisma.IntFilter<"PromotionVote"> | number;
    voterId?: Prisma.IntFilter<"PromotionVote"> | number;
    proxyForId?: Prisma.IntNullableFilter<"PromotionVote"> | number | null;
    vote?: Prisma.EnumVoteChoiceFilter<"PromotionVote"> | $Enums.VoteChoice;
    notes?: Prisma.StringNullableFilter<"PromotionVote"> | string | null;
    castAt?: Prisma.DateTimeFilter<"PromotionVote"> | Date | string;
    request?: Prisma.XOR<Prisma.PromotionRequestScalarRelationFilter, Prisma.PromotionRequestWhereInput>;
    voter?: Prisma.XOR<Prisma.MemberScalarRelationFilter, Prisma.MemberWhereInput>;
    proxyFor?: Prisma.XOR<Prisma.MemberNullableScalarRelationFilter, Prisma.MemberWhereInput> | null;
}, "id" | "requestId_voterId_proxyForId">;
export type PromotionVoteOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrderInput | Prisma.SortOrder;
    vote?: Prisma.SortOrder;
    notes?: Prisma.SortOrderInput | Prisma.SortOrder;
    castAt?: Prisma.SortOrder;
    _count?: Prisma.PromotionVoteCountOrderByAggregateInput;
    _avg?: Prisma.PromotionVoteAvgOrderByAggregateInput;
    _max?: Prisma.PromotionVoteMaxOrderByAggregateInput;
    _min?: Prisma.PromotionVoteMinOrderByAggregateInput;
    _sum?: Prisma.PromotionVoteSumOrderByAggregateInput;
};
export type PromotionVoteScalarWhereWithAggregatesInput = {
    AND?: Prisma.PromotionVoteScalarWhereWithAggregatesInput | Prisma.PromotionVoteScalarWhereWithAggregatesInput[];
    OR?: Prisma.PromotionVoteScalarWhereWithAggregatesInput[];
    NOT?: Prisma.PromotionVoteScalarWhereWithAggregatesInput | Prisma.PromotionVoteScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"PromotionVote"> | number;
    requestId?: Prisma.IntWithAggregatesFilter<"PromotionVote"> | number;
    voterId?: Prisma.IntWithAggregatesFilter<"PromotionVote"> | number;
    proxyForId?: Prisma.IntNullableWithAggregatesFilter<"PromotionVote"> | number | null;
    vote?: Prisma.EnumVoteChoiceWithAggregatesFilter<"PromotionVote"> | $Enums.VoteChoice;
    notes?: Prisma.StringNullableWithAggregatesFilter<"PromotionVote"> | string | null;
    castAt?: Prisma.DateTimeWithAggregatesFilter<"PromotionVote"> | Date | string;
};
export type PromotionVoteCreateInput = {
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
    request: Prisma.PromotionRequestCreateNestedOneWithoutVotesInput;
    voter: Prisma.MemberCreateNestedOneWithoutPromotionVotesInput;
    proxyFor?: Prisma.MemberCreateNestedOneWithoutProxiedVotesInput;
};
export type PromotionVoteUncheckedCreateInput = {
    id?: number;
    requestId: number;
    voterId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteUpdateInput = {
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutVotesNestedInput;
    voter?: Prisma.MemberUpdateOneRequiredWithoutPromotionVotesNestedInput;
    proxyFor?: Prisma.MemberUpdateOneWithoutProxiedVotesNestedInput;
};
export type PromotionVoteUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteCreateManyInput = {
    id?: number;
    requestId: number;
    voterId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteUpdateManyMutationInput = {
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteListRelationFilter = {
    every?: Prisma.PromotionVoteWhereInput;
    some?: Prisma.PromotionVoteWhereInput;
    none?: Prisma.PromotionVoteWhereInput;
};
export type PromotionVoteOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type PromotionVoteRequestIdVoterIdProxyForIdCompoundUniqueInput = {
    requestId: number;
    voterId: number;
    proxyForId: number;
};
export type PromotionVoteCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrder;
    vote?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    castAt?: Prisma.SortOrder;
};
export type PromotionVoteAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrder;
};
export type PromotionVoteMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrder;
    vote?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    castAt?: Prisma.SortOrder;
};
export type PromotionVoteMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrder;
    vote?: Prisma.SortOrder;
    notes?: Prisma.SortOrder;
    castAt?: Prisma.SortOrder;
};
export type PromotionVoteSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    requestId?: Prisma.SortOrder;
    voterId?: Prisma.SortOrder;
    proxyForId?: Prisma.SortOrder;
};
export type PromotionVoteCreateNestedManyWithoutVoterInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput> | Prisma.PromotionVoteCreateWithoutVoterInput[] | Prisma.PromotionVoteUncheckedCreateWithoutVoterInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutVoterInput | Prisma.PromotionVoteCreateOrConnectWithoutVoterInput[];
    createMany?: Prisma.PromotionVoteCreateManyVoterInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteCreateNestedManyWithoutProxyForInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput> | Prisma.PromotionVoteCreateWithoutProxyForInput[] | Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput | Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput[];
    createMany?: Prisma.PromotionVoteCreateManyProxyForInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteUncheckedCreateNestedManyWithoutVoterInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput> | Prisma.PromotionVoteCreateWithoutVoterInput[] | Prisma.PromotionVoteUncheckedCreateWithoutVoterInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutVoterInput | Prisma.PromotionVoteCreateOrConnectWithoutVoterInput[];
    createMany?: Prisma.PromotionVoteCreateManyVoterInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteUncheckedCreateNestedManyWithoutProxyForInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput> | Prisma.PromotionVoteCreateWithoutProxyForInput[] | Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput | Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput[];
    createMany?: Prisma.PromotionVoteCreateManyProxyForInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteUpdateManyWithoutVoterNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput> | Prisma.PromotionVoteCreateWithoutVoterInput[] | Prisma.PromotionVoteUncheckedCreateWithoutVoterInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutVoterInput | Prisma.PromotionVoteCreateOrConnectWithoutVoterInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutVoterInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutVoterInput[];
    createMany?: Prisma.PromotionVoteCreateManyVoterInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutVoterInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutVoterInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutVoterInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutVoterInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type PromotionVoteUpdateManyWithoutProxyForNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput> | Prisma.PromotionVoteCreateWithoutProxyForInput[] | Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput | Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutProxyForInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutProxyForInput[];
    createMany?: Prisma.PromotionVoteCreateManyProxyForInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutProxyForInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutProxyForInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutProxyForInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutProxyForInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type PromotionVoteUncheckedUpdateManyWithoutVoterNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput> | Prisma.PromotionVoteCreateWithoutVoterInput[] | Prisma.PromotionVoteUncheckedCreateWithoutVoterInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutVoterInput | Prisma.PromotionVoteCreateOrConnectWithoutVoterInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutVoterInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutVoterInput[];
    createMany?: Prisma.PromotionVoteCreateManyVoterInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutVoterInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutVoterInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutVoterInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutVoterInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type PromotionVoteUncheckedUpdateManyWithoutProxyForNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput> | Prisma.PromotionVoteCreateWithoutProxyForInput[] | Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput | Prisma.PromotionVoteCreateOrConnectWithoutProxyForInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutProxyForInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutProxyForInput[];
    createMany?: Prisma.PromotionVoteCreateManyProxyForInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutProxyForInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutProxyForInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutProxyForInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutProxyForInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type PromotionVoteCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput> | Prisma.PromotionVoteCreateWithoutRequestInput[] | Prisma.PromotionVoteUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutRequestInput | Prisma.PromotionVoteCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.PromotionVoteCreateManyRequestInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteUncheckedCreateNestedManyWithoutRequestInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput> | Prisma.PromotionVoteCreateWithoutRequestInput[] | Prisma.PromotionVoteUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutRequestInput | Prisma.PromotionVoteCreateOrConnectWithoutRequestInput[];
    createMany?: Prisma.PromotionVoteCreateManyRequestInputEnvelope;
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
};
export type PromotionVoteUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput> | Prisma.PromotionVoteCreateWithoutRequestInput[] | Prisma.PromotionVoteUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutRequestInput | Prisma.PromotionVoteCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutRequestInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.PromotionVoteCreateManyRequestInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutRequestInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutRequestInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type PromotionVoteUncheckedUpdateManyWithoutRequestNestedInput = {
    create?: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput> | Prisma.PromotionVoteCreateWithoutRequestInput[] | Prisma.PromotionVoteUncheckedCreateWithoutRequestInput[];
    connectOrCreate?: Prisma.PromotionVoteCreateOrConnectWithoutRequestInput | Prisma.PromotionVoteCreateOrConnectWithoutRequestInput[];
    upsert?: Prisma.PromotionVoteUpsertWithWhereUniqueWithoutRequestInput | Prisma.PromotionVoteUpsertWithWhereUniqueWithoutRequestInput[];
    createMany?: Prisma.PromotionVoteCreateManyRequestInputEnvelope;
    set?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    disconnect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    delete?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    connect?: Prisma.PromotionVoteWhereUniqueInput | Prisma.PromotionVoteWhereUniqueInput[];
    update?: Prisma.PromotionVoteUpdateWithWhereUniqueWithoutRequestInput | Prisma.PromotionVoteUpdateWithWhereUniqueWithoutRequestInput[];
    updateMany?: Prisma.PromotionVoteUpdateManyWithWhereWithoutRequestInput | Prisma.PromotionVoteUpdateManyWithWhereWithoutRequestInput[];
    deleteMany?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
};
export type EnumVoteChoiceFieldUpdateOperationsInput = {
    set?: $Enums.VoteChoice;
};
export type PromotionVoteCreateWithoutVoterInput = {
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
    request: Prisma.PromotionRequestCreateNestedOneWithoutVotesInput;
    proxyFor?: Prisma.MemberCreateNestedOneWithoutProxiedVotesInput;
};
export type PromotionVoteUncheckedCreateWithoutVoterInput = {
    id?: number;
    requestId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteCreateOrConnectWithoutVoterInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput>;
};
export type PromotionVoteCreateManyVoterInputEnvelope = {
    data: Prisma.PromotionVoteCreateManyVoterInput | Prisma.PromotionVoteCreateManyVoterInput[];
    skipDuplicates?: boolean;
};
export type PromotionVoteCreateWithoutProxyForInput = {
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
    request: Prisma.PromotionRequestCreateNestedOneWithoutVotesInput;
    voter: Prisma.MemberCreateNestedOneWithoutPromotionVotesInput;
};
export type PromotionVoteUncheckedCreateWithoutProxyForInput = {
    id?: number;
    requestId: number;
    voterId: number;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteCreateOrConnectWithoutProxyForInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput>;
};
export type PromotionVoteCreateManyProxyForInputEnvelope = {
    data: Prisma.PromotionVoteCreateManyProxyForInput | Prisma.PromotionVoteCreateManyProxyForInput[];
    skipDuplicates?: boolean;
};
export type PromotionVoteUpsertWithWhereUniqueWithoutVoterInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutVoterInput, Prisma.PromotionVoteUncheckedUpdateWithoutVoterInput>;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutVoterInput, Prisma.PromotionVoteUncheckedCreateWithoutVoterInput>;
};
export type PromotionVoteUpdateWithWhereUniqueWithoutVoterInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutVoterInput, Prisma.PromotionVoteUncheckedUpdateWithoutVoterInput>;
};
export type PromotionVoteUpdateManyWithWhereWithoutVoterInput = {
    where: Prisma.PromotionVoteScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateManyMutationInput, Prisma.PromotionVoteUncheckedUpdateManyWithoutVoterInput>;
};
export type PromotionVoteScalarWhereInput = {
    AND?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
    OR?: Prisma.PromotionVoteScalarWhereInput[];
    NOT?: Prisma.PromotionVoteScalarWhereInput | Prisma.PromotionVoteScalarWhereInput[];
    id?: Prisma.IntFilter<"PromotionVote"> | number;
    requestId?: Prisma.IntFilter<"PromotionVote"> | number;
    voterId?: Prisma.IntFilter<"PromotionVote"> | number;
    proxyForId?: Prisma.IntNullableFilter<"PromotionVote"> | number | null;
    vote?: Prisma.EnumVoteChoiceFilter<"PromotionVote"> | $Enums.VoteChoice;
    notes?: Prisma.StringNullableFilter<"PromotionVote"> | string | null;
    castAt?: Prisma.DateTimeFilter<"PromotionVote"> | Date | string;
};
export type PromotionVoteUpsertWithWhereUniqueWithoutProxyForInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutProxyForInput, Prisma.PromotionVoteUncheckedUpdateWithoutProxyForInput>;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutProxyForInput, Prisma.PromotionVoteUncheckedCreateWithoutProxyForInput>;
};
export type PromotionVoteUpdateWithWhereUniqueWithoutProxyForInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutProxyForInput, Prisma.PromotionVoteUncheckedUpdateWithoutProxyForInput>;
};
export type PromotionVoteUpdateManyWithWhereWithoutProxyForInput = {
    where: Prisma.PromotionVoteScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateManyMutationInput, Prisma.PromotionVoteUncheckedUpdateManyWithoutProxyForInput>;
};
export type PromotionVoteCreateWithoutRequestInput = {
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
    voter: Prisma.MemberCreateNestedOneWithoutPromotionVotesInput;
    proxyFor?: Prisma.MemberCreateNestedOneWithoutProxiedVotesInput;
};
export type PromotionVoteUncheckedCreateWithoutRequestInput = {
    id?: number;
    voterId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteCreateOrConnectWithoutRequestInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput>;
};
export type PromotionVoteCreateManyRequestInputEnvelope = {
    data: Prisma.PromotionVoteCreateManyRequestInput | Prisma.PromotionVoteCreateManyRequestInput[];
    skipDuplicates?: boolean;
};
export type PromotionVoteUpsertWithWhereUniqueWithoutRequestInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    update: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutRequestInput, Prisma.PromotionVoteUncheckedUpdateWithoutRequestInput>;
    create: Prisma.XOR<Prisma.PromotionVoteCreateWithoutRequestInput, Prisma.PromotionVoteUncheckedCreateWithoutRequestInput>;
};
export type PromotionVoteUpdateWithWhereUniqueWithoutRequestInput = {
    where: Prisma.PromotionVoteWhereUniqueInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateWithoutRequestInput, Prisma.PromotionVoteUncheckedUpdateWithoutRequestInput>;
};
export type PromotionVoteUpdateManyWithWhereWithoutRequestInput = {
    where: Prisma.PromotionVoteScalarWhereInput;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateManyMutationInput, Prisma.PromotionVoteUncheckedUpdateManyWithoutRequestInput>;
};
export type PromotionVoteCreateManyVoterInput = {
    id?: number;
    requestId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteCreateManyProxyForInput = {
    id?: number;
    requestId: number;
    voterId: number;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteUpdateWithoutVoterInput = {
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutVotesNestedInput;
    proxyFor?: Prisma.MemberUpdateOneWithoutProxiedVotesNestedInput;
};
export type PromotionVoteUncheckedUpdateWithoutVoterInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteUncheckedUpdateManyWithoutVoterInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteUpdateWithoutProxyForInput = {
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    request?: Prisma.PromotionRequestUpdateOneRequiredWithoutVotesNestedInput;
    voter?: Prisma.MemberUpdateOneRequiredWithoutPromotionVotesNestedInput;
};
export type PromotionVoteUncheckedUpdateWithoutProxyForInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteUncheckedUpdateManyWithoutProxyForInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    requestId?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteCreateManyRequestInput = {
    id?: number;
    voterId: number;
    proxyForId?: number | null;
    vote: $Enums.VoteChoice;
    notes?: string | null;
    castAt?: Date | string;
};
export type PromotionVoteUpdateWithoutRequestInput = {
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    voter?: Prisma.MemberUpdateOneRequiredWithoutPromotionVotesNestedInput;
    proxyFor?: Prisma.MemberUpdateOneWithoutProxiedVotesNestedInput;
};
export type PromotionVoteUncheckedUpdateWithoutRequestInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteUncheckedUpdateManyWithoutRequestInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    voterId?: Prisma.IntFieldUpdateOperationsInput | number;
    proxyForId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    vote?: Prisma.EnumVoteChoiceFieldUpdateOperationsInput | $Enums.VoteChoice;
    notes?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    castAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type PromotionVoteSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    voterId?: boolean;
    proxyForId?: boolean;
    vote?: boolean;
    notes?: boolean;
    castAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
}, ExtArgs["result"]["promotionVote"]>;
export type PromotionVoteSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    voterId?: boolean;
    proxyForId?: boolean;
    vote?: boolean;
    notes?: boolean;
    castAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
}, ExtArgs["result"]["promotionVote"]>;
export type PromotionVoteSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    requestId?: boolean;
    voterId?: boolean;
    proxyForId?: boolean;
    vote?: boolean;
    notes?: boolean;
    castAt?: boolean;
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
}, ExtArgs["result"]["promotionVote"]>;
export type PromotionVoteSelectScalar = {
    id?: boolean;
    requestId?: boolean;
    voterId?: boolean;
    proxyForId?: boolean;
    vote?: boolean;
    notes?: boolean;
    castAt?: boolean;
};
export type PromotionVoteOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "requestId" | "voterId" | "proxyForId" | "vote" | "notes" | "castAt", ExtArgs["result"]["promotionVote"]>;
export type PromotionVoteInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
};
export type PromotionVoteIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
};
export type PromotionVoteIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    request?: boolean | Prisma.PromotionRequestDefaultArgs<ExtArgs>;
    voter?: boolean | Prisma.MemberDefaultArgs<ExtArgs>;
    proxyFor?: boolean | Prisma.PromotionVote$proxyForArgs<ExtArgs>;
};
export type $PromotionVotePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "PromotionVote";
    objects: {
        request: Prisma.$PromotionRequestPayload<ExtArgs>;
        voter: Prisma.$MemberPayload<ExtArgs>;
        proxyFor: Prisma.$MemberPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        requestId: number;
        voterId: number;
        proxyForId: number | null;
        vote: $Enums.VoteChoice;
        notes: string | null;
        castAt: Date;
    }, ExtArgs["result"]["promotionVote"]>;
    composites: {};
};
export type PromotionVoteGetPayload<S extends boolean | null | undefined | PromotionVoteDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload, S>;
export type PromotionVoteCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<PromotionVoteFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: PromotionVoteCountAggregateInputType | true;
};
export interface PromotionVoteDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['PromotionVote'];
        meta: {
            name: 'PromotionVote';
        };
    };
    findUnique<T extends PromotionVoteFindUniqueArgs>(args: Prisma.SelectSubset<T, PromotionVoteFindUniqueArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends PromotionVoteFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, PromotionVoteFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends PromotionVoteFindFirstArgs>(args?: Prisma.SelectSubset<T, PromotionVoteFindFirstArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends PromotionVoteFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, PromotionVoteFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends PromotionVoteFindManyArgs>(args?: Prisma.SelectSubset<T, PromotionVoteFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends PromotionVoteCreateArgs>(args: Prisma.SelectSubset<T, PromotionVoteCreateArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends PromotionVoteCreateManyArgs>(args?: Prisma.SelectSubset<T, PromotionVoteCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends PromotionVoteCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, PromotionVoteCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends PromotionVoteDeleteArgs>(args: Prisma.SelectSubset<T, PromotionVoteDeleteArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends PromotionVoteUpdateArgs>(args: Prisma.SelectSubset<T, PromotionVoteUpdateArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends PromotionVoteDeleteManyArgs>(args?: Prisma.SelectSubset<T, PromotionVoteDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends PromotionVoteUpdateManyArgs>(args: Prisma.SelectSubset<T, PromotionVoteUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends PromotionVoteUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, PromotionVoteUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends PromotionVoteUpsertArgs>(args: Prisma.SelectSubset<T, PromotionVoteUpsertArgs<ExtArgs>>): Prisma.Prisma__PromotionVoteClient<runtime.Types.Result.GetResult<Prisma.$PromotionVotePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends PromotionVoteCountArgs>(args?: Prisma.Subset<T, PromotionVoteCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], PromotionVoteCountAggregateOutputType> : number>;
    aggregate<T extends PromotionVoteAggregateArgs>(args: Prisma.Subset<T, PromotionVoteAggregateArgs>): Prisma.PrismaPromise<GetPromotionVoteAggregateType<T>>;
    groupBy<T extends PromotionVoteGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: PromotionVoteGroupByArgs['orderBy'];
    } : {
        orderBy?: PromotionVoteGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, PromotionVoteGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetPromotionVoteGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: PromotionVoteFieldRefs;
}
export interface Prisma__PromotionVoteClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    request<T extends Prisma.PromotionRequestDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionRequestDefaultArgs<ExtArgs>>): Prisma.Prisma__PromotionRequestClient<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    voter<T extends Prisma.MemberDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    proxyFor<T extends Prisma.PromotionVote$proxyForArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.PromotionVote$proxyForArgs<ExtArgs>>): Prisma.Prisma__MemberClient<runtime.Types.Result.GetResult<Prisma.$MemberPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface PromotionVoteFieldRefs {
    readonly id: Prisma.FieldRef<"PromotionVote", 'Int'>;
    readonly requestId: Prisma.FieldRef<"PromotionVote", 'Int'>;
    readonly voterId: Prisma.FieldRef<"PromotionVote", 'Int'>;
    readonly proxyForId: Prisma.FieldRef<"PromotionVote", 'Int'>;
    readonly vote: Prisma.FieldRef<"PromotionVote", 'VoteChoice'>;
    readonly notes: Prisma.FieldRef<"PromotionVote", 'String'>;
    readonly castAt: Prisma.FieldRef<"PromotionVote", 'DateTime'>;
}
export type PromotionVoteFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where: Prisma.PromotionVoteWhereUniqueInput;
};
export type PromotionVoteFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where: Prisma.PromotionVoteWhereUniqueInput;
};
export type PromotionVoteFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithRelationInput | Prisma.PromotionVoteOrderByWithRelationInput[];
    cursor?: Prisma.PromotionVoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionVoteScalarFieldEnum | Prisma.PromotionVoteScalarFieldEnum[];
};
export type PromotionVoteFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithRelationInput | Prisma.PromotionVoteOrderByWithRelationInput[];
    cursor?: Prisma.PromotionVoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionVoteScalarFieldEnum | Prisma.PromotionVoteScalarFieldEnum[];
};
export type PromotionVoteFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where?: Prisma.PromotionVoteWhereInput;
    orderBy?: Prisma.PromotionVoteOrderByWithRelationInput | Prisma.PromotionVoteOrderByWithRelationInput[];
    cursor?: Prisma.PromotionVoteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionVoteScalarFieldEnum | Prisma.PromotionVoteScalarFieldEnum[];
};
export type PromotionVoteCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionVoteCreateInput, Prisma.PromotionVoteUncheckedCreateInput>;
};
export type PromotionVoteCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.PromotionVoteCreateManyInput | Prisma.PromotionVoteCreateManyInput[];
    skipDuplicates?: boolean;
};
export type PromotionVoteCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    data: Prisma.PromotionVoteCreateManyInput | Prisma.PromotionVoteCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.PromotionVoteIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type PromotionVoteUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateInput, Prisma.PromotionVoteUncheckedUpdateInput>;
    where: Prisma.PromotionVoteWhereUniqueInput;
};
export type PromotionVoteUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.PromotionVoteUpdateManyMutationInput, Prisma.PromotionVoteUncheckedUpdateManyInput>;
    where?: Prisma.PromotionVoteWhereInput;
    limit?: number;
};
export type PromotionVoteUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.PromotionVoteUpdateManyMutationInput, Prisma.PromotionVoteUncheckedUpdateManyInput>;
    where?: Prisma.PromotionVoteWhereInput;
    limit?: number;
    include?: Prisma.PromotionVoteIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type PromotionVoteUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where: Prisma.PromotionVoteWhereUniqueInput;
    create: Prisma.XOR<Prisma.PromotionVoteCreateInput, Prisma.PromotionVoteUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.PromotionVoteUpdateInput, Prisma.PromotionVoteUncheckedUpdateInput>;
};
export type PromotionVoteDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
    where: Prisma.PromotionVoteWhereUniqueInput;
};
export type PromotionVoteDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionVoteWhereInput;
    limit?: number;
};
export type PromotionVote$proxyForArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberSelect<ExtArgs> | null;
    omit?: Prisma.MemberOmit<ExtArgs> | null;
    include?: Prisma.MemberInclude<ExtArgs> | null;
    where?: Prisma.MemberWhereInput;
};
export type PromotionVoteDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionVoteSelect<ExtArgs> | null;
    omit?: Prisma.PromotionVoteOmit<ExtArgs> | null;
    include?: Prisma.PromotionVoteInclude<ExtArgs> | null;
};
