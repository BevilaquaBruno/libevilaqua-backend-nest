import { Test, TestingModule } from '@nestjs/testing';
import { PersonService } from './person.service';
import { CreatePersonDto } from './dto/create-person.dto';
import { States } from '../helpers/enum/States.enum';
import { UpdatePersonDto } from './dto/update-person.dto';
import { mockPersonService } from './mocks/person.service.mock';

describe('PersonService', () => {
  let service: PersonService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [{ provide: PersonService, useValue: mockPersonService }],
    }).compile();

    service = module.get<PersonService>(PersonService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('Should create a gente', async () => {
    // Cria o mock
    const mock: CreatePersonDto = {
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro'
    };

    const mockResolved: UpdatePersonDto = {
      id: 1,
      ...mock
    }

    // Coloca no resolve
    mockPersonService.create.mockResolvedValue(mockResolved);

    // Chama e valida
    const result = await service.create({
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro'
    });

    expect(result).toEqual(mockResolved)
    expect(mockPersonService.create).toHaveBeenCalledWith({
      name: 'Bruno Fernando Bevilaqua',
      cpf: '103.411.729-79',
      cep: '889700-055',
      state: States.SC,
      city: 'Concórdia',
      district: 'Linha São Paulo',
      street: 'Rua Sérgio Galvan',
      number: '15',
      obs: 'Meu próprio cadastro'
    });
  });
});
