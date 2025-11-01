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
  ) { }
  create(createPersonDto: CreatePersonDto, libraryId: number) {
    return this.personServiceRepository.save({
      ...createPersonDto,
      libraryId: libraryId
    });
  }

  findAll(findPersonDto: FindPersonDto, libraryId: number) {
    // Retorna a lista de pessoas paginada ordenada pelo id decrescente
    return this.personServiceRepository.find({
      select: {
        id: true,
        name: true,
        cpf: true,
        cep: true,
        state: true,
        city: true,
        district: true,
        street: true,
        number: true,
        obs: true
      },
      take: findPersonDto.limit,
      skip: findPersonDto.page,
      where: { libraryId: libraryId },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.personServiceRepository.findOne({
      where: {
        id: id,
        libraryId: libraryId
      }
    });
  }

  async update(id: number, updatePersonDto: UpdatePersonDto, libraryId: number) {
    return await this.personServiceRepository.update({
      id: id,
      libraryId: libraryId
    }, updatePersonDto);
  }

  async remove(id: number, libraryId: number) {
    return await this.personServiceRepository.delete({
      id: id,
      libraryId: libraryId
    });
  }

  async count(libraryId: number) {
    return await this.personServiceRepository.count({
      where: {
        libraryId: libraryId
      }
    });
  }

  async findByCPF(cpf: string, excludeId: number = null, libraryId: number) {
    let dynamicWhere: FindOptionsWhere<Person> = {
      cpf: cpf,
      libraryId: libraryId
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
