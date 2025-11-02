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
  ) { }
  create(createGenreDto: CreateGenreDto, libraryId: number) {
    return this.genreServiceRepository.save({
      ...createGenreDto,
      libraryId: libraryId
    });
  }

  findAll(findGenre: FindGenreDto, libraryId: number) {
    // Retorna o gênero pelo id decrescente
    return this.genreServiceRepository.find({
      select: {
        id: true,
        description: true,
      },
      take: findGenre.limit,
      skip: findGenre.page,
      where: {
        libraryId: libraryId
      },
      order: { id: 'DESC' },
    });
  }

  findOne(id: number, libraryId: number) {
    return this.genreServiceRepository.findOne({
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

  update(id: number, updateGenreDto: UpdateGenreDto, libraryId: number) {
    return this.genreServiceRepository.update({
      id: id,
      libraryId: libraryId
    }, updateGenreDto);
  }

  remove(id: number, libraryId: number) {
    return this.genreServiceRepository.delete({
      id: id,
      libraryId: libraryId
    });
  }

  count(libraryId: number) {
    return this.genreServiceRepository.count({
      where: {
        libraryId: libraryId
      }
    });
  }
}
