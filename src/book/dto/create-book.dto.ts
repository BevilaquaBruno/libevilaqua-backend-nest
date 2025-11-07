import {
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateBookDto {
  @IsString({ message: 'book.title.invalid' })
  @Length(1, 250, {
    message: 'book.title.length_error',
  })
  title: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.edition !== null &&
      thisBook.edition !== undefined &&
      thisBook.edition !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.edition.invalid' })
  edition: number;

  @ValidateIf(
    (thisBook) =>
      thisBook.isbn !== null &&
      thisBook.isbn !== undefined &&
      thisBook.isbn !== '',
  )
  @IsString({ message: 'book.isbn.invalid' })
  @Length(13, 13, { message: 'book.isbn.length_error' })
  isbn: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.number_pages !== null &&
      thisBook.number_pages !== undefined &&
      thisBook.number_pages !== '',
  )
  @IsNumber(
    { allowNaN: false },
    { message: 'book.number_pages.invalid' },
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
    { message: 'book.release_year.invalid' },
  )
  release_year: number;

  @ValidateIf(
    (thisBook) =>
      thisBook.obs !== null &&
      thisBook.obs !== undefined &&
      thisBook.obs !== '',
  )
  @IsString({ message: 'book.obs.invalid' })
  obs: string;

  @ValidateIf(
    (thisBook) =>
      thisBook.genre !== null &&
      thisBook.genre !== undefined &&
      thisBook.genre !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.genre.invalid' })
  genre_id: number | null;

  @ValidateIf(
    (thisBook) =>
      thisBook.publisher !== null &&
      thisBook.publisher !== undefined &&
      thisBook.publisher !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.publisher.invalid' })
  publisher_id: number | null;

  @ValidateIf(
    (thisBook) =>
      thisBook.type !== null &&
      thisBook.type !== undefined &&
      thisBook.type !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.type.invalid' })
  type_id: number | null;

  @ValidateIf((thisBook) => thisBook.tags_id.length > 0)
  @IsArray({ message: 'book.tags.invalid' })
  tags_id: number[];

  @ValidateIf((thisBook) => thisBook.authors_id.length > 0)
  @IsArray({ message: 'book.authors.invalid' })
  authors_id: number[];

  @IsBoolean({ message: 'book.status.invalid' })
  status: boolean;
}
