import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateTagDto } from './dto/create-tag.dto';
import { UpdateTagDto } from './dto/update-tag.dto';
import { Tag } from './entities/tag.entity';
import { FindTagDto } from './dto/find-tag.dto';

@Injectable()
export class TagService {
  constructor(
    @InjectRepository(Tag) private tagServiceRepository: Repository<Tag>,
  ) { }
  create(createTagDto: CreateTagDto, libraryId: number) {
    return this.tagServiceRepository.save({
      ...createTagDto,
      libraryId: libraryId
    });
  }

  findAll(findTag: FindTagDto, libraryId: number) {
    // Retorna a lista de tags paginada ordenada pelo id descrescente
    return this.tagServiceRepository.find({
      select: {
        id: true,
        description: true,
      },
      take: findTag.limit,
      skip: findTag.page,
      where: { libraryId: libraryId },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.tagServiceRepository.findOne({
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

  update(id: number, updateTagDto: UpdateTagDto, libraryId: number) {
    return this.tagServiceRepository.update({
      id: id,
      libraryId: libraryId
    }, updateTagDto);
  }

  remove(id: number, libraryId: number) {
    return this.tagServiceRepository.delete({ id: id, libraryId: libraryId });
  }

  count(libraryId: number) {
    return this.tagServiceRepository.count({ where: { libraryId: libraryId } });
  }

  getTagList(tag_id_list: number[], libraryId: number) {
    return this.tagServiceRepository.find({
      where: {
        id: In(tag_id_list),
        libraryId: libraryId,
      }
    })
  }
}
