import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';
import { FindTypeDto } from './dto/find-type.dto';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type) private typeServiceRepository: Repository<Type>,
  ) { }
  create(createTypeDto: CreateTypeDto, libraryId: number) {
    return this.typeServiceRepository.save({
      ...createTypeDto,
      libraryId: libraryId
    });
  }

  findAll(findType: FindTypeDto, libraryId: number) {
    return this.typeServiceRepository.find({
      select: {
        id: true,
        description: true
      },
      take: findType.limit,
      skip: findType.page,
      where: { libraryId: libraryId },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.typeServiceRepository.findOne({
      select: {
        id: true,
        description: true
      },
      where: {
        id: id,
        libraryId: libraryId
      }
    });
  }

  update(id: number, updateTypeDto: UpdateTypeDto, libraryId: number) {
    return this.typeServiceRepository.update({
      id: id,
      libraryId: libraryId
    }, updateTypeDto);
  }

  remove(id: number, libraryId: number) {
    return this.typeServiceRepository.delete({ id: id, libraryId: libraryId });
  }

  count(libraryId: number) {
    return this.typeServiceRepository.count({ where: { libraryId: libraryId } });
  }
}
