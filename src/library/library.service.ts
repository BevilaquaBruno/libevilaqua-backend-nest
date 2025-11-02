import { Injectable } from '@nestjs/common';
import { CreateLibraryDto } from './dto/create-library.dto';
import { UpdateLibraryDto } from './dto/update-library.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Library } from './entities/library.entity';
import { FindLibraryDto } from './dto/find-library.dto';

@Injectable()
export class LibraryService {
  constructor(
    @InjectRepository(Library) private libraryServiceRepository: Repository<Library>,
  ) { }

  create(createLibraryDto: CreateLibraryDto) {
    return this.libraryServiceRepository.save(createLibraryDto);
  }

  findAll(findLibrary: FindLibraryDto) {
    return this.libraryServiceRepository.find({
      take: findLibrary.limit,
      skip: findLibrary.page,
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.libraryServiceRepository.findOneBy({ id });
  }

  update(id: number, updateLibraryDto: UpdateLibraryDto) {
    return this.libraryServiceRepository.update(id, updateLibraryDto);
  }

  remove(id: number) {
    return this.libraryServiceRepository.delete(id);
  }

  async count() {
    return await this.libraryServiceRepository.count();
  }

  getLibrariesFromuser(userId: number) {
    return this.libraryServiceRepository.find({
      where: { users: { user: { id: userId } } }
    });
  }
}
