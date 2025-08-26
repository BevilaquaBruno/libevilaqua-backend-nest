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
import { CreateLoanDto } from './dto/create-loan.dto';

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

  it('Should create a new loan', async () => {
    // Cria o dto
    const loanDto: CreateLoanDto = {
      description: 'Loan description',
      return_date: null,
      must_return_date: new Date('2025-01-02'),
      loan_date: new Date('2025-01-01'),
      bookId: 1,
      personId: 2
    }

    // Mocka o retorno
    mockLoanService.create.mockResolvedValue({
      id: 1,
      description: 'Loan description',
      return_date: null,
      must_return_date: new Date('2025-01-02'),
      loan_date: new Date('2025-01-01'),
      book: {
        id: 1,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil'
        },
        type: {
          id: 1,
          descrption: 'Type Test'
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test'
          },
          {
            id: 2,
            description: 'Tag Test 2'
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2'
          }
        ]
      },
      person: {
        id: 2,
        name: 'Bruno Fernando',
        cpf: '255.182.290-46',
        cep: '89700-055',
        state: 'SC',
        city: 'Concórdia',
        district: 'Centro',
        street: 'Rua Marechal Deodoro',
        number: '1280',
        obs: 'Observação aqui',
      }
    });
    mockBookService.findOne.mockResolvedValue({
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      genre: {
        id: 1,
        description: 'Genre test',
      },
      publisher: {
        id: 1,
        name: 'Publisher 1',
        country: 'Brazil'
      },
      type: {
        id: 1,
        descrption: 'Type Test'
      },
      tags: [
        {
          id: 1,
          description: 'Tag Test'
        },
        {
          id: 2,
          description: 'Tag Test 2'
        },
      ],
      authors: [
        {
          id: 1,
          name: 'New Author name',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
        },
        {
          id: 2,
          name: 'New Author name 2',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2'
        }
      ]
    });
    mockPersonService.findOne.mockResolvedValue({
      id: 2,
      name: 'Bruno Fernando',
      cpf: '255.182.290-46',
      cep: '89700-055',
      state: 'SC',
      city: 'Concórdia',
      district: 'Centro',
      street: 'Rua Marechal Deodoro',
      number: '1280',
      obs: 'Observação aqui',
    });
    mockLoanService.findLoanedBook.mockResolvedValue([[], 0]);

    const result = await controller.create(loanDto);

    expect(result).toEqual({
      id: 1,
      description: 'Loan description',
      return_date: null,
      must_return_date: new Date('2025-01-02'),
      loan_date: new Date('2025-01-01'),
      book: {
        id: 1,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil'
        },
        type: {
          id: 1,
          descrption: 'Type Test'
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test'
          },
          {
            id: 2,
            description: 'Tag Test 2'
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text'
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2'
          }
        ]
      },
      person: {
        id: 2,
        name: 'Bruno Fernando',
        cpf: '255.182.290-46',
        cep: '89700-055',
        state: 'SC',
        city: 'Concórdia',
        district: 'Centro',
        street: 'Rua Marechal Deodoro',
        number: '1280',
        obs: 'Observação aqui',
      }
    });
    expect(mockLoanService.create).toHaveBeenCalledWith(loanDto);
  });
});
