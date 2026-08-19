import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsDateString,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import type { AuthContext } from '../auth/auth-context';
import { CurrentAuth } from '../auth/current-auth.decorator';
import { RequirePermissions } from '../auth/require-permissions.decorator';
import { PERMISSIONS } from '../permissions/catalog';
import { PermissionHoldersService } from '../permissions/permission-holders.service';
import { EvalsService, type TemplateNodeInput } from './evals.service';

class TemplateOptionDto {
  @IsString()
  value!: string;

  @IsString()
  label!: string;
}

const SCORE_TYPES = [
  'SCALE_1_5',
  'PASS_FAIL',
  'TEXT',
  'SHORT_TEXT',
  'NUMBER',
  'OPTIONS',
  'MULTI_SELECT',
  'HEADING',
  'SIGNOFF',
] as const;

class TemplateItemDto {
  /** Ignored: position comes from the order items arrive in. */
  @IsOptional()
  @IsInt()
  order?: number;

  @IsString()
  prompt!: string;

  @IsIn(SCORE_TYPES)
  scoreType!: (typeof SCORE_TYPES)[number];

  /** Required for OPTIONS and MULTI_SELECT; ignored otherwise. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateOptionDto)
  options?: TemplateOptionDto[];

  @IsOptional()
  @IsNumber()
  minValue?: number | null;

  @IsOptional()
  @IsNumber()
  maxValue?: number | null;

  @IsOptional()
  @IsString()
  unit?: string | null;

  /** Checklist items only: who may sign this line, instead of the checklist's set. */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  signoffCredentialTypeIds?: number[];

  /** Whether the trainee fills this in when requesting the evaluation. */
  @IsOptional()
  @IsIn(['NONE', 'OPTIONAL', 'REQUIRED'])
  traineeInput?: 'NONE' | 'OPTIONAL' | 'REQUIRED';
}

/** A node is a loose item or a group of them; the two share one ordering. */
class TemplateNodeDto {
  @IsIn(['ITEM', 'GROUP'])
  kind!: 'ITEM' | 'GROUP';

  // ITEM
  @IsOptional()
  @IsString()
  prompt?: string;

  @IsOptional()
  @IsIn(SCORE_TYPES)
  scoreType?: (typeof SCORE_TYPES)[number];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateOptionDto)
  options?: TemplateOptionDto[];

  @IsOptional()
  @IsNumber()
  minValue?: number | null;

  @IsOptional()
  @IsNumber()
  maxValue?: number | null;

  @IsOptional()
  @IsString()
  unit?: string | null;

  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  signoffCredentialTypeIds?: number[];

  @IsOptional()
  @IsIn(['NONE', 'OPTIONAL', 'REQUIRED'])
  traineeInput?: 'NONE' | 'OPTIONAL' | 'REQUIRED';

  // GROUP
  @IsOptional()
  @IsString()
  heading?: string;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items?: TemplateItemDto[];
}

class CreateTemplateDto {
  @IsString()
  name!: string;

  @IsOptional()
  @IsIn(['EVALUATION', 'CHECKLIST'])
  kind?: 'EVALUATION' | 'CHECKLIST';

  /** Required for a checklist: the credentials that let someone sign it. */
  @IsOptional()
  @IsArray()
  @IsInt({ each: true })
  signoffCredentialTypeIds?: number[];

  /** The current shape. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateNodeDto)
  nodes?: TemplateNodeDto[];

  /** Older shape: a flat list, every item loose. Still accepted. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => TemplateItemDto)
  items?: TemplateItemDto[];
}

class CreateEvalDto {
  @IsInt()
  subjectId!: number;

  @IsInt()
  templateId!: number;

  @IsOptional()
  @IsDateString()
  evalDate?: string;
}

class RequestEvalDto {
  @IsInt()
  templateId!: number;

  /** The trainer being asked. */
  @IsInt()
  evaluatorId!: number;

  @IsOptional()
  @IsDateString()
  evalDate?: string;

  /** Whatever the trainee was invited to fill in. */
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreDto)
  scores?: ScoreDto[];
}

class TraineeScoresDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreDto)
  scores!: ScoreDto[];
}

class ScoreDto {
  @IsInt()
  itemId!: number;

  @IsOptional()
  @IsInt()
  scaleValue?: number | null;

  @IsOptional()
  @IsBoolean()
  passed?: boolean | null;

  @IsOptional()
  @IsString()
  textValue?: string | null;

  @IsOptional()
  @IsString()
  optionValue?: string | null;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  optionValues?: string[] | null;

  @IsOptional()
  @IsNumber()
  numberValue?: number | null;
}

class SaveScoresDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ScoreDto)
  scores!: ScoreDto[];

  @IsOptional()
  @IsBoolean()
  submit?: boolean;

  @IsOptional()
  @IsString()
  notes?: string;

  /** The evaluator's overall verdict. */
  @IsOptional()
  @IsIn(['NEEDS_IMPROVEMENT', 'PASSED'])
  outcome?: 'NEEDS_IMPROVEMENT' | 'PASSED';

  @IsOptional()
  @IsBoolean()
  readyForPromotion?: boolean;
}

function requireMember(auth: AuthContext): number {
  if (auth.kind !== 'member') {
    throw new ForbiddenException('This endpoint requires a member session');
  }
  return auth.memberId;
}

@Controller({ path: 'evals', version: '1' })
export class EvalsController {
  constructor(
    private readonly evals: EvalsService,
    private readonly permissionHolders: PermissionHoldersService,
  ) {}

  @Get('templates')
  templates(@Query('kind') kind?: string) {
    return this.evals.listTemplates({
      kind: kind === 'CHECKLIST' || kind === 'EVALUATION' ? kind : undefined,
    });
  }

  @Post('templates')
  @RequirePermissions(PERMISSIONS.EVALS_MANAGE_FORMS)
  createTemplate(@Body() body: CreateTemplateDto) {
    return this.evals.createTemplate({
      name: body.name,
      kind: body.kind,
      signoffCredentialTypeIds: body.signoffCredentialTypeIds,
      nodes: body.nodes as TemplateNodeInput[] | undefined,
      items: body.items,
    });
  }

  @Put('templates/:id')
  @RequirePermissions(PERMISSIONS.EVALS_MANAGE_FORMS)
  reviseTemplate(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: CreateTemplateDto,
  ) {
    return this.evals.reviseTemplate(id, {
      signoffCredentialTypeIds: body.signoffCredentialTypeIds,
      nodes: body.nodes as TemplateNodeInput[] | undefined,
      items: body.items,
    });
  }

  @Post()
  @RequirePermissions(PERMISSIONS.EVALS_WRITE)
  create(@CurrentAuth() auth: AuthContext, @Body() body: CreateEvalDto) {
    return this.evals.create(
      requireMember(auth),
      body.subjectId,
      body.templateId,
      body.evalDate,
    );
  }

  /**
   * A trainee asking a trainer for an evaluation.
   *
   * No permission: asking to be assessed is not a privilege. Filling it in
   * still needs evals:write, which is why the trainers offered are the people
   * who hold it.
   */
  @Post('request')
  requestEval(@CurrentAuth() auth: AuthContext, @Body() body: RequestEvalDto) {
    return this.evals.request(requireMember(auth), {
      templateId: body.templateId,
      evaluatorId: body.evaluatorId,
      evalDate: body.evalDate,
      scores: body.scores,
    });
  }

  /**
   * Who can be asked, per form.
   *
   * Answered for every published form at once: the picker changes as the
   * trainee chooses a form, and one round trip beats a request per change.
   */
  @Get('evaluators')
  async evaluators() {
    const templates = await this.evals.listTemplates({ kind: 'EVALUATION' });
    return Promise.all(
      templates.map(async (template) => ({
        templateId: template.id,
        ...(await this.evals.eligibleEvaluators(template.id)),
      })),
    );
  }

  /** The trainee correcting their own answers, while it is still a draft. */
  @Put(':id/trainee-scores')
  saveTraineeScores(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: TraineeScoresDto,
  ) {
    return this.evals.saveTraineeScores(requireMember(auth), id, body.scores);
  }

  @Get('mine')
  mine(@CurrentAuth() auth: AuthContext) {
    return this.evals.listFor(requireMember(auth));
  }

  @Get('about/:memberId')
  @RequirePermissions(PERMISSIONS.EVALS_READ_ALL)
  about(@Param('memberId', ParseIntPipe) memberId: number) {
    return this.evals.listAbout(memberId);
  }

  @Get(':id')
  get(@CurrentAuth() auth: AuthContext, @Param('id', ParseIntPipe) id: number) {
    return this.evals.get(
      id,
      requireMember(auth),
      auth.permissions.has(PERMISSIONS.EVALS_READ_ALL),
    );
  }

  @Put(':id/scores')
  @RequirePermissions(PERMISSIONS.EVALS_WRITE)
  saveScores(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
    @Body() body: SaveScoresDto,
  ) {
    return this.evals.saveScores(requireMember(auth), id, body.scores, {
      submit: body.submit,
      notes: body.notes,
      outcome: body.outcome,
      readyForPromotion: body.readyForPromotion,
    });
  }

  /**
   * Left undecorated on purpose: which permission applies depends on whether
   * the evaluation is still a draft, so the service decides and answers 403.
   */
  @Delete(':id')
  remove(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.evals.remove(auth, id);
  }

  @Post(':id/sign')
  sign(
    @CurrentAuth() auth: AuthContext,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.evals.sign(requireMember(auth), id);
  }
}
