import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { PdfService } from '../pdf/pdf.service';
import { mockPdfService } from '../pdf/mocks/pdf.service.mock';

describe('ReportController', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [{ provide: PdfService, useValue: mockPdfService }],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
