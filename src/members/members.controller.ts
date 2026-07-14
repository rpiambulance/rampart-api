import { Controller, Get, Param, ParseIntPipe, Query } from '@nestjs/common';
import { CurrentAuth } from '../auth/current-auth.decorator';
import type { AuthContext } from '../auth/auth-context';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { MembersService } from './members.service';

@Controller({ path: 'members', version: '1' })
export class MembersController {
  constructor(private readonly members: MembersService) {}

  @Get()
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  list(@Query('includeInactive') includeInactive?: string) {
    return this.members.list(includeInactive === 'true');
  }

  @Get('me')
  me(@CurrentAuth() auth: AuthContext) {
    if (auth.kind !== 'member') return null;
    return this.members.get(auth.memberId);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.members.get(id);
  }
}
