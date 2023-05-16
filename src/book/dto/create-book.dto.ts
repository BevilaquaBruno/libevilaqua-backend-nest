import {
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  IsArray,
} from 'class-validator';
import { CreateAuthorDto } from 'src/author/dto/create-author.dto';
import { CreateGenreDto } from 'src/genre/dto/create-genre.dto';
import { CreatePublisherDto } from 'src/publisher/dto/create-publisher.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';
import { CreateTypeDto } from 'src/type/dto/create-type.dto';

export class CreateBookDto {
  @IsString({ message: 'Informe o título do livro' })
  @Length(1, 250, {
    message: 'O título do livro deve ter entre 1 e 250 caracteres',
  })
  title: string;

  @ValidateIf((thisBook) => thisBook.edition !== null)
  @IsNumber({ allowNaN: false }, { message: 'Informe o a edição do livro' })
  edition: number;

  @ValidateIf((thisBook) => thisBook.isbn !== null)
  @IsString({ message: 'Informe o ISBN do livro' })
  @Length(13, 13, { message: 'O ISBN deve ter 13 dígitos' })
  isbn: string;

  @ValidateIf((thisBook) => thisBook.number_pages !== null)
  @IsNumber(
    { allowNaN: false },
    { message: 'Informe o número de páginas do livro' },
  )
  number_pages: number;

  @ValidateIf((thisBook) => thisBook.release_year !== null)
  @IsNumber(
    { allowNaN: false },
    { message: 'Informe o ano de lançamento do livro' },
  )
  release_year: number;

  @ValidateIf((thisBook) => thisBook.obs !== null)
  @IsString({ message: 'Informe a observação novamente.' })
  obs: string;

  genre: CreateGenreDto | null;

  publisher: CreatePublisherDto | null;

  type: CreateTypeDto | null;

  @ValidateIf((thisBook) => thisBook.tags.length > 0)
  @IsArray({ message: 'Informe a lista de tags novamente' })
  tags: CreateTagDto[];

  @ValidateIf((thisBook) => thisBook.authors.length > 0)
  @IsArray({ message: 'Informe a lista de autores novamente' })
  authors: CreateAuthorDto[];
}
