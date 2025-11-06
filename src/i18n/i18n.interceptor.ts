import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from '@nestjs/common';
import { I18nContext, I18nService } from 'nestjs-i18n';
import { map, Observable } from 'rxjs';

@Injectable()
export class I18nInterceptor implements NestInterceptor {
  constructor(private readonly i18n: I18nService<any>) { }
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map(async (data) => {
        const ctx = I18nContext.current();
        const lang = ctx?.lang || 'pt';

        // Se a resposta tiver "message" e for uma chave de tradução
        if (data?.message && typeof data.message === 'string' && data.message.includes('.')) {
          try {
            data.message = this.i18n.translate((data.message as never), { lang });
          } catch {
            // Se a tradução não for encontrada, deixa a chave original
          }
        }

        return data;
      }),
    );
  }
}

