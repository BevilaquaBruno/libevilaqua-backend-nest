import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateGenreDto } from './dto/create-genre.dto';
import { UpdateGenreDto } from './dto/update-genre.dto';
import { Genre } from './entities/genre.entity';
import { FindGenreDto } from './dto/find-genre.dto';

@Injectable()
export class GenreService {
  constructor(
    @InjectRepository(Genre) private genreServiceRepository: Repository<Genre>,
  ) {}
  create(createGenreDto: CreateGenreDto) {
    return this.genreServiceRepository.save(createGenreDto);
  }

  findAll(findGenre: FindGenreDto) {
    return this.genreServiceRepository.find({
      take: findGenre.limit,
      skip: findGenre.page,
      order: { id: 'DESC' },
    });
  }

  findOne(id: number) {
    return this.genreServiceRepository.findOneBy({ id });
  }

  async update(id: number, updateGenreDto: UpdateGenreDto) {
    return await this.genreServiceRepository.update(id, updateGenreDto);
  }

  async remove(id: number) {
    return await this.genreServiceRepository.delete(id);
  }

  async count() {
    return await this.genreServiceRepository.count();
  }
}
