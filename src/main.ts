import { BadRequestException, HttpStatus, ValidationError, ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CreateValidationPipe } from './common/pipes/validation-pipe/create-validation-pipe.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: { origin: ['http://localhost:4200'] },
  });
  app.useGlobalPipes(
    new CreateValidationPipe()
  );
  await app.listen(3000);
}
bootstrap();
