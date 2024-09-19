import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { NestExpressApplication } from '@nestjs/platform-express';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { join } from 'path';

const swaggerDocument = new DocumentBuilder()
  .setTitle('cart REST api part')
  .setDescription('the REST api part for cart product assessment')
  .setVersion('1.0.0')
  .addTag('API')
  .build();

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: '*',
    credentials: true,
  });

  app.enableVersioning({
    type: VersioningType.URI,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
    }),
  );

  app.useStaticAssets(join(__dirname, '..', './uploads'));

  const document = SwaggerModule.createDocument(app, swaggerDocument);
  SwaggerModule.setup('/api', app, document);

  await app.listen(8080);
}
bootstrap();
