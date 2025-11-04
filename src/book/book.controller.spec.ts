import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from './book.service';
import { mockBookService } from './mocks/book.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { GenreService } from '../genre/genre.service';
import { mockGenreService } from '../genre/mocks/genre.service.mock';
import { PublisherService } from '../publisher/publisher.service';
import { mockPublisherService } from '../publisher/mocks/publisher.service.mock';
import { TypeService } from '../type/type.service';
import { mockTypeService } from '../type/mocks/type.service.mock';
import { AuthorService } from '../author/author.service';
import { mockAuthorService } from '../author/mocks/author.service.mock';
import { TagService } from '../tag/tag.service';
import { mockTagService } from '../tag/mocks/tag.service.mock';
import { UpdateBookDto } from './dto/update-book.dto';

describe('BookController', () => {
  let controller: BookController;
  const libraryId = 1;
  const req = { user: { libraryId: 1, logged: true, sub: 1, username: 'bruno.f.bevilaqua@gmail.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: BookService, useValue: mockBookService },
        { provide: GenreService, useValue: mockGenreService },
        { provide: PublisherService, useValue: mockPublisherService },
        { provide: TypeService, useValue: mockTypeService },
        { provide: AuthorService, useValue: mockAuthorService },
        { provide: TagService, useValue: mockTagService },
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
      tags_id: [1, 2],
      authors_id: [1, 2]
    };

    mockGenreService.findOne.mockResolvedValue({
      id: 1,
      description: 'Genre test',
    });
    mockPublisherService.findOne.mockResolvedValue({
      id: 1,
      name: 'Publisher 1',
      country: 'Brazil'
    });
    mockTypeService.findOne.mockResolvedValue({
      id: 1,
      descrption: 'Type Test'
    });
    mockAuthorService.getAuthorList.mockResolvedValue([
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
    ]);
    mockTagService.getTagList.mockResolvedValue([
      {
        id: 1,
        description: 'Tag Test'
      },
      {
        id: 2,
        description: 'Tag Test 2'
      },
    ]);

    // Mocka o retorno no service e pega o resultado do controller
    mockBookService.create.mockResolvedValue({
      id: 1,
      ...bookDto
    });


    // cria o livro
    const result = await controller.create(req, bookDto);

    expect(result).toEqual({
      id: 1,
      ...bookDto
    });
    expect(mockGenreService.findOne).toHaveBeenCalledWith(bookDto.genre_id, libraryId);
    expect(mockPublisherService.findOne).toHaveBeenCalledWith(bookDto.publisher_id, libraryId);
    expect(mockTypeService.findOne).toHaveBeenCalledWith(bookDto.type_id, libraryId);
    expect(mockAuthorService.getAuthorList).toHaveBeenCalledWith(bookDto.authors_id, libraryId);
    expect(mockTagService.getTagList).toHaveBeenCalledWith(bookDto.tags_id, libraryId);
    expect(mockBookService.create).toHaveBeenCalledWith(bookDto, libraryId);
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
      req,
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
    const result = await controller.findOne(req, bookId.toString());

    // Valida os dados
    expect(result).toEqual(book);
    expect(mockBookService.findOne).toHaveBeenCalledWith(bookId, libraryId);
  });

  it('Should edit a book', async () => {
    // Cria o dto do livro
    const bookId = 1;
    const updateBook: UpdateBookDto = {
      id: bookId,
      title: 'Livro 1',
      edition: 1,
      isbn: '1234567890123',
      number_pages: 250,
      release_year: 2025,
      obs: 'Observações do livro',
      genre_id: 1,
      publisher_id: 1,
      type_id: 1,
      tags_id: [1, 2],
      authors_id: [1, 2]
    };
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

    mockGenreService.findOne.mockResolvedValue({
      id: 1,
      description: 'Genre test',
    });
    mockPublisherService.findOne.mockResolvedValue({
      id: 1,
      name: 'Publisher 1',
      country: 'Brazil'
    });
    mockTypeService.findOne.mockResolvedValue({
      id: 1,
      descrption: 'Type Test'
    });
    mockAuthorService.getAuthorList.mockResolvedValue([
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
    ]);
    mockTagService.getTagList.mockResolvedValue([
      {
        id: 1,
        description: 'Tag Test'
      },
      {
        id: 2,
        description: 'Tag Test 2'
      },
    ]);

    // Mocka o retorno no service e pega o resultado do controller
    mockBookService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockBookService.findOne.mockResolvedValue(book);

    const result = await controller.update(req, bookId.toString(), updateBook);

    expect(result).toEqual(updateBook);
    expect(mockBookService.update).toHaveBeenCalledWith(bookId, updateBook);
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


    const result = await controller.remove(req, bookId.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Livro deletado com sucesso.',
    });
    expect(mockBookService.remove).toHaveBeenCalledWith(bookId, libraryId);
    expect(mockBookService.findOne).toHaveBeenCalledWith(bookId, libraryId);
  });
});
