import { CreateValidationPipe } from './create-validation-pipe.pipe';
import { I18nService } from 'nestjs-i18n';

describe('CreateValidationPipe', () => {
  let i18nService: I18nService;

  beforeEach(() => {
    // mock simples do I18nService
    i18nService = {
      translate: jest.fn().mockResolvedValue('Mensagem traduzida'),
    } as any;
  });

  it('should be defined', () => {
    const pipe = new CreateValidationPipe(i18nService);
    expect(pipe).toBeDefined();
  });
});
