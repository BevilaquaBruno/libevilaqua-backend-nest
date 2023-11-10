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
  ) {}
  create(createTypeDto: CreateTypeDto) {
    return this.typeServiceRepository.save(createTypeDto);
  }

  findAll(findType: FindTypeDto) {
    return this.typeServiceRepository.find({
      take: findType.limit,
      skip: findType.page,
    });
  }

  findOne(id: number) {
    return this.typeServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateTypeDto: UpdateTypeDto) {
    return await this.typeServiceRepository.update(id, updateTypeDto);
  }

  async remove(id: number) {
    return await this.typeServiceRepository.delete({ id });
  }

  async count() {
    return await this.typeServiceRepository.count();
  }
}
