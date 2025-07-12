import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Not, Repository } from 'typeorm';
import { CreatePersonDto } from './dto/create-person.dto';
import { UpdatePersonDto } from './dto/update-person.dto';
import { Person } from './entities/person.entity';
import { FindPersonDto } from './dto/find-person.dto';

@Injectable()
export class PersonService {
  constructor(
    @InjectRepository(Person)
    private personServiceRepository: Repository<Person>,
  ) {}
  create(createPersonDto: CreatePersonDto) {
    return this.personServiceRepository.save(createPersonDto);
  }

  findAll(findPersonDto: FindPersonDto) {
    // Retorna a lista de pessoas paginada ordenada pelo id decrescente
    return this.personServiceRepository.find({
      take: findPersonDto.limit,
      skip: findPersonDto.page,
      order: { id: 'DESC' },
    });
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

  async count() {
    return await this.personServiceRepository.count();
  }

  async findByCPF(cpf: string, excludeId: number = null) {
    let dynamicWhere: FindOptionsWhere<Person> = {
      cpf: cpf,
    };

    if (null != excludeId) {
      dynamicWhere = {
        ...dynamicWhere,
        id: Not(excludeId),
      };
    }

    return this.personServiceRepository.findOneBy(dynamicWhere);
  }
}
