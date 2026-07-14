import { Permission } from '../permissions/catalog';
export declare const PERMISSIONS_KEY = "requiredPermissions";
export declare const RequirePermissions: (...permissions: Permission[]) => import("@nestjs/common").CustomDecorator<string>;
