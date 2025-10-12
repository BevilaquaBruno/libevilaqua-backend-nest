import { Test, TestingModule } from '@nestjs/testing';
import { TypeController } from './type.controller';
import { TypeService } from './type.service';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockTypeService } from './mocks/type.service.mock';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { FindTypeDto } from './dto/find-type.dto';

describe('TypeController', () => {
  let controller: TypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TypeController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: TypeService, useValue: mockTypeService }
      ],
    }).compile();

    controller = module.get<TypeController>(TypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('Should create a new type', async () => {
    // Cria o dto
    const publisher: CreateTypeDto = {
      description: 'Tipo cadastrado'
    };

    // Mocka o retorno
    mockTypeService.create.mockResolvedValue({
      id: 1,
      ...publisher
    });
    const result = await controller.create(publisher);

    expect(result).toEqual({
      id: 1,
      ...publisher
    });
    expect(mockTypeService.create).toHaveBeenCalledWith(publisher);
  });

  it('should return all types', async () => {
    // Cria os mocks e coloca no retorno
    const list: UpdateTypeDto[] = [
      {
        id: 1,
        description: 'Tipo cadastrado'
      },
      {
        id: 2,
        description: 'Tag nova cadastrada'
      },
    ];
    const quantity = list.length;

    // insere os mocks
    mockTypeService.findAll.mockResolvedValue(list);
    mockTypeService.count.mockResolvedValue(quantity);

    // Cria a paginação e requisita
    const findDto: FindTypeDto = {
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
    expect(mockTypeService.findAll).toHaveBeenCalledWith(findDto);
  });

  it('Should return one type', async () => {
    // Cria um mock
    const publisher: UpdateTypeDto = {
      id: 1,
      description: 'Tipo cadastrado'
    };

    // Insere os mocks nos serviços
    mockTypeService.findOne.mockResolvedValue(publisher);

    // Cria o mock da consulta e consulta
    const id = 1;
    const result = await controller.findOne(id.toString());

    // Valida os dados
    expect(result).toEqual(publisher);
    expect(mockTypeService.findOne).toHaveBeenCalledWith(id);
  });

  it('Should edit a type', async () => {
    // Cria o dto
    const id = 1;
    const dto: UpdateTypeDto = {
      id: 1,
      description: 'Tipo cadastrado'
    };

    // Mocka o retorno no service e pega o resultado do controller
    mockTypeService.update.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockTypeService.findOne.mockResolvedValue(dto);

    const result = await controller.update(id.toString(), dto);

    expect(result).toEqual(dto);
    expect(mockTypeService.update).toHaveBeenCalledWith(id, dto);
  });

  it('Should remove a type', async () => {
    // Cria o id
    const id = 1;

    // Mocka o resultado
    mockTypeService.remove.mockResolvedValue({
      raw: [],
      affected: 1
    });
    mockTypeService.findOne.mockResolvedValue({
      id: 1,
      description: 'Tipo cadastrado'
    });

    const result = await controller.remove(id.toString());

    // Valida os retornos
    expect(result).toEqual({
      statusCode: 200,
      message: 'Tipo deletado com sucesso.',
    });
    expect(mockTypeService.remove).toHaveBeenCalledWith(id);
  });
});

