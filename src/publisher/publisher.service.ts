import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';
import { FindPublisherDto } from './dto/find-publisher.dto';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private publisherServiceRepository: Repository<Publisher>,
  ) { }
  create(createPublisherDto: CreatePublisherDto, libraryId: number) {
    return this.publisherServiceRepository.save({
      ...createPublisherDto,
      libraryId: libraryId
    });
  }

  findAll(findPublisher: FindPublisherDto, libraryId: number) {
    // Retorna as editoras paginadas
    return this.publisherServiceRepository.find({
      select: {
        id: true,
        name: true,
        country: true
      },
      take: findPublisher.limit,
      skip: findPublisher.page,
      where: {
        libraryId: libraryId
      },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.publisherServiceRepository.findOne({
      select: {
        id: true,
        name: true,
        country: true
      },
      where: {
        id: id,
        libraryId: libraryId
      }
    });
  }

  update(id: number, updatePublisherDto: UpdatePublisherDto, libraryId: number) {
    return this.publisherServiceRepository.update({
      id: id,
      libraryId: libraryId
    }, updatePublisherDto);
  }

  remove(id: number, libraryId: number) {
    return this.publisherServiceRepository.delete({ id: id, libraryId: libraryId });
  }

  count(libraryId: number) {
    return this.publisherServiceRepository.count({ where: { libraryId: libraryId } });
  }
}
