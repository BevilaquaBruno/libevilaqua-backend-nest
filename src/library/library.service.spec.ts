import { Test, TestingModule } from '@nestjs/testing';
import { LibraryService } from './library.service';
import { mockLibraryService } from './mocks/library.service.mock';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { FindLibraryDto } from './dto/find-library.dto';

describe('LibraryService', () => {
  let service: LibraryService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: LibraryService, useValue: mockLibraryService }],
    }).compile();

    service = module.get<LibraryService>(LibraryService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a library', async () => {

    const mockLibrary: CreateLibraryDto = {
      description: 'New Library'
    };

    const mockLibraryResolved: UpdateLibraryDto = {
      id: 1,
      ...mockLibrary
    }

    mockLibraryService.create.mockResolvedValue(mockLibraryResolved);

    const result = await service.create({
      description: 'New Library'
    });

    expect(result).toEqual(mockLibraryResolved)
    expect(mockLibraryService.create).toHaveBeenCalledWith({ description: 'New Library' });
  });

  it('Should return a list with all libraries', async () => {
    const mockLibraryList = [
      {
        id: 1,
        description: 'Library 1'
      },
      {
        id: 2,
        description: 'Library 2'
      }
    ];
    mockLibraryService.findAll.mockResolvedValue(mockLibraryList);
    const findLibraryDto: FindLibraryDto = {
      limit: 2,
      page: 1
    };
    const result = await service.findAll(findLibraryDto);

    // Valida os retornos
    expect(result).toEqual(mockLibraryList);
    expect(mockLibraryService.findAll).toHaveBeenCalledWith({ limit: 2, page: 1 });
  });

  it('Should return a library', async () => {
    const mockLibrary = {
      id: 1,
      description: 'Library novo'
    };
    mockLibraryService.findOne.mockResolvedValue(mockLibrary);
    const result = await service.findOne(1);
    expect(result).toEqual(mockLibrary);
    expect(mockLibraryService.findOne).toHaveBeenCalledWith(1);
  });

  it('Should update a library', async () => {
    const mockLibrary: UpdateLibraryDto = {
      id: 1,
      description: 'Update Library'
    };
    mockLibraryService.update.mockResolvedValue(mockLibrary);

    const result = await service.update(1, { id: 1, description: 'Update Library' });

    expect(result).toEqual(mockLibrary);
    expect(mockLibraryService.update).toHaveBeenCalledWith(1, {
      id: 1,
      description: 'Update Library'
    });
  });

  it('Should remove a library', async () => {
    const mockDeleteLibrary = {
      raw: [],
      affected: 1
    };
    mockLibraryService.remove.mockResolvedValue(mockDeleteLibrary);

    const result = await service.remove(1);

    expect(result).toEqual({ raw: [], affected: 1 });
    expect(mockLibraryService.remove).toHaveBeenCalledWith(1);
  });
});
