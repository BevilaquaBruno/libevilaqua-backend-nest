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
import { FindLoanDto } from './dto/find-loan.dto';
import { UpdateLoanDto } from './dto/update-loan.dto';

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

  it('should return all loans', async () => {
    // Cria os mocks e coloca no retorno
    const loanList = [
      {
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
      },
      {
        id: 2,
        description: 'Loan description 2',
        return_date: null,
        must_return_date: new Date('2025-01-02'),
        loan_date: new Date('2025-01-01'),
        book: {
          id: 2,
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
          id: 3,
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
      }
    ];
    const loanQuantity = loanList.length;

    // insere os mocks
    mockLoanService.findAll.mockResolvedValue(loanList);
    mockLoanService.count.mockResolvedValue(loanQuantity);

    // Cria a paginação e requisita
    const findLoanDto: FindLoanDto = {
      limit: 2,
      page: 1,
      start_date: '',
      end_date: '',
      book: 0,
      person: 0,
      description: '',
      returned: false
    };

    const result = await controller.findAll(
      findLoanDto.start_date.toString(),
      findLoanDto.end_date.toString(),
      findLoanDto.book.toString(),
      findLoanDto.person.toString(),
      findLoanDto.description.toString(),
      findLoanDto.returned.toString(),
      findLoanDto.page.toString(),
      findLoanDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: loanList,
      count: loanQuantity
    });
    findLoanDto.page--;
    expect(mockLoanService.findAll).toHaveBeenCalledWith(findLoanDto);
  });

  it('Should return one loan', async () => {
    // Cria um mock
    const loan = {
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
    };

    // Insere os mocks nos serviços
    mockLoanService.findOne.mockResolvedValue(loan);

    // Cria o mock da consulta e consulta
    const loanId = 1;
    const result = await controller.findOne(loanId.toString());

    // Valida os dados
    expect(result).toEqual(loan);
    expect(mockLoanService.findOne).toHaveBeenCalledWith(loanId);
  });

  it('Should edit a loan', async () => {
    // Cria o dto
    const loanId = 1;
    const loanDto: UpdateLoanDto = {
      id: 1,
      description: 'Loan edited',
      bookId: 1,
      loan_date: new Date('2025-09-13'),
      must_return_date: null,
      return_date: null,
      personId: 1,
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockLoanService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockLoanService.findOne.mockResolvedValue({
      id: 1,
      description: 'Loan edited',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-09-13'),
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

    const result = await controller.update(loanId.toString(), loanDto);

    expect(result).toEqual({
      id: 1,
      description: 'Loan edited',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-09-13'),
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
    expect(mockLoanService.update).toHaveBeenCalledWith(loanId, loanDto);
  });

});
