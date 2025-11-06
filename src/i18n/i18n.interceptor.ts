import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { from, mergeMap, Observable } from 'rxjs';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService<any>) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      mergeMap((data) =>
        from(
          (async () => {
            const ctx = I18nContext.current();
            const lang = ctx?.lang || 'pt';

            if (data?.message && typeof data.message === 'string' && data.message.includes('.')) {
              try {
                data.message = await this.i18n.translate(data.message as never, { lang });
              } catch {
                // mantém a chave original caso a tradução falhe
              }
            }

            return data;
          })(),
        ),
      ),
    );
  }
}

