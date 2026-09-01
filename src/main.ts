import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

/**
 * How many proxies sit in front of this service.
 *
 * Wrong in either direction is a real cost: too low and the log records the
 * proxy, too high and a caller can claim any address they like. Defaults to
 * one, which is the deployment as it stands — Traefik and nothing else.
 */
function trustedProxyHops(): number {
  const configured = Number(process.env.TRUSTED_PROXY_HOPS);
  return Number.isInteger(configured) && configured >= 0 ? configured : 1;
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    // Slack signs the bytes it sent, so the bytes have to survive parsing:
    // a re-serialized object does not produce the same signature.
    rawBody: true,
  });
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  // Slash commands and interactions arrive form-encoded.
  app.useBodyParser('urlencoded', { extended: true });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(',') ?? true,
    credentials: true,
  });
  app.enableShutdownHooks();

  // Behind a reverse proxy, so the socket peer is the proxy and never the
  // caller. Without this Express reports the proxy's address as req.ip —
  // which lands in the access log, and, more quietly, is what the rate
  // limiter buckets on: every client sharing one bucket means one noisy
  // caller can throttle the whole agency.
  //
  // A hop count rather than `true`: trusting the whole chain lets any caller
  // forge their own address by sending an X-Forwarded-For of their choosing,
  // because Express would believe the leftmost entry. Counting from the
  // right instead means only the proxies actually in front of this are
  // trusted, and anything a client prepends is ignored. One is Traefik
  // alone; raise it to two if Cloudflare or another proxy sits in front.
  app.set('trust proxy', trustedProxyHops());

  // OpenAPI docs at /docs (JSON at /docs-json). Disable with SWAGGER_ENABLED=false.
  if (process.env.SWAGGER_ENABLED !== 'false') {
    const config = new DocumentBuilder()
      .setTitle('Rampart API')
      .setDescription(
        'RPI Ambulance member portal API. Authenticate with a Keycloak OIDC ' +
          'access token (members) or an admin-issued rpa_ API token (machine ' +
          'clients) — both as `Authorization: Bearer <token>`. API tokens carry ' +
          'an explicit permission subset; see docs/EXTERNAL_API.md in the repo ' +
          'for the permission each endpoint group requires.',
      )
      .setVersion('1')
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
        'keycloak',
      )
      .addBearerAuth(
        { type: 'http', scheme: 'bearer', bearerFormat: 'rpa_ token' },
        'api-token',
      )
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3001);
}
void bootstrap();
