import { Body, Controller, Post, Req, Res, UseGuards } from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';
import { AuthGuard } from '../auth/auth.guard';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import * as moment from 'moment';
import { ReportDataDto } from './dto/report-data.dto';
import { LibraryService } from '../library/library.service';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';

@Controller('report')
export class ReportController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly libraryService: LibraryService,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
  ) { }

  // Emite relatório da lista de autores
  @UseGuards(AuthGuard)
  @Post('/author-list')
  async authorList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const authors = await this.authorService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);


    // Formata os dados para exibir
    let authors_formatted = [];
    for (let i = 0; i < authors.length; i++) {
      const author = authors[i];
      const birth = moment(author.birth_date);
      const death = moment(author.death_date);
      authors_formatted.push({
        id: author.id,
        name: author.name,
        birth_death:
          ((null == author.birth_date) ? '-' : birth.format('DD/MM/YYYY'))
          + ' | ' +
          ((null == author.death_date) ? '-' : death.format('DD/MM/YYYY'))
      })
    }

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'author-list',
      data: {
        title: library.description,
        subtitle: 'Lista de autores',
        date: moment().format('DD/MM/YYYY'),
        author: 'MyAlexandria - Relatórios',
        headers: ['#', 'nome', 'Nasc - Morte'],
        data: authors_formatted,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'author_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/genre-list')
  async genreList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const genres = await this.genreService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'genre-list',
      data: {
        title: library.description,
        subtitle: 'Lista de gêneros',
        date: moment().format('DD/MM/YYYY'),
        author: 'MyAlexandria - Relatórios',
        headers: ['#', 'Descrição'],
        data: genres,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'genre_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  private getResponseData(pdfBuffer: Buffer, reportName: string) {
    return {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename=${reportName}.pdf`,
      'Content-Length': pdfBuffer.length,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: 0,
    };
  }
}
