import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { INestApplication, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  setupSwagger(app);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  await app.listen(3000);
}

function setupSwagger(app: INestApplication) {
  const config = new DocumentBuilder()
    .setTitle('API Documentation')
    .setDescription('The backend API description')
    .setVersion('1.0')
    .addTag('docs')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

}
bootstrap();
