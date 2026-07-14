import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { AuthContext } from './auth-context';

/** Injects the authenticated caller's AuthContext into a handler parameter. */
export const CurrentAuth = createParamDecorator(
  (_: unknown, context: ExecutionContext): AuthContext =>
    context.switchToHttp().getRequest().auth,
);
