import {
  Body,
  Controller,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  IsBoolean,
  IsDateString,
  IsEmail,
  IsOptional,
  IsString,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { MembersService } from './members.service';

class SelfEditDto {
  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  cellPhone?: string;

  @IsOptional()
  @IsString()
  homePhone?: string;

  @IsOptional()
  @IsString()
  localAddress?: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;
}

class CreateMemberDto {
  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @IsEmail()
  email!: string;

  @IsOptional()
  @IsDateString()
  dob?: string;

  @IsOptional()
  @IsEmail()
  personalEmail?: string;

  @IsOptional()
  @IsString()
  cellPhone?: string;

  @IsOptional()
  @IsString()
  localAddress?: string;

  @IsOptional()
  @IsString()
  homeAddress?: string;

  @IsOptional()
  @IsString()
  rcsId?: string;

  @IsOptional()
  @IsString()
  rin?: string;

  @IsOptional()
  @IsString()
  keycloakSubject?: string;
}

class UpdateMemberDto extends CreateMemberDto {
  @IsOptional()
  @IsString()
  declare firstName: string;

  @IsOptional()
  @IsString()
  declare lastName: string;

  @IsOptional()
  @IsEmail()
  declare email: string;

  @IsOptional()
  @IsBoolean()
  active?: boolean;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

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
    return this.members.get(requireMember(auth));
  }

  @Patch('me')
  editSelf(@CurrentAuth() auth: AuthContext, @Body() body: SelfEditDto) {
    return this.members.update(requireMember(auth), body);
  }

  @Get(':id')
  @RequirePermissions(PERMISSIONS.MEMBERS_READ)
  get(@Param('id', ParseIntPipe) id: number) {
    return this.members.get(id);
  }

  @Post()
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  create(@CurrentAuth() auth: AuthContext, @Body() body: CreateMemberDto) {
    return this.members.create(auth, body);
  }

  @Patch(':id')
  @RequirePermissions(PERMISSIONS.MEMBERS_WRITE)
  update(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateMemberDto,
  ) {
    if (body.active === false && !auth.permissions.has(PERMISSIONS.MEMBERS_DEACTIVATE)) {
      throw new ForbiddenException('Missing permission: members:deactivate');
    }
    return this.members.update(id, body, auth);
  }
}
