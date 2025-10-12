import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { mockBookService } from './mocks/book.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { count } from 'console';

describe('BookController', () => {
  let controller: BookController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: BookService, useValue: mockBookService }
      ],
    }).compile();

    controller = module.get<BookController>(BookController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new book', async () => {
    // Cria o dto do livro
    const bookDto: CreateBookDto = {
      title: 'Livro 1',
      edition: 1,
      isbn: '1234567890123',
      number_pages: 250,
      release_year: 2025,
      obs: 'Observações do livro',
      genre_id: 1,
      publisher_id: 1,
      type_id: 1,
      tags_id: [1, 2, 3],
      authors_id: [1, 2]
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockBookService.create.mockResolvedValue({
      id: 1,
      ...bookDto
    });

    // cria o livro
    const result = await controller.create(bookDto);

    expect(result).toEqual({
      id: 1,
      ...bookDto
    });
    expect(mockBookService.create).toHaveBeenCalledWith(bookDto);
  });

  it('Should return all books', async () => {
    // Cria os mocks para os livros e a quantidde
    const mockResolvedBookList = [
      {
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
      {
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
      }
    ];
    const bookQuantity = mockResolvedBookList.length;

    // Insere os mocks
    mockBookService.findAll.mockResolvedValue(mockResolvedBookList);
    mockBookService.count.mockResolvedValue(bookQuantity);

    // Cria o mock para o findBook e requisita
    const findBookDto: FindBookDto = {
      tagList: [],
      genreList: [],
      publisherList: [],
      typeList: [],
      authorList: [],
      release_year: 0,
      number_pages: [],
      isbn: '',
      edition: 0,
      title: '',
      page: 1,
      limit: 2
    };
    const result = await controller.findAll(
      findBookDto.genreList.join(','),
      findBookDto.tagList.join(','),
      findBookDto.publisherList.join(','),
      findBookDto.typeList.join(','),
      findBookDto.authorList.join(','),
      findBookDto.release_year.toString(),
      findBookDto.number_pages.toString(),
      findBookDto.isbn,
      findBookDto.edition.toString(),
      findBookDto.title,
      findBookDto.page.toString(),
      findBookDto.limit.toString()
    );

    expect(result).toEqual({
      data: mockResolvedBookList,
      count: bookQuantity
    });
  });

  it('Should return one book', async () => {
    // Cria um mock para o livro
    const book = {
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
    };

    // Insere os dados no mock
    mockBookService.findOne.mockResolvedValue(book);

    // Cria o mock e consulta o livro
    const bookId = 1;
    const result = await controller.findOne(bookId.toString());

    // Valida os dados
    expect(result).toEqual(book);
    expect(mockBookService.findOne).toHaveBeenCalledWith(bookId);
  });

  it('Should edit a book', async () => {
    // Cria o dto do livro
    const bookId = 1;
    const book = {
      id: bookId,
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
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockBookService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockBookService.findOne.mockResolvedValue(book);

    const result = await controller.update(bookId.toString(), book);

    expect(result).toEqual(book);
    expect(mockBookService.update).toHaveBeenCalledWith(bookId, book);
  });

  it('Should remove a book', async () => {
    // Cria o id e um livro
    const bookId = 1;
    const book = {
      id: bookId,
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
    };

    // Mocka o resultado
    mockBookService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockBookService.findOne.mockResolvedValue(book);


    const result = await controller.remove(bookId.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Livro deletado com sucesso.',
    });
    expect(mockBookService.remove).toHaveBeenCalledWith(bookId);
    expect(mockBookService.findOne).toHaveBeenCalledWith(bookId);
  });
});
