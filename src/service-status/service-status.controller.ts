import { Body, Controller, Get, Put } from '@nestjs/common';
import { IsBoolean, IsOptional, IsString } from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { ServiceStatusService } from './service-status.service';

class ServiceStatusDto {
  @IsBoolean()
  inService!: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}

@Controller({ path: 'service-status', version: '1' })
export class ServiceStatusController {
  constructor(private readonly status: ServiceStatusService) {}

  /** Readable by any member: it is on every page of the portal. */
  @Get()
  current() {
    return this.status.current();
  }

  @Put()
  @RequirePermissions(PERMISSIONS.SERVICE_STATUS)
  set(@CurrentAuth() auth: AuthContext, @Body() body: ServiceStatusDto) {
    return this.status.set(auth, body.inService, body.reason);
  }
}
