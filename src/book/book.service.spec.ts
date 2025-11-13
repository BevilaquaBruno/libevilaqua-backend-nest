import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { mockBookService } from './mocks/book.service.mock';
import { CreateBookDto } from './dto/create-book.dto';
import { FindBookDto } from './dto/find-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';
import { FindAuthorBooksDto } from '../author/dto/find-author-books.dto';

describe('BookService', () => {
  let service: BookService;
  const libraryId = 1;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: BookService, useValue: mockBookService }],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a book', async () => {
    //Cria um mock de retorno e coloca ele no Create Book
    const mockBook: CreateBookDto = {
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      status: true,
      genre_id: 1,
      publisher_id: 1,
      type_id: 1,
      tags_id: [1, 2],
      authors_id: [1, 2],
    };

    const mockBookResolved = {
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      status: true,
      genre: {
        id: 1,
        description: 'Genre test',
      },
      publisher: {
        id: 1,
        name: 'Publisher 1',
        country: 'Brazil',
      },
      type: {
        id: 1,
        descrption: 'Type Test',
      },
      tags: [
        {
          id: 1,
          description: 'Tag Test',
        },
        {
          id: 2,
          description: 'Tag Test 2',
        },
      ],
      authors: [
        {
          id: 1,
          name: 'New Author name',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
        },
        {
          id: 2,
          name: 'New Author name 2',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
        },
      ],
    };

    mockBookService.create.mockResolvedValue(mockBookResolved);

    // Chama a criação do livro
    const result = await service.create(mockBook, libraryId);

    expect(result).toEqual(mockBookResolved);
    expect(mockBookService.create).toHaveBeenCalledWith(mockBook, libraryId);
  });

  it('Should return a list with all books', async () => {
    // Cria o mock da lista de livros e coloca no resolve do findAll
    const mockBookList = [
      {
        id: 1,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        status: true,
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil',
        },
        type: {
          id: 1,
          descrption: 'Type Test',
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test',
          },
          {
            id: 2,
            description: 'Tag Test 2',
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
          },
        ],
      },
      {
        id: 2,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        status: true,
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil',
        },
        type: {
          id: 1,
          descrption: 'Type Test',
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test',
          },
          {
            id: 2,
            description: 'Tag Test 2',
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
          },
        ],
      },
    ];

    mockBookService.findAll.mockResolvedValue(mockBookList);

    // cria a paginação e recebe o retorno
    const findBook: FindBookDto = {
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
      limit: 2,
      status: true,
    };

    const result = await service.findAll(findBook, libraryId);

    // Valida os retornos
    expect(result).toEqual(mockBookList);
    expect(mockBookService.findAll).toHaveBeenCalledWith(findBook, libraryId);
  });

  it('Should return one book', async () => {
    // Cria o mock do book e coloca no resolve do findOne
    const mockBook = {
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      status: true,
      genre: {
        id: 1,
        description: 'Genre test',
      },
      publisher: {
        id: 1,
        name: 'Publisher 1',
        country: 'Brazil',
      },
      type: {
        id: 1,
        descrption: 'Type Test',
      },
      tags: [
        {
          id: 1,
          description: 'Tag Test',
        },
        {
          id: 2,
          description: 'Tag Test 2',
        },
      ],
      authors: [
        {
          id: 1,
          name: 'New Author name',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
        },
        {
          id: 2,
          name: 'New Author name 2',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
        },
      ],
    };
    mockBookService.findOne.mockResolvedValue(mockBook);

    //consult
    const result = await service.findOne(1, libraryId);

    // valida os retornos
    expect(result).toEqual(mockBook);
    expect(mockBookService.findOne).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should update a book', async () => {
    // Cria um mock de retorno e coloca ele no update book
    const mockBook: UpdateBookDto = {
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      status: true,
      genre_id: 1,
      publisher_id: 1,
      type_id: 1,
      tags_id: [1, 2],
      authors_id: [1, 2],
    };

    const mockBookResolved = {
      id: 1,
      title: 'Book Title',
      edition: 1,
      isbn: '1234567890987',
      number_pages: 250,
      release_year: 2025,
      obs: 'Book mock',
      status: true,
      genre: {
        id: 1,
        description: 'Genre test',
      },
      publisher: {
        id: 1,
        name: 'Publisher 1',
        country: 'Brazil',
      },
      type: {
        id: 1,
        descrption: 'Type Test',
      },
      tags: [
        {
          id: 1,
          description: 'Tag Test',
        },
        {
          id: 2,
          description: 'Tag Test 2',
        },
      ],
      authors: [
        {
          id: 1,
          name: 'New Author name',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
        },
        {
          id: 2,
          name: 'New Author name 2',
          birth_date: new Date('2000-01-01'),
          death_date: new Date('2025-01-01'),
          bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
        },
      ],
    };

    mockBookService.update.mockResolvedValue(mockBookResolved);

    // Chama a edição do livro
    const result = await service.update(1, mockBook);

    // Valida o retorno e a chamada
    expect(result).toEqual(mockBookResolved);
    expect(mockBookService.update).toHaveBeenCalledWith(1, mockBook);
  });

  it('Should delete a book', async () => {
    // Cria o mock de retorno e coloca no delete Book
    const mockDeleteBook = {
      raw: [],
      affected: 1,
    };
    mockBookService.remove.mockResolvedValue(mockDeleteBook);

    // Deleta o livro
    const result = await service.remove(1, libraryId);

    // Valida os retornos
    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockBookService.remove).toHaveBeenCalledWith(1, libraryId);
  });

  it('Should return books from an author', async () => {
    // Cria o valor de pesquisa e o mock de retorno e coloca no resolve do service
    const mockAuthorBooks: FindAuthorBooksDto = {
      page: 1,
      limit: 2,
      authorId: 1,
    };

    const mockAuthorBooksResolved = [
      {
        id: 1,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        status: true,
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil',
        },
        type: {
          id: 1,
          descrption: 'Type Test',
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test',
          },
          {
            id: 2,
            description: 'Tag Test 2',
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
          },
        ],
      },
      {
        id: 2,
        title: 'Book Title',
        edition: 1,
        isbn: '1234567890987',
        number_pages: 250,
        release_year: 2025,
        obs: 'Book mock',
        status: true,
        genre: {
          id: 1,
          description: 'Genre test',
        },
        publisher: {
          id: 1,
          name: 'Publisher 1',
          country: 'Brazil',
        },
        type: {
          id: 1,
          descrption: 'Type Test',
        },
        tags: [
          {
            id: 1,
            description: 'Tag Test',
          },
          {
            id: 2,
            description: 'Tag Test 2',
          },
        ],
        authors: [
          {
            id: 1,
            name: 'New Author name',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text',
          },
          {
            id: 2,
            name: 'New Author name 2',
            birth_date: new Date('2000-01-01'),
            death_date: new Date('2025-01-01'),
            bio: 'This is the author bio, insert here a loooooooooooooooooooooooong text 2',
          },
        ],
      },
    ];
    mockBookService.findBooksFromAuthor.mockResolvedValue(
      mockAuthorBooksResolved,
    );

    // Consulta
    const result = await service.findBooksFromAuthor(
      mockAuthorBooks,
      libraryId,
    );

    // Valida os retornos
    expect(result).toEqual(mockAuthorBooksResolved);
    expect(mockBookService.findBooksFromAuthor).toHaveBeenCalledWith(
      mockAuthorBooks,
      libraryId,
    );
  });

  it('Should return a count of books', async () => {
    // Coloca um mock no count de autores
    mockBookService.count.mockResolvedValue(1);

    // Chama o count
    const findBook: FindBookDto = {
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
      limit: 2,
      status: true,
    };
    const result = await service.count(findBook, libraryId);

    // Valida os retornos
    expect(result).toEqual(1);
    expect(mockBookService.count).toHaveBeenCalledWith(findBook, libraryId);
  });
});
