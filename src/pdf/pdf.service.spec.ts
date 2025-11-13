import { Test, TestingModule } from '@nestjs/testing';
import { PdfService } from './pdf.service';
import { mockPdfService } from './mocks/pdf.service.mock';

describe('PdfService', () => {
  let service: PdfService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PdfService, useValue: mockPdfService }],
    }).compile();

    service = module.get<PdfService>(PdfService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
