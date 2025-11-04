import { Test, TestingModule } from '@nestjs/testing';
import { PublisherController } from './publisher.controller';
import { PublisherService } from './publisher.service';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockPublisherService } from './mocks/publisher.service.mock';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { FindPublisherDto } from './dto/find-publisher.dto';

describe('PublisherController', () => {
  let controller: PublisherController;
  const libraryId = 1;
  const req = { user: { libraryId: 1, logged: true, sub: 1, username: 'bruno.f.bevilaqua@gmail.com' } } as any;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PublisherController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: PublisherService, useValue: mockPublisherService }
      ],
    }).compile();

    controller = module.get<PublisherController>(PublisherController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new publisher', async () => {
    // Cria o dto
    const publisher: CreatePublisherDto = {
      name: 'Editora cadastrada',
      country: "Brasil"
    };

    // Mocka o retorno
    mockPublisherService.create.mockResolvedValue({
      id: 1,
      ...publisher
    });
    const result = await controller.create(req, publisher);

    expect(result).toEqual({
      id: 1,
      ...publisher
    });
    expect(mockPublisherService.create).toHaveBeenCalledWith(publisher, libraryId);
  });

  it('should return all Publishers', async () => {
    // Cria os mocks e coloca no retorno
    const list: UpdatePublisherDto[] = [
      {
        id: 1,
        name: 'Editora cadastrada',
        country: "Brasil"
      },
      {
        id: 2,
        name: 'Editora cadastrada',
        country: "Brasil"
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockPublisherService.findAll.mockResolvedValue(list);
    mockPublisherService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const findDto: FindPublisherDto = {
      limit: 2,
      page: 1
    };

    const result = await controller.findAll(
      req,
      findDto.page.toString(),
      findDto.limit.toString(),
    );

    // Valida os retornos
    expect(result).toEqual({
      data: list,
      count: quantity
    });
    findDto.page--;
    expect(mockPublisherService.findAll).toHaveBeenCalledWith(findDto, libraryId);
  });

  it('Should return one publisher', async () => {
    // Cria um mock
    const publisher: UpdatePublisherDto = {
      id: 1,
      name: 'Editora cadastrada',
      country: "Brasil"
    };

    // Insere os mocks nos serviços
    mockPublisherService.findOne.mockResolvedValue(publisher);

    // Cria o mock da consulta e consulta
    const id = 1;
    const result = await controller.findOne(req, id.toString());

    // Valida os dados
    expect(result).toEqual(publisher);
    expect(mockPublisherService.findOne).toHaveBeenCalledWith(id, libraryId);
  });

  it('Should edit a publisher', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdatePublisherDto = {
      id: 1,
      name: 'Editora cadastrada',
      country: "Brasil"
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockPublisherService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockPublisherService.findOne.mockResolvedValue(dto);

    const result = await controller.update(req, id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockPublisherService.update).toHaveBeenCalledWith(id, dto, libraryId);
  });

  it('Should remove a publisher', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockPublisherService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockPublisherService.findOne.mockResolvedValue({
      id: 1,
      name: 'Editora cadastrada',
      country: "Brasil"
    });

    const result = await controller.remove(req, id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Editora deletada com sucesso.',
    });
    expect(mockPublisherService.remove).toHaveBeenCalledWith(id, libraryId);
  });
});
