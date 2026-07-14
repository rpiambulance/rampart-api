"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EvalsController = void 0;
const common_1 = require("@nestjs/common");
const class_transformer_1 = require("class-transformer");
const class_validator_1 = require("class-validator");
const current_auth_decorator_1 = require("../auth/current-auth.decorator");
const require_permissions_decorator_1 = require("../auth/require-permissions.decorator");
const catalog_1 = require("../permissions/catalog");
const evals_service_1 = require("./evals.service");
class TemplateItemDto {
    order;
    prompt;
    scoreType;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], TemplateItemDto.prototype, "order", void 0);
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], TemplateItemDto.prototype, "prompt", void 0);
__decorate([
    (0, class_validator_1.IsIn)(['SCALE_1_5', 'PASS_FAIL', 'TEXT']),
    __metadata("design:type", String)
], TemplateItemDto.prototype, "scoreType", void 0);
class CreateTemplateDto {
    name;
    items;
}
__decorate([
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], CreateTemplateDto.prototype, "name", void 0);
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => TemplateItemDto),
    __metadata("design:type", Array)
], CreateTemplateDto.prototype, "items", void 0);
class CreateEvalDto {
    subjectId;
    templateId;
    shiftDate;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEvalDto.prototype, "subjectId", void 0);
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], CreateEvalDto.prototype, "templateId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsDateString)(),
    __metadata("design:type", String)
], CreateEvalDto.prototype, "shiftDate", void 0);
class ScoreDto {
    itemId;
    scaleValue;
    passed;
    textValue;
}
__decorate([
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Number)
], ScoreDto.prototype, "itemId", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsInt)(),
    __metadata("design:type", Object)
], ScoreDto.prototype, "scaleValue", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Object)
], ScoreDto.prototype, "passed", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", Object)
], ScoreDto.prototype, "textValue", void 0);
class SaveScoresDto {
    scores;
    submit;
    notes;
}
__decorate([
    (0, class_validator_1.IsArray)(),
    (0, class_validator_1.ValidateNested)({ each: true }),
    (0, class_transformer_1.Type)(() => ScoreDto),
    __metadata("design:type", Array)
], SaveScoresDto.prototype, "scores", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsBoolean)(),
    __metadata("design:type", Boolean)
], SaveScoresDto.prototype, "submit", void 0);
__decorate([
    (0, class_validator_1.IsOptional)(),
    (0, class_validator_1.IsString)(),
    __metadata("design:type", String)
], SaveScoresDto.prototype, "notes", void 0);
function requireMember(auth) {
    if (auth.kind !== 'member') {
        throw new common_1.ForbiddenException('This endpoint requires a member session');
    }
    return auth.memberId;
}
let EvalsController = class EvalsController {
    evals;
    constructor(evals) {
        this.evals = evals;
    }
    templates() {
        return this.evals.listTemplates();
    }
    createTemplate(body) {
        return this.evals.createTemplate(body.name, body.items);
    }
    reviseTemplate(id, body) {
        return this.evals.reviseTemplate(id, body.items);
    }
    create(auth, body) {
        return this.evals.create(requireMember(auth), body.subjectId, body.templateId, body.shiftDate);
    }
    mine(auth) {
        return this.evals.listFor(requireMember(auth));
    }
    about(memberId) {
        return this.evals.listAbout(memberId);
    }
    get(auth, id) {
        return this.evals.get(id, requireMember(auth), auth.permissions.has(catalog_1.PERMISSIONS.EVALS_READ_ALL));
    }
    saveScores(auth, id, body) {
        return this.evals.saveScores(requireMember(auth), id, body.scores, {
            submit: body.submit,
            notes: body.notes,
        });
    }
    sign(auth, id) {
        return this.evals.sign(requireMember(auth), id);
    }
};
exports.EvalsController = EvalsController;
__decorate([
    (0, common_1.Get)('templates'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "templates", null);
__decorate([
    (0, common_1.Post)('templates'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVALS_MANAGE_FORMS),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateTemplateDto]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "createTemplate", null);
__decorate([
    (0, common_1.Put)('templates/:id'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVALS_MANAGE_FORMS),
    __param(0, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, CreateTemplateDto]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "reviseTemplate", null);
__decorate([
    (0, common_1.Post)(),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVALS_WRITE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, CreateEvalDto]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "create", null);
__decorate([
    (0, common_1.Get)('mine'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "mine", null);
__decorate([
    (0, common_1.Get)('about/:memberId'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVALS_READ_ALL),
    __param(0, (0, common_1.Param)('memberId', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "about", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "get", null);
__decorate([
    (0, common_1.Put)(':id/scores'),
    (0, require_permissions_decorator_1.RequirePermissions)(catalog_1.PERMISSIONS.EVALS_WRITE),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number, SaveScoresDto]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "saveScores", null);
__decorate([
    (0, common_1.Post)(':id/sign'),
    __param(0, (0, current_auth_decorator_1.CurrentAuth)()),
    __param(1, (0, common_1.Param)('id', common_1.ParseIntPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Number]),
    __metadata("design:returntype", void 0)
], EvalsController.prototype, "sign", null);
exports.EvalsController = EvalsController = __decorate([
    (0, common_1.Controller)({ path: 'evals', version: '1' }),
    __metadata("design:paramtypes", [evals_service_1.EvalsService])
], EvalsController);
//# sourceMappingURL=evals.controller.js.map