import {
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  IsArray,
} from 'class-validator';
import { CreateAuthorDto } from 'src/author/dto/create-author.dto';
import { CreateTagDto } from 'src/tag/dto/create-tag.dto';

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

  @IsNumber({ allowNaN: false }, { message: 'Informe o status do livro' })
  status: number;

  @ValidateIf((thisBook) => thisBook.obs !== null)
  @IsString({ message: 'Informe a observação novamente.' })
  obs: string;

  @ValidateIf((thisBook) => thisBook.genreId !== null)
  @IsNumber({ allowNaN: false }, { message: 'Informe o gênero do livro' })
  genreId: number;

  @ValidateIf((thisBook) => thisBook.publisherId !== null)
  @IsNumber({ allowNaN: false }, { message: 'Informe a publicadora do livro' })
  publisherId: number;

  @ValidateIf((thisBook) => thisBook.typeId !== null)
  @IsNumber({ allowNaN: false }, { message: 'Informe o tipo do livro' })
  typeId: number;

  @ValidateIf((thisBook) => thisBook.tags.length > 0)
  @IsArray({ message: 'Informe a lista de tags novamente' })
  tags: CreateTagDto[];

  @ValidateIf((thisBook) => thisBook.authors.length > 0)
  @IsArray({ message: 'Informe a lista de autores novamente' })
  authors: CreateAuthorDto[];
}
