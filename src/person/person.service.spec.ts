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

});
