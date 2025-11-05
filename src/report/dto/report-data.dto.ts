export class ReportDataDto {
  layout: string;
  template: string;
  data: {
    title: string;
    subtitle: string;
    date: string;
    author: string;
    headers?: string[];
    data: any;
  }
}