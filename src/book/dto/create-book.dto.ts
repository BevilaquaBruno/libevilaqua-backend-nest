import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  Length,
  IsNumber,
  ValidateIf,
  IsArray,
  IsBoolean,
} from 'class-validator';

export class CreateBookDto {
  @ApiProperty({ example: 'Os Sertões', description: 'Book title.' })
  @IsString({ message: 'book.title.invalid' })
  @Length(1, 250, {
    message: 'book.title.length_error',
  })
  title: string;

  @ApiProperty({
    example: 1,
    examples: [1, null],
    description: 'Book edition.',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.edition !== null &&
      thisBook.edition !== undefined &&
      thisBook.edition !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.edition.invalid' })
  edition: number;

  @ApiProperty({
    example: '9786598327804',
    examples: ['9786598327804', null],
    description: 'Book ISBN code.',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.isbn !== null &&
      thisBook.isbn !== undefined &&
      thisBook.isbn !== '',
  )
  @IsString({ message: 'book.isbn.invalid' })
  @Length(13, 13, { message: 'book.isbn.length_error' })
  isbn: string;

  @ApiProperty({
    example: 250,
    examples: [250, null],
    description: 'Book number pages.',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.number_pages !== null &&
      thisBook.number_pages !== undefined &&
      thisBook.number_pages !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.number_pages.invalid' })
  number_pages: number;

  @ApiProperty({
    example: 2000,
    examples: [2000, null],
    description: 'Book release year.',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.release_year !== null &&
      thisBook.release_year !== undefined &&
      thisBook.release_year !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.release_year.invalid' })
  release_year: number;

  @ApiProperty({
    example: 'Some text here.',
    examples: ['Some text here.', null],
    description: '',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.obs !== null &&
      thisBook.obs !== undefined &&
      thisBook.obs !== '',
  )
  @IsString({ message: 'book.obs.invalid' })
  @Length(1, 500, { message: 'book.obs.length_error' })
  obs: string;

  @ApiProperty({ example: 1, examples: [1, null], description: 'Genre id.' })
  @ValidateIf(
    (thisBook) =>
      thisBook.genre !== null &&
      thisBook.genre !== undefined &&
      thisBook.genre !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.genre.invalid' })
  genre_id: number | null;

  @ApiProperty({
    example: 1,
    examples: [1, null],
    description: 'Publisher id.',
  })
  @ValidateIf(
    (thisBook) =>
      thisBook.publisher !== null &&
      thisBook.publisher !== undefined &&
      thisBook.publisher !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.publisher.invalid' })
  publisher_id: number | null;

  @ApiProperty({ example: 1, examples: [1, null], description: 'Type id.' })
  @ValidateIf(
    (thisBook) =>
      thisBook.type !== null &&
      thisBook.type !== undefined &&
      thisBook.type !== '',
  )
  @IsNumber({ allowNaN: false }, { message: 'book.type.invalid' })
  type_id: number | null;

  @ApiProperty({
    example: [1, 2],
    examples: [[1, 2], []],
    description: 'Book tags.',
  })
  @ValidateIf((thisBook) => thisBook.tags_id.length > 0)
  @IsArray({ message: 'book.tags.invalid' })
  tags_id: number[];

  @ApiProperty({
    example: [1, 2],
    examples: [[1, 2], []],
    description: 'Book authors.',
  })
  @ValidateIf((thisBook) => thisBook.authors_id.length > 0)
  @IsArray({ message: 'book.authors.invalid' })
  authors_id: number[];

  @ApiProperty({
    example: true,
    examples: [true, false],
    description: 'Book status, active or inactive.',
  })
  @IsBoolean({ message: 'book.status.invalid' })
  status: boolean;
}
