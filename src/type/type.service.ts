import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateTypeDto } from './dto/create-type.dto';
import { UpdateTypeDto } from './dto/update-type.dto';
import { Type } from './entities/type.entity';

@Injectable()
export class TypeService {
  constructor(
    @InjectRepository(Type) private typeServiceRepository: Repository<Type>,
  ) {}
  create(createTypeDto: CreateTypeDto) {
    return this.typeServiceRepository.save(createTypeDto);
  }

  findAll() {
    return this.typeServiceRepository.find();
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
}
