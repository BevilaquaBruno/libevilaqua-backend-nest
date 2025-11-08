import { Test, TestingModule } from '@nestjs/testing';
import { LibraryController } from './library.controller';
import { LibraryService } from './library.service';
import { mockLibraryService } from './mocks/library.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { UpdateLibraryDto } from './dto/update-library.dto';

describe('LibraryController', () => {
  let controller: LibraryController;
  const libraryId = 1;
  const req = { user: { libraryId: 1, logged: true, sub: 1, username: 'bruno.f.bevilaqua@gmail.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LibraryController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: LibraryService, useValue: mockLibraryService }
      ]
    }).compile();

    controller = module.get<LibraryController>(LibraryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should edit a library', async () => {
    const libraryId = 1;
    const libraryDto: UpdateLibraryDto = {
      id: 1,
      description: 'Library edited'
    };

    mockLibraryService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockLibraryService.findOne.mockResolvedValue(libraryDto);

    const result = await controller.update(req, libraryId.toString(), libraryDto);

    expect(result).toEqual(libraryDto);
    expect(mockLibraryService.update).toHaveBeenCalledWith(libraryId, libraryDto);
  });

  it('Should remove a library', async () => {
    const libraryId = 1;
    mockLibraryService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });

    const result = await controller.remove(req, libraryId.toString());

    expect(result).toEqual({
      statusCode: 200,
      message: 'library.general.deleted_with_success',
    });
    expect(mockLibraryService.remove).toHaveBeenCalledWith(libraryId);
  });
});
