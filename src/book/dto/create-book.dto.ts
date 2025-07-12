import {
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  IsArray,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'Informe o título do livro.' })
  @Length(1, 250, {
    message: 'O título do livro deve ter entre 1 e 250 caracteres.',
  })
  title: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.edition !== null &&
      thisBook.edition !== undefined &&
      thisBook.edition !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'Informe a edição do livro.' })
  edition: number;

  @ValidateIf(
    (thisBook) =>
      thisBook.isbn !== null &&
      thisBook.isbn !== undefined &&
      thisBook.isbn !== '',
  )
  @IsString({ message: 'Informe o ISBN do livro.' })
  @Length(13, 13, { message: 'O ISBN deve ter 13 dígitos.' })
  isbn: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.number_pages !== null &&
      thisBook.number_pages !== undefined &&
      thisBook.number_pages !== '',
  )
  @IsNumber(
    { allowNaN: false },
    { message: 'Informe o número de páginas do livro.' },
  )
  number_pages: number;

  @ValidateIf(
    (thisBook) =>
      thisBook.release_year !== null &&
      thisBook.release_year !== undefined &&
      thisBook.release_year !== '',
  )
  @IsNumber(
    { allowNaN: false },
    { message: 'Informe o ano de lançamento do livro.' },
  )
  release_year: number;

  @ValidateIf(
    (thisBook) =>
      thisBook.obs !== null &&
      thisBook.obs !== undefined &&
      thisBook.obs !== '',
  )
  @IsString({ message: 'Informe a observação novamente.' })
  obs: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.genre !== null &&
      thisBook.genre !== undefined &&
      thisBook.genre !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'Informe o gênero do livro.' })
  genre_id: number | null;

  @ValidateIf(
    (thisBook) =>
      thisBook.publisher !== null &&
      thisBook.publisher !== undefined &&
      thisBook.publisher !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'Informe a editora do livro.' })
  publisher_id: number | null;

  @ValidateIf(
    (thisBook) =>
      thisBook.type !== null &&
      thisBook.type !== undefined &&
      thisBook.type !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'Informe o tipo do livro.' })
  type_id: number | null;

  @ValidateIf((thisBook) => thisBook.tags_id.length > 0)
  @IsArray({ message: 'Informe a lista de tags novamente.' })
  tags_id: number[];

  @ValidateIf((thisBook) => thisBook.authors_id.length > 0)
  @IsArray({ message: 'Informe a lista de autores novamente.' })
  authors_id: number[];
}
