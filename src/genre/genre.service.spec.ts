import { Test, TestingModule } from '@nestjs/testing';
import { GenreService } from './genre.service';
import { mockGenreService } from './mocks/genre.service.mock';

describe('GenreService', () => {
  let service: GenreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: GenreService, useValue: mockGenreService}],
    }).compile();

    service = module.get<GenreService>(GenreService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
