import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import { mockBookService } from './mocks/book.service.mock';

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
});
