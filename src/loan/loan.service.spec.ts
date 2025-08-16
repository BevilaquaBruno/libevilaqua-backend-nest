import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { mockLoanService } from './mocks/loan.service.mock';

describe('LoanService', () => {
  let service: LoanService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: LoanService, useValue: mockLoanService }
      ],
    }).compile();

    service = module.get<LoanService>(LoanService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
