import { Test, TestingModule } from '@nestjs/testing';
import { TagController } from './tag.controller';
import { TagService } from './tag.service';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockTagService } from './mocks/tag.service.mock';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { FindTagDto } from './dto/find-tag.dto';

describe('TagController', () => {
  let controller: TagController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TagController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: TagService, useValue: mockTagService }
      ],
    }).compile();

    controller = module.get<TagController>(TagController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new tag', async () => {
    // Cria o dto
    const publisher: CreateTagDto = {
      description: 'Tag cadastrada'
    };

    // Mocka o retorno
    mockTagService.create.mockResolvedValue({
      id: 1,
      ...publisher
    });
    const result = await controller.create(publisher);

    expect(result).toEqual({
      id: 1,
      ...publisher
    });
    expect(mockTagService.create).toHaveBeenCalledWith(publisher);
  });

  it('should return all tags', async () => {
    // Cria os mocks e coloca no retorno
    const list: UpdateTagDto[] = [
      {
        id: 1,
        description: 'Tag cadastrada'
      },
      {
        id: 2,
        description: 'Tag nova cadastrada'
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockTagService.findAll.mockResolvedValue(list);
    mockTagService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const findDto: FindTagDto = {
      limit: 2,
      page: 1
    };

    const result = await controller.findAll(
      findDto.page.toString(),
      findDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: list,
      count: quantity
    });
    findDto.page--;
    expect(mockTagService.findAll).toHaveBeenCalledWith(findDto);
  });

  it('Should return one tag', async () => {
    // Cria um mock
    const publisher: UpdateTagDto = {
      id: 1,
      description: 'Tag cadastrada'
    };

    // Insere os mocks nos serviços
    mockTagService.findOne.mockResolvedValue(publisher);

    // Cria o mock da consulta e consulta
    const id = 1;
    const result = await controller.findOne(id.toString());

    // Valida os dados
    expect(result).toEqual(publisher);
    expect(mockTagService.findOne).toHaveBeenCalledWith(id);
  });

  it('Should edit a tag', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdateTagDto = {
      id: 1,
      description: 'Tag cadastrada'
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockTagService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockTagService.findOne.mockResolvedValue(dto);

    const result = await controller.update(id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockTagService.update).toHaveBeenCalledWith(id, dto);
  });

  it('Should remove a tag', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockTagService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockTagService.findOne.mockResolvedValue({
      id: 1,
      description: 'Tag cadastrada'
    });

    const result = await controller.remove(id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Tag deletada com sucesso.',
    });
    expect(mockTagService.remove).toHaveBeenCalledWith(id);
  });
});
