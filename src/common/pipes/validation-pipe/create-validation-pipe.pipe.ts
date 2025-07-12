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
