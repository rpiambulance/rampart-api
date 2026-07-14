import type { AuthContext } from '../auth/auth-context';
import { AuditService } from '../audit/audit.service';
import { PrismaService } from '../prisma/prisma.service';
declare class RoleDto {
    name: string;
    description?: string;
    isOfficer?: boolean;
    permissions: string[];
}
declare class AssignDto {
    memberId: number;
    startDate: string;
    endDate?: string;
}
export declare class RolesController {
    private readonly prisma;
    private readonly audit;
    constructor(prisma: PrismaService, audit: AuditService);
    permissionCatalog(): import("../permissions/catalog").Permission[];
    list(): import("../generated/prisma/internal/prismaNamespace").PrismaPromise<({
        permissions: {
            roleId: number;
            permission: string;
        }[];
        members: ({
            member: {
                id: number;
                firstName: string;
                lastName: string;
            };
        } & {
            id: number;
            roleId: number;
            memberId: number;
            startDate: Date;
            endDate: Date | null;
        })[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isOfficer: boolean;
    })[]>;
    create(auth: AuthContext, body: RoleDto): Promise<{
        permissions: {
            roleId: number;
            permission: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isOfficer: boolean;
    }>;
    update(auth: AuthContext, id: number, body: RoleDto): Promise<{
        permissions: {
            roleId: number;
            permission: string;
        }[];
    } & {
        id: number;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        isOfficer: boolean;
    }>;
    assign(auth: AuthContext, roleId: number, body: AssignDto): Promise<{
        id: number;
        roleId: number;
        memberId: number;
        startDate: Date;
        endDate: Date | null;
    }>;
    unassign(auth: AuthContext, assignmentId: number): Promise<{
        ok: boolean;
    }>;
}
export {};
