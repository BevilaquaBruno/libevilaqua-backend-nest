// pdf.service.ts
import { Injectable } from '@nestjs/common';
import { generatePDF } from '@bkrajendra/nestjs-pdf-lib';
import * as path from 'path';
import { ReportDataDto } from '../report/dto/report-data.dto';
import * as fs from 'fs';
import * as hbs from 'handlebars';
import { v4 as uuid } from 'uuid';

@Injectable()
export class PdfService {
  private layoutsDir = path.join(process.cwd(), 'src/report/html/layouts');
  private templatesDir = path.join(process.cwd(), 'src/report/html/reports');

  async generatePDF(data: ReportDataDto): Promise<Buffer> {
    const options = {
      format: 'A4',
      displayHeaderFooter: true,
      margin: {
        left: '3mm',
        top: '10mm',
        right: '3mm',
        bottom: '10mm',
      },
      landscape: false,
    };

    const html = await this.compileReport(data.template, data.data, data.layout);
    return this.generateWithCustomHtml(html, options);
  }

  private compileReport(templateName: string, data: any, layoutName = 'main') {
    const layoutPath = path.join(this.layoutsDir, `${layoutName}.hbs`);
    const layout = fs.readFileSync(layoutPath, 'utf8');

    const templatePath = path.join(this.templatesDir, `${templateName}.hbs`);
    const content = fs.readFileSync(templatePath, 'utf8');

    // Compila o conteúdo específico
    const body = hbs.compile(content)(data);

    // Injeta dentro do layout
    const finalTemplate = layout.replace('{{{body}}}', body);

    // Retorna o HTML final para gerar o PDF
    return hbs.compile(finalTemplate)(data);
  }


  private async generateWithCustomHtml(html: string, options: any): Promise<Buffer> {
    const tempFilePath = path.join(process.cwd(), 'temp', `${uuid()}.hbs`);

    // salva o HTML num arquivo temporário
    fs.writeFileSync(tempFilePath, html, 'utf8');

    const pdf: Buffer = await generatePDF(tempFilePath, {}, options);

    // remove o arquivo depois
    fs.unlinkSync(tempFilePath);

    return pdf;
  }

}
