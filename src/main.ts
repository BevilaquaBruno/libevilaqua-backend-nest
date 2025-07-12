import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CreateValidationPipe } from './common/pipes/validation-pipe/create-validation-pipe.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /**
   * Pipes:
   * CreateValidationPipe: Altera dados do class-validator
   */
  app.useGlobalPipes(
    new CreateValidationPipe()
  );
  const port: number = +process.env['MODE'];
  await app.listen(port);
}
bootstrap();
