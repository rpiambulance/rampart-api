import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CertificationTypeModel = runtime.Types.Result.DefaultSelection<Prisma.$CertificationTypePayload>;
export type AggregateCertificationType = {
    _count: CertificationTypeCountAggregateOutputType | null;
    _avg: CertificationTypeAvgAggregateOutputType | null;
    _sum: CertificationTypeSumAggregateOutputType | null;
    _min: CertificationTypeMinAggregateOutputType | null;
    _max: CertificationTypeMaxAggregateOutputType | null;
};
export type CertificationTypeAvgAggregateOutputType = {
    id: number | null;
    defaultValidityMonths: number | null;
};
export type CertificationTypeSumAggregateOutputType = {
    id: number | null;
    defaultValidityMonths: number | null;
};
export type CertificationTypeMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    abbreviation: string | null;
    issuingOrg: string | null;
    defaultValidityMonths: number | null;
    active: boolean | null;
};
export type CertificationTypeMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    abbreviation: string | null;
    issuingOrg: string | null;
    defaultValidityMonths: number | null;
    active: boolean | null;
};
export type CertificationTypeCountAggregateOutputType = {
    id: number;
    name: number;
    abbreviation: number;
    issuingOrg: number;
    defaultValidityMonths: number;
    active: number;
    _all: number;
};
export type CertificationTypeAvgAggregateInputType = {
    id?: true;
    defaultValidityMonths?: true;
};
export type CertificationTypeSumAggregateInputType = {
    id?: true;
    defaultValidityMonths?: true;
};
export type CertificationTypeMinAggregateInputType = {
    id?: true;
    name?: true;
    abbreviation?: true;
    issuingOrg?: true;
    defaultValidityMonths?: true;
    active?: true;
};
export type CertificationTypeMaxAggregateInputType = {
    id?: true;
    name?: true;
    abbreviation?: true;
    issuingOrg?: true;
    defaultValidityMonths?: true;
    active?: true;
};
export type CertificationTypeCountAggregateInputType = {
    id?: true;
    name?: true;
    abbreviation?: true;
    issuingOrg?: true;
    defaultValidityMonths?: true;
    active?: true;
    _all?: true;
};
export type CertificationTypeAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationTypeWhereInput;
    orderBy?: Prisma.CertificationTypeOrderByWithRelationInput | Prisma.CertificationTypeOrderByWithRelationInput[];
    cursor?: Prisma.CertificationTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CertificationTypeCountAggregateInputType;
    _avg?: CertificationTypeAvgAggregateInputType;
    _sum?: CertificationTypeSumAggregateInputType;
    _min?: CertificationTypeMinAggregateInputType;
    _max?: CertificationTypeMaxAggregateInputType;
};
export type GetCertificationTypeAggregateType<T extends CertificationTypeAggregateArgs> = {
    [P in keyof T & keyof AggregateCertificationType]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCertificationType[P]> : Prisma.GetScalarType<T[P], AggregateCertificationType[P]>;
};
export type CertificationTypeGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationTypeWhereInput;
    orderBy?: Prisma.CertificationTypeOrderByWithAggregationInput | Prisma.CertificationTypeOrderByWithAggregationInput[];
    by: Prisma.CertificationTypeScalarFieldEnum[] | Prisma.CertificationTypeScalarFieldEnum;
    having?: Prisma.CertificationTypeScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CertificationTypeCountAggregateInputType | true;
    _avg?: CertificationTypeAvgAggregateInputType;
    _sum?: CertificationTypeSumAggregateInputType;
    _min?: CertificationTypeMinAggregateInputType;
    _max?: CertificationTypeMaxAggregateInputType;
};
export type CertificationTypeGroupByOutputType = {
    id: number;
    name: string;
    abbreviation: string;
    issuingOrg: string | null;
    defaultValidityMonths: number | null;
    active: boolean;
    _count: CertificationTypeCountAggregateOutputType | null;
    _avg: CertificationTypeAvgAggregateOutputType | null;
    _sum: CertificationTypeSumAggregateOutputType | null;
    _min: CertificationTypeMinAggregateOutputType | null;
    _max: CertificationTypeMaxAggregateOutputType | null;
};
export type GetCertificationTypeGroupByPayload<T extends CertificationTypeGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CertificationTypeGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CertificationTypeGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CertificationTypeGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CertificationTypeGroupByOutputType[P]>;
}>>;
export type CertificationTypeWhereInput = {
    AND?: Prisma.CertificationTypeWhereInput | Prisma.CertificationTypeWhereInput[];
    OR?: Prisma.CertificationTypeWhereInput[];
    NOT?: Prisma.CertificationTypeWhereInput | Prisma.CertificationTypeWhereInput[];
    id?: Prisma.IntFilter<"CertificationType"> | number;
    name?: Prisma.StringFilter<"CertificationType"> | string;
    abbreviation?: Prisma.StringFilter<"CertificationType"> | string;
    issuingOrg?: Prisma.StringNullableFilter<"CertificationType"> | string | null;
    defaultValidityMonths?: Prisma.IntNullableFilter<"CertificationType"> | number | null;
    active?: Prisma.BoolFilter<"CertificationType"> | boolean;
    memberCertifications?: Prisma.MemberCertificationListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
};
export type CertificationTypeOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    abbreviation?: Prisma.SortOrder;
    issuingOrg?: Prisma.SortOrderInput | Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    memberCertifications?: Prisma.MemberCertificationOrderByRelationAggregateInput;
    credentialRequirements?: Prisma.CredentialRequirementOrderByRelationAggregateInput;
};
export type CertificationTypeWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    name?: string;
    AND?: Prisma.CertificationTypeWhereInput | Prisma.CertificationTypeWhereInput[];
    OR?: Prisma.CertificationTypeWhereInput[];
    NOT?: Prisma.CertificationTypeWhereInput | Prisma.CertificationTypeWhereInput[];
    abbreviation?: Prisma.StringFilter<"CertificationType"> | string;
    issuingOrg?: Prisma.StringNullableFilter<"CertificationType"> | string | null;
    defaultValidityMonths?: Prisma.IntNullableFilter<"CertificationType"> | number | null;
    active?: Prisma.BoolFilter<"CertificationType"> | boolean;
    memberCertifications?: Prisma.MemberCertificationListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
}, "id" | "name">;
export type CertificationTypeOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    abbreviation?: Prisma.SortOrder;
    issuingOrg?: Prisma.SortOrderInput | Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrderInput | Prisma.SortOrder;
    active?: Prisma.SortOrder;
    _count?: Prisma.CertificationTypeCountOrderByAggregateInput;
    _avg?: Prisma.CertificationTypeAvgOrderByAggregateInput;
    _max?: Prisma.CertificationTypeMaxOrderByAggregateInput;
    _min?: Prisma.CertificationTypeMinOrderByAggregateInput;
    _sum?: Prisma.CertificationTypeSumOrderByAggregateInput;
};
export type CertificationTypeScalarWhereWithAggregatesInput = {
    AND?: Prisma.CertificationTypeScalarWhereWithAggregatesInput | Prisma.CertificationTypeScalarWhereWithAggregatesInput[];
    OR?: Prisma.CertificationTypeScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CertificationTypeScalarWhereWithAggregatesInput | Prisma.CertificationTypeScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"CertificationType"> | number;
    name?: Prisma.StringWithAggregatesFilter<"CertificationType"> | string;
    abbreviation?: Prisma.StringWithAggregatesFilter<"CertificationType"> | string;
    issuingOrg?: Prisma.StringNullableWithAggregatesFilter<"CertificationType"> | string | null;
    defaultValidityMonths?: Prisma.IntNullableWithAggregatesFilter<"CertificationType"> | number | null;
    active?: Prisma.BoolWithAggregatesFilter<"CertificationType"> | boolean;
};
export type CertificationTypeCreateInput = {
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    memberCertifications?: Prisma.MemberCertificationCreateNestedManyWithoutTypeInput;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCertificationTypeInput;
};
export type CertificationTypeUncheckedCreateInput = {
    id?: number;
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    memberCertifications?: Prisma.MemberCertificationUncheckedCreateNestedManyWithoutTypeInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCertificationTypeInput;
};
export type CertificationTypeUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberCertifications?: Prisma.MemberCertificationUpdateManyWithoutTypeNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutCertificationTypeNestedInput;
};
export type CertificationTypeUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberCertifications?: Prisma.MemberCertificationUncheckedUpdateManyWithoutTypeNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCertificationTypeNestedInput;
};
export type CertificationTypeCreateManyInput = {
    id?: number;
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
};
export type CertificationTypeUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type CertificationTypeUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
};
export type CertificationTypeCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    abbreviation?: Prisma.SortOrder;
    issuingOrg?: Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CertificationTypeAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrder;
};
export type CertificationTypeMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    abbreviation?: Prisma.SortOrder;
    issuingOrg?: Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CertificationTypeMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    abbreviation?: Prisma.SortOrder;
    issuingOrg?: Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrder;
    active?: Prisma.SortOrder;
};
export type CertificationTypeSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    defaultValidityMonths?: Prisma.SortOrder;
};
export type CertificationTypeScalarRelationFilter = {
    is?: Prisma.CertificationTypeWhereInput;
    isNot?: Prisma.CertificationTypeWhereInput;
};
export type CertificationTypeNullableScalarRelationFilter = {
    is?: Prisma.CertificationTypeWhereInput | null;
    isNot?: Prisma.CertificationTypeWhereInput | null;
};
export type CertificationTypeCreateNestedOneWithoutMemberCertificationsInput = {
    create?: Prisma.XOR<Prisma.CertificationTypeCreateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedCreateWithoutMemberCertificationsInput>;
    connectOrCreate?: Prisma.CertificationTypeCreateOrConnectWithoutMemberCertificationsInput;
    connect?: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeUpdateOneRequiredWithoutMemberCertificationsNestedInput = {
    create?: Prisma.XOR<Prisma.CertificationTypeCreateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedCreateWithoutMemberCertificationsInput>;
    connectOrCreate?: Prisma.CertificationTypeCreateOrConnectWithoutMemberCertificationsInput;
    upsert?: Prisma.CertificationTypeUpsertWithoutMemberCertificationsInput;
    connect?: Prisma.CertificationTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CertificationTypeUpdateToOneWithWhereWithoutMemberCertificationsInput, Prisma.CertificationTypeUpdateWithoutMemberCertificationsInput>, Prisma.CertificationTypeUncheckedUpdateWithoutMemberCertificationsInput>;
};
export type CertificationTypeCreateNestedOneWithoutCredentialRequirementsInput = {
    create?: Prisma.XOR<Prisma.CertificationTypeCreateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.CertificationTypeCreateOrConnectWithoutCredentialRequirementsInput;
    connect?: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeUpdateOneWithoutCredentialRequirementsNestedInput = {
    create?: Prisma.XOR<Prisma.CertificationTypeCreateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.CertificationTypeCreateOrConnectWithoutCredentialRequirementsInput;
    upsert?: Prisma.CertificationTypeUpsertWithoutCredentialRequirementsInput;
    disconnect?: Prisma.CertificationTypeWhereInput | boolean;
    delete?: Prisma.CertificationTypeWhereInput | boolean;
    connect?: Prisma.CertificationTypeWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.CertificationTypeUpdateToOneWithWhereWithoutCredentialRequirementsInput, Prisma.CertificationTypeUpdateWithoutCredentialRequirementsInput>, Prisma.CertificationTypeUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type CertificationTypeCreateWithoutMemberCertificationsInput = {
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutCertificationTypeInput;
};
export type CertificationTypeUncheckedCreateWithoutMemberCertificationsInput = {
    id?: number;
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutCertificationTypeInput;
};
export type CertificationTypeCreateOrConnectWithoutMemberCertificationsInput = {
    where: Prisma.CertificationTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificationTypeCreateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedCreateWithoutMemberCertificationsInput>;
};
export type CertificationTypeUpsertWithoutMemberCertificationsInput = {
    update: Prisma.XOR<Prisma.CertificationTypeUpdateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedUpdateWithoutMemberCertificationsInput>;
    create: Prisma.XOR<Prisma.CertificationTypeCreateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedCreateWithoutMemberCertificationsInput>;
    where?: Prisma.CertificationTypeWhereInput;
};
export type CertificationTypeUpdateToOneWithWhereWithoutMemberCertificationsInput = {
    where?: Prisma.CertificationTypeWhereInput;
    data: Prisma.XOR<Prisma.CertificationTypeUpdateWithoutMemberCertificationsInput, Prisma.CertificationTypeUncheckedUpdateWithoutMemberCertificationsInput>;
};
export type CertificationTypeUpdateWithoutMemberCertificationsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutCertificationTypeNestedInput;
};
export type CertificationTypeUncheckedUpdateWithoutMemberCertificationsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutCertificationTypeNestedInput;
};
export type CertificationTypeCreateWithoutCredentialRequirementsInput = {
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    memberCertifications?: Prisma.MemberCertificationCreateNestedManyWithoutTypeInput;
};
export type CertificationTypeUncheckedCreateWithoutCredentialRequirementsInput = {
    id?: number;
    name: string;
    abbreviation: string;
    issuingOrg?: string | null;
    defaultValidityMonths?: number | null;
    active?: boolean;
    memberCertifications?: Prisma.MemberCertificationUncheckedCreateNestedManyWithoutTypeInput;
};
export type CertificationTypeCreateOrConnectWithoutCredentialRequirementsInput = {
    where: Prisma.CertificationTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificationTypeCreateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedCreateWithoutCredentialRequirementsInput>;
};
export type CertificationTypeUpsertWithoutCredentialRequirementsInput = {
    update: Prisma.XOR<Prisma.CertificationTypeUpdateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedUpdateWithoutCredentialRequirementsInput>;
    create: Prisma.XOR<Prisma.CertificationTypeCreateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedCreateWithoutCredentialRequirementsInput>;
    where?: Prisma.CertificationTypeWhereInput;
};
export type CertificationTypeUpdateToOneWithWhereWithoutCredentialRequirementsInput = {
    where?: Prisma.CertificationTypeWhereInput;
    data: Prisma.XOR<Prisma.CertificationTypeUpdateWithoutCredentialRequirementsInput, Prisma.CertificationTypeUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type CertificationTypeUpdateWithoutCredentialRequirementsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberCertifications?: Prisma.MemberCertificationUpdateManyWithoutTypeNestedInput;
};
export type CertificationTypeUncheckedUpdateWithoutCredentialRequirementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    abbreviation?: Prisma.StringFieldUpdateOperationsInput | string;
    issuingOrg?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    defaultValidityMonths?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    active?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    memberCertifications?: Prisma.MemberCertificationUncheckedUpdateManyWithoutTypeNestedInput;
};
export type CertificationTypeCountOutputType = {
    memberCertifications: number;
    credentialRequirements: number;
};
export type CertificationTypeCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    memberCertifications?: boolean | CertificationTypeCountOutputTypeCountMemberCertificationsArgs;
    credentialRequirements?: boolean | CertificationTypeCountOutputTypeCountCredentialRequirementsArgs;
};
export type CertificationTypeCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeCountOutputTypeSelect<ExtArgs> | null;
};
export type CertificationTypeCountOutputTypeCountMemberCertificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.MemberCertificationWhereInput;
};
export type CertificationTypeCountOutputTypeCountCredentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
};
export type CertificationTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    abbreviation?: boolean;
    issuingOrg?: boolean;
    defaultValidityMonths?: boolean;
    active?: boolean;
    memberCertifications?: boolean | Prisma.CertificationType$memberCertificationsArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.CertificationType$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.CertificationTypeCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificationType"]>;
export type CertificationTypeSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    abbreviation?: boolean;
    issuingOrg?: boolean;
    defaultValidityMonths?: boolean;
    active?: boolean;
}, ExtArgs["result"]["certificationType"]>;
export type CertificationTypeSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    abbreviation?: boolean;
    issuingOrg?: boolean;
    defaultValidityMonths?: boolean;
    active?: boolean;
}, ExtArgs["result"]["certificationType"]>;
export type CertificationTypeSelectScalar = {
    id?: boolean;
    name?: boolean;
    abbreviation?: boolean;
    issuingOrg?: boolean;
    defaultValidityMonths?: boolean;
    active?: boolean;
};
export type CertificationTypeOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "abbreviation" | "issuingOrg" | "defaultValidityMonths" | "active", ExtArgs["result"]["certificationType"]>;
export type CertificationTypeInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    memberCertifications?: boolean | Prisma.CertificationType$memberCertificationsArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.CertificationType$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.CertificationTypeCountOutputTypeDefaultArgs<ExtArgs>;
};
export type CertificationTypeIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type CertificationTypeIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $CertificationTypePayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CertificationType";
    objects: {
        memberCertifications: Prisma.$MemberCertificationPayload<ExtArgs>[];
        credentialRequirements: Prisma.$CredentialRequirementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        abbreviation: string;
        issuingOrg: string | null;
        defaultValidityMonths: number | null;
        active: boolean;
    }, ExtArgs["result"]["certificationType"]>;
    composites: {};
};
export type CertificationTypeGetPayload<S extends boolean | null | undefined | CertificationTypeDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload, S>;
export type CertificationTypeCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CertificationTypeFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CertificationTypeCountAggregateInputType | true;
};
export interface CertificationTypeDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CertificationType'];
        meta: {
            name: 'CertificationType';
        };
    };
    findUnique<T extends CertificationTypeFindUniqueArgs>(args: Prisma.SelectSubset<T, CertificationTypeFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CertificationTypeFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CertificationTypeFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CertificationTypeFindFirstArgs>(args?: Prisma.SelectSubset<T, CertificationTypeFindFirstArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CertificationTypeFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CertificationTypeFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CertificationTypeFindManyArgs>(args?: Prisma.SelectSubset<T, CertificationTypeFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CertificationTypeCreateArgs>(args: Prisma.SelectSubset<T, CertificationTypeCreateArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CertificationTypeCreateManyArgs>(args?: Prisma.SelectSubset<T, CertificationTypeCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CertificationTypeCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CertificationTypeCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CertificationTypeDeleteArgs>(args: Prisma.SelectSubset<T, CertificationTypeDeleteArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CertificationTypeUpdateArgs>(args: Prisma.SelectSubset<T, CertificationTypeUpdateArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CertificationTypeDeleteManyArgs>(args?: Prisma.SelectSubset<T, CertificationTypeDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CertificationTypeUpdateManyArgs>(args: Prisma.SelectSubset<T, CertificationTypeUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CertificationTypeUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CertificationTypeUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CertificationTypeUpsertArgs>(args: Prisma.SelectSubset<T, CertificationTypeUpsertArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CertificationTypeCountArgs>(args?: Prisma.Subset<T, CertificationTypeCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CertificationTypeCountAggregateOutputType> : number>;
    aggregate<T extends CertificationTypeAggregateArgs>(args: Prisma.Subset<T, CertificationTypeAggregateArgs>): Prisma.PrismaPromise<GetCertificationTypeAggregateType<T>>;
    groupBy<T extends CertificationTypeGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CertificationTypeGroupByArgs['orderBy'];
    } : {
        orderBy?: CertificationTypeGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CertificationTypeGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificationTypeGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CertificationTypeFieldRefs;
}
export interface Prisma__CertificationTypeClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    memberCertifications<T extends Prisma.CertificationType$memberCertificationsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CertificationType$memberCertificationsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    credentialRequirements<T extends Prisma.CertificationType$credentialRequirementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CertificationType$credentialRequirementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CertificationTypeFieldRefs {
    readonly id: Prisma.FieldRef<"CertificationType", 'Int'>;
    readonly name: Prisma.FieldRef<"CertificationType", 'String'>;
    readonly abbreviation: Prisma.FieldRef<"CertificationType", 'String'>;
    readonly issuingOrg: Prisma.FieldRef<"CertificationType", 'String'>;
    readonly defaultValidityMonths: Prisma.FieldRef<"CertificationType", 'Int'>;
    readonly active: Prisma.FieldRef<"CertificationType", 'Boolean'>;
}
export type CertificationTypeFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where?: Prisma.CertificationTypeWhereInput;
    orderBy?: Prisma.CertificationTypeOrderByWithRelationInput | Prisma.CertificationTypeOrderByWithRelationInput[];
    cursor?: Prisma.CertificationTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationTypeScalarFieldEnum | Prisma.CertificationTypeScalarFieldEnum[];
};
export type CertificationTypeFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where?: Prisma.CertificationTypeWhereInput;
    orderBy?: Prisma.CertificationTypeOrderByWithRelationInput | Prisma.CertificationTypeOrderByWithRelationInput[];
    cursor?: Prisma.CertificationTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationTypeScalarFieldEnum | Prisma.CertificationTypeScalarFieldEnum[];
};
export type CertificationTypeFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where?: Prisma.CertificationTypeWhereInput;
    orderBy?: Prisma.CertificationTypeOrderByWithRelationInput | Prisma.CertificationTypeOrderByWithRelationInput[];
    cursor?: Prisma.CertificationTypeWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationTypeScalarFieldEnum | Prisma.CertificationTypeScalarFieldEnum[];
};
export type CertificationTypeCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationTypeCreateInput, Prisma.CertificationTypeUncheckedCreateInput>;
};
export type CertificationTypeCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CertificationTypeCreateManyInput | Prisma.CertificationTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CertificationTypeCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    data: Prisma.CertificationTypeCreateManyInput | Prisma.CertificationTypeCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CertificationTypeUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationTypeUpdateInput, Prisma.CertificationTypeUncheckedUpdateInput>;
    where: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CertificationTypeUpdateManyMutationInput, Prisma.CertificationTypeUncheckedUpdateManyInput>;
    where?: Prisma.CertificationTypeWhereInput;
    limit?: number;
};
export type CertificationTypeUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationTypeUpdateManyMutationInput, Prisma.CertificationTypeUncheckedUpdateManyInput>;
    where?: Prisma.CertificationTypeWhereInput;
    limit?: number;
};
export type CertificationTypeUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where: Prisma.CertificationTypeWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificationTypeCreateInput, Prisma.CertificationTypeUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CertificationTypeUpdateInput, Prisma.CertificationTypeUncheckedUpdateInput>;
};
export type CertificationTypeDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where: Prisma.CertificationTypeWhereUniqueInput;
};
export type CertificationTypeDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationTypeWhereInput;
    limit?: number;
};
export type CertificationType$memberCertificationsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.MemberCertificationSelect<ExtArgs> | null;
    omit?: Prisma.MemberCertificationOmit<ExtArgs> | null;
    include?: Prisma.MemberCertificationInclude<ExtArgs> | null;
    where?: Prisma.MemberCertificationWhereInput;
    orderBy?: Prisma.MemberCertificationOrderByWithRelationInput | Prisma.MemberCertificationOrderByWithRelationInput[];
    cursor?: Prisma.MemberCertificationWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.MemberCertificationScalarFieldEnum | Prisma.MemberCertificationScalarFieldEnum[];
};
export type CertificationType$credentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CertificationTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
};
