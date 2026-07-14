import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type CertificationDocumentModel = runtime.Types.Result.DefaultSelection<Prisma.$CertificationDocumentPayload>;
export type AggregateCertificationDocument = {
    _count: CertificationDocumentCountAggregateOutputType | null;
    _avg: CertificationDocumentAvgAggregateOutputType | null;
    _sum: CertificationDocumentSumAggregateOutputType | null;
    _min: CertificationDocumentMinAggregateOutputType | null;
    _max: CertificationDocumentMaxAggregateOutputType | null;
};
export type CertificationDocumentAvgAggregateOutputType = {
    id: number | null;
    certificationId: number | null;
    sizeBytes: number | null;
};
export type CertificationDocumentSumAggregateOutputType = {
    id: number | null;
    certificationId: number | null;
    sizeBytes: number | null;
};
export type CertificationDocumentMinAggregateOutputType = {
    id: number | null;
    certificationId: number | null;
    storageKey: string | null;
    fileName: string | null;
    contentType: string | null;
    sizeBytes: number | null;
    uploadedAt: Date | null;
};
export type CertificationDocumentMaxAggregateOutputType = {
    id: number | null;
    certificationId: number | null;
    storageKey: string | null;
    fileName: string | null;
    contentType: string | null;
    sizeBytes: number | null;
    uploadedAt: Date | null;
};
export type CertificationDocumentCountAggregateOutputType = {
    id: number;
    certificationId: number;
    storageKey: number;
    fileName: number;
    contentType: number;
    sizeBytes: number;
    uploadedAt: number;
    _all: number;
};
export type CertificationDocumentAvgAggregateInputType = {
    id?: true;
    certificationId?: true;
    sizeBytes?: true;
};
export type CertificationDocumentSumAggregateInputType = {
    id?: true;
    certificationId?: true;
    sizeBytes?: true;
};
export type CertificationDocumentMinAggregateInputType = {
    id?: true;
    certificationId?: true;
    storageKey?: true;
    fileName?: true;
    contentType?: true;
    sizeBytes?: true;
    uploadedAt?: true;
};
export type CertificationDocumentMaxAggregateInputType = {
    id?: true;
    certificationId?: true;
    storageKey?: true;
    fileName?: true;
    contentType?: true;
    sizeBytes?: true;
    uploadedAt?: true;
};
export type CertificationDocumentCountAggregateInputType = {
    id?: true;
    certificationId?: true;
    storageKey?: true;
    fileName?: true;
    contentType?: true;
    sizeBytes?: true;
    uploadedAt?: true;
    _all?: true;
};
export type CertificationDocumentAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithRelationInput | Prisma.CertificationDocumentOrderByWithRelationInput[];
    cursor?: Prisma.CertificationDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | CertificationDocumentCountAggregateInputType;
    _avg?: CertificationDocumentAvgAggregateInputType;
    _sum?: CertificationDocumentSumAggregateInputType;
    _min?: CertificationDocumentMinAggregateInputType;
    _max?: CertificationDocumentMaxAggregateInputType;
};
export type GetCertificationDocumentAggregateType<T extends CertificationDocumentAggregateArgs> = {
    [P in keyof T & keyof AggregateCertificationDocument]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateCertificationDocument[P]> : Prisma.GetScalarType<T[P], AggregateCertificationDocument[P]>;
};
export type CertificationDocumentGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithAggregationInput | Prisma.CertificationDocumentOrderByWithAggregationInput[];
    by: Prisma.CertificationDocumentScalarFieldEnum[] | Prisma.CertificationDocumentScalarFieldEnum;
    having?: Prisma.CertificationDocumentScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: CertificationDocumentCountAggregateInputType | true;
    _avg?: CertificationDocumentAvgAggregateInputType;
    _sum?: CertificationDocumentSumAggregateInputType;
    _min?: CertificationDocumentMinAggregateInputType;
    _max?: CertificationDocumentMaxAggregateInputType;
};
export type CertificationDocumentGroupByOutputType = {
    id: number;
    certificationId: number;
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt: Date;
    _count: CertificationDocumentCountAggregateOutputType | null;
    _avg: CertificationDocumentAvgAggregateOutputType | null;
    _sum: CertificationDocumentSumAggregateOutputType | null;
    _min: CertificationDocumentMinAggregateOutputType | null;
    _max: CertificationDocumentMaxAggregateOutputType | null;
};
export type GetCertificationDocumentGroupByPayload<T extends CertificationDocumentGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<CertificationDocumentGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof CertificationDocumentGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], CertificationDocumentGroupByOutputType[P]> : Prisma.GetScalarType<T[P], CertificationDocumentGroupByOutputType[P]>;
}>>;
export type CertificationDocumentWhereInput = {
    AND?: Prisma.CertificationDocumentWhereInput | Prisma.CertificationDocumentWhereInput[];
    OR?: Prisma.CertificationDocumentWhereInput[];
    NOT?: Prisma.CertificationDocumentWhereInput | Prisma.CertificationDocumentWhereInput[];
    id?: Prisma.IntFilter<"CertificationDocument"> | number;
    certificationId?: Prisma.IntFilter<"CertificationDocument"> | number;
    storageKey?: Prisma.StringFilter<"CertificationDocument"> | string;
    fileName?: Prisma.StringFilter<"CertificationDocument"> | string;
    contentType?: Prisma.StringFilter<"CertificationDocument"> | string;
    sizeBytes?: Prisma.IntFilter<"CertificationDocument"> | number;
    uploadedAt?: Prisma.DateTimeFilter<"CertificationDocument"> | Date | string;
    certification?: Prisma.XOR<Prisma.MemberCertificationScalarRelationFilter, Prisma.MemberCertificationWhereInput>;
};
export type CertificationDocumentOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    contentType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    certification?: Prisma.MemberCertificationOrderByWithRelationInput;
};
export type CertificationDocumentWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.CertificationDocumentWhereInput | Prisma.CertificationDocumentWhereInput[];
    OR?: Prisma.CertificationDocumentWhereInput[];
    NOT?: Prisma.CertificationDocumentWhereInput | Prisma.CertificationDocumentWhereInput[];
    certificationId?: Prisma.IntFilter<"CertificationDocument"> | number;
    storageKey?: Prisma.StringFilter<"CertificationDocument"> | string;
    fileName?: Prisma.StringFilter<"CertificationDocument"> | string;
    contentType?: Prisma.StringFilter<"CertificationDocument"> | string;
    sizeBytes?: Prisma.IntFilter<"CertificationDocument"> | number;
    uploadedAt?: Prisma.DateTimeFilter<"CertificationDocument"> | Date | string;
    certification?: Prisma.XOR<Prisma.MemberCertificationScalarRelationFilter, Prisma.MemberCertificationWhereInput>;
}, "id">;
export type CertificationDocumentOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    contentType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
    _count?: Prisma.CertificationDocumentCountOrderByAggregateInput;
    _avg?: Prisma.CertificationDocumentAvgOrderByAggregateInput;
    _max?: Prisma.CertificationDocumentMaxOrderByAggregateInput;
    _min?: Prisma.CertificationDocumentMinOrderByAggregateInput;
    _sum?: Prisma.CertificationDocumentSumOrderByAggregateInput;
};
export type CertificationDocumentScalarWhereWithAggregatesInput = {
    AND?: Prisma.CertificationDocumentScalarWhereWithAggregatesInput | Prisma.CertificationDocumentScalarWhereWithAggregatesInput[];
    OR?: Prisma.CertificationDocumentScalarWhereWithAggregatesInput[];
    NOT?: Prisma.CertificationDocumentScalarWhereWithAggregatesInput | Prisma.CertificationDocumentScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"CertificationDocument"> | number;
    certificationId?: Prisma.IntWithAggregatesFilter<"CertificationDocument"> | number;
    storageKey?: Prisma.StringWithAggregatesFilter<"CertificationDocument"> | string;
    fileName?: Prisma.StringWithAggregatesFilter<"CertificationDocument"> | string;
    contentType?: Prisma.StringWithAggregatesFilter<"CertificationDocument"> | string;
    sizeBytes?: Prisma.IntWithAggregatesFilter<"CertificationDocument"> | number;
    uploadedAt?: Prisma.DateTimeWithAggregatesFilter<"CertificationDocument"> | Date | string;
};
export type CertificationDocumentCreateInput = {
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
    certification: Prisma.MemberCertificationCreateNestedOneWithoutDocumentsInput;
};
export type CertificationDocumentUncheckedCreateInput = {
    id?: number;
    certificationId: number;
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
};
export type CertificationDocumentUpdateInput = {
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    certification?: Prisma.MemberCertificationUpdateOneRequiredWithoutDocumentsNestedInput;
};
export type CertificationDocumentUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    certificationId?: Prisma.IntFieldUpdateOperationsInput | number;
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentCreateManyInput = {
    id?: number;
    certificationId: number;
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
};
export type CertificationDocumentUpdateManyMutationInput = {
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    certificationId?: Prisma.IntFieldUpdateOperationsInput | number;
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentListRelationFilter = {
    every?: Prisma.CertificationDocumentWhereInput;
    some?: Prisma.CertificationDocumentWhereInput;
    none?: Prisma.CertificationDocumentWhereInput;
};
export type CertificationDocumentOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type CertificationDocumentCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    contentType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
};
export type CertificationDocumentAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
};
export type CertificationDocumentMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    contentType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
};
export type CertificationDocumentMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    storageKey?: Prisma.SortOrder;
    fileName?: Prisma.SortOrder;
    contentType?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
    uploadedAt?: Prisma.SortOrder;
};
export type CertificationDocumentSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    certificationId?: Prisma.SortOrder;
    sizeBytes?: Prisma.SortOrder;
};
export type CertificationDocumentCreateNestedManyWithoutCertificationInput = {
    create?: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput> | Prisma.CertificationDocumentCreateWithoutCertificationInput[] | Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput[];
    connectOrCreate?: Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput | Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput[];
    createMany?: Prisma.CertificationDocumentCreateManyCertificationInputEnvelope;
    connect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
};
export type CertificationDocumentUncheckedCreateNestedManyWithoutCertificationInput = {
    create?: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput> | Prisma.CertificationDocumentCreateWithoutCertificationInput[] | Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput[];
    connectOrCreate?: Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput | Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput[];
    createMany?: Prisma.CertificationDocumentCreateManyCertificationInputEnvelope;
    connect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
};
export type CertificationDocumentUpdateManyWithoutCertificationNestedInput = {
    create?: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput> | Prisma.CertificationDocumentCreateWithoutCertificationInput[] | Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput[];
    connectOrCreate?: Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput | Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput[];
    upsert?: Prisma.CertificationDocumentUpsertWithWhereUniqueWithoutCertificationInput | Prisma.CertificationDocumentUpsertWithWhereUniqueWithoutCertificationInput[];
    createMany?: Prisma.CertificationDocumentCreateManyCertificationInputEnvelope;
    set?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    disconnect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    delete?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    connect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    update?: Prisma.CertificationDocumentUpdateWithWhereUniqueWithoutCertificationInput | Prisma.CertificationDocumentUpdateWithWhereUniqueWithoutCertificationInput[];
    updateMany?: Prisma.CertificationDocumentUpdateManyWithWhereWithoutCertificationInput | Prisma.CertificationDocumentUpdateManyWithWhereWithoutCertificationInput[];
    deleteMany?: Prisma.CertificationDocumentScalarWhereInput | Prisma.CertificationDocumentScalarWhereInput[];
};
export type CertificationDocumentUncheckedUpdateManyWithoutCertificationNestedInput = {
    create?: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput> | Prisma.CertificationDocumentCreateWithoutCertificationInput[] | Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput[];
    connectOrCreate?: Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput | Prisma.CertificationDocumentCreateOrConnectWithoutCertificationInput[];
    upsert?: Prisma.CertificationDocumentUpsertWithWhereUniqueWithoutCertificationInput | Prisma.CertificationDocumentUpsertWithWhereUniqueWithoutCertificationInput[];
    createMany?: Prisma.CertificationDocumentCreateManyCertificationInputEnvelope;
    set?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    disconnect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    delete?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    connect?: Prisma.CertificationDocumentWhereUniqueInput | Prisma.CertificationDocumentWhereUniqueInput[];
    update?: Prisma.CertificationDocumentUpdateWithWhereUniqueWithoutCertificationInput | Prisma.CertificationDocumentUpdateWithWhereUniqueWithoutCertificationInput[];
    updateMany?: Prisma.CertificationDocumentUpdateManyWithWhereWithoutCertificationInput | Prisma.CertificationDocumentUpdateManyWithWhereWithoutCertificationInput[];
    deleteMany?: Prisma.CertificationDocumentScalarWhereInput | Prisma.CertificationDocumentScalarWhereInput[];
};
export type CertificationDocumentCreateWithoutCertificationInput = {
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
};
export type CertificationDocumentUncheckedCreateWithoutCertificationInput = {
    id?: number;
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
};
export type CertificationDocumentCreateOrConnectWithoutCertificationInput = {
    where: Prisma.CertificationDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput>;
};
export type CertificationDocumentCreateManyCertificationInputEnvelope = {
    data: Prisma.CertificationDocumentCreateManyCertificationInput | Prisma.CertificationDocumentCreateManyCertificationInput[];
    skipDuplicates?: boolean;
};
export type CertificationDocumentUpsertWithWhereUniqueWithoutCertificationInput = {
    where: Prisma.CertificationDocumentWhereUniqueInput;
    update: Prisma.XOR<Prisma.CertificationDocumentUpdateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedUpdateWithoutCertificationInput>;
    create: Prisma.XOR<Prisma.CertificationDocumentCreateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedCreateWithoutCertificationInput>;
};
export type CertificationDocumentUpdateWithWhereUniqueWithoutCertificationInput = {
    where: Prisma.CertificationDocumentWhereUniqueInput;
    data: Prisma.XOR<Prisma.CertificationDocumentUpdateWithoutCertificationInput, Prisma.CertificationDocumentUncheckedUpdateWithoutCertificationInput>;
};
export type CertificationDocumentUpdateManyWithWhereWithoutCertificationInput = {
    where: Prisma.CertificationDocumentScalarWhereInput;
    data: Prisma.XOR<Prisma.CertificationDocumentUpdateManyMutationInput, Prisma.CertificationDocumentUncheckedUpdateManyWithoutCertificationInput>;
};
export type CertificationDocumentScalarWhereInput = {
    AND?: Prisma.CertificationDocumentScalarWhereInput | Prisma.CertificationDocumentScalarWhereInput[];
    OR?: Prisma.CertificationDocumentScalarWhereInput[];
    NOT?: Prisma.CertificationDocumentScalarWhereInput | Prisma.CertificationDocumentScalarWhereInput[];
    id?: Prisma.IntFilter<"CertificationDocument"> | number;
    certificationId?: Prisma.IntFilter<"CertificationDocument"> | number;
    storageKey?: Prisma.StringFilter<"CertificationDocument"> | string;
    fileName?: Prisma.StringFilter<"CertificationDocument"> | string;
    contentType?: Prisma.StringFilter<"CertificationDocument"> | string;
    sizeBytes?: Prisma.IntFilter<"CertificationDocument"> | number;
    uploadedAt?: Prisma.DateTimeFilter<"CertificationDocument"> | Date | string;
};
export type CertificationDocumentCreateManyCertificationInput = {
    id?: number;
    storageKey: string;
    fileName: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt?: Date | string;
};
export type CertificationDocumentUpdateWithoutCertificationInput = {
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentUncheckedUpdateWithoutCertificationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentUncheckedUpdateManyWithoutCertificationInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    storageKey?: Prisma.StringFieldUpdateOperationsInput | string;
    fileName?: Prisma.StringFieldUpdateOperationsInput | string;
    contentType?: Prisma.StringFieldUpdateOperationsInput | string;
    sizeBytes?: Prisma.IntFieldUpdateOperationsInput | number;
    uploadedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type CertificationDocumentSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    certificationId?: boolean;
    storageKey?: boolean;
    fileName?: boolean;
    contentType?: boolean;
    sizeBytes?: boolean;
    uploadedAt?: boolean;
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificationDocument"]>;
export type CertificationDocumentSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    certificationId?: boolean;
    storageKey?: boolean;
    fileName?: boolean;
    contentType?: boolean;
    sizeBytes?: boolean;
    uploadedAt?: boolean;
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificationDocument"]>;
export type CertificationDocumentSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    certificationId?: boolean;
    storageKey?: boolean;
    fileName?: boolean;
    contentType?: boolean;
    sizeBytes?: boolean;
    uploadedAt?: boolean;
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["certificationDocument"]>;
export type CertificationDocumentSelectScalar = {
    id?: boolean;
    certificationId?: boolean;
    storageKey?: boolean;
    fileName?: boolean;
    contentType?: boolean;
    sizeBytes?: boolean;
    uploadedAt?: boolean;
};
export type CertificationDocumentOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "certificationId" | "storageKey" | "fileName" | "contentType" | "sizeBytes" | "uploadedAt", ExtArgs["result"]["certificationDocument"]>;
export type CertificationDocumentInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
};
export type CertificationDocumentIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
};
export type CertificationDocumentIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    certification?: boolean | Prisma.MemberCertificationDefaultArgs<ExtArgs>;
};
export type $CertificationDocumentPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "CertificationDocument";
    objects: {
        certification: Prisma.$MemberCertificationPayload<ExtArgs>;
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        certificationId: number;
        storageKey: string;
        fileName: string;
        contentType: string;
        sizeBytes: number;
        uploadedAt: Date;
    }, ExtArgs["result"]["certificationDocument"]>;
    composites: {};
};
export type CertificationDocumentGetPayload<S extends boolean | null | undefined | CertificationDocumentDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload, S>;
export type CertificationDocumentCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<CertificationDocumentFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: CertificationDocumentCountAggregateInputType | true;
};
export interface CertificationDocumentDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['CertificationDocument'];
        meta: {
            name: 'CertificationDocument';
        };
    };
    findUnique<T extends CertificationDocumentFindUniqueArgs>(args: Prisma.SelectSubset<T, CertificationDocumentFindUniqueArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends CertificationDocumentFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, CertificationDocumentFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends CertificationDocumentFindFirstArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentFindFirstArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends CertificationDocumentFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends CertificationDocumentFindManyArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends CertificationDocumentCreateArgs>(args: Prisma.SelectSubset<T, CertificationDocumentCreateArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends CertificationDocumentCreateManyArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends CertificationDocumentCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends CertificationDocumentDeleteArgs>(args: Prisma.SelectSubset<T, CertificationDocumentDeleteArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends CertificationDocumentUpdateArgs>(args: Prisma.SelectSubset<T, CertificationDocumentUpdateArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends CertificationDocumentDeleteManyArgs>(args?: Prisma.SelectSubset<T, CertificationDocumentDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends CertificationDocumentUpdateManyArgs>(args: Prisma.SelectSubset<T, CertificationDocumentUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends CertificationDocumentUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, CertificationDocumentUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends CertificationDocumentUpsertArgs>(args: Prisma.SelectSubset<T, CertificationDocumentUpsertArgs<ExtArgs>>): Prisma.Prisma__CertificationDocumentClient<runtime.Types.Result.GetResult<Prisma.$CertificationDocumentPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends CertificationDocumentCountArgs>(args?: Prisma.Subset<T, CertificationDocumentCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], CertificationDocumentCountAggregateOutputType> : number>;
    aggregate<T extends CertificationDocumentAggregateArgs>(args: Prisma.Subset<T, CertificationDocumentAggregateArgs>): Prisma.PrismaPromise<GetCertificationDocumentAggregateType<T>>;
    groupBy<T extends CertificationDocumentGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: CertificationDocumentGroupByArgs['orderBy'];
    } : {
        orderBy?: CertificationDocumentGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, CertificationDocumentGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetCertificationDocumentGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: CertificationDocumentFieldRefs;
}
export interface Prisma__CertificationDocumentClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    certification<T extends Prisma.MemberCertificationDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.MemberCertificationDefaultArgs<ExtArgs>>): Prisma.Prisma__MemberCertificationClient<runtime.Types.Result.GetResult<Prisma.$MemberCertificationPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface CertificationDocumentFieldRefs {
    readonly id: Prisma.FieldRef<"CertificationDocument", 'Int'>;
    readonly certificationId: Prisma.FieldRef<"CertificationDocument", 'Int'>;
    readonly storageKey: Prisma.FieldRef<"CertificationDocument", 'String'>;
    readonly fileName: Prisma.FieldRef<"CertificationDocument", 'String'>;
    readonly contentType: Prisma.FieldRef<"CertificationDocument", 'String'>;
    readonly sizeBytes: Prisma.FieldRef<"CertificationDocument", 'Int'>;
    readonly uploadedAt: Prisma.FieldRef<"CertificationDocument", 'DateTime'>;
}
export type CertificationDocumentFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where: Prisma.CertificationDocumentWhereUniqueInput;
};
export type CertificationDocumentFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where: Prisma.CertificationDocumentWhereUniqueInput;
};
export type CertificationDocumentFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithRelationInput | Prisma.CertificationDocumentOrderByWithRelationInput[];
    cursor?: Prisma.CertificationDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationDocumentScalarFieldEnum | Prisma.CertificationDocumentScalarFieldEnum[];
};
export type CertificationDocumentFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithRelationInput | Prisma.CertificationDocumentOrderByWithRelationInput[];
    cursor?: Prisma.CertificationDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationDocumentScalarFieldEnum | Prisma.CertificationDocumentScalarFieldEnum[];
};
export type CertificationDocumentFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where?: Prisma.CertificationDocumentWhereInput;
    orderBy?: Prisma.CertificationDocumentOrderByWithRelationInput | Prisma.CertificationDocumentOrderByWithRelationInput[];
    cursor?: Prisma.CertificationDocumentWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.CertificationDocumentScalarFieldEnum | Prisma.CertificationDocumentScalarFieldEnum[];
};
export type CertificationDocumentCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationDocumentCreateInput, Prisma.CertificationDocumentUncheckedCreateInput>;
};
export type CertificationDocumentCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.CertificationDocumentCreateManyInput | Prisma.CertificationDocumentCreateManyInput[];
    skipDuplicates?: boolean;
};
export type CertificationDocumentCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    data: Prisma.CertificationDocumentCreateManyInput | Prisma.CertificationDocumentCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.CertificationDocumentIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type CertificationDocumentUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationDocumentUpdateInput, Prisma.CertificationDocumentUncheckedUpdateInput>;
    where: Prisma.CertificationDocumentWhereUniqueInput;
};
export type CertificationDocumentUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.CertificationDocumentUpdateManyMutationInput, Prisma.CertificationDocumentUncheckedUpdateManyInput>;
    where?: Prisma.CertificationDocumentWhereInput;
    limit?: number;
};
export type CertificationDocumentUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.CertificationDocumentUpdateManyMutationInput, Prisma.CertificationDocumentUncheckedUpdateManyInput>;
    where?: Prisma.CertificationDocumentWhereInput;
    limit?: number;
    include?: Prisma.CertificationDocumentIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type CertificationDocumentUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where: Prisma.CertificationDocumentWhereUniqueInput;
    create: Prisma.XOR<Prisma.CertificationDocumentCreateInput, Prisma.CertificationDocumentUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.CertificationDocumentUpdateInput, Prisma.CertificationDocumentUncheckedUpdateInput>;
};
export type CertificationDocumentDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
    where: Prisma.CertificationDocumentWhereUniqueInput;
};
export type CertificationDocumentDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.CertificationDocumentWhereInput;
    limit?: number;
};
export type CertificationDocumentDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.CertificationDocumentSelect<ExtArgs> | null;
    omit?: Prisma.CertificationDocumentOmit<ExtArgs> | null;
    include?: Prisma.CertificationDocumentInclude<ExtArgs> | null;
};
