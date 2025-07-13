import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CreateValidationPipe } from './common/pipes/validation-pipe/create-validation-pipe.pipe';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: ['https://libevilaqua-frontend-angular-production.up.railway.app', 'biblioteca.bevilaqua.dev.br']
  })
  /**
   * Pipes:
   * CreateValidationPipe: Altera dados do class-validator
   */
  app.useGlobalPipes(
    new CreateValidationPipe()
  );
  const port: number = +process.env['PORT'];
  await app.listen(port);
}
bootstrap();
