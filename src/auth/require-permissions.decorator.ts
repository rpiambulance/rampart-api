import { SetMetadata } from '@nestjs/common';
import { Permission } from '../permissions/catalog';

export const PERMISSIONS_KEY = 'requiredPermissions';

/** Requires the caller (member or API token) to hold ALL listed permissions. */
export const RequirePermissions = (...permissions: Permission[]) =>
  SetMetadata(PERMISSIONS_KEY, permissions);
