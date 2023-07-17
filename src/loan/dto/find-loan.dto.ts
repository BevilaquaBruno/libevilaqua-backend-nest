export class FindLoanDto {
  start_date: string | null;

  end_date: string | null;

  book: number | null;

  person: number | null;

  description: string | null;

  page: number;

  limit: number;
}
