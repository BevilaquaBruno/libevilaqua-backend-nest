import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';

@Catch()
export class I18nFilter<T> implements ExceptionFilter {
  constructor(private readonly i18n: I18nService) {}

  async catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const status = exception.getStatus?.() ?? HttpStatus.INTERNAL_SERVER_ERROR;

    const ctxI18n = I18nContext.current();
    const lang = ctxI18n?.lang || 'pt';

    let message = exception.message;

    // Se for uma chave i18n (ex: 'user.email.does_not_exists')
    if (typeof message === 'string' && message.includes('.')) {
      try {
        message = await this.i18n.translate(message, { lang });
      } catch {
        // fallback se a chave não existir
      }
    }

    response.status(status).json({
      statusCode: status,
      message,
    });
  }
}
