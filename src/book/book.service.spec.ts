import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { mockBookService } from './mocks/book.service.mock';
import { CreateBookDto } from './dto/create-book.dto';

describe('BookService', () => {
  let service: BookService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: BookService, useValue: mockBookService }
      ],
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
      genre_id: 1,
      publisher_id: 1,
      type_id: 1,
      tags_id: [1, 2],
      authors_id: [1, 2]
    };

    const mockBookResolved = {
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

    mockBookService.create.mockResolvedValue(mockBookResolved);

    // Chama a criação do livro
    const result = await service.create(mockBook);

    expect(result).toEqual(mockBookResolved);
    expect(mockBookService.create).toHaveBeenCalledWith(mockBook);
  });
});
