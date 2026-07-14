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
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthGuard = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const crypto_1 = require("crypto");
const jose_1 = require("jose");
const prisma_service_1 = require("../prisma/prisma.service");
const public_decorator_1 = require("./public.decorator");
const API_TOKEN_PREFIX = 'rpa_';
let AuthGuard = class AuthGuard {
    config;
    prisma;
    reflector;
    jwks;
    constructor(config, prisma, reflector) {
        this.config = config;
        this.prisma = prisma;
        this.reflector = reflector;
    }
    async canActivate(context) {
        const isPublic = this.reflector.getAllAndOverride(public_decorator_1.IS_PUBLIC_KEY, [
            context.getHandler(),
            context.getClass(),
        ]);
        if (isPublic)
            return true;
        const request = context.switchToHttp().getRequest();
        const header = request.headers['authorization'];
        if (!header?.startsWith('Bearer ')) {
            throw new common_1.UnauthorizedException('Missing bearer token');
        }
        const token = header.slice('Bearer '.length);
        request.auth = token.startsWith(API_TOKEN_PREFIX)
            ? await this.authenticateApiToken(token)
            : await this.authenticateKeycloakJwt(token);
        return true;
    }
    async authenticateKeycloakJwt(token) {
        const issuer = this.config.getOrThrow('KEYCLOAK_ISSUER');
        const audience = this.config.get('KEYCLOAK_AUDIENCE');
        this.jwks ??= (0, jose_1.createRemoteJWKSet)(new URL(`${issuer}/protocol/openid-connect/certs`));
        let subject;
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, this.jwks, {
                issuer,
                ...(audience ? { audience } : {}),
            });
            subject = payload.sub;
        }
        catch {
            throw new common_1.UnauthorizedException('Invalid token');
        }
        const member = await this.prisma.member.findUnique({
            where: { keycloakSubject: subject },
            include: {
                roles: {
                    include: { role: { include: { permissions: true } } },
                },
            },
        });
        if (!member) {
            throw new common_1.ForbiddenException({
                code: 'NO_MEMBER_RECORD',
                message: 'Your login is valid but no member record is linked to it. Contact an officer.',
            });
        }
        if (!member.active) {
            throw new common_1.ForbiddenException({
                code: 'INACTIVE_MEMBER',
                message: 'Your membership is inactive. Contact an officer to become active again.',
            });
        }
        const today = new Date();
        const permissions = new Set();
        for (const assignment of member.roles) {
            const started = assignment.startDate <= today;
            const notEnded = !assignment.endDate || assignment.endDate >= today;
            if (started && notEnded) {
                for (const p of assignment.role.permissions) {
                    permissions.add(p.permission);
                }
            }
        }
        return {
            kind: 'member',
            memberId: member.id,
            permissions,
        };
    }
    async authenticateApiToken(token) {
        const tokenHash = (0, crypto_1.createHash)('sha256').update(token).digest('hex');
        const apiToken = await this.prisma.apiToken.findUnique({
            where: { tokenHash },
        });
        const now = new Date();
        if (!apiToken ||
            apiToken.revokedAt ||
            (apiToken.expiresAt && apiToken.expiresAt < now)) {
            throw new common_1.UnauthorizedException('Invalid API token');
        }
        await this.prisma.apiToken.update({
            where: { id: apiToken.id },
            data: { lastUsedAt: now },
        });
        return {
            kind: 'api-token',
            apiTokenId: apiToken.id,
            permissions: new Set(apiToken.permissions),
        };
    }
};
exports.AuthGuard = AuthGuard;
exports.AuthGuard = AuthGuard = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        prisma_service_1.PrismaService,
        core_1.Reflector])
], AuthGuard);
//# sourceMappingURL=auth.guard.js.map