import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personServiceRepository: Repository<Person>,
  ) {}
  create(createPersonDto: CreatePersonDto) {
    return this.personServiceRepository.save(createPersonDto);
  }

  findAll() {
    return this.personServiceRepository.find();
  }

  findOne(id: number) {
    return this.personServiceRepository.findOneBy({ id });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto) {
    return await this.personServiceRepository.update(id, updatePersonDto);
  }

  async remove(id: number) {
    return await this.personServiceRepository.delete({ id });
  }
}
