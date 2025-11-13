// src/common/pipes/create-validation.pipe.ts
import {
  HttpException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';
import { I18nService, I18nContext } from 'nestjs-i18n';

@Injectable()
export class CreateValidationPipe extends ValidationPipe {
  /**
   * Este Pipe é usado no main.ts para o class-validator
   * importante:
   * stopAtFirstError faz parar no primeiro erro, para evitar uma cadeia de mensagens para o usuário
   * exceptionFactory cria um padrão só de retorno, para igualar aos Throw new HttpException, só retorna uma mensagem, por isso o [0]
   *
   * Padrão definido:
   * {
   *  statusCode: 400,
   *  message: 'Mensagem de erro'
   * }
   */
  constructor(private readonly i18n: I18nService) {
    super({
      dismissDefaultMessages: true,
      stopAtFirstError: true,
      exceptionFactory: async (errors: ValidationError[]) => {
        const error = errors[0];
        const constraint = Object.values(error.constraints || {})[0];

        // Pega o contexto da tradução (do pipe e module)
        const ctx = I18nContext.current();

        // obtém o idioma, se disponível, ou pt
        const lang = ctx?.lang || 'pt';

        // se a mensagem for uma chave i18n, traduz
        let message = constraint;

        if (typeof constraint === 'string' && constraint.includes('.')) {
          message = await this.i18n.translate(constraint, { lang });
        }

        return new HttpException(message, HttpStatus.BAD_REQUEST);
      },
    });
  }
}
