import type * as runtime from "@prisma/client/runtime/client";
import type * as $Enums from "../enums.js";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CredentialRequirementModel = runtime.Types.Result.DefaultSelection<Prisma.$CredentialRequirementPayload>;
export type AggregateCredentialRequirement = {
    _count: CredentialRequirementCountAggregateOutputType | null;
    _avg: CredentialRequirementAvgAggregateOutputType | null;
    _sum: CredentialRequirementSumAggregateOutputType | null;
    _min: CredentialRequirementMinAggregateOutputType | null;
    _max: CredentialRequirementMaxAggregateOutputType | null;
};
export type CredentialRequirementAvgAggregateOutputType = {
    id: number | null;
    credentialTypeId: number | null;
    certificationTypeId: number | null;
    evalTemplateId: number | null;
    count: number | null;
    classId: number | null;
};
export type CredentialRequirementSumAggregateOutputType = {
    id: number | null;
    credentialTypeId: number | null;
    certificationTypeId: number | null;
    evalTemplateId: number | null;
    count: number | null;
    classId: number | null;
};
export type CredentialRequirementMinAggregateOutputType = {
    id: number | null;
    credentialTypeId: number | null;
    kind: $Enums.RequirementKind | null;
    certificationTypeId: number | null;
    evalTemplateId: number | null;
    count: number | null;
    classId: number | null;
};
export type CredentialRequirementMaxAggregateOutputType = {
    id: number | null;
    credentialTypeId: number | null;
    kind: $Enums.RequirementKind | null;
    certificationTypeId: number | null;
    evalTemplateId: number | null;
    count: number | null;
    classId: number | null;
};
export type CredentialRequirementCountAggregateOutputType = {
    id: number;
    credentialTypeId: number;
    kind: number;
    certificationTypeId: number;
    evalTemplateId: number;
    count: number;
    classId: number;
    _all: number;
};
export type CredentialRequirementAvgAggregateInputType = {
    id?: true;
    credentialTypeId?: true;
    certificationTypeId?: true;
    evalTemplateId?: true;
    count?: true;
    classId?: true;
};
export type CredentialRequirementSumAggregateInputType = {
    id?: true;
    credentialTypeId?: true;
    certificationTypeId?: true;
    evalTemplateId?: true;
    count?: true;
    classId?: true;
};
export type CredentialRequirementMinAggregateInputType = {
    id?: true;
    credentialTypeId?: true;
    kind?: true;
    certificationTypeId?: true;
    evalTemplateId?: true;
    count?: true;
    classId?: true;
};
export type CredentialRequirementMaxAggregateInputType = {
    id?: true;
    credentialTypeId?: true;
    kind?: true;
    certificationTypeId?: true;
    evalTemplateId?: true;
    count?: true;
    classId?: true;
};
export type CredentialRequirementCountAggregateInputType = {
    id?: true;
    credentialTypeId?: true;
    kind?: true;
    certificationTypeId?: true;
    evalTemplateId?: true;
    count?: true;
    classId?: true;
    _all?: true;
};
export type CredentialRequirementAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
    orderBy?: Prisma.CredentialRequirementOrderByWithRelationInput | Prisma.CredentialRequirementOrderByWithRelationInput[];
    cursor?: Prisma.CredentialRequirementWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CredentialRequirementCountAggregateInputType;
    _avg?: CredentialRequirementAvgAggregateInputType;
    _sum?: CredentialRequirementSumAggregateInputType;
    _min?: CredentialRequirementMinAggregateInputType;
    _max?: CredentialRequirementMaxAggregateInputType;
};
export type GetCredentialRequirementAggregateType<T extends CredentialRequirementAggregateArgs> = {
    [P in keyof T & keyof AggregateCredentialRequirement]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCredentialRequirement[P]> : Prisma.GetScalarType<T[P], AggregateCredentialRequirement[P]>;
};
export type CredentialRequirementGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
    orderBy?: Prisma.CredentialRequirementOrderByWithAggregationInput | Prisma.CredentialRequirementOrderByWithAggregationInput[];
    by: Prisma.CredentialRequirementScalarFieldEnum[] | Prisma.CredentialRequirementScalarFieldEnum;
    having?: Prisma.CredentialRequirementScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CredentialRequirementCountAggregateInputType | true;
    _avg?: CredentialRequirementAvgAggregateInputType;
    _sum?: CredentialRequirementSumAggregateInputType;
    _min?: CredentialRequirementMinAggregateInputType;
    _max?: CredentialRequirementMaxAggregateInputType;
};
export type CredentialRequirementGroupByOutputType = {
    id: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId: number | null;
    evalTemplateId: number | null;
    count: number | null;
    classId: number | null;
    _count: CredentialRequirementCountAggregateOutputType | null;
    _avg: CredentialRequirementAvgAggregateOutputType | null;
    _sum: CredentialRequirementSumAggregateOutputType | null;
    _min: CredentialRequirementMinAggregateOutputType | null;
    _max: CredentialRequirementMaxAggregateOutputType | null;
};
export type GetCredentialRequirementGroupByPayload<T extends CredentialRequirementGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CredentialRequirementGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CredentialRequirementGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CredentialRequirementGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CredentialRequirementGroupByOutputType[P]>;
}>>;
export type CredentialRequirementWhereInput = {
    AND?: Prisma.CredentialRequirementWhereInput | Prisma.CredentialRequirementWhereInput[];
    OR?: Prisma.CredentialRequirementWhereInput[];
    NOT?: Prisma.CredentialRequirementWhereInput | Prisma.CredentialRequirementWhereInput[];
    id?: Prisma.IntFilter<"CredentialRequirement"> | number;
    credentialTypeId?: Prisma.IntFilter<"CredentialRequirement"> | number;
    kind?: Prisma.EnumRequirementKindFilter<"CredentialRequirement"> | $Enums.RequirementKind;
    certificationTypeId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    evalTemplateId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    count?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    classId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    certificationType?: Prisma.XOR<Prisma.CertificationTypeNullableScalarRelationFilter, Prisma.CertificationTypeWhereInput> | null;
    evalTemplate?: Prisma.XOR<Prisma.EvalFormTemplateNullableScalarRelationFilter, Prisma.EvalFormTemplateWhereInput> | null;
    class?: Prisma.XOR<Prisma.TrainingClassNullableScalarRelationFilter, Prisma.TrainingClassWhereInput> | null;
};
export type CredentialRequirementOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrderInput | Prisma.SortOrder;
    count?: Prisma.SortOrderInput | Prisma.SortOrder;
    classId?: Prisma.SortOrderInput | Prisma.SortOrder;
    credentialType?: Prisma.CredentialTypeOrderByWithRelationInput;
    certificationType?: Prisma.CertificationTypeOrderByWithRelationInput;
    evalTemplate?: Prisma.EvalFormTemplateOrderByWithRelationInput;
    class?: Prisma.TrainingClassOrderByWithRelationInput;
};
export type CredentialRequirementWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.CredentialRequirementWhereInput | Prisma.CredentialRequirementWhereInput[];
    OR?: Prisma.CredentialRequirementWhereInput[];
    NOT?: Prisma.CredentialRequirementWhereInput | Prisma.CredentialRequirementWhereInput[];
    credentialTypeId?: Prisma.IntFilter<"CredentialRequirement"> | number;
    kind?: Prisma.EnumRequirementKindFilter<"CredentialRequirement"> | $Enums.RequirementKind;
    certificationTypeId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    evalTemplateId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    count?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    classId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    credentialType?: Prisma.XOR<Prisma.CredentialTypeScalarRelationFilter, Prisma.CredentialTypeWhereInput>;
    certificationType?: Prisma.XOR<Prisma.CertificationTypeNullableScalarRelationFilter, Prisma.CertificationTypeWhereInput> | null;
    evalTemplate?: Prisma.XOR<Prisma.EvalFormTemplateNullableScalarRelationFilter, Prisma.EvalFormTemplateWhereInput> | null;
    class?: Prisma.XOR<Prisma.TrainingClassNullableScalarRelationFilter, Prisma.TrainingClassWhereInput> | null;
}, "id">;
export type CredentialRequirementOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrderInput | Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrderInput | Prisma.SortOrder;
    count?: Prisma.SortOrderInput | Prisma.SortOrder;
    classId?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.CredentialRequirementCountOrderByAggregateInput;
    _avg?: Prisma.CredentialRequirementAvgOrderByAggregateInput;
    _max?: Prisma.CredentialRequirementMaxOrderByAggregateInput;
    _min?: Prisma.CredentialRequirementMinOrderByAggregateInput;
    _sum?: Prisma.CredentialRequirementSumOrderByAggregateInput;
};
export type CredentialRequirementScalarWhereWithAggregatesInput = {
    AND?: Prisma.CredentialRequirementScalarWhereWithAggregatesInput | Prisma.CredentialRequirementScalarWhereWithAggregatesInput[];
    OR?: Prisma.CredentialRequirementScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CredentialRequirementScalarWhereWithAggregatesInput | Prisma.CredentialRequirementScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"CredentialRequirement"> | number;
    credentialTypeId?: Prisma.IntWithAggregatesFilter<"CredentialRequirement"> | number;
    kind?: Prisma.EnumRequirementKindWithAggregatesFilter<"CredentialRequirement"> | $Enums.RequirementKind;
    certificationTypeId?: Prisma.IntNullableWithAggregatesFilter<"CredentialRequirement"> | number | null;
    evalTemplateId?: Prisma.IntNullableWithAggregatesFilter<"CredentialRequirement"> | number | null;
    count?: Prisma.IntNullableWithAggregatesFilter<"CredentialRequirement"> | number | null;
    classId?: Prisma.IntNullableWithAggregatesFilter<"CredentialRequirement"> | number | null;
};
export type CredentialRequirementCreateInput = {
    kind: $Enums.RequirementKind;
    count?: number | null;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutRequirementsInput;
    certificationType?: Prisma.CertificationTypeCreateNestedOneWithoutCredentialRequirementsInput;
    evalTemplate?: Prisma.EvalFormTemplateCreateNestedOneWithoutCredentialRequirementsInput;
    class?: Prisma.TrainingClassCreateNestedOneWithoutCredentialRequirementsInput;
};
export type CredentialRequirementUncheckedCreateInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementUpdateInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutRequirementsNestedInput;
    certificationType?: Prisma.CertificationTypeUpdateOneWithoutCredentialRequirementsNestedInput;
    evalTemplate?: Prisma.EvalFormTemplateUpdateOneWithoutCredentialRequirementsNestedInput;
    class?: Prisma.TrainingClassUpdateOneWithoutCredentialRequirementsNestedInput;
};
export type CredentialRequirementUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementCreateManyInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementUpdateManyMutationInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementListRelationFilter = {
    every?: Prisma.CredentialRequirementWhereInput;
    some?: Prisma.CredentialRequirementWhereInput;
    none?: Prisma.CredentialRequirementWhereInput;
};
export type CredentialRequirementOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CredentialRequirementCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    classId?: Prisma.SortOrder;
};
export type CredentialRequirementAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    classId?: Prisma.SortOrder;
};
export type CredentialRequirementMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    classId?: Prisma.SortOrder;
};
export type CredentialRequirementMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    kind?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    classId?: Prisma.SortOrder;
};
export type CredentialRequirementSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    credentialTypeId?: Prisma.SortOrder;
    certificationTypeId?: Prisma.SortOrder;
    evalTemplateId?: Prisma.SortOrder;
    count?: Prisma.SortOrder;
    classId?: Prisma.SortOrder;
};
export type CredentialRequirementCreateNestedManyWithoutCertificationTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput> | Prisma.CredentialRequirementCreateWithoutCertificationTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCertificationTypeInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUncheckedCreateNestedManyWithoutCertificationTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput> | Prisma.CredentialRequirementCreateWithoutCertificationTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCertificationTypeInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUpdateManyWithoutCertificationTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput> | Prisma.CredentialRequirementCreateWithoutCertificationTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCertificationTypeInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCertificationTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCertificationTypeInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCertificationTypeInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCertificationTypeInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutCertificationTypeInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutCertificationTypeInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementUncheckedUpdateManyWithoutCertificationTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput> | Prisma.CredentialRequirementCreateWithoutCertificationTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCertificationTypeInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCertificationTypeInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCertificationTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCertificationTypeInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCertificationTypeInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCertificationTypeInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutCertificationTypeInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutCertificationTypeInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialRequirementCreateWithoutCredentialTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUncheckedCreateNestedManyWithoutCredentialTypeInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialRequirementCreateWithoutCredentialTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCredentialTypeInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialRequirementCreateWithoutCredentialTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput> | Prisma.CredentialRequirementCreateWithoutCredentialTypeInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput | Prisma.CredentialRequirementCreateOrConnectWithoutCredentialTypeInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutCredentialTypeInput[];
    createMany?: Prisma.CredentialRequirementCreateManyCredentialTypeInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCredentialTypeInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutCredentialTypeInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutCredentialTypeInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutCredentialTypeInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type EnumRequirementKindFieldUpdateOperationsInput = {
    set?: $Enums.RequirementKind;
};
export type CredentialRequirementCreateNestedManyWithoutEvalTemplateInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput> | Prisma.CredentialRequirementCreateWithoutEvalTemplateInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput | Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput[];
    createMany?: Prisma.CredentialRequirementCreateManyEvalTemplateInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUncheckedCreateNestedManyWithoutEvalTemplateInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput> | Prisma.CredentialRequirementCreateWithoutEvalTemplateInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput | Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput[];
    createMany?: Prisma.CredentialRequirementCreateManyEvalTemplateInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUpdateManyWithoutEvalTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput> | Prisma.CredentialRequirementCreateWithoutEvalTemplateInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput | Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutEvalTemplateInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutEvalTemplateInput[];
    createMany?: Prisma.CredentialRequirementCreateManyEvalTemplateInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutEvalTemplateInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutEvalTemplateInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutEvalTemplateInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutEvalTemplateInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput> | Prisma.CredentialRequirementCreateWithoutEvalTemplateInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput | Prisma.CredentialRequirementCreateOrConnectWithoutEvalTemplateInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutEvalTemplateInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutEvalTemplateInput[];
    createMany?: Prisma.CredentialRequirementCreateManyEvalTemplateInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutEvalTemplateInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutEvalTemplateInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutEvalTemplateInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutEvalTemplateInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementCreateNestedManyWithoutClassInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput> | Prisma.CredentialRequirementCreateWithoutClassInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutClassInput | Prisma.CredentialRequirementCreateOrConnectWithoutClassInput[];
    createMany?: Prisma.CredentialRequirementCreateManyClassInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUncheckedCreateNestedManyWithoutClassInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput> | Prisma.CredentialRequirementCreateWithoutClassInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutClassInput | Prisma.CredentialRequirementCreateOrConnectWithoutClassInput[];
    createMany?: Prisma.CredentialRequirementCreateManyClassInputEnvelope;
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
};
export type CredentialRequirementUpdateManyWithoutClassNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput> | Prisma.CredentialRequirementCreateWithoutClassInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutClassInput | Prisma.CredentialRequirementCreateOrConnectWithoutClassInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutClassInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutClassInput[];
    createMany?: Prisma.CredentialRequirementCreateManyClassInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutClassInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutClassInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutClassInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutClassInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementUncheckedUpdateManyWithoutClassNestedInput = {
    create?: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput> | Prisma.CredentialRequirementCreateWithoutClassInput[] | Prisma.CredentialRequirementUncheckedCreateWithoutClassInput[];
    connectOrCreate?: Prisma.CredentialRequirementCreateOrConnectWithoutClassInput | Prisma.CredentialRequirementCreateOrConnectWithoutClassInput[];
    upsert?: Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutClassInput | Prisma.CredentialRequirementUpsertWithWhereUniqueWithoutClassInput[];
    createMany?: Prisma.CredentialRequirementCreateManyClassInputEnvelope;
    set?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    disconnect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    delete?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    connect?: Prisma.CredentialRequirementWhereUniqueInput | Prisma.CredentialRequirementWhereUniqueInput[];
    update?: Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutClassInput | Prisma.CredentialRequirementUpdateWithWhereUniqueWithoutClassInput[];
    updateMany?: Prisma.CredentialRequirementUpdateManyWithWhereWithoutClassInput | Prisma.CredentialRequirementUpdateManyWithWhereWithoutClassInput[];
    deleteMany?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
};
export type CredentialRequirementCreateWithoutCertificationTypeInput = {
    kind: $Enums.RequirementKind;
    count?: number | null;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutRequirementsInput;
    evalTemplate?: Prisma.EvalFormTemplateCreateNestedOneWithoutCredentialRequirementsInput;
    class?: Prisma.TrainingClassCreateNestedOneWithoutCredentialRequirementsInput;
};
export type CredentialRequirementUncheckedCreateWithoutCertificationTypeInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementCreateOrConnectWithoutCertificationTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput>;
};
export type CredentialRequirementCreateManyCertificationTypeInputEnvelope = {
    data: Prisma.CredentialRequirementCreateManyCertificationTypeInput | Prisma.CredentialRequirementCreateManyCertificationTypeInput[];
    skipDuplicates?: boolean;
};
export type CredentialRequirementUpsertWithWhereUniqueWithoutCertificationTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedUpdateWithoutCertificationTypeInput>;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCertificationTypeInput>;
};
export type CredentialRequirementUpdateWithWhereUniqueWithoutCertificationTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutCertificationTypeInput, Prisma.CredentialRequirementUncheckedUpdateWithoutCertificationTypeInput>;
};
export type CredentialRequirementUpdateManyWithWhereWithoutCertificationTypeInput = {
    where: Prisma.CredentialRequirementScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyWithoutCertificationTypeInput>;
};
export type CredentialRequirementScalarWhereInput = {
    AND?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
    OR?: Prisma.CredentialRequirementScalarWhereInput[];
    NOT?: Prisma.CredentialRequirementScalarWhereInput | Prisma.CredentialRequirementScalarWhereInput[];
    id?: Prisma.IntFilter<"CredentialRequirement"> | number;
    credentialTypeId?: Prisma.IntFilter<"CredentialRequirement"> | number;
    kind?: Prisma.EnumRequirementKindFilter<"CredentialRequirement"> | $Enums.RequirementKind;
    certificationTypeId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    evalTemplateId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    count?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
    classId?: Prisma.IntNullableFilter<"CredentialRequirement"> | number | null;
};
export type CredentialRequirementCreateWithoutCredentialTypeInput = {
    kind: $Enums.RequirementKind;
    count?: number | null;
    certificationType?: Prisma.CertificationTypeCreateNestedOneWithoutCredentialRequirementsInput;
    evalTemplate?: Prisma.EvalFormTemplateCreateNestedOneWithoutCredentialRequirementsInput;
    class?: Prisma.TrainingClassCreateNestedOneWithoutCredentialRequirementsInput;
};
export type CredentialRequirementUncheckedCreateWithoutCredentialTypeInput = {
    id?: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementCreateOrConnectWithoutCredentialTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput>;
};
export type CredentialRequirementCreateManyCredentialTypeInputEnvelope = {
    data: Prisma.CredentialRequirementCreateManyCredentialTypeInput | Prisma.CredentialRequirementCreateManyCredentialTypeInput[];
    skipDuplicates?: boolean;
};
export type CredentialRequirementUpsertWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedUpdateWithoutCredentialTypeInput>;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedCreateWithoutCredentialTypeInput>;
};
export type CredentialRequirementUpdateWithWhereUniqueWithoutCredentialTypeInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutCredentialTypeInput, Prisma.CredentialRequirementUncheckedUpdateWithoutCredentialTypeInput>;
};
export type CredentialRequirementUpdateManyWithWhereWithoutCredentialTypeInput = {
    where: Prisma.CredentialRequirementScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeInput>;
};
export type CredentialRequirementCreateWithoutEvalTemplateInput = {
    kind: $Enums.RequirementKind;
    count?: number | null;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutRequirementsInput;
    certificationType?: Prisma.CertificationTypeCreateNestedOneWithoutCredentialRequirementsInput;
    class?: Prisma.TrainingClassCreateNestedOneWithoutCredentialRequirementsInput;
};
export type CredentialRequirementUncheckedCreateWithoutEvalTemplateInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementCreateOrConnectWithoutEvalTemplateInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput>;
};
export type CredentialRequirementCreateManyEvalTemplateInputEnvelope = {
    data: Prisma.CredentialRequirementCreateManyEvalTemplateInput | Prisma.CredentialRequirementCreateManyEvalTemplateInput[];
    skipDuplicates?: boolean;
};
export type CredentialRequirementUpsertWithWhereUniqueWithoutEvalTemplateInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedUpdateWithoutEvalTemplateInput>;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedCreateWithoutEvalTemplateInput>;
};
export type CredentialRequirementUpdateWithWhereUniqueWithoutEvalTemplateInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutEvalTemplateInput, Prisma.CredentialRequirementUncheckedUpdateWithoutEvalTemplateInput>;
};
export type CredentialRequirementUpdateManyWithWhereWithoutEvalTemplateInput = {
    where: Prisma.CredentialRequirementScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateInput>;
};
export type CredentialRequirementCreateWithoutClassInput = {
    kind: $Enums.RequirementKind;
    count?: number | null;
    credentialType: Prisma.CredentialTypeCreateNestedOneWithoutRequirementsInput;
    certificationType?: Prisma.CertificationTypeCreateNestedOneWithoutCredentialRequirementsInput;
    evalTemplate?: Prisma.EvalFormTemplateCreateNestedOneWithoutCredentialRequirementsInput;
};
export type CredentialRequirementUncheckedCreateWithoutClassInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
};
export type CredentialRequirementCreateOrConnectWithoutClassInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput>;
};
export type CredentialRequirementCreateManyClassInputEnvelope = {
    data: Prisma.CredentialRequirementCreateManyClassInput | Prisma.CredentialRequirementCreateManyClassInput[];
    skipDuplicates?: boolean;
};
export type CredentialRequirementUpsertWithWhereUniqueWithoutClassInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    update: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutClassInput, Prisma.CredentialRequirementUncheckedUpdateWithoutClassInput>;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateWithoutClassInput, Prisma.CredentialRequirementUncheckedCreateWithoutClassInput>;
};
export type CredentialRequirementUpdateWithWhereUniqueWithoutClassInput = {
    where: Prisma.CredentialRequirementWhereUniqueInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateWithoutClassInput, Prisma.CredentialRequirementUncheckedUpdateWithoutClassInput>;
};
export type CredentialRequirementUpdateManyWithWhereWithoutClassInput = {
    where: Prisma.CredentialRequirementScalarWhereInput;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyWithoutClassInput>;
};
export type CredentialRequirementCreateManyCertificationTypeInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementUpdateWithoutCertificationTypeInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutRequirementsNestedInput;
    evalTemplate?: Prisma.EvalFormTemplateUpdateOneWithoutCredentialRequirementsNestedInput;
    class?: Prisma.TrainingClassUpdateOneWithoutCredentialRequirementsNestedInput;
};
export type CredentialRequirementUncheckedUpdateWithoutCertificationTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementUncheckedUpdateManyWithoutCertificationTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementCreateManyCredentialTypeInput = {
    id?: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementUpdateWithoutCredentialTypeInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    certificationType?: Prisma.CertificationTypeUpdateOneWithoutCredentialRequirementsNestedInput;
    evalTemplate?: Prisma.EvalFormTemplateUpdateOneWithoutCredentialRequirementsNestedInput;
    class?: Prisma.TrainingClassUpdateOneWithoutCredentialRequirementsNestedInput;
};
export type CredentialRequirementUncheckedUpdateWithoutCredentialTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementUncheckedUpdateManyWithoutCredentialTypeInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementCreateManyEvalTemplateInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    count?: number | null;
    classId?: number | null;
};
export type CredentialRequirementUpdateWithoutEvalTemplateInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutRequirementsNestedInput;
    certificationType?: Prisma.CertificationTypeUpdateOneWithoutCredentialRequirementsNestedInput;
    class?: Prisma.TrainingClassUpdateOneWithoutCredentialRequirementsNestedInput;
};
export type CredentialRequirementUncheckedUpdateWithoutEvalTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementUncheckedUpdateManyWithoutEvalTemplateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    classId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementCreateManyClassInput = {
    id?: number;
    credentialTypeId: number;
    kind: $Enums.RequirementKind;
    certificationTypeId?: number | null;
    evalTemplateId?: number | null;
    count?: number | null;
};
export type CredentialRequirementUpdateWithoutClassInput = {
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    credentialType?: Prisma.CredentialTypeUpdateOneRequiredWithoutRequirementsNestedInput;
    certificationType?: Prisma.CertificationTypeUpdateOneWithoutCredentialRequirementsNestedInput;
    evalTemplate?: Prisma.EvalFormTemplateUpdateOneWithoutCredentialRequirementsNestedInput;
};
export type CredentialRequirementUncheckedUpdateWithoutClassInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementUncheckedUpdateManyWithoutClassInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    credentialTypeId?: Prisma.IntFieldUpdateOperationsInput | number;
    kind?: Prisma.EnumRequirementKindFieldUpdateOperationsInput | $Enums.RequirementKind;
    certificationTypeId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    evalTemplateId?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    count?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
};
export type CredentialRequirementSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    credentialTypeId?: boolean;
    kind?: boolean;
    certificationTypeId?: boolean;
    evalTemplateId?: boolean;
    count?: boolean;
    classId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
}, ExtArgs["result"]["credentialRequirement"]>;
export type CredentialRequirementSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    credentialTypeId?: boolean;
    kind?: boolean;
    certificationTypeId?: boolean;
    evalTemplateId?: boolean;
    count?: boolean;
    classId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
}, ExtArgs["result"]["credentialRequirement"]>;
export type CredentialRequirementSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    credentialTypeId?: boolean;
    kind?: boolean;
    certificationTypeId?: boolean;
    evalTemplateId?: boolean;
    count?: boolean;
    classId?: boolean;
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
}, ExtArgs["result"]["credentialRequirement"]>;
export type CredentialRequirementSelectScalar = {
    id?: boolean;
    credentialTypeId?: boolean;
    kind?: boolean;
    certificationTypeId?: boolean;
    evalTemplateId?: boolean;
    count?: boolean;
    classId?: boolean;
};
export type CredentialRequirementOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "credentialTypeId" | "kind" | "certificationTypeId" | "evalTemplateId" | "count" | "classId", ExtArgs["result"]["credentialRequirement"]>;
export type CredentialRequirementInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
};
export type CredentialRequirementIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
};
export type CredentialRequirementIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    credentialType?: boolean | Prisma.CredentialTypeDefaultArgs<ExtArgs>;
    certificationType?: boolean | Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>;
    evalTemplate?: boolean | Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>;
    class?: boolean | Prisma.CredentialRequirement$classArgs<ExtArgs>;
};
export type $CredentialRequirementPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CredentialRequirement";
    objects: {
        credentialType: Prisma.$CredentialTypePayload<ExtArgs>;
        certificationType: Prisma.$CertificationTypePayload<ExtArgs> | null;
        evalTemplate: Prisma.$EvalFormTemplatePayload<ExtArgs> | null;
        class: Prisma.$TrainingClassPayload<ExtArgs> | null;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        credentialTypeId: number;
        kind: $Enums.RequirementKind;
        certificationTypeId: number | null;
        evalTemplateId: number | null;
        count: number | null;
        classId: number | null;
    }, ExtArgs["result"]["credentialRequirement"]>;
    composites: {};
};
export type CredentialRequirementGetPayload<S extends boolean | null | undefined | CredentialRequirementDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload, S>;
export type CredentialRequirementCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CredentialRequirementFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CredentialRequirementCountAggregateInputType | true;
};
export interface CredentialRequirementDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CredentialRequirement'];
        meta: {
            name: 'CredentialRequirement';
        };
    };
    findUnique<T extends CredentialRequirementFindUniqueArgs>(args: Prisma.SelectSubset<T, CredentialRequirementFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CredentialRequirementFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CredentialRequirementFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CredentialRequirementFindFirstArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementFindFirstArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CredentialRequirementFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CredentialRequirementFindManyArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CredentialRequirementCreateArgs>(args: Prisma.SelectSubset<T, CredentialRequirementCreateArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CredentialRequirementCreateManyArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CredentialRequirementCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CredentialRequirementDeleteArgs>(args: Prisma.SelectSubset<T, CredentialRequirementDeleteArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CredentialRequirementUpdateArgs>(args: Prisma.SelectSubset<T, CredentialRequirementUpdateArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CredentialRequirementDeleteManyArgs>(args?: Prisma.SelectSubset<T, CredentialRequirementDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CredentialRequirementUpdateManyArgs>(args: Prisma.SelectSubset<T, CredentialRequirementUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CredentialRequirementUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CredentialRequirementUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CredentialRequirementUpsertArgs>(args: Prisma.SelectSubset<T, CredentialRequirementUpsertArgs<ExtArgs>>): Prisma.Prisma__CredentialRequirementClient<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CredentialRequirementCountArgs>(args?: Prisma.Subset<T, CredentialRequirementCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CredentialRequirementCountAggregateOutputType> : number>;
    aggregate<T extends CredentialRequirementAggregateArgs>(args: Prisma.Subset<T, CredentialRequirementAggregateArgs>): Prisma.PrismaPromise<GetCredentialRequirementAggregateType<T>>;
    groupBy<T extends CredentialRequirementGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CredentialRequirementGroupByArgs['orderBy'];
    } : {
        orderBy?: CredentialRequirementGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CredentialRequirementGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCredentialRequirementGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CredentialRequirementFieldRefs;
}
export interface Prisma__CredentialRequirementClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    credentialType<T extends Prisma.CredentialTypeDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialTypeDefaultArgs<ExtArgs>>): Prisma.Prisma__CredentialTypeClient<runtime.Types.Result.GetResult<Prisma.$CredentialTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    certificationType<T extends Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialRequirement$certificationTypeArgs<ExtArgs>>): Prisma.Prisma__CertificationTypeClient<runtime.Types.Result.GetResult<Prisma.$CertificationTypePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    evalTemplate<T extends Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialRequirement$evalTemplateArgs<ExtArgs>>): Prisma.Prisma__EvalFormTemplateClient<runtime.Types.Result.GetResult<Prisma.$EvalFormTemplatePayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    class<T extends Prisma.CredentialRequirement$classArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.CredentialRequirement$classArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CredentialRequirementFieldRefs {
    readonly id: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
    readonly credentialTypeId: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
    readonly kind: Prisma.FieldRef<"CredentialRequirement", 'RequirementKind'>;
    readonly certificationTypeId: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
    readonly evalTemplateId: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
    readonly count: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
    readonly classId: Prisma.FieldRef<"CredentialRequirement", 'Int'>;
}
export type CredentialRequirementFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where: Prisma.CredentialRequirementWhereUniqueInput;
};
export type CredentialRequirementFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where: Prisma.CredentialRequirementWhereUniqueInput;
};
export type CredentialRequirementFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialRequirementFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialRequirementFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type CredentialRequirementCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialRequirementCreateInput, Prisma.CredentialRequirementUncheckedCreateInput>;
};
export type CredentialRequirementCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CredentialRequirementCreateManyInput | Prisma.CredentialRequirementCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CredentialRequirementCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    data: Prisma.CredentialRequirementCreateManyInput | Prisma.CredentialRequirementCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CredentialRequirementIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CredentialRequirementUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateInput, Prisma.CredentialRequirementUncheckedUpdateInput>;
    where: Prisma.CredentialRequirementWhereUniqueInput;
};
export type CredentialRequirementUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyInput>;
    where?: Prisma.CredentialRequirementWhereInput;
    limit?: number;
};
export type CredentialRequirementUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CredentialRequirementUpdateManyMutationInput, Prisma.CredentialRequirementUncheckedUpdateManyInput>;
    where?: Prisma.CredentialRequirementWhereInput;
    limit?: number;
    include?: Prisma.CredentialRequirementIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CredentialRequirementUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where: Prisma.CredentialRequirementWhereUniqueInput;
    create: Prisma.XOR<Prisma.CredentialRequirementCreateInput, Prisma.CredentialRequirementUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CredentialRequirementUpdateInput, Prisma.CredentialRequirementUncheckedUpdateInput>;
};
export type CredentialRequirementDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
    where: Prisma.CredentialRequirementWhereUniqueInput;
};
export type CredentialRequirementDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
    limit?: number;
};
export type CredentialRequirement$certificationTypeArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationTypeSelect<ExtArgs> | null;
    omit?: Prisma.CertificationTypeOmit<ExtArgs> | null;
    include?: Prisma.CertificationTypeInclude<ExtArgs> | null;
    where?: Prisma.CertificationTypeWhereInput;
};
export type CredentialRequirement$evalTemplateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EvalFormTemplateSelect<ExtArgs> | null;
    omit?: Prisma.EvalFormTemplateOmit<ExtArgs> | null;
    include?: Prisma.EvalFormTemplateInclude<ExtArgs> | null;
    where?: Prisma.EvalFormTemplateWhereInput;
};
export type CredentialRequirement$classArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where?: Prisma.TrainingClassWhereInput;
};
export type CredentialRequirementDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CredentialRequirementSelect<ExtArgs> | null;
    omit?: Prisma.CredentialRequirementOmit<ExtArgs> | null;
    include?: Prisma.CredentialRequirementInclude<ExtArgs> | null;
};
