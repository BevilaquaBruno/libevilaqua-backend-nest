import { Test, TestingModule } from '@nestjs/testing';
import { MailService } from './mail.service';
import { mockMailService } from './mock/mail.service.mock';

describe('MailService', () => {
  let service: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    service = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
