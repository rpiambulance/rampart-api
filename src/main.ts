import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableVersioning({ type: VersioningType.URI, defaultVersion: '1' });
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
  app.enableCors({
    origin: process.env.WEB_ORIGIN?.split(',') ?? true,
    credentials: true,
  });
  app.enableShutdownHooks();

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
