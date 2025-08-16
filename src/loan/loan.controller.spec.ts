import { Test, TestingModule } from '@nestjs/testing';
import { LoanController } from './loan.controller';
import { LoanService } from './loan.service';
import { mockLoanService } from './mocks/loan.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { BookService } from '../book/book.service';
import { mockBookService } from '../book/mocks/book.service.mock';
import { PersonService } from '../person/person.service';
import { mockPersonService } from '../person/mocks/person.service.mock';

describe('LoanController', () => {
  let controller: LoanController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LoanController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: LoanService, useValue: mockLoanService },
        { provide: BookService, useValue: mockBookService },
        { provide: PersonService, useValue: mockPersonService }
      ],
    }).compile();

    controller = module.get<LoanController>(LoanController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
