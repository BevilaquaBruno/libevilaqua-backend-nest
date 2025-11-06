import { I18nFilter } from './i18n.filter';
import { I18nService } from 'nestjs-i18n';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('I18nFilter', () => {
  let filter: I18nFilter<any>;
  let i18nService: I18nService;

  beforeEach(() => {
    // cria um mock do I18nService
    i18nService = {
      translate: jest.fn().mockResolvedValue('Mensagem traduzida'),
    } as any;

    filter = new I18nFilter(i18nService);
  });

  it('should be defined', () => {
    expect(filter).toBeDefined();
  });

  it('should translate i18n key message', async () => {
    const exception = new HttpException('user.email.invalid', HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
      }),
    } as any;

    await filter.catch(exception, host);

    expect(i18nService.translate).toHaveBeenCalledWith('user.email.invalid', expect.any(Object));
  });

  it('should not translate non-i18n message', async () => {
    const exception = new HttpException('Already translated message', HttpStatus.BAD_REQUEST);

    const host = {
      switchToHttp: () => ({
        getResponse: () => ({
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        }),
      }),
    } as any;

    await filter.catch(exception, host);

    expect(i18nService.translate).not.toHaveBeenCalled();
  });
});
