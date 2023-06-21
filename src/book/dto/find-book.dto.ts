export class FindBookDto {
  tagList: number[] | null;

  genreList: number[] | null;

  publisherList: number[] | null;

  typeList: number[] | null;

  authorList: number[] | null;

  release_year: number | null;

  number_pages: number[] | null;

  isbn: string | null;

  edition: number | null;

  title: string | null;

  page: number;

  limit: number;
}
