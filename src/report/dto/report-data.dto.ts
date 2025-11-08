export class ReportDataDto {
  layout: string;
  template: string;
  data: {
    title: string;
    subtitle: string;
    generated_in_date: string;
    generated_by_author: string;
    headers?: string[];
    data: any;
  }
}