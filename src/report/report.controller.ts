import { Body, Controller, Get, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { PdfService } from '../pdf/pdf.service';
import { AuthGuard } from '../auth/auth.guard';
import { PayloadAuthDto } from '../auth/dto/payload-auth.dto';
import * as moment from 'moment';
import { ReportDataDto } from './dto/report-data.dto';
import { LibraryService } from '../library/library.service';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';
import { PersonService } from '../person/person.service';
import { PublisherService } from '../publisher/publisher.service';
import { TagService } from '../tag/tag.service';
import { TypeService } from '../type/type.service';
import { UserService } from '../user/user.service';
import { ReportListDto } from './dto/report-list.dto';
import { LoanService } from '../loan/loan.service';
import { FindLoanDto } from '../loan/dto/find-loan.dto';

@Controller('report')
export class ReportController {
  constructor(
    private readonly pdfService: PdfService,
    private readonly libraryService: LibraryService,
    private readonly authorService: AuthorService,
    private readonly genreService: GenreService,
    private readonly personService: PersonService,
    private readonly publisherService: PublisherService,
    private readonly tagService: TagService,
    private readonly typeService: TypeService,
    private readonly userService: UserService,
    private readonly loanService: LoanService,
  ) { }


  @UseGuards(AuthGuard)
  @Get('/')
  async reportList(@Req() req: Request) {
    const report_list: ReportListDto[] = [
      { name: 'Lista de autores', description: 'Uma lista com todos os autores cadastrados' },
      { name: 'Lista de gêneros', description: 'Uma lista com todos os gêneros cadastrados' },
      { name: 'Lista de pessoas', description: 'Uma lista com todos os pessoas cadastradas' },
      { name: 'Lista de tags', description: 'Uma lista com todos os tags cadastradas' },
      { name: 'Lista de tipos', description: 'Uma lista com todos os tipos cadastrados' },
      { name: 'Lista de usuários', description: 'Uma lista com todos os usuários cadastrados' },
    ];

    return report_list;
  }

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
        author: process.env['APP_NAME'] + ' - Relatórios',
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
        author: process.env['APP_NAME'] + ' - Relatórios',
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

  @UseGuards(AuthGuard)
  @Post('/person-list')
  async personList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const people = await this.personService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    let peopleData = [];
    for (let i = 0; i < people.length; i++) {
      const person = people[i];
      let address = `
        ${((null == person.cep) ? '' : person.cep + ', ')}
        ${((null == person.street) ? '' : person.street + ', ')}
        ${((null == person.district) ? '' : 'B. ' + person.district + ', ')}
        ${((null == person.number) ? '' : 'Nº' + person.number + ', ')}
        ${((null == person.city) ? '' : person.city + ', ')}
        ${((null == person.state) ? '' : person.state + ', ')}
        `;
      if('' == address.trim()){
        address = '-';
      }
      peopleData.push({
        id: person.id,
        name: person.name,
        cpf: (null == person.cpf) ? '-' : person.cpf,
        address: address
      });
    }

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'person-list',
      data: {
        title: library.description,
        subtitle: 'Lista de pessoas',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Nome', 'CPF', 'Endereço'],
        data: peopleData,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'person_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/publisher-list')
  async publisherList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const publishers = await this.publisherService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'publisher-list',
      data: {
        title: library.description,
        subtitle: 'Lista de Editoras',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Descrição', 'País'],
        data: publishers,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'publisher_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/tag-list')
  async tagList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const tags = await this.tagService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'tag-list',
      data: {
        title: library.description,
        subtitle: 'Lista de tags',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Descrição'],
        data: tags,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'tag_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/type-list')
  async typeList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const types = await this.typeService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'type-list',
      data: {
        title: library.description,
        subtitle: 'Lista de Tipos',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Descrição'],
        data: types,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'type_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/user-list')
  async userList(@Req() req: Request, @Res() res) {
    const reqUser: PayloadAuthDto = req['user'];
    const library = await this.libraryService.findOne(reqUser.libraryId);
    const users = await this.userService.findAll({ limit: 999, page: 0 }, reqUser.libraryId);

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'user-list',
      data: {
        title: library.description,
        subtitle: 'Lista de Usuários',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Nome', 'E-mail'],
        data: users,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'user_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

    @UseGuards(AuthGuard)
  @Post('/loan-list')
  async loanList(@Req() req: Request, @Res() res,
    @Query('start_date') start_date: string,
    @Query('end_date') end_date: string,
    @Query('book') book: string,
    @Query('person') person: string,
    @Query('description') description: string,
    @Query('returned') returned: string,
  ) {
    const reqUser: PayloadAuthDto = req['user'];
    const findLoan: FindLoanDto = {
      start_date: null,
      end_date: null,
      book: null,
      person: null,
      description: null,
      returned: undefined,
      limit: 999,
      page: 0,
    };

    // Define os filtros com base no que veio na URL
    if (start_date !== undefined) findLoan.start_date = start_date;

    if (end_date !== undefined) findLoan.end_date = end_date;

    if (book !== undefined) findLoan.book = parseInt(book);

    if (person !== undefined) findLoan.person = parseInt(person);

    if (description !== undefined) findLoan.description = description;

    /**
     * Valida o retorno do livr
     * returned = true - Apenas livros retornados
     * returned = false - Apenas livros não retornados
     * returned = undefined - Todos os livros
     */
    if (returned !== undefined)
      if (returned == 'true') findLoan.returned = true;
      else findLoan.returned = false;


    const library = await this.libraryService.findOne(reqUser.libraryId);
    const loans = await this.loanService.findAll(findLoan, reqUser.libraryId);

    let loanData = [];
    for (let i = 0; i < loans.length; i++) {
      const loan = loans[i];
      loanData.push({
        id: loan.id,
        description: (null != loan.description) ? '' : loan.description,
        person: loan.person.name,
        book: loan.book.title,
        loan_date: (null == loan.loan_date) ? '' : moment(loan.loan_date).format('DD/MM/YYYY'),
        return_date: (null == loan.return_date) ? '' : moment(loan.return_date).format('DD/MM/YYYY'),
      });
    }

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'loan-list',
      data: {
        title: library.description,
        subtitle: 'Lista de Empréstimos',
        date: moment().format('DD/MM/YYYY'),
        author: process.env['APP_NAME'] + ' - Relatórios',
        headers: ['#', 'Descrição', 'Pessoa', 'Livro', 'Data Emp.', 'Data Dev.'],
        data: loanData,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'loan_list');
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
