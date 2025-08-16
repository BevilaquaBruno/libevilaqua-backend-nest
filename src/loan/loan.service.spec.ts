import { Test, TestingModule } from '@nestjs/testing';
import { LoanService } from './loan.service';
import { mockLoanService } from './mocks/loan.service.mock';
import { CreateLoanDto } from './dto/create-loan.dto';
import { FindLoanDto } from './dto/find-loan.dto';

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

  it('Should create a loan', async () => {
    // Cria o mock
    const mockLoan: CreateLoanDto = {
      description: 'Novo empréstimo',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-01-01'),
      bookId: 1,
      personId: 2
    };

    const mockLoanResolved = {
      id: 1,
      description: 'Novo Empréstimo',
      return_date: null,
      must_return_date: null,
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

    // Coloca no resolve
    mockLoanService.create.mockResolvedValue(mockLoanResolved);

    // Chama e valida
    const result = await service.create(mockLoan);

    expect(result).toEqual(mockLoanResolved)
    expect(mockLoanService.create).toHaveBeenCalledWith({
      description: 'Novo empréstimo',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-01-01'),
      bookId: 1,
      personId: 2
    });
  });

  it('Should return a list with all loans', async () => {
    // Cria o mock da lista e coloca no resolve
    const mockLoanList = [
      {
        id: 1,
        description: 'Novo Empréstimo',
        return_date: null,
        must_return_date: null,
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
        description: 'Novo Empréstimo',
        return_date: null,
        must_return_date: null,
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
      }
    ];
    mockLoanService.findAll.mockResolvedValue(mockLoanList);

    // Cria a paginação e recebe o retorno;
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
    const result = await service.findAll(findLoanDto);

    // Valida os retornos
    expect(result).toEqual(mockLoanList);
    expect(mockLoanService.findAll).toHaveBeenCalledWith({
      limit: 2,
      page: 1,
      start_date: '',
      end_date: '',
      book: 0,
      person: 0,
      description: '',
      returned: false
    });
  });

  it('Should return a loan', async () => {
    // Cria o mock
    const mockLoan = {
      id: 1,
      description: 'Novo Empréstimo',
      return_date: null,
      must_return_date: null,
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
    mockLoanService.findOne.mockResolvedValue(mockLoan);

    // Consulta
    const result = await service.findOne(1);

    // Valida os retornos
    expect(result).toEqual(mockLoan);
    expect(mockLoanService.findOne).toHaveBeenCalledWith(1);
  });

  it('Should update a loan', async () => {
    // Cria o mock do gênero
    const mockLoan = {
      id: 1,
      description: 'Novo Empréstimo',
      return_date: null,
      must_return_date: null,
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
    mockLoanService.update.mockResolvedValue(mockLoan);

    // Chama a edição do gênero
    const result = await service.update(1, {
      id: 1,
      description: 'Novo empréstimo',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-01-01'),
      bookId: 1,
      personId: 2
    });

    // Valida o retorno
    expect(result).toEqual(mockLoan);
    expect(mockLoanService.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: 'Novo empréstimo',
      return_date: null,
      must_return_date: null,
      loan_date: new Date('2025-01-01'),
      bookId: 1,
      personId: 2
    });
  });

  it('Should remove a loan', async () => {
    // Cria o mock de retorno e coloca no delete
    const mockDeleteLoan = {
      raw: [],
      affected: 1
    };
    mockLoanService.remove.mockResolvedValue(mockDeleteLoan);

    // Deleta
    const result = await service.remove(1);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockLoanService.remove).toHaveBeenCalledWith(1);
  });

  it('Should return a count of loans', async () => {
    // Coloca um mock no count de autores
    mockLoanService.count.mockResolvedValue(1);

    const findLoanDto: FindLoanDto = {
      start_date: '',
      end_date: '',
      book: 0,
      person: 0,
      description: '',
      page: 1,
      limit: 2,
      returned: false
    }

    // Chama o count
    const result = await service.count(findLoanDto);

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockLoanService.count).toHaveBeenCalledWith({
      start_date: '',
      end_date: '',
      book: 0,
      person: 0,
      description: '',
      page: 1,
      limit: 2,
      returned: false
    });
  });
});
