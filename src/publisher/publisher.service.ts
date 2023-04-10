import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreatePublisherDto } from './dto/create-publisher.dto';
import { UpdatePublisherDto } from './dto/update-publisher.dto';
import { Publisher } from './entities/publisher.entity';

@Injectable()
export class PublisherService {
  constructor(
    @InjectRepository(Publisher)
    private publisherServiceRepository: Repository<Publisher>,
  ) {}
  create(createPublisherDto: CreatePublisherDto) {
    return this.publisherServiceRepository.save(createPublisherDto);
  }

  findAll() {
    return this.publisherServiceRepository.find();
  }

  findOne(id: number) {
    return this.publisherServiceRepository.findOneBy({ id });
  }

  async update(id: number, updatePublisherDto: UpdatePublisherDto) {
    return await this.publisherServiceRepository.update(id, updatePublisherDto);
  }

  async remove(id: number) {
    return await this.publisherServiceRepository.delete({ id });
  }
}
