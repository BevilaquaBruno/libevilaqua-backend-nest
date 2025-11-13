import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateAuthorDto } from './dto/create-author.dto';
import { FindAuthorDto } from './dto/find-author.dto';
import { UpdateAuthorDto } from './dto/update-author.dto';
import { Author } from './entities/author.entity';

@Injectable()
export class AuthorService {
  constructor(
    @InjectRepository(Author)
    private authorServiceRepository: Repository<Author>,
  ) {}

  create(createAuthorDto: CreateAuthorDto, libraryId: number) {
    return this.authorServiceRepository.save({
      ...createAuthorDto,
      libraryId: libraryId,
    });
  }

  findAll(findAuthor: FindAuthorDto, libraryId: number) {
    // Pesquisa o autor ordenando pelo ID descrescente
    return this.authorServiceRepository.find({
      select: {
        id: true,
        name: true,
        birth_date: true,
        bio: true,
        death_date: true,
      },
      take: findAuthor.limit,
      skip: findAuthor.page,
      where: {
        libraryId: libraryId,
      },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.authorServiceRepository.findOne({
      where: {
        id: id,
        libraryId: libraryId,
      },
    });
  }

  update(id: number, updateAuthorDto: UpdateAuthorDto, libraryId: number) {
    return this.authorServiceRepository.update(
      {
        id: id,
        libraryId: libraryId,
      },
      updateAuthorDto,
    );
  }

  remove(id: number, libraryId: number) {
    return this.authorServiceRepository.delete({
      id: id,
      libraryId: libraryId,
    });
  }

  count(libraryId: number) {
    return this.authorServiceRepository.count({
      where: {
        libraryId: libraryId,
      },
    });
  }

  getAuthorList(author_id_list: number[], libraryId: number) {
    return this.authorServiceRepository.find({
      where: {
        id: In(author_id_list),
        libraryId: libraryId,
      },
    });
  }
}
