// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { generatePDF } from '@bkrajendra/nestjs-pdf-lib';
import * as path from 'path';
import { ReportDataDto } from '../report/dto/report-data.dto';

@Injectable()
export class PdfService {
  async generatePDF(data: ReportDataDto, templateName: string): Promise<Buffer> {
    const templatePath = path.join(
      process.cwd(),
      'src/report/html/',
      templateName+'.hbs'
    );

    const options = {
      format: 'A4',
      displayHeaderFooter: true,
      margin: {
        left: '5mm',
        top: '20mm',
        right: '5mm',
        bottom: '10mm',
      },
      landscape: false,
    };

    const pdfBuffer: Buffer = await generatePDF(templatePath, options, data);
    return pdfBuffer;
  }

}
