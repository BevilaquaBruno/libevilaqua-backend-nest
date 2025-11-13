import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CreateValidationPipe } from './common/pipes/validation-pipe/create-validation-pipe.pipe';
import { I18nService } from 'nestjs-i18n';
import { I18nFilter } from './i18n/i18n.filter';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  /*
  app.enableCors({
    origin: [process.env['FRONT_END_URL']]
  });
  */

  const config = new DocumentBuilder()
    .setTitle(process.env['APP_NAME'])
    .setDescription('API for ' + process.env['APP_NAME'])
    .setVersion('1.0')
    .build();
  const documentFactory = () =>
    SwaggerModule.createDocument(app, config, {
      deepScanRoutes: true,
    });
  SwaggerModule.setup('api', app, documentFactory);
  // Cria o serviço i18n
  const i18n = app.get<I18nService<Record<string, unknown>>>(I18nService);
  /**
   * Pipes:
   * CreateValidationPipe: Altera dados do class-validator, recebe tradução
   */
  app.useGlobalPipes(new CreateValidationPipe(i18n));
  /**
   * Filters:
   * I18nFilter: Altera os dados das exceptions, recebe tradução
   */
  app.useGlobalFilters(new I18nFilter(i18n));

  const port: number = +process.env['PORT'];
  await app.listen(port);
}
bootstrap();
