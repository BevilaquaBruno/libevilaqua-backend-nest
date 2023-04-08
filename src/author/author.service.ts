import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorServiceRepository: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto) {
    return this.authorServiceRepository.save(createAuthorDto);
  }

  findAll() {
    return this.authorServiceRepository.find();
  }

  findOne(id: number) {
    return this.authorServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateAuthorDto: UpdateAuthorDto) {
    return await this.authorServiceRepository.update(id, updateAuthorDto);
  }

  async remove(id: number) {
    return await this.authorServiceRepository.delete(id);
  }
}
