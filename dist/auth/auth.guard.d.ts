import { CanActivate, ExecutionContext } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { PrismaService } from '../prisma/prisma.service';
export declare class AuthGuard implements CanActivate {
    private readonly config;
    private readonly prisma;
    private readonly reflector;
    private jwks?;
    constructor(config: ConfigService, prisma: PrismaService, reflector: Reflector);
    canActivate(context: ExecutionContext): Promise<boolean>;
    private authenticateKeycloakJwt;
    private authenticateApiToken;
}
