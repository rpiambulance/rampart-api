import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CredentialTypeModel = runtime.Types.Result.DefaultSelection<Prisma.$CredentialTypePayload>;
export type AggregateCredentialType = {
    _count: CredentialTypeCountAggregateOutputType | null;
    _avg: CredentialTypeAvgAggregateOutputType | null;
    _sum: CredentialTypeSumAggregateOutputType | null;
    _min: CredentialTypeMinAggregateOutputType | null;
    _max: CredentialTypeMaxAggregateOutputType | null;
};
export type CredentialTypeAvgAggregateOutputType = {
    id: number | null;
};
export type CredentialTypeSumAggregateOutputType = {
    id: number | null;
};
export type CredentialTypeMinAggregateOutputType = {
    id: number | null;
    key: string | null;
    name: string | null;
    grantMethod: $Enums.GrantMethod | null;
    isAddOn: boolean | null;
    active: boolean | null;
};
export type CredentialTypeMaxAggregateOutputType = {
    id: number | null;
    key: string | null;
    name: string | null;
    grantMethod: $Enums.GrantMethod | null;
    isAddOn: boolean | null;
    active: boolean | null;
};
export type CredentialTypeCountAggregateOutputType = {
    id: number;
    key: number;
    name: number;
    grantMethod: number;
    isAddOn: number;
    active: number;
    _all: number;
};
export type CredentialTypeAvgAggregateInputType = {
    id?: true;
};
export type CredentialTypeSumAggregateInputType = {
    id?: true;
};
export type CredentialTypeMinAggregateInputType = {
    id?: true;
    key?: true;
    name?: true;
    grantMethod?: true;
    isAddOn?: true;
    active?: true;
};
export type CredentialTypeMaxAggregateInputType = {
    id?: true;
    key?: true;
    name?: true;
    grantMethod?: true;
    isAddOn?: true;
    active?: true;
};
export type CredentialTypeCountAggregateInputType = {
    id?: true;
    key?: true;
    name?: true;
    grantMethod?: true;
    isAddOn?: true;
    active?: true;
    _all?: true;
};
export type CredentialTypeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialTypeWhereInput;
    orderBy?: Prisma.CredentialTypeOrderByWithRelationInput | Prisma.CredentialTypeOrderByWithRelationInput[];
    cursor?: Prisma.CredentialTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CredentialTypeCountAggregateInputType;
    _avg?: CredentialTypeAvgAggregateInputType;
    _sum?: CredentialTypeSumAggregateInputType;
    _min?: CredentialTypeMinAggregateInputType;
    _max?: CredentialTypeMaxAggregateInputType;
};
export type GetCredentialTypeAggregateType<T extends CredentialTypeAggregateArgs> = {
    [P in keyof T & keyof AggregateCredentialType]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCredentialType[P]> : Prisma.GetScalarType<T[P], AggregateCredentialType[P]>;
};
export type CredentialTypeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialTypeWhereInput;
    orderBy?: Prisma.CredentialTypeOrderByWithAggregationInput | Prisma.CredentialTypeOrderByWithAggregationInput[];
    by: Prisma.CredentialTypeScalarFieldEnum[] | Prisma.CredentialTypeScalarFieldEnum;
    having?: Prisma.CredentialTypeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CredentialTypeCountAggregateInputType | true;
    _avg?: CredentialTypeAvgAggregateInputType;
    _sum?: CredentialTypeSumAggregateInputType;
    _min?: CredentialTypeMinAggregateInputType;
    _max?: CredentialTypeMaxAggregateInputType;
};
export type CredentialTypeGroupByOutputType = {
    id: number;
    key: string;
    name: string;
    grantMethod: $Enums.GrantMethod;
    isAddOn: boolean;
    active: boolean;
    _count: CredentialTypeCountAggregateOutputType | null;
    _avg: CredentialTypeAvgAggregateOutputType | null;
    _sum: CredentialTypeSumAggregateOutputType | null;
    _min: CredentialTypeMinAggregateOutputType | null;
    _max: CredentialTypeMaxAggregateOutputType | null;
};
export type GetCredentialTypeGroupByPayload<T extends CredentialTypeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CredentialTypeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CredentialTypeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CredentialTypeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CredentialTypeGroupByOutputType[P]>;
}>>;
export type CredentialTypeWhereInput = {
    AND?: Prisma.CredentialTypeWhereInput | Prisma.CredentialTypeWhereInput[];
    OR?: Prisma.CredentialTypeWhereInput[];
    NOT?: Prisma.CredentialTypeWhereInput | Prisma.CredentialTypeWhereInput[];
    id?: Prisma.IntFilter<"CredentialType"> | number;
    key?: Prisma.StringFilter<"CredentialType"> | string;
    name?: Prisma.StringFilter<"CredentialType"> | string;
    grantMethod?: Prisma.EnumGrantMethodFilter<"CredentialType"> | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFilter<"CredentialType"> | boolean;
    active?: Prisma.BoolFilter<"CredentialType"> | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteListRelationFilter;
    prerequisiteOf?: Prisma.CredentialPrerequisiteListRelationFilter;
    requirements?: Prisma.CredentialRequirementListRelationFilter;
    memberCredentials?: Prisma.MemberCredentialListRelationFilter;
    promotionRequests?: Prisma.PromotionRequestListRelationFilter;
};
export type CredentialTypeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    grantMethod?: Prisma.SortOrder;
    isAddOn?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    prerequisites?: Prisma.CredentialPrerequisiteOrderByRelationAggregateInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteOrderByRelationAggregateInput;
    requirements?: Prisma.CredentialRequirementOrderByRelationAggregateInput;
    memberCredentials?: Prisma.MemberCredentialOrderByRelationAggregateInput;
    promotionRequests?: Prisma.PromotionRequestOrderByRelationAggregateInput;
};
export type CredentialTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    key?: string;
    AND?: Prisma.CredentialTypeWhereInput | Prisma.CredentialTypeWhereInput[];
    OR?: Prisma.CredentialTypeWhereInput[];
    NOT?: Prisma.CredentialTypeWhereInput | Prisma.CredentialTypeWhereInput[];
    name?: Prisma.StringFilter<"CredentialType"> | string;
    grantMethod?: Prisma.EnumGrantMethodFilter<"CredentialType"> | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFilter<"CredentialType"> | boolean;
    active?: Prisma.BoolFilter<"CredentialType"> | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteListRelationFilter;
    prerequisiteOf?: Prisma.CredentialPrerequisiteListRelationFilter;
    requirements?: Prisma.CredentialRequirementListRelationFilter;
    memberCredentials?: Prisma.MemberCredentialListRelationFilter;
    promotionRequests?: Prisma.PromotionRequestListRelationFilter;
}, "id" | "key">;
export type CredentialTypeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    grantMethod?: Prisma.SortOrder;
    isAddOn?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.CredentialTypeCountOrderByAggregateInput;
    _avg?: Prisma.CredentialTypeAvgOrderByAggregateInput;
    _max?: Prisma.CredentialTypeMaxOrderByAggregateInput;
    _min?: Prisma.CredentialTypeMinOrderByAggregateInput;
    _sum?: Prisma.CredentialTypeSumOrderByAggregateInput;
};
export type CredentialTypeScalarWhereWithAggregatesInput = {
    AND?: Prisma.CredentialTypeScalarWhereWithAggregatesInput | Prisma.CredentialTypeScalarWhereWithAggregatesInput[];
    OR?: Prisma.CredentialTypeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CredentialTypeScalarWhereWithAggregatesInput | Prisma.CredentialTypeScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"CredentialType"> | number;
    key?: Prisma.StringWithAggregatesFilter<"CredentialType"> | string;
    name?: Prisma.StringWithAggregatesFilter<"CredentialType"> | string;
    grantMethod?: Prisma.EnumGrantMethodWithAggregatesFilter<"CredentialType"> | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolWithAggregatesFilter<"CredentialType"> | boolean;
    active?: Prisma.BoolWithAggregatesFilter<"CredentialType"> | boolean;
};
export type CredentialTypeCreateInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUncheckedCreateInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUpdateInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeCreateManyInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
};
export type CredentialTypeUpdateManyMutationInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type CredentialTypeUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type CredentialTypeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    grantMethod?: Prisma.SortOrder;
    isAddOn?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CredentialTypeAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type CredentialTypeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    grantMethod?: Prisma.SortOrder;
    isAddOn?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CredentialTypeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    key?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    grantMethod?: Prisma.SortOrder;
    isAddOn?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CredentialTypeSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type CredentialTypeScalarRelationFilter = {
    is?: Prisma.CredentialTypeWhereInput;
    isNot?: Prisma.CredentialTypeWhereInput;
};
export type EnumGrantMethodFieldUpdateOperationsInput = {
    set?: $Enums.GrantMethod;
};
export type CredentialTypeCreateNestedOneWithoutPrerequisitesInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisitesInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPrerequisitesInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeCreateNestedOneWithoutPrerequisiteOfInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisiteOfInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPrerequisiteOfInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeUpdateOneRequiredWithoutPrerequisitesNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisitesInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPrerequisitesInput;
    upsert?: Prisma.CredentialTypeUpsertWithoutPrerequisitesInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CredentialTypeUpdateToOneWithWhereWithoutPrerequisitesInput, Prisma.CredentialTypeUpdateWithoutPrerequisitesInput>, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisitesInput>;
};
export type CredentialTypeUpdateOneRequiredWithoutPrerequisiteOfNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisiteOfInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPrerequisiteOfInput;
    upsert?: Prisma.CredentialTypeUpsertWithoutPrerequisiteOfInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CredentialTypeUpdateToOneWithWhereWithoutPrerequisiteOfInput, Prisma.CredentialTypeUpdateWithoutPrerequisiteOfInput>, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisiteOfInput>;
};
export type CredentialTypeCreateNestedOneWithoutRequirementsInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedCreateWithoutRequirementsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutRequirementsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeUpdateOneRequiredWithoutRequirementsNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedCreateWithoutRequirementsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutRequirementsInput;
    upsert?: Prisma.CredentialTypeUpsertWithoutRequirementsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CredentialTypeUpdateToOneWithWhereWithoutRequirementsInput, Prisma.CredentialTypeUpdateWithoutRequirementsInput>, Prisma.CredentialTypeUncheckedUpdateWithoutRequirementsInput>;
};
export type CredentialTypeCreateNestedOneWithoutMemberCredentialsInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedCreateWithoutMemberCredentialsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutMemberCredentialsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeUpdateOneRequiredWithoutMemberCredentialsNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedCreateWithoutMemberCredentialsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutMemberCredentialsInput;
    upsert?: Prisma.CredentialTypeUpsertWithoutMemberCredentialsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CredentialTypeUpdateToOneWithWhereWithoutMemberCredentialsInput, Prisma.CredentialTypeUpdateWithoutMemberCredentialsInput>, Prisma.CredentialTypeUncheckedUpdateWithoutMemberCredentialsInput>;
};
export type CredentialTypeCreateNestedOneWithoutPromotionRequestsInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedCreateWithoutPromotionRequestsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPromotionRequestsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeUpdateOneRequiredWithoutPromotionRequestsNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedCreateWithoutPromotionRequestsInput>;
    connectOrCreate?: Prisma.CredentialTypeCreateOrConnectWithoutPromotionRequestsInput;
    upsert?: Prisma.CredentialTypeUpsertWithoutPromotionRequestsInput;
    connect?: Prisma.CredentialTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CredentialTypeUpdateToOneWithWhereWithoutPromotionRequestsInput, Prisma.CredentialTypeUpdateWithoutPromotionRequestsInput>, Prisma.CredentialTypeUncheckedUpdateWithoutPromotionRequestsInput>;
};
export type CredentialTypeCreateWithoutPrerequisitesInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisiteOf?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUncheckedCreateWithoutPrerequisitesInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeCreateOrConnectWithoutPrerequisitesInput = {
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisitesInput>;
};
export type CredentialTypeCreateWithoutPrerequisiteOfInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput;
    requirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUncheckedCreateWithoutPrerequisiteOfInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput;
    requirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeCreateOrConnectWithoutPrerequisiteOfInput = {
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisiteOfInput>;
};
export type CredentialTypeUpsertWithoutPrerequisitesInput = {
    update: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisitesInput>;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisitesInput>;
    where?: Prisma.CredentialTypeWhereInput;
};
export type CredentialTypeUpdateToOneWithWhereWithoutPrerequisitesInput = {
    where?: Prisma.CredentialTypeWhereInput;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPrerequisitesInput, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisitesInput>;
};
export type CredentialTypeUpdateWithoutPrerequisitesInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateWithoutPrerequisitesInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUpsertWithoutPrerequisiteOfInput = {
    update: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisiteOfInput>;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedCreateWithoutPrerequisiteOfInput>;
    where?: Prisma.CredentialTypeWhereInput;
};
export type CredentialTypeUpdateToOneWithWhereWithoutPrerequisiteOfInput = {
    where?: Prisma.CredentialTypeWhereInput;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPrerequisiteOfInput, Prisma.CredentialTypeUncheckedUpdateWithoutPrerequisiteOfInput>;
};
export type CredentialTypeUpdateWithoutPrerequisiteOfInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateWithoutPrerequisiteOfInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeCreateWithoutRequirementsInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput;
    memberCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUncheckedCreateWithoutRequirementsInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutTypeInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeCreateOrConnectWithoutRequirementsInput = {
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedCreateWithoutRequirementsInput>;
};
export type CredentialTypeUpsertWithoutRequirementsInput = {
    update: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedUpdateWithoutRequirementsInput>;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedCreateWithoutRequirementsInput>;
    where?: Prisma.CredentialTypeWhereInput;
};
export type CredentialTypeUpdateToOneWithWhereWithoutRequirementsInput = {
    where?: Prisma.CredentialTypeWhereInput;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutRequirementsInput, Prisma.CredentialTypeUncheckedUpdateWithoutRequirementsInput>;
};
export type CredentialTypeUpdateWithoutRequirementsInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateWithoutRequirementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeCreateWithoutMemberCredentialsInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCredentialTypeInput;
    promotionRequests?: Prisma.PromotionRequestCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeUncheckedCreateWithoutMemberCredentialsInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedCreateNestedManyWithoutCredentialTypeInput;
};
export type CredentialTypeCreateOrConnectWithoutMemberCredentialsInput = {
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedCreateWithoutMemberCredentialsInput>;
};
export type CredentialTypeUpsertWithoutMemberCredentialsInput = {
    update: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedUpdateWithoutMemberCredentialsInput>;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedCreateWithoutMemberCredentialsInput>;
    where?: Prisma.CredentialTypeWhereInput;
};
export type CredentialTypeUpdateToOneWithWhereWithoutMemberCredentialsInput = {
    where?: Prisma.CredentialTypeWhereInput;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutMemberCredentialsInput, Prisma.CredentialTypeUncheckedUpdateWithoutMemberCredentialsInput>;
};
export type CredentialTypeUpdateWithoutMemberCredentialsInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateWithoutMemberCredentialsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    promotionRequests?: Prisma.PromotionRequestUncheckedUpdateManyWithoutCredentialTypeNestedInput;
};
export type CredentialTypeCreateWithoutPromotionRequestsInput = {
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialCreateNestedManyWithoutTypeInput;
};
export type CredentialTypeUncheckedCreateWithoutPromotionRequestsInput = {
    id?: number;
    key: string;
    name: string;
    grantMethod?: $Enums.GrantMethod;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutCredentialTypeInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedCreateNestedManyWithoutRequiresTypeInput;
    requirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedCreateNestedManyWithoutTypeInput;
};
export type CredentialTypeCreateOrConnectWithoutPromotionRequestsInput = {
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedCreateWithoutPromotionRequestsInput>;
};
export type CredentialTypeUpsertWithoutPromotionRequestsInput = {
    update: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedUpdateWithoutPromotionRequestsInput>;
    create: Prisma.XOR<Prisma.CredentialTypeCreateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedCreateWithoutPromotionRequestsInput>;
    where?: Prisma.CredentialTypeWhereInput;
};
export type CredentialTypeUpdateToOneWithWhereWithoutPromotionRequestsInput = {
    where?: Prisma.CredentialTypeWhereInput;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateWithoutPromotionRequestsInput, Prisma.CredentialTypeUncheckedUpdateWithoutPromotionRequestsInput>;
};
export type CredentialTypeUpdateWithoutPromotionRequestsInput = {
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUpdateManyWithoutTypeNestedInput;
};
export type CredentialTypeUncheckedUpdateWithoutPromotionRequestsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    key?: Prisma.StringFieldUpdateOperationsInput | string;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    grantMethod?: Prisma.EnumGrantMethodFieldUpdateOperationsInput | $Enums.GrantMethod;
    isAddOn?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    prerequisites?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    prerequisiteOf?: Prisma.CredentialPrerequisiteUncheckedUpdateManyWithoutRequiresTypeNestedInput;
    requirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput;
    memberCredentials?: Prisma.MemberCredentialUncheckedUpdateManyWithoutTypeNestedInput;
};
export type CredentialTypeCountOutputType = {
    prerequisites: number;
    prerequisiteOf: number;
    requirements: number;
    memberCredentials: number;
    promotionRequests: number;
};
export type CredentialTypeCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prerequisites?: boolean | CredentialTypeCountOutputTypeCountPrerequisitesArgs;
    prerequisiteOf?: boolean | CredentialTypeCountOutputTypeCountPrerequisiteOfArgs;
    requirements?: boolean | CredentialTypeCountOutputTypeCountRequirementsArgs;
    memberCredentials?: boolean | CredentialTypeCountOutputTypeCountMemberCredentialsArgs;
    promotionRequests?: boolean | CredentialTypeCountOutputTypeCountPromotionRequestsArgs;
};
export type CredentialTypeCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeCountOutputTypeSelect<ExtArgs> | null;
};
export type CredentialTypeCountOutputTypeCountPrerequisitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialPrerequisiteWhereInput;
};
export type CredentialTypeCountOutputTypeCountPrerequisiteOfArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialPrerequisiteWhereInput;
};
export type CredentialTypeCountOutputTypeCountRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
};
export type CredentialTypeCountOutputTypeCountMemberCredentialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCredentialWhereInput;
};
export type CredentialTypeCountOutputTypeCountPromotionRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.PromotionRequestWhereInput;
};
export type CredentialTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    name?: boolean;
    grantMethod?: boolean;
    isAddOn?: boolean;
    active?: boolean;
    prerequisites?: boolean | Prisma.CredentialType$prerequisitesArgs<ExtArgs>;
    prerequisiteOf?: boolean | Prisma.CredentialType$prerequisiteOfArgs<ExtArgs>;
    requirements?: boolean | Prisma.CredentialType$requirementsArgs<ExtArgs>;
    memberCredentials?: boolean | Prisma.CredentialType$memberCredentialsArgs<ExtArgs>;
    promotionRequests?: boolean | Prisma.CredentialType$promotionRequestsArgs<ExtArgs>;
    _count?: boolean | Prisma.CredentialTypeCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["credentialType"]>;
export type CredentialTypeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    name?: boolean;
    grantMethod?: boolean;
    isAddOn?: boolean;
    active?: boolean;
}, ExtArgs["result"]["credentialType"]>;
export type CredentialTypeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    key?: boolean;
    name?: boolean;
    grantMethod?: boolean;
    isAddOn?: boolean;
    active?: boolean;
}, ExtArgs["result"]["credentialType"]>;
export type CredentialTypeSelectScalar = {
    id?: boolean;
    key?: boolean;
    name?: boolean;
    grantMethod?: boolean;
    isAddOn?: boolean;
    active?: boolean;
};
export type CredentialTypeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "key" | "name" | "grantMethod" | "isAddOn" | "active", ExtArgs["result"]["credentialType"]>;
export type CredentialTypeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    prerequisites?: boolean | Prisma.CredentialType$prerequisitesArgs<ExtArgs>;
    prerequisiteOf?: boolean | Prisma.CredentialType$prerequisiteOfArgs<ExtArgs>;
    requirements?: boolean | Prisma.CredentialType$requirementsArgs<ExtArgs>;
    memberCredentials?: boolean | Prisma.CredentialType$memberCredentialsArgs<ExtArgs>;
    promotionRequests?: boolean | Prisma.CredentialType$promotionRequestsArgs<ExtArgs>;
    _count?: boolean | Prisma.CredentialTypeCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CredentialTypeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type CredentialTypeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $CredentialTypePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CredentialType";
    objects: {
        prerequisites: Prisma.$CredentialPrerequisitePayload<ExtArgs>[];
        prerequisiteOf: Prisma.$CredentialPrerequisitePayload<ExtArgs>[];
        requirements: Prisma.$CredentialRequirementPayload<ExtArgs>[];
        memberCredentials: Prisma.$MemberCredentialPayload<ExtArgs>[];
        promotionRequests: Prisma.$PromotionRequestPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        key: string;
        name: string;
        grantMethod: $Enums.GrantMethod;
        isAddOn: boolean;
        active: boolean;
    }, ExtArgs["result"]["credentialType"]>;
    composites: {};
};
export type CredentialTypeGetPayload<S extends boolean | null | undefined | CredentialTypeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload, S>;
export type CredentialTypeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CredentialTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CredentialTypeCountAggregateInputType | true;
};
export interface CredentialTypeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CredentialType'];
        meta: {
            name: 'CredentialType';
        };
    };
    findUnique<T extends CredentialTypeFindUniqueArgs>(args: Prisma.SelectSubset<T, CredentialTypeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CredentialTypeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CredentialTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CredentialTypeFindFirstArgs>(args?: Prisma.SelectSubset<T, CredentialTypeFindFirstArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CredentialTypeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CredentialTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CredentialTypeFindManyArgs>(args?: Prisma.SelectSubset<T, CredentialTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CredentialTypeCreateArgs>(args: Prisma.SelectSubset<T, CredentialTypeCreateArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CredentialTypeCreateManyArgs>(args?: Prisma.SelectSubset<T, CredentialTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CredentialTypeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CredentialTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CredentialTypeDeleteArgs>(args: Prisma.SelectSubset<T, CredentialTypeDeleteArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CredentialTypeUpdateArgs>(args: Prisma.SelectSubset<T, CredentialTypeUpdateArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CredentialTypeDeleteManyArgs>(args?: Prisma.SelectSubset<T, CredentialTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CredentialTypeUpdateManyArgs>(args: Prisma.SelectSubset<T, CredentialTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CredentialTypeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CredentialTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CredentialTypeUpsertArgs>(args: Prisma.SelectSubset<T, CredentialTypeUpsertArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CredentialTypeCountArgs>(args?: Prisma.Subset<T, CredentialTypeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CredentialTypeCountAggregateOutputType> : number>;
    aggregate<T extends CredentialTypeAggregateArgs>(args: Prisma.Subset<T, CredentialTypeAggregateArgs>): Prisma.PrismaPromise<GetCredentialTypeAggregateType<T>>;
    groupBy<T extends CredentialTypeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CredentialTypeGroupByArgs['orderBy'];
    } : {
        orderBy?: CredentialTypeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CredentialTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CredentialTypeFieldRefs;
}
export interface Prisma__CredentialTypeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    prerequisites<T extends Prisma.CredentialType$prerequisitesArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialType$prerequisitesArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    prerequisiteOf<T extends Prisma.CredentialType$prerequisiteOfArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialType$prerequisiteOfArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialPrerequisitePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    requirements<T extends Prisma.CredentialType$requirementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialType$requirementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    memberCredentials<T extends Prisma.CredentialType$memberCredentialsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialType$memberCredentialsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCredentialPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    promotionRequests<T extends Prisma.CredentialType$promotionRequestsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialType$promotionRequestsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$PromotionRequestPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CredentialTypeFieldRefs {
    readonly id: Prisma.FieldRef<"CredentialType", 'Int'>;
    readonly key: Prisma.FieldRef<"CredentialType", 'String'>;
    readonly name: Prisma.FieldRef<"CredentialType", 'String'>;
    readonly grantMethod: Prisma.FieldRef<"CredentialType", 'GrantMethod'>;
    readonly isAddOn: Prisma.FieldRef<"CredentialType", 'Boolean'>;
    readonly active: Prisma.FieldRef<"CredentialType", 'Boolean'>;
}
export type CredentialTypeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where?: Prisma.CredentialTypeWhereInput;
    orderBy?: Prisma.CredentialTypeOrderByWithRelationInput | Prisma.CredentialTypeOrderByWithRelationInput[];
    cursor?: Prisma.CredentialTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialTypeScalarFieldEnum | Prisma.CredentialTypeScalarFieldEnum[];
};
export type CredentialTypeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where?: Prisma.CredentialTypeWhereInput;
    orderBy?: Prisma.CredentialTypeOrderByWithRelationInput | Prisma.CredentialTypeOrderByWithRelationInput[];
    cursor?: Prisma.CredentialTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialTypeScalarFieldEnum | Prisma.CredentialTypeScalarFieldEnum[];
};
export type CredentialTypeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where?: Prisma.CredentialTypeWhereInput;
    orderBy?: Prisma.CredentialTypeOrderByWithRelationInput | Prisma.CredentialTypeOrderByWithRelationInput[];
    cursor?: Prisma.CredentialTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialTypeScalarFieldEnum | Prisma.CredentialTypeScalarFieldEnum[];
};
export type CredentialTypeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialTypeCreateInput, Prisma.CredentialTypeUncheckedCreateInput>;
};
export type CredentialTypeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CredentialTypeCreateManyInput | Prisma.CredentialTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CredentialTypeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    data: Prisma.CredentialTypeCreateManyInput | Prisma.CredentialTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CredentialTypeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateInput, Prisma.CredentialTypeUncheckedUpdateInput>;
    where: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CredentialTypeUpdateManyMutationInput, Prisma.CredentialTypeUncheckedUpdateManyInput>;
    where?: Prisma.CredentialTypeWhereInput;
    limit?: number;
};
export type CredentialTypeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialTypeUpdateManyMutationInput, Prisma.CredentialTypeUncheckedUpdateManyInput>;
    where?: Prisma.CredentialTypeWhereInput;
    limit?: number;
};
export type CredentialTypeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where: Prisma.CredentialTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialTypeCreateInput, Prisma.CredentialTypeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CredentialTypeUpdateInput, Prisma.CredentialTypeUncheckedUpdateInput>;
};
export type CredentialTypeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
    where: Prisma.CredentialTypeWhereUniqueInput;
};
export type CredentialTypeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialTypeWhereInput;
    limit?: number;
};
export type CredentialType$prerequisitesArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialPrerequisiteScalarFieldEnum | Prisma.CredentialPrerequisiteScalarFieldEnum[];
};
export type CredentialType$prerequisiteOfArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialPrerequisiteSelect<ExtArgs> | null;
    omit?: Prisma.CredentialPrerequisiteOmit<ExtArgs> | null;
    include?: Prisma.CredentialPrerequisiteInclude<ExtArgs> | null;
    where?: Prisma.CredentialPrerequisiteWhereInput;
    orderBy?: Prisma.CredentialPrerequisiteOrderByWithRelationInput | Prisma.CredentialPrerequisiteOrderByWithRelationInput[];
    cursor?: Prisma.CredentialPrerequisiteWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialPrerequisiteScalarFieldEnum | Prisma.CredentialPrerequisiteScalarFieldEnum[];
};
export type CredentialType$requirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where?: Prisma.CredentialRequirementWhereInput;
    orderBy?: Prisma.CredentialRequirementOrderByWithRelationInput | Prisma.CredentialRequirementOrderByWithRelationInput[];
    cursor?: Prisma.CredentialRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CredentialRequirementScalarFieldEnum | Prisma.CredentialRequirementScalarFieldEnum[];
};
export type CredentialType$memberCredentialsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCredentialSelect<ExtArgs> | null;
    omit?: Prisma.MemberCredentialOmit<ExtArgs> | null;
    include?: Prisma.MemberCredentialInclude<ExtArgs> | null;
    where?: Prisma.MemberCredentialWhereInput;
    orderBy?: Prisma.MemberCredentialOrderByWithRelationInput | Prisma.MemberCredentialOrderByWithRelationInput[];
    cursor?: Prisma.MemberCredentialWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCredentialScalarFieldEnum | Prisma.MemberCredentialScalarFieldEnum[];
};
export type CredentialType$promotionRequestsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.PromotionRequestSelect<ExtArgs> | null;
    omit?: Prisma.PromotionRequestOmit<ExtArgs> | null;
    include?: Prisma.PromotionRequestInclude<ExtArgs> | null;
    where?: Prisma.PromotionRequestWhereInput;
    orderBy?: Prisma.PromotionRequestOrderByWithRelationInput | Prisma.PromotionRequestOrderByWithRelationInput[];
    cursor?: Prisma.PromotionRequestWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.PromotionRequestScalarFieldEnum | Prisma.PromotionRequestScalarFieldEnum[];
};
export type CredentialTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialTypeSelect<ExtArgs> | null;
    omit?: Prisma.CredentialTypeOmit<ExtArgs> | null;
    include?: Prisma.CredentialTypeInclude<ExtArgs> | null;
};
