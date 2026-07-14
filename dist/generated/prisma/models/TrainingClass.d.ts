import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type TrainingClassModel = runtime.Types.Result.DefaultSelection<Prisma.$TrainingClassPayload>;
export type AggregateTrainingClass = {
    _count: TrainingClassCountAggregateOutputType | null;
    _avg: TrainingClassAvgAggregateOutputType | null;
    _sum: TrainingClassSumAggregateOutputType | null;
    _min: TrainingClassMinAggregateOutputType | null;
    _max: TrainingClassMaxAggregateOutputType | null;
};
export type TrainingClassAvgAggregateOutputType = {
    id: number | null;
};
export type TrainingClassSumAggregateOutputType = {
    id: number | null;
};
export type TrainingClassMinAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    sessionAt: Date | null;
    location: string | null;
};
export type TrainingClassMaxAggregateOutputType = {
    id: number | null;
    name: string | null;
    description: string | null;
    sessionAt: Date | null;
    location: string | null;
};
export type TrainingClassCountAggregateOutputType = {
    id: number;
    name: number;
    description: number;
    sessionAt: number;
    location: number;
    _all: number;
};
export type TrainingClassAvgAggregateInputType = {
    id?: true;
};
export type TrainingClassSumAggregateInputType = {
    id?: true;
};
export type TrainingClassMinAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    sessionAt?: true;
    location?: true;
};
export type TrainingClassMaxAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    sessionAt?: true;
    location?: true;
};
export type TrainingClassCountAggregateInputType = {
    id?: true;
    name?: true;
    description?: true;
    sessionAt?: true;
    location?: true;
    _all?: true;
};
export type TrainingClassAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TrainingClassWhereInput;
    orderBy?: Prisma.TrainingClassOrderByWithRelationInput | Prisma.TrainingClassOrderByWithRelationInput[];
    cursor?: Prisma.TrainingClassWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | TrainingClassCountAggregateInputType;
    _avg?: TrainingClassAvgAggregateInputType;
    _sum?: TrainingClassSumAggregateInputType;
    _min?: TrainingClassMinAggregateInputType;
    _max?: TrainingClassMaxAggregateInputType;
};
export type GetTrainingClassAggregateType<T extends TrainingClassAggregateArgs> = {
    [P in keyof T & keyof AggregateTrainingClass]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateTrainingClass[P]> : Prisma.GetScalarType<T[P], AggregateTrainingClass[P]>;
};
export type TrainingClassGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TrainingClassWhereInput;
    orderBy?: Prisma.TrainingClassOrderByWithAggregationInput | Prisma.TrainingClassOrderByWithAggregationInput[];
    by: Prisma.TrainingClassScalarFieldEnum[] | Prisma.TrainingClassScalarFieldEnum;
    having?: Prisma.TrainingClassScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: TrainingClassCountAggregateInputType | true;
    _avg?: TrainingClassAvgAggregateInputType;
    _sum?: TrainingClassSumAggregateInputType;
    _min?: TrainingClassMinAggregateInputType;
    _max?: TrainingClassMaxAggregateInputType;
};
export type TrainingClassGroupByOutputType = {
    id: number;
    name: string;
    description: string | null;
    sessionAt: Date | null;
    location: string | null;
    _count: TrainingClassCountAggregateOutputType | null;
    _avg: TrainingClassAvgAggregateOutputType | null;
    _sum: TrainingClassSumAggregateOutputType | null;
    _min: TrainingClassMinAggregateOutputType | null;
    _max: TrainingClassMaxAggregateOutputType | null;
};
export type GetTrainingClassGroupByPayload<T extends TrainingClassGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<TrainingClassGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof TrainingClassGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], TrainingClassGroupByOutputType[P]> : Prisma.GetScalarType<T[P], TrainingClassGroupByOutputType[P]>;
}>>;
export type TrainingClassWhereInput = {
    AND?: Prisma.TrainingClassWhereInput | Prisma.TrainingClassWhereInput[];
    OR?: Prisma.TrainingClassWhereInput[];
    NOT?: Prisma.TrainingClassWhereInput | Prisma.TrainingClassWhereInput[];
    id?: Prisma.IntFilter<"TrainingClass"> | number;
    name?: Prisma.StringFilter<"TrainingClass"> | string;
    description?: Prisma.StringNullableFilter<"TrainingClass"> | string | null;
    sessionAt?: Prisma.DateTimeNullableFilter<"TrainingClass"> | Date | string | null;
    location?: Prisma.StringNullableFilter<"TrainingClass"> | string | null;
    attendance?: Prisma.ClassAttendanceListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
};
export type TrainingClassOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    sessionAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    attendance?: Prisma.ClassAttendanceOrderByRelationAggregateInput;
    credentialRequirements?: Prisma.CredentialRequirementOrderByRelationAggregateInput;
};
export type TrainingClassWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.TrainingClassWhereInput | Prisma.TrainingClassWhereInput[];
    OR?: Prisma.TrainingClassWhereInput[];
    NOT?: Prisma.TrainingClassWhereInput | Prisma.TrainingClassWhereInput[];
    name?: Prisma.StringFilter<"TrainingClass"> | string;
    description?: Prisma.StringNullableFilter<"TrainingClass"> | string | null;
    sessionAt?: Prisma.DateTimeNullableFilter<"TrainingClass"> | Date | string | null;
    location?: Prisma.StringNullableFilter<"TrainingClass"> | string | null;
    attendance?: Prisma.ClassAttendanceListRelationFilter;
    credentialRequirements?: Prisma.CredentialRequirementListRelationFilter;
}, "id">;
export type TrainingClassOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    sessionAt?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    _count?: Prisma.TrainingClassCountOrderByAggregateInput;
    _avg?: Prisma.TrainingClassAvgOrderByAggregateInput;
    _max?: Prisma.TrainingClassMaxOrderByAggregateInput;
    _min?: Prisma.TrainingClassMinOrderByAggregateInput;
    _sum?: Prisma.TrainingClassSumOrderByAggregateInput;
};
export type TrainingClassScalarWhereWithAggregatesInput = {
    AND?: Prisma.TrainingClassScalarWhereWithAggregatesInput | Prisma.TrainingClassScalarWhereWithAggregatesInput[];
    OR?: Prisma.TrainingClassScalarWhereWithAggregatesInput[];
    NOT?: Prisma.TrainingClassScalarWhereWithAggregatesInput | Prisma.TrainingClassScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"TrainingClass"> | number;
    name?: Prisma.StringWithAggregatesFilter<"TrainingClass"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"TrainingClass"> | string | null;
    sessionAt?: Prisma.DateTimeNullableWithAggregatesFilter<"TrainingClass"> | Date | string | null;
    location?: Prisma.StringNullableWithAggregatesFilter<"TrainingClass"> | string | null;
};
export type TrainingClassCreateInput = {
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    attendance?: Prisma.ClassAttendanceCreateNestedManyWithoutClassInput;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutClassInput;
};
export type TrainingClassUncheckedCreateInput = {
    id?: number;
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    attendance?: Prisma.ClassAttendanceUncheckedCreateNestedManyWithoutClassInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutClassInput;
};
export type TrainingClassUpdateInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    attendance?: Prisma.ClassAttendanceUpdateManyWithoutClassNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutClassNestedInput;
};
export type TrainingClassUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    attendance?: Prisma.ClassAttendanceUncheckedUpdateManyWithoutClassNestedInput;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutClassNestedInput;
};
export type TrainingClassCreateManyInput = {
    id?: number;
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
};
export type TrainingClassUpdateManyMutationInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TrainingClassUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
};
export type TrainingClassNullableScalarRelationFilter = {
    is?: Prisma.TrainingClassWhereInput | null;
    isNot?: Prisma.TrainingClassWhereInput | null;
};
export type TrainingClassCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sessionAt?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
};
export type TrainingClassAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type TrainingClassMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sessionAt?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
};
export type TrainingClassMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    name?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    sessionAt?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
};
export type TrainingClassSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
};
export type TrainingClassScalarRelationFilter = {
    is?: Prisma.TrainingClassWhereInput;
    isNot?: Prisma.TrainingClassWhereInput;
};
export type TrainingClassCreateNestedOneWithoutCredentialRequirementsInput = {
    create?: Prisma.XOR<Prisma.TrainingClassCreateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.TrainingClassCreateOrConnectWithoutCredentialRequirementsInput;
    connect?: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassUpdateOneWithoutCredentialRequirementsNestedInput = {
    create?: Prisma.XOR<Prisma.TrainingClassCreateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedCreateWithoutCredentialRequirementsInput>;
    connectOrCreate?: Prisma.TrainingClassCreateOrConnectWithoutCredentialRequirementsInput;
    upsert?: Prisma.TrainingClassUpsertWithoutCredentialRequirementsInput;
    disconnect?: Prisma.TrainingClassWhereInput | boolean;
    delete?: Prisma.TrainingClassWhereInput | boolean;
    connect?: Prisma.TrainingClassWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TrainingClassUpdateToOneWithWhereWithoutCredentialRequirementsInput, Prisma.TrainingClassUpdateWithoutCredentialRequirementsInput>, Prisma.TrainingClassUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type TrainingClassCreateNestedOneWithoutAttendanceInput = {
    create?: Prisma.XOR<Prisma.TrainingClassCreateWithoutAttendanceInput, Prisma.TrainingClassUncheckedCreateWithoutAttendanceInput>;
    connectOrCreate?: Prisma.TrainingClassCreateOrConnectWithoutAttendanceInput;
    connect?: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassUpdateOneRequiredWithoutAttendanceNestedInput = {
    create?: Prisma.XOR<Prisma.TrainingClassCreateWithoutAttendanceInput, Prisma.TrainingClassUncheckedCreateWithoutAttendanceInput>;
    connectOrCreate?: Prisma.TrainingClassCreateOrConnectWithoutAttendanceInput;
    upsert?: Prisma.TrainingClassUpsertWithoutAttendanceInput;
    connect?: Prisma.TrainingClassWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.TrainingClassUpdateToOneWithWhereWithoutAttendanceInput, Prisma.TrainingClassUpdateWithoutAttendanceInput>, Prisma.TrainingClassUncheckedUpdateWithoutAttendanceInput>;
};
export type TrainingClassCreateWithoutCredentialRequirementsInput = {
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    attendance?: Prisma.ClassAttendanceCreateNestedManyWithoutClassInput;
};
export type TrainingClassUncheckedCreateWithoutCredentialRequirementsInput = {
    id?: number;
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    attendance?: Prisma.ClassAttendanceUncheckedCreateNestedManyWithoutClassInput;
};
export type TrainingClassCreateOrConnectWithoutCredentialRequirementsInput = {
    where: Prisma.TrainingClassWhereUniqueInput;
    create: Prisma.XOR<Prisma.TrainingClassCreateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedCreateWithoutCredentialRequirementsInput>;
};
export type TrainingClassUpsertWithoutCredentialRequirementsInput = {
    update: Prisma.XOR<Prisma.TrainingClassUpdateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedUpdateWithoutCredentialRequirementsInput>;
    create: Prisma.XOR<Prisma.TrainingClassCreateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedCreateWithoutCredentialRequirementsInput>;
    where?: Prisma.TrainingClassWhereInput;
};
export type TrainingClassUpdateToOneWithWhereWithoutCredentialRequirementsInput = {
    where?: Prisma.TrainingClassWhereInput;
    data: Prisma.XOR<Prisma.TrainingClassUpdateWithoutCredentialRequirementsInput, Prisma.TrainingClassUncheckedUpdateWithoutCredentialRequirementsInput>;
};
export type TrainingClassUpdateWithoutCredentialRequirementsInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    attendance?: Prisma.ClassAttendanceUpdateManyWithoutClassNestedInput;
};
export type TrainingClassUncheckedUpdateWithoutCredentialRequirementsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    attendance?: Prisma.ClassAttendanceUncheckedUpdateManyWithoutClassNestedInput;
};
export type TrainingClassCreateWithoutAttendanceInput = {
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    credentialRequirements?: Prisma.CredentialRequirementCreateNestedManyWithoutClassInput;
};
export type TrainingClassUncheckedCreateWithoutAttendanceInput = {
    id?: number;
    name: string;
    description?: string | null;
    sessionAt?: Date | string | null;
    location?: string | null;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedCreateNestedManyWithoutClassInput;
};
export type TrainingClassCreateOrConnectWithoutAttendanceInput = {
    where: Prisma.TrainingClassWhereUniqueInput;
    create: Prisma.XOR<Prisma.TrainingClassCreateWithoutAttendanceInput, Prisma.TrainingClassUncheckedCreateWithoutAttendanceInput>;
};
export type TrainingClassUpsertWithoutAttendanceInput = {
    update: Prisma.XOR<Prisma.TrainingClassUpdateWithoutAttendanceInput, Prisma.TrainingClassUncheckedUpdateWithoutAttendanceInput>;
    create: Prisma.XOR<Prisma.TrainingClassCreateWithoutAttendanceInput, Prisma.TrainingClassUncheckedCreateWithoutAttendanceInput>;
    where?: Prisma.TrainingClassWhereInput;
};
export type TrainingClassUpdateToOneWithWhereWithoutAttendanceInput = {
    where?: Prisma.TrainingClassWhereInput;
    data: Prisma.XOR<Prisma.TrainingClassUpdateWithoutAttendanceInput, Prisma.TrainingClassUncheckedUpdateWithoutAttendanceInput>;
};
export type TrainingClassUpdateWithoutAttendanceInput = {
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credentialRequirements?: Prisma.CredentialRequirementUpdateManyWithoutClassNestedInput;
};
export type TrainingClassUncheckedUpdateWithoutAttendanceInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    name?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    sessionAt?: Prisma.NullableDateTimeFieldUpdateOperationsInput | Date | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    credentialRequirements?: Prisma.CredentialRequirementUncheckedUpdateManyWithoutClassNestedInput;
};
export type TrainingClassCountOutputType = {
    attendance: number;
    credentialRequirements: number;
};
export type TrainingClassCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    attendance?: boolean | TrainingClassCountOutputTypeCountAttendanceArgs;
    credentialRequirements?: boolean | TrainingClassCountOutputTypeCountCredentialRequirementsArgs;
};
export type TrainingClassCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassCountOutputTypeSelect<ExtArgs> | null;
};
export type TrainingClassCountOutputTypeCountAttendanceArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.ClassAttendanceWhereInput;
};
export type TrainingClassCountOutputTypeCountCredentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CredentialRequirementWhereInput;
};
export type TrainingClassSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    sessionAt?: boolean;
    location?: boolean;
    attendance?: boolean | Prisma.TrainingClass$attendanceArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.TrainingClass$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.TrainingClassCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["trainingClass"]>;
export type TrainingClassSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    sessionAt?: boolean;
    location?: boolean;
}, ExtArgs["result"]["trainingClass"]>;
export type TrainingClassSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    name?: boolean;
    description?: boolean;
    sessionAt?: boolean;
    location?: boolean;
}, ExtArgs["result"]["trainingClass"]>;
export type TrainingClassSelectScalar = {
    id?: boolean;
    name?: boolean;
    description?: boolean;
    sessionAt?: boolean;
    location?: boolean;
};
export type TrainingClassOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "name" | "description" | "sessionAt" | "location", ExtArgs["result"]["trainingClass"]>;
export type TrainingClassInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    attendance?: boolean | Prisma.TrainingClass$attendanceArgs<ExtArgs>;
    credentialRequirements?: boolean | Prisma.TrainingClass$credentialRequirementsArgs<ExtArgs>;
    _count?: boolean | Prisma.TrainingClassCountOutputTypeDefaultArgs<ExtArgs>;
};
export type TrainingClassIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type TrainingClassIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {};
export type $TrainingClassPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "TrainingClass";
    objects: {
        attendance: Prisma.$ClassAttendancePayload<ExtArgs>[];
        credentialRequirements: Prisma.$CredentialRequirementPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        name: string;
        description: string | null;
        sessionAt: Date | null;
        location: string | null;
    }, ExtArgs["result"]["trainingClass"]>;
    composites: {};
};
export type TrainingClassGetPayload<S extends boolean | null | undefined | TrainingClassDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload, S>;
export type TrainingClassCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<TrainingClassFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: TrainingClassCountAggregateInputType | true;
};
export interface TrainingClassDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['TrainingClass'];
        meta: {
            name: 'TrainingClass';
        };
    };
    findUnique<T extends TrainingClassFindUniqueArgs>(args: Prisma.SelectSubset<T, TrainingClassFindUniqueArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends TrainingClassFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, TrainingClassFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends TrainingClassFindFirstArgs>(args?: Prisma.SelectSubset<T, TrainingClassFindFirstArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends TrainingClassFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, TrainingClassFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends TrainingClassFindManyArgs>(args?: Prisma.SelectSubset<T, TrainingClassFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends TrainingClassCreateArgs>(args: Prisma.SelectSubset<T, TrainingClassCreateArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends TrainingClassCreateManyArgs>(args?: Prisma.SelectSubset<T, TrainingClassCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends TrainingClassCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, TrainingClassCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends TrainingClassDeleteArgs>(args: Prisma.SelectSubset<T, TrainingClassDeleteArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends TrainingClassUpdateArgs>(args: Prisma.SelectSubset<T, TrainingClassUpdateArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends TrainingClassDeleteManyArgs>(args?: Prisma.SelectSubset<T, TrainingClassDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends TrainingClassUpdateManyArgs>(args: Prisma.SelectSubset<T, TrainingClassUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends TrainingClassUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, TrainingClassUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends TrainingClassUpsertArgs>(args: Prisma.SelectSubset<T, TrainingClassUpsertArgs<ExtArgs>>): Prisma.Prisma__TrainingClassClient<runtime.Types.Result.GetResult<Prisma.$TrainingClassPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends TrainingClassCountArgs>(args?: Prisma.Subset<T, TrainingClassCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], TrainingClassCountAggregateOutputType> : number>;
    aggregate<T extends TrainingClassAggregateArgs>(args: Prisma.Subset<T, TrainingClassAggregateArgs>): Prisma.PrismaPromise<GetTrainingClassAggregateType<T>>;
    groupBy<T extends TrainingClassGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: TrainingClassGroupByArgs['orderBy'];
    } : {
        orderBy?: TrainingClassGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, TrainingClassGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetTrainingClassGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: TrainingClassFieldRefs;
}
export interface Prisma__TrainingClassClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    attendance<T extends Prisma.TrainingClass$attendanceArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TrainingClass$attendanceArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$ClassAttendancePayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    credentialRequirements<T extends Prisma.TrainingClass$credentialRequirementsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.TrainingClass$credentialRequirementsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CredentialRequirementPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface TrainingClassFieldRefs {
    readonly id: Prisma.FieldRef<"TrainingClass", 'Int'>;
    readonly name: Prisma.FieldRef<"TrainingClass", 'String'>;
    readonly description: Prisma.FieldRef<"TrainingClass", 'String'>;
    readonly sessionAt: Prisma.FieldRef<"TrainingClass", 'DateTime'>;
    readonly location: Prisma.FieldRef<"TrainingClass", 'String'>;
}
export type TrainingClassFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where?: Prisma.TrainingClassWhereInput;
    orderBy?: Prisma.TrainingClassOrderByWithRelationInput | Prisma.TrainingClassOrderByWithRelationInput[];
    cursor?: Prisma.TrainingClassWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TrainingClassScalarFieldEnum | Prisma.TrainingClassScalarFieldEnum[];
};
export type TrainingClassFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where?: Prisma.TrainingClassWhereInput;
    orderBy?: Prisma.TrainingClassOrderByWithRelationInput | Prisma.TrainingClassOrderByWithRelationInput[];
    cursor?: Prisma.TrainingClassWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TrainingClassScalarFieldEnum | Prisma.TrainingClassScalarFieldEnum[];
};
export type TrainingClassFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where?: Prisma.TrainingClassWhereInput;
    orderBy?: Prisma.TrainingClassOrderByWithRelationInput | Prisma.TrainingClassOrderByWithRelationInput[];
    cursor?: Prisma.TrainingClassWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.TrainingClassScalarFieldEnum | Prisma.TrainingClassScalarFieldEnum[];
};
export type TrainingClassCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TrainingClassCreateInput, Prisma.TrainingClassUncheckedCreateInput>;
};
export type TrainingClassCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.TrainingClassCreateManyInput | Prisma.TrainingClassCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TrainingClassCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    data: Prisma.TrainingClassCreateManyInput | Prisma.TrainingClassCreateManyInput[];
    skipDuplicates?: boolean;
};
export type TrainingClassUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TrainingClassUpdateInput, Prisma.TrainingClassUncheckedUpdateInput>;
    where: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.TrainingClassUpdateManyMutationInput, Prisma.TrainingClassUncheckedUpdateManyInput>;
    where?: Prisma.TrainingClassWhereInput;
    limit?: number;
};
export type TrainingClassUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.TrainingClassUpdateManyMutationInput, Prisma.TrainingClassUncheckedUpdateManyInput>;
    where?: Prisma.TrainingClassWhereInput;
    limit?: number;
};
export type TrainingClassUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where: Prisma.TrainingClassWhereUniqueInput;
    create: Prisma.XOR<Prisma.TrainingClassCreateInput, Prisma.TrainingClassUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.TrainingClassUpdateInput, Prisma.TrainingClassUncheckedUpdateInput>;
};
export type TrainingClassDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
    where: Prisma.TrainingClassWhereUniqueInput;
};
export type TrainingClassDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.TrainingClassWhereInput;
    limit?: number;
};
export type TrainingClass$attendanceArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.ClassAttendanceSelect<ExtArgs> | null;
    omit?: Prisma.ClassAttendanceOmit<ExtArgs> | null;
    include?: Prisma.ClassAttendanceInclude<ExtArgs> | null;
    where?: Prisma.ClassAttendanceWhereInput;
    orderBy?: Prisma.ClassAttendanceOrderByWithRelationInput | Prisma.ClassAttendanceOrderByWithRelationInput[];
    cursor?: Prisma.ClassAttendanceWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.ClassAttendanceScalarFieldEnum | Prisma.ClassAttendanceScalarFieldEnum[];
};
export type TrainingClass$credentialRequirementsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
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
export type TrainingClassDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.TrainingClassSelect<ExtArgs> | null;
    omit?: Prisma.TrainingClassOmit<ExtArgs> | null;
    include?: Prisma.TrainingClassInclude<ExtArgs> | null;
};
