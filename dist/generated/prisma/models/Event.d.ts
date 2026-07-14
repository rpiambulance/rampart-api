import type * as runtime from "@prisma/client/runtime/client";
import type * as Prisma from "../internal/prismaNamespace.js";
export type EventModel = runtime.Types.Result.DefaultSelection<Prisma.$EventPayload>;
export type AggregateEvent = {
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type EventAvgAggregateOutputType = {
    id: number | null;
    kindId: number | null;
    attendeeCap: number | null;
};
export type EventSumAggregateOutputType = {
    id: number | null;
    kindId: number | null;
    attendeeCap: number | null;
};
export type EventMinAggregateOutputType = {
    id: number | null;
    title: string | null;
    description: string | null;
    location: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    kindId: number | null;
    locked: boolean | null;
    attendeeCap: number | null;
    hidden: boolean | null;
    gcalEventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EventMaxAggregateOutputType = {
    id: number | null;
    title: string | null;
    description: string | null;
    location: string | null;
    startsAt: Date | null;
    endsAt: Date | null;
    kindId: number | null;
    locked: boolean | null;
    attendeeCap: number | null;
    hidden: boolean | null;
    gcalEventId: string | null;
    createdAt: Date | null;
    updatedAt: Date | null;
};
export type EventCountAggregateOutputType = {
    id: number;
    title: number;
    description: number;
    location: number;
    startsAt: number;
    endsAt: number;
    kindId: number;
    locked: number;
    attendeeCap: number;
    hidden: number;
    gcalEventId: number;
    createdAt: number;
    updatedAt: number;
    _all: number;
};
export type EventAvgAggregateInputType = {
    id?: true;
    kindId?: true;
    attendeeCap?: true;
};
export type EventSumAggregateInputType = {
    id?: true;
    kindId?: true;
    attendeeCap?: true;
};
export type EventMinAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    startsAt?: true;
    endsAt?: true;
    kindId?: true;
    locked?: true;
    attendeeCap?: true;
    hidden?: true;
    gcalEventId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EventMaxAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    startsAt?: true;
    endsAt?: true;
    kindId?: true;
    locked?: true;
    attendeeCap?: true;
    hidden?: true;
    gcalEventId?: true;
    createdAt?: true;
    updatedAt?: true;
};
export type EventCountAggregateInputType = {
    id?: true;
    title?: true;
    description?: true;
    location?: true;
    startsAt?: true;
    endsAt?: true;
    kindId?: true;
    locked?: true;
    attendeeCap?: true;
    hidden?: true;
    gcalEventId?: true;
    createdAt?: true;
    updatedAt?: true;
    _all?: true;
};
export type EventAggregateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    _count?: true | EventCountAggregateInputType;
    _avg?: EventAvgAggregateInputType;
    _sum?: EventSumAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type GetEventAggregateType<T extends EventAggregateArgs> = {
    [P in keyof T & keyof AggregateEvent]: P extends '_count' | 'count' ? T[P] extends true ? number : Prisma.GetScalarType<T[P], AggregateEvent[P]> : Prisma.GetScalarType<T[P], AggregateEvent[P]>;
};
export type EventGroupByArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithAggregationInput | Prisma.EventOrderByWithAggregationInput[];
    by: Prisma.EventScalarFieldEnum[] | Prisma.EventScalarFieldEnum;
    having?: Prisma.EventScalarWhereWithAggregatesInput;
    take?: number;
    skip?: number;
    _count?: EventCountAggregateInputType | true;
    _avg?: EventAvgAggregateInputType;
    _sum?: EventSumAggregateInputType;
    _min?: EventMinAggregateInputType;
    _max?: EventMaxAggregateInputType;
};
export type EventGroupByOutputType = {
    id: number;
    title: string;
    description: string | null;
    location: string | null;
    startsAt: Date;
    endsAt: Date;
    kindId: number;
    locked: boolean;
    attendeeCap: number | null;
    hidden: boolean;
    gcalEventId: string | null;
    createdAt: Date;
    updatedAt: Date;
    _count: EventCountAggregateOutputType | null;
    _avg: EventAvgAggregateOutputType | null;
    _sum: EventSumAggregateOutputType | null;
    _min: EventMinAggregateOutputType | null;
    _max: EventMaxAggregateOutputType | null;
};
export type GetEventGroupByPayload<T extends EventGroupByArgs> = Prisma.PrismaPromise<Array<Prisma.PickEnumerable<EventGroupByOutputType, T['by']> & {
    [P in ((keyof T) & (keyof EventGroupByOutputType))]: P extends '_count' ? T[P] extends boolean ? number : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]> : Prisma.GetScalarType<T[P], EventGroupByOutputType[P]>;
}>>;
export type EventWhereInput = {
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    id?: Prisma.IntFilter<"Event"> | number;
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    startsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    endsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    kindId?: Prisma.IntFilter<"Event"> | number;
    locked?: Prisma.BoolFilter<"Event"> | boolean;
    attendeeCap?: Prisma.IntNullableFilter<"Event"> | number | null;
    hidden?: Prisma.BoolFilter<"Event"> | boolean;
    gcalEventId?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    kind?: Prisma.XOR<Prisma.EventKindScalarRelationFilter, Prisma.EventKindWhereInput>;
    positions?: Prisma.EventPositionListRelationFilter;
    signups?: Prisma.EventSignupListRelationFilter;
};
export type EventOrderByWithRelationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    locked?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrderInput | Prisma.SortOrder;
    hidden?: Prisma.SortOrder;
    gcalEventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    kind?: Prisma.EventKindOrderByWithRelationInput;
    positions?: Prisma.EventPositionOrderByRelationAggregateInput;
    signups?: Prisma.EventSignupOrderByRelationAggregateInput;
};
export type EventWhereUniqueInput = Prisma.AtLeast<{
    id?: number;
    AND?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    OR?: Prisma.EventWhereInput[];
    NOT?: Prisma.EventWhereInput | Prisma.EventWhereInput[];
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    startsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    endsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    kindId?: Prisma.IntFilter<"Event"> | number;
    locked?: Prisma.BoolFilter<"Event"> | boolean;
    attendeeCap?: Prisma.IntNullableFilter<"Event"> | number | null;
    hidden?: Prisma.BoolFilter<"Event"> | boolean;
    gcalEventId?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    kind?: Prisma.XOR<Prisma.EventKindScalarRelationFilter, Prisma.EventKindWhereInput>;
    positions?: Prisma.EventPositionListRelationFilter;
    signups?: Prisma.EventSignupListRelationFilter;
}, "id">;
export type EventOrderByWithAggregationInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrderInput | Prisma.SortOrder;
    location?: Prisma.SortOrderInput | Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    locked?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrderInput | Prisma.SortOrder;
    hidden?: Prisma.SortOrder;
    gcalEventId?: Prisma.SortOrderInput | Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
    _count?: Prisma.EventCountOrderByAggregateInput;
    _avg?: Prisma.EventAvgOrderByAggregateInput;
    _max?: Prisma.EventMaxOrderByAggregateInput;
    _min?: Prisma.EventMinOrderByAggregateInput;
    _sum?: Prisma.EventSumOrderByAggregateInput;
};
export type EventScalarWhereWithAggregatesInput = {
    AND?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    OR?: Prisma.EventScalarWhereWithAggregatesInput[];
    NOT?: Prisma.EventScalarWhereWithAggregatesInput | Prisma.EventScalarWhereWithAggregatesInput[];
    id?: Prisma.IntWithAggregatesFilter<"Event"> | number;
    title?: Prisma.StringWithAggregatesFilter<"Event"> | string;
    description?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    location?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    startsAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
    endsAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
    kindId?: Prisma.IntWithAggregatesFilter<"Event"> | number;
    locked?: Prisma.BoolWithAggregatesFilter<"Event"> | boolean;
    attendeeCap?: Prisma.IntNullableWithAggregatesFilter<"Event"> | number | null;
    hidden?: Prisma.BoolWithAggregatesFilter<"Event"> | boolean;
    gcalEventId?: Prisma.StringNullableWithAggregatesFilter<"Event"> | string | null;
    createdAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
    updatedAt?: Prisma.DateTimeWithAggregatesFilter<"Event"> | Date | string;
};
export type EventCreateInput = {
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    kind: Prisma.EventKindCreateNestedOneWithoutEventsInput;
    positions?: Prisma.EventPositionCreateNestedManyWithoutEventInput;
    signups?: Prisma.EventSignupCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    kindId: number;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    positions?: Prisma.EventPositionUncheckedCreateNestedManyWithoutEventInput;
    signups?: Prisma.EventSignupUncheckedCreateNestedManyWithoutEventInput;
};
export type EventUpdateInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kind?: Prisma.EventKindUpdateOneRequiredWithoutEventsNestedInput;
    positions?: Prisma.EventPositionUpdateManyWithoutEventNestedInput;
    signups?: Prisma.EventSignupUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kindId?: Prisma.IntFieldUpdateOperationsInput | number;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    positions?: Prisma.EventPositionUncheckedUpdateManyWithoutEventNestedInput;
    signups?: Prisma.EventSignupUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateManyInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    kindId: number;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EventUpdateManyMutationInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventUncheckedUpdateManyInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kindId?: Prisma.IntFieldUpdateOperationsInput | number;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventListRelationFilter = {
    every?: Prisma.EventWhereInput;
    some?: Prisma.EventWhereInput;
    none?: Prisma.EventWhereInput;
};
export type EventOrderByRelationAggregateInput = {
    _count?: Prisma.SortOrder;
};
export type EventCountOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    locked?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrder;
    hidden?: Prisma.SortOrder;
    gcalEventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EventAvgOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrder;
};
export type EventMaxOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    locked?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrder;
    hidden?: Prisma.SortOrder;
    gcalEventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EventMinOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    title?: Prisma.SortOrder;
    description?: Prisma.SortOrder;
    location?: Prisma.SortOrder;
    startsAt?: Prisma.SortOrder;
    endsAt?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    locked?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrder;
    hidden?: Prisma.SortOrder;
    gcalEventId?: Prisma.SortOrder;
    createdAt?: Prisma.SortOrder;
    updatedAt?: Prisma.SortOrder;
};
export type EventSumOrderByAggregateInput = {
    id?: Prisma.SortOrder;
    kindId?: Prisma.SortOrder;
    attendeeCap?: Prisma.SortOrder;
};
export type EventScalarRelationFilter = {
    is?: Prisma.EventWhereInput;
    isNot?: Prisma.EventWhereInput;
};
export type EventCreateNestedManyWithoutKindInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput> | Prisma.EventCreateWithoutKindInput[] | Prisma.EventUncheckedCreateWithoutKindInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutKindInput | Prisma.EventCreateOrConnectWithoutKindInput[];
    createMany?: Prisma.EventCreateManyKindInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUncheckedCreateNestedManyWithoutKindInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput> | Prisma.EventCreateWithoutKindInput[] | Prisma.EventUncheckedCreateWithoutKindInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutKindInput | Prisma.EventCreateOrConnectWithoutKindInput[];
    createMany?: Prisma.EventCreateManyKindInputEnvelope;
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
};
export type EventUpdateManyWithoutKindNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput> | Prisma.EventCreateWithoutKindInput[] | Prisma.EventUncheckedCreateWithoutKindInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutKindInput | Prisma.EventCreateOrConnectWithoutKindInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutKindInput | Prisma.EventUpsertWithWhereUniqueWithoutKindInput[];
    createMany?: Prisma.EventCreateManyKindInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutKindInput | Prisma.EventUpdateWithWhereUniqueWithoutKindInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutKindInput | Prisma.EventUpdateManyWithWhereWithoutKindInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type EventUncheckedUpdateManyWithoutKindNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput> | Prisma.EventCreateWithoutKindInput[] | Prisma.EventUncheckedCreateWithoutKindInput[];
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutKindInput | Prisma.EventCreateOrConnectWithoutKindInput[];
    upsert?: Prisma.EventUpsertWithWhereUniqueWithoutKindInput | Prisma.EventUpsertWithWhereUniqueWithoutKindInput[];
    createMany?: Prisma.EventCreateManyKindInputEnvelope;
    set?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    disconnect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    delete?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    connect?: Prisma.EventWhereUniqueInput | Prisma.EventWhereUniqueInput[];
    update?: Prisma.EventUpdateWithWhereUniqueWithoutKindInput | Prisma.EventUpdateWithWhereUniqueWithoutKindInput[];
    updateMany?: Prisma.EventUpdateManyWithWhereWithoutKindInput | Prisma.EventUpdateManyWithWhereWithoutKindInput[];
    deleteMany?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
};
export type EventCreateNestedOneWithoutPositionsInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutPositionsInput, Prisma.EventUncheckedCreateWithoutPositionsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutPositionsInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutPositionsNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutPositionsInput, Prisma.EventUncheckedCreateWithoutPositionsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutPositionsInput;
    upsert?: Prisma.EventUpsertWithoutPositionsInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutPositionsInput, Prisma.EventUpdateWithoutPositionsInput>, Prisma.EventUncheckedUpdateWithoutPositionsInput>;
};
export type EventCreateNestedOneWithoutSignupsInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSignupsInput, Prisma.EventUncheckedCreateWithoutSignupsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSignupsInput;
    connect?: Prisma.EventWhereUniqueInput;
};
export type EventUpdateOneRequiredWithoutSignupsNestedInput = {
    create?: Prisma.XOR<Prisma.EventCreateWithoutSignupsInput, Prisma.EventUncheckedCreateWithoutSignupsInput>;
    connectOrCreate?: Prisma.EventCreateOrConnectWithoutSignupsInput;
    upsert?: Prisma.EventUpsertWithoutSignupsInput;
    connect?: Prisma.EventWhereUniqueInput;
    update?: Prisma.XOR<Prisma.XOR<Prisma.EventUpdateToOneWithWhereWithoutSignupsInput, Prisma.EventUpdateWithoutSignupsInput>, Prisma.EventUncheckedUpdateWithoutSignupsInput>;
};
export type EventCreateWithoutKindInput = {
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    positions?: Prisma.EventPositionCreateNestedManyWithoutEventInput;
    signups?: Prisma.EventSignupCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutKindInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    positions?: Prisma.EventPositionUncheckedCreateNestedManyWithoutEventInput;
    signups?: Prisma.EventSignupUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutKindInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput>;
};
export type EventCreateManyKindInputEnvelope = {
    data: Prisma.EventCreateManyKindInput | Prisma.EventCreateManyKindInput[];
    skipDuplicates?: boolean;
};
export type EventUpsertWithWhereUniqueWithoutKindInput = {
    where: Prisma.EventWhereUniqueInput;
    update: Prisma.XOR<Prisma.EventUpdateWithoutKindInput, Prisma.EventUncheckedUpdateWithoutKindInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutKindInput, Prisma.EventUncheckedCreateWithoutKindInput>;
};
export type EventUpdateWithWhereUniqueWithoutKindInput = {
    where: Prisma.EventWhereUniqueInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutKindInput, Prisma.EventUncheckedUpdateWithoutKindInput>;
};
export type EventUpdateManyWithWhereWithoutKindInput = {
    where: Prisma.EventScalarWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyWithoutKindInput>;
};
export type EventScalarWhereInput = {
    AND?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    OR?: Prisma.EventScalarWhereInput[];
    NOT?: Prisma.EventScalarWhereInput | Prisma.EventScalarWhereInput[];
    id?: Prisma.IntFilter<"Event"> | number;
    title?: Prisma.StringFilter<"Event"> | string;
    description?: Prisma.StringNullableFilter<"Event"> | string | null;
    location?: Prisma.StringNullableFilter<"Event"> | string | null;
    startsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    endsAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    kindId?: Prisma.IntFilter<"Event"> | number;
    locked?: Prisma.BoolFilter<"Event"> | boolean;
    attendeeCap?: Prisma.IntNullableFilter<"Event"> | number | null;
    hidden?: Prisma.BoolFilter<"Event"> | boolean;
    gcalEventId?: Prisma.StringNullableFilter<"Event"> | string | null;
    createdAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
    updatedAt?: Prisma.DateTimeFilter<"Event"> | Date | string;
};
export type EventCreateWithoutPositionsInput = {
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    kind: Prisma.EventKindCreateNestedOneWithoutEventsInput;
    signups?: Prisma.EventSignupCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutPositionsInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    kindId: number;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    signups?: Prisma.EventSignupUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutPositionsInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutPositionsInput, Prisma.EventUncheckedCreateWithoutPositionsInput>;
};
export type EventUpsertWithoutPositionsInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutPositionsInput, Prisma.EventUncheckedUpdateWithoutPositionsInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutPositionsInput, Prisma.EventUncheckedCreateWithoutPositionsInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutPositionsInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutPositionsInput, Prisma.EventUncheckedUpdateWithoutPositionsInput>;
};
export type EventUpdateWithoutPositionsInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kind?: Prisma.EventKindUpdateOneRequiredWithoutEventsNestedInput;
    signups?: Prisma.EventSignupUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutPositionsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kindId?: Prisma.IntFieldUpdateOperationsInput | number;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    signups?: Prisma.EventSignupUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateWithoutSignupsInput = {
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    kind: Prisma.EventKindCreateNestedOneWithoutEventsInput;
    positions?: Prisma.EventPositionCreateNestedManyWithoutEventInput;
};
export type EventUncheckedCreateWithoutSignupsInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    kindId: number;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
    positions?: Prisma.EventPositionUncheckedCreateNestedManyWithoutEventInput;
};
export type EventCreateOrConnectWithoutSignupsInput = {
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateWithoutSignupsInput, Prisma.EventUncheckedCreateWithoutSignupsInput>;
};
export type EventUpsertWithoutSignupsInput = {
    update: Prisma.XOR<Prisma.EventUpdateWithoutSignupsInput, Prisma.EventUncheckedUpdateWithoutSignupsInput>;
    create: Prisma.XOR<Prisma.EventCreateWithoutSignupsInput, Prisma.EventUncheckedCreateWithoutSignupsInput>;
    where?: Prisma.EventWhereInput;
};
export type EventUpdateToOneWithWhereWithoutSignupsInput = {
    where?: Prisma.EventWhereInput;
    data: Prisma.XOR<Prisma.EventUpdateWithoutSignupsInput, Prisma.EventUncheckedUpdateWithoutSignupsInput>;
};
export type EventUpdateWithoutSignupsInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kind?: Prisma.EventKindUpdateOneRequiredWithoutEventsNestedInput;
    positions?: Prisma.EventPositionUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutSignupsInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    kindId?: Prisma.IntFieldUpdateOperationsInput | number;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    positions?: Prisma.EventPositionUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventCreateManyKindInput = {
    id?: number;
    title: string;
    description?: string | null;
    location?: string | null;
    startsAt: Date | string;
    endsAt: Date | string;
    locked?: boolean;
    attendeeCap?: number | null;
    hidden?: boolean;
    gcalEventId?: string | null;
    createdAt?: Date | string;
    updatedAt?: Date | string;
};
export type EventUpdateWithoutKindInput = {
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    positions?: Prisma.EventPositionUpdateManyWithoutEventNestedInput;
    signups?: Prisma.EventSignupUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateWithoutKindInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    positions?: Prisma.EventPositionUncheckedUpdateManyWithoutEventNestedInput;
    signups?: Prisma.EventSignupUncheckedUpdateManyWithoutEventNestedInput;
};
export type EventUncheckedUpdateManyWithoutKindInput = {
    id?: Prisma.IntFieldUpdateOperationsInput | number;
    title?: Prisma.StringFieldUpdateOperationsInput | string;
    description?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    location?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    startsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    endsAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    locked?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    attendeeCap?: Prisma.NullableIntFieldUpdateOperationsInput | number | null;
    hidden?: Prisma.BoolFieldUpdateOperationsInput | boolean;
    gcalEventId?: Prisma.NullableStringFieldUpdateOperationsInput | string | null;
    createdAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
    updatedAt?: Prisma.DateTimeFieldUpdateOperationsInput | Date | string;
};
export type EventCountOutputType = {
    positions: number;
    signups: number;
};
export type EventCountOutputTypeSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    positions?: boolean | EventCountOutputTypeCountPositionsArgs;
    signups?: boolean | EventCountOutputTypeCountSignupsArgs;
};
export type EventCountOutputTypeDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventCountOutputTypeSelect<ExtArgs> | null;
};
export type EventCountOutputTypeCountPositionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventPositionWhereInput;
};
export type EventCountOutputTypeCountSignupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventSignupWhereInput;
};
export type EventSelect<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    kindId?: boolean;
    locked?: boolean;
    attendeeCap?: boolean;
    hidden?: boolean;
    gcalEventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
    positions?: boolean | Prisma.Event$positionsArgs<ExtArgs>;
    signups?: boolean | Prisma.Event$signupsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    kindId?: boolean;
    locked?: boolean;
    attendeeCap?: boolean;
    hidden?: boolean;
    gcalEventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetSelect<{
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    kindId?: boolean;
    locked?: boolean;
    attendeeCap?: boolean;
    hidden?: boolean;
    gcalEventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
}, ExtArgs["result"]["event"]>;
export type EventSelectScalar = {
    id?: boolean;
    title?: boolean;
    description?: boolean;
    location?: boolean;
    startsAt?: boolean;
    endsAt?: boolean;
    kindId?: boolean;
    locked?: boolean;
    attendeeCap?: boolean;
    hidden?: boolean;
    gcalEventId?: boolean;
    createdAt?: boolean;
    updatedAt?: boolean;
};
export type EventOmit<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = runtime.Types.Extensions.GetOmit<"id" | "title" | "description" | "location" | "startsAt" | "endsAt" | "kindId" | "locked" | "attendeeCap" | "hidden" | "gcalEventId" | "createdAt" | "updatedAt", ExtArgs["result"]["event"]>;
export type EventInclude<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
    positions?: boolean | Prisma.Event$positionsArgs<ExtArgs>;
    signups?: boolean | Prisma.Event$signupsArgs<ExtArgs>;
    _count?: boolean | Prisma.EventCountOutputTypeDefaultArgs<ExtArgs>;
};
export type EventIncludeCreateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
};
export type EventIncludeUpdateManyAndReturn<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    kind?: boolean | Prisma.EventKindDefaultArgs<ExtArgs>;
};
export type $EventPayload<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    name: "Event";
    objects: {
        kind: Prisma.$EventKindPayload<ExtArgs>;
        positions: Prisma.$EventPositionPayload<ExtArgs>[];
        signups: Prisma.$EventSignupPayload<ExtArgs>[];
    };
    scalars: runtime.Types.Extensions.GetPayloadResult<{
        id: number;
        title: string;
        description: string | null;
        location: string | null;
        startsAt: Date;
        endsAt: Date;
        kindId: number;
        locked: boolean;
        attendeeCap: number | null;
        hidden: boolean;
        gcalEventId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }, ExtArgs["result"]["event"]>;
    composites: {};
};
export type EventGetPayload<S extends boolean | null | undefined | EventDefaultArgs> = runtime.Types.Result.GetResult<Prisma.$EventPayload, S>;
export type EventCountArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = Omit<EventFindManyArgs, 'select' | 'include' | 'distinct' | 'omit'> & {
    select?: EventCountAggregateInputType | true;
};
export interface EventDelegate<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> {
    [K: symbol]: {
        types: Prisma.TypeMap<ExtArgs>['model']['Event'];
        meta: {
            name: 'Event';
        };
    };
    findUnique<T extends EventFindUniqueArgs>(args: Prisma.SelectSubset<T, EventFindUniqueArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUnique", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findUniqueOrThrow<T extends EventFindUniqueOrThrowArgs>(args: Prisma.SelectSubset<T, EventFindUniqueOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findFirst<T extends EventFindFirstArgs>(args?: Prisma.SelectSubset<T, EventFindFirstArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirst", GlobalOmitOptions> | null, null, ExtArgs, GlobalOmitOptions>;
    findFirstOrThrow<T extends EventFindFirstOrThrowArgs>(args?: Prisma.SelectSubset<T, EventFindFirstOrThrowArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findFirstOrThrow", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    findMany<T extends EventFindManyArgs>(args?: Prisma.SelectSubset<T, EventFindManyArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "findMany", GlobalOmitOptions>>;
    create<T extends EventCreateArgs>(args: Prisma.SelectSubset<T, EventCreateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "create", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    createMany<T extends EventCreateManyArgs>(args?: Prisma.SelectSubset<T, EventCreateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    createManyAndReturn<T extends EventCreateManyAndReturnArgs>(args?: Prisma.SelectSubset<T, EventCreateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "createManyAndReturn", GlobalOmitOptions>>;
    delete<T extends EventDeleteArgs>(args: Prisma.SelectSubset<T, EventDeleteArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "delete", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    update<T extends EventUpdateArgs>(args: Prisma.SelectSubset<T, EventUpdateArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "update", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    deleteMany<T extends EventDeleteManyArgs>(args?: Prisma.SelectSubset<T, EventDeleteManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateMany<T extends EventUpdateManyArgs>(args: Prisma.SelectSubset<T, EventUpdateManyArgs<ExtArgs>>): Prisma.PrismaPromise<Prisma.BatchPayload>;
    updateManyAndReturn<T extends EventUpdateManyAndReturnArgs>(args: Prisma.SelectSubset<T, EventUpdateManyAndReturnArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "updateManyAndReturn", GlobalOmitOptions>>;
    upsert<T extends EventUpsertArgs>(args: Prisma.SelectSubset<T, EventUpsertArgs<ExtArgs>>): Prisma.Prisma__EventClient<runtime.Types.Result.GetResult<Prisma.$EventPayload<ExtArgs>, T, "upsert", GlobalOmitOptions>, never, ExtArgs, GlobalOmitOptions>;
    count<T extends EventCountArgs>(args?: Prisma.Subset<T, EventCountArgs>): Prisma.PrismaPromise<T extends runtime.Types.Utils.Record<'select', any> ? T['select'] extends true ? number : Prisma.GetScalarType<T['select'], EventCountAggregateOutputType> : number>;
    aggregate<T extends EventAggregateArgs>(args: Prisma.Subset<T, EventAggregateArgs>): Prisma.PrismaPromise<GetEventAggregateType<T>>;
    groupBy<T extends EventGroupByArgs, HasSelectOrTake extends Prisma.Or<Prisma.Extends<'skip', Prisma.Keys<T>>, Prisma.Extends<'take', Prisma.Keys<T>>>, OrderByArg extends Prisma.True extends HasSelectOrTake ? {
        orderBy: EventGroupByArgs['orderBy'];
    } : {
        orderBy?: EventGroupByArgs['orderBy'];
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
    }[OrderFields]>(args: Prisma.SubsetIntersection<T, EventGroupByArgs, OrderByArg> & InputErrors): {} extends InputErrors ? GetEventGroupByPayload<T> : Prisma.PrismaPromise<InputErrors>;
    readonly fields: EventFieldRefs;
}
export interface Prisma__EventClient<T, Null = never, ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs, GlobalOmitOptions = {}> extends Prisma.PrismaPromise<T> {
    readonly [Symbol.toStringTag]: "PrismaPromise";
    kind<T extends Prisma.EventKindDefaultArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.EventKindDefaultArgs<ExtArgs>>): Prisma.Prisma__EventKindClient<runtime.Types.Result.GetResult<Prisma.$EventKindPayload<ExtArgs>, T, "findUniqueOrThrow", GlobalOmitOptions> | Null, Null, ExtArgs, GlobalOmitOptions>;
    positions<T extends Prisma.Event$positionsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$positionsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventPositionPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    signups<T extends Prisma.Event$signupsArgs<ExtArgs> = {}>(args?: Prisma.Subset<T, Prisma.Event$signupsArgs<ExtArgs>>): Prisma.PrismaPromise<runtime.Types.Result.GetResult<Prisma.$EventSignupPayload<ExtArgs>, T, "findMany", GlobalOmitOptions> | Null>;
    then<TResult1 = T, TResult2 = never>(onfulfilled?: ((value: T) => TResult1 | PromiseLike<TResult1>) | undefined | null, onrejected?: ((reason: any) => TResult2 | PromiseLike<TResult2>) | undefined | null): runtime.Types.Utils.JsPromise<TResult1 | TResult2>;
    catch<TResult = never>(onrejected?: ((reason: any) => TResult | PromiseLike<TResult>) | undefined | null): runtime.Types.Utils.JsPromise<T | TResult>;
    finally(onfinally?: (() => void) | undefined | null): runtime.Types.Utils.JsPromise<T>;
}
export interface EventFieldRefs {
    readonly id: Prisma.FieldRef<"Event", 'Int'>;
    readonly title: Prisma.FieldRef<"Event", 'String'>;
    readonly description: Prisma.FieldRef<"Event", 'String'>;
    readonly location: Prisma.FieldRef<"Event", 'String'>;
    readonly startsAt: Prisma.FieldRef<"Event", 'DateTime'>;
    readonly endsAt: Prisma.FieldRef<"Event", 'DateTime'>;
    readonly kindId: Prisma.FieldRef<"Event", 'Int'>;
    readonly locked: Prisma.FieldRef<"Event", 'Boolean'>;
    readonly attendeeCap: Prisma.FieldRef<"Event", 'Int'>;
    readonly hidden: Prisma.FieldRef<"Event", 'Boolean'>;
    readonly gcalEventId: Prisma.FieldRef<"Event", 'String'>;
    readonly createdAt: Prisma.FieldRef<"Event", 'DateTime'>;
    readonly updatedAt: Prisma.FieldRef<"Event", 'DateTime'>;
}
export type EventFindUniqueArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindUniqueOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventFindFirstArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindFirstOrThrowArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventFindManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where?: Prisma.EventWhereInput;
    orderBy?: Prisma.EventOrderByWithRelationInput | Prisma.EventOrderByWithRelationInput[];
    cursor?: Prisma.EventWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventScalarFieldEnum | Prisma.EventScalarFieldEnum[];
};
export type EventCreateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
};
export type EventCreateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
};
export type EventCreateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectCreateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.EventCreateManyInput | Prisma.EventCreateManyInput[];
    skipDuplicates?: boolean;
    include?: Prisma.EventIncludeCreateManyAndReturn<ExtArgs> | null;
};
export type EventUpdateArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
    where: Prisma.EventWhereUniqueInput;
};
export type EventUpdateManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type EventUpdateManyAndReturnArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelectUpdateManyAndReturn<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    data: Prisma.XOR<Prisma.EventUpdateManyMutationInput, Prisma.EventUncheckedUpdateManyInput>;
    where?: Prisma.EventWhereInput;
    limit?: number;
    include?: Prisma.EventIncludeUpdateManyAndReturn<ExtArgs> | null;
};
export type EventUpsertArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
    create: Prisma.XOR<Prisma.EventCreateInput, Prisma.EventUncheckedCreateInput>;
    update: Prisma.XOR<Prisma.EventUpdateInput, Prisma.EventUncheckedUpdateInput>;
};
export type EventDeleteArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
    where: Prisma.EventWhereUniqueInput;
};
export type EventDeleteManyArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    where?: Prisma.EventWhereInput;
    limit?: number;
};
export type Event$positionsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventPositionSelect<ExtArgs> | null;
    omit?: Prisma.EventPositionOmit<ExtArgs> | null;
    include?: Prisma.EventPositionInclude<ExtArgs> | null;
    where?: Prisma.EventPositionWhereInput;
    orderBy?: Prisma.EventPositionOrderByWithRelationInput | Prisma.EventPositionOrderByWithRelationInput[];
    cursor?: Prisma.EventPositionWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventPositionScalarFieldEnum | Prisma.EventPositionScalarFieldEnum[];
};
export type Event$signupsArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSignupSelect<ExtArgs> | null;
    omit?: Prisma.EventSignupOmit<ExtArgs> | null;
    include?: Prisma.EventSignupInclude<ExtArgs> | null;
    where?: Prisma.EventSignupWhereInput;
    orderBy?: Prisma.EventSignupOrderByWithRelationInput | Prisma.EventSignupOrderByWithRelationInput[];
    cursor?: Prisma.EventSignupWhereUniqueInput;
    take?: number;
    skip?: number;
    distinct?: Prisma.EventSignupScalarFieldEnum | Prisma.EventSignupScalarFieldEnum[];
};
export type EventDefaultArgs<ExtArgs extends runtime.Types.Extensions.InternalArgs = runtime.Types.Extensions.DefaultArgs> = {
    select?: Prisma.EventSelect<ExtArgs> | null;
    omit?: Prisma.EventOmit<ExtArgs> | null;
    include?: Prisma.EventInclude<ExtArgs> | null;
};
