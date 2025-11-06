import { I18nInterceptor } from './i18n.interceptor';
import { I18nService } from 'nestjs-i18n';
import { CallHandler, ExecutionContext } from '@nestjs/common';
import { of } from 'rxjs';
import { lastValueFrom } from 'rxjs';

describe('I18nInterceptor', () => {
  let interceptor: I18nInterceptor;
  let i18nService: I18nService;

  beforeEach(() => {
    // Mocka o I18nService
    i18nService = {
      translate: jest.fn().mockResolvedValue('Mensagem traduzida'),
    } as any;

    interceptor = new I18nInterceptor(i18nService);
  });

  it('should be defined', () => {
    expect(interceptor).toBeDefined();
  });

  it('should translate message if it contains a translation key', async () => {
    const context = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => of({ message: 'user.email.invalid' }),
    };

    const result$ = interceptor.intercept(context, next);

    // Espera o resultado da stream
    const result = await lastValueFrom(result$);

    // O interceptor retorna uma Promise dentro do map(), então precisamos resolvê-la:
    const resolved = await result;

    expect(i18nService.translate).toHaveBeenCalledWith('user.email.invalid' as never, expect.any(Object));
    expect(resolved.message).toBe('Mensagem traduzida');
  });

  it('should not translate message if it is not a key', async () => {
    const context = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => of({ message: 'Mensagem normal' }),
    };

    const result$ = interceptor.intercept(context, next);
    const result = await lastValueFrom(result$);
    const resolved = await result;

    expect(i18nService.translate).not.toHaveBeenCalled();
    expect(resolved.message).toBe('Mensagem normal');
  });

  it('should handle data without message property', async () => {
    const context = {} as ExecutionContext;
    const next: CallHandler = {
      handle: () => of({ data: 'anything' }),
    };

    const result$ = interceptor.intercept(context, next);
    const result = await lastValueFrom(result$);
    const resolved = await result;

    expect(resolved.data).toBe('anything');
    expect(i18nService.translate).not.toHaveBeenCalled();
  });
});
