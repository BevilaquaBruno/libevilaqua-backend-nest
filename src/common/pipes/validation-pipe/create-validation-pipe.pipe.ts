// src/common/pipes/create-validation.pipe.ts
import {
  BadRequestException,
  HttpStatus,
  Injectable,
  ValidationError,
  ValidationPipe,
} from '@nestjs/common';

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
  constructor() {
    super({
      dismissDefaultMessages: true,
      stopAtFirstError: true,
      exceptionFactory: (errors: ValidationError[]) => {
        return new BadRequestException({
          statusCode: HttpStatus.BAD_REQUEST,
          message: Object.values(errors[0].constraints || {})[0],
        });
      },
    });
  }
}
