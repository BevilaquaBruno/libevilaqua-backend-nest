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
import { FindBookDto } from '../book/dto/find-book.dto';
import { BookService } from '../book/book.service';
import { Author } from '../author/entities/author.entity';
import { I18nService } from 'nestjs-i18n';
import { ApiQuery } from '@nestjs/swagger';

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
    private readonly bookService: BookService,
    private readonly i18nService: I18nService,
  ) { }


  @UseGuards(AuthGuard)
  @Get('/')
  async reportList(@Req() req: Request) {
    const report_list: ReportListDto[] = [
      { name: this.i18nService.translate('report.author.name'), description: this.i18nService.translate('report.author.description') },
      { name: this.i18nService.translate('report.genre.name'), description: this.i18nService.translate('report.genre.description') },
      { name: this.i18nService.translate('report.person.name'), description: this.i18nService.translate('report.person.description') },
      { name: this.i18nService.translate('report.publisher.name'), description: this.i18nService.translate('report.publisher.description') },
      { name: this.i18nService.translate('report.tag.name'), description: this.i18nService.translate('report.tag.description') },
      { name: this.i18nService.translate('report.type.name'), description: this.i18nService.translate('report.type.description') },
      { name: this.i18nService.translate('report.user.name'), description: this.i18nService.translate('report.user.description') },
      { name: this.i18nService.translate('report.loan.name'), description: this.i18nService.translate('report.loan.description') },
      { name: this.i18nService.translate('report.book.name'), description: this.i18nService.translate('report.book.description') },
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
        subtitle: this.i18nService.translate('report.author.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.author.headers.name'),
          this.i18nService.translate('report.author.headers.birth_death_date')
        ],
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
        subtitle: this.i18nService.translate('report.genre.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.genre.headers.description')
        ],
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
        ${((null == person.zip_code) ? '' : person.zip_code + ', ')}
        ${((null == person.street) ? '' : person.street + ', ')}
        ${((null == person.district) ? '' : 'B. ' + person.district + ', ')}
        ${((null == person.number) ? '' : 'Nº' + person.number + ', ')}
        ${((null == person.city) ? '' : person.city + ', ')}
        ${((null == person.state) ? '' : person.state + ', ')}
        ${((null == person.country) ? '' : person.country + ', ')}
        `;
      if ('' == address.trim()) {
        address = '-';
      }

      const contactData = [person.email, person.phone]

      peopleData.push({
        id: person.id,
        name: person.name,
        document: (null == person.document) ? '-' : person.document,
        address: address,
        contact: contactData.filter(Boolean).join(', ') || '-'
      });
    }

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'person-list',
      data: {
        title: library.description,
        subtitle: this.i18nService.translate('report.person.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.person.headers.name'),
          this.i18nService.translate('report.person.headers.document'),
          this.i18nService.translate('report.person.headers.address'),
          this.i18nService.translate('report.person.headers.contact')
        ],
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
        subtitle: this.i18nService.translate('report.publisher.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.publisher.headers.description'),
          this.i18nService.translate('report.publisher.headers.country')
        ],
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
        subtitle: this.i18nService.translate('report.tag.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.tag.headers.description')
        ],
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
        subtitle: this.i18nService.translate('report.type.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.type.headers.description')
        ],
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
        subtitle: this.i18nService.translate('report.user.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.user.headers.name'),
          this.i18nService.translate('report.user.headers.email'),
          this.i18nService.translate('report.user.headers.language')
        ],
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
  @ApiQuery({ name: 'start_date', required: false, example: '2024-01-01', description: 'Start date to filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'end_date', required: false, example: '2024-31-12', description: 'End date to filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'book', required: false, example: '1', description: 'Book filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'person', required: false, example: '1', description: 'Person filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'description', required: false, example: '1', description: 'Description filter loan.', schema: { default: null } })
  @ApiQuery({ name: 'returned', required: false, example: 'true', examples: { returned: { summary: 'Returned loans', value: 'true' }, notReturned: { summary: 'Pending loans', value: 'false' } }, description: 'Return or not filter loan.', schema: { default: null } })
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
    if (undefined != start_date && '' != start_date) findLoan.start_date = start_date;

    if (undefined != end_date && '' != end_date) findLoan.end_date = end_date;

    if (undefined != book && '' != book) findLoan.book = parseInt(book);

    if (undefined != person && '' != person) findLoan.person = parseInt(person);

    if (undefined != description && '' != description) findLoan.description = description;

    /**
     * Valida o retorno do livr
     * returned = true - Apenas livros retornados
     * returned = false - Apenas livros não retornados
     * returned = undefined - Todos os livros
     */
    if (undefined != returned && '' != returned)
      if (returned == 'true') findLoan.returned = true;
      else findLoan.returned = false;


    const library = await this.libraryService.findOne(reqUser.libraryId);
    const loans = await this.loanService.findAll(findLoan, reqUser.libraryId);

    let loanData = [];
    for (let i = 0; i < loans.length; i++) {
      const loan = loans[i];
      loanData.push({
        id: loan.id,
        description: (null == loan.description) ? '' : loan.description,
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
        subtitle: this.i18nService.translate('report.loan.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.loan.headers.description'),
          this.i18nService.translate('report.loan.headers.person'),
          this.i18nService.translate('report.loan.headers.book'),
          this.i18nService.translate('report.loan.headers.loan_date'),
          this.i18nService.translate('report.loan.headers.return_date')
        ],
        data: loanData,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'loan_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  @UseGuards(AuthGuard)
  @Post('/book-list')
  @ApiQuery({ name: 'genres', required: false, example: '1', examples: { oneGenre: { summary: 'One genre', value: '1' }, moreGenres: { summary: 'Two Genres', value: '1,2' } }, description: 'Genre filter.', schema: { default: null } })
  @ApiQuery({ name: 'tags', required: false, example: '1', examples: { oneTag: { summary: 'One tag', value: '1' }, moreTags: { summary: 'Two Tags', value: '1,2' } }, description: 'Tag filter.', schema: { default: null } })
  @ApiQuery({ name: 'publishers', required: false, example: '1', examples: { onePublisher: { summary: 'One publisher', value: '1' }, morePublishers: { summary: 'Two Publishers', value: '1,2' } }, description: 'Publisher filter.', schema: { default: null } })
  @ApiQuery({ name: 'types', required: false, example: '1', examples: { oneType: { summary: 'One type', value: '1' }, moreTypes: { summary: 'Two Types', value: '1,2' } }, description: 'Type filter.', schema: { default: null } })
  @ApiQuery({ name: 'authors', required: false, example: '1', examples: { oneAuthor: { summary: 'One author', value: '1' }, moreAuthors: { summary: 'Two Authors', value: '1,2' } }, description: 'Author filter.', schema: { default: null } })
  @ApiQuery({ name: 'release_year', required: false, example: '2025', description: 'Release year filter.', schema: { default: null } })
  @ApiQuery({ name: 'number_pages', required: false, example: '1', examples: { oneNumberPage: { summary: 'One number_pages', value: '1' }, moreNumberPages: { summary: 'Two number pages', value: '1,2' } }, description: 'Number page filter.', schema: { default: null } })
  @ApiQuery({ name: 'isbn', required: false, example: '9856434579234', description: 'ISBN filter.', schema: { default: null } })
  @ApiQuery({ name: 'isbn', required: false, example: '9856434579234', description: 'ISBN filter.', schema: { default: null } })
  @ApiQuery({ name: 'edition', required: false, example: '1', description: 'Edition number.', schema: { default: null } })
  @ApiQuery({ name: 'title', required: false, example: 'Os Sertões', description: 'Book title.', schema: { default: null } })
  async bookList(@Req() req: Request, @Res() res,
    @Query('genres') genres: string,
    @Query('tags') tags: string,
    @Query('publishers') publishers: string,
    @Query('types') types: string,
    @Query('authors') authors: string,
    @Query('release_year') release_year: string,
    @Query('number_pages') number_pages: string,
    @Query('isbn') isbn: string,
    @Query('edition') edition: string,
    @Query('status') status: string,
    @Query('title') title: string,
  ) {
    const reqUser: PayloadAuthDto = req['user'];

    const findBook: FindBookDto = {
      typeList: null,
      publisherList: null,
      tagList: null,
      genreList: null,
      authorList: null,
      release_year: null,
      number_pages: null,
      isbn: null,
      edition: null,
      title: null,
      status: null,
      limit: null,
      page: null,
    };

    // Transforma os itens passados na URL
    // Transforma a typeList em number[]
    if (undefined != types && '' != types) {
      findBook.typeList = types.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a publisherList em number[]
    if (undefined != publishers && '' != publishers) {
      findBook.publisherList = publishers.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a taglist em number[]
    if (undefined != tags && '' != tags) {
      findBook.tagList = tags.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a genderList em number[]
    if (undefined != genres && '' != genres) {
      findBook.genreList = genres.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma a authorList em number[]
    if (undefined != authors && '' != authors) {
      findBook.authorList = authors.split(',').map((v) => {
        return parseInt(v);
      });
    }

    // Transforma o release_year em number
    if (undefined != release_year && '' != release_year)
      findBook.release_year = parseInt(release_year);

    // Transforma o number_pages em array com as posições 0 e 1
    if (undefined != number_pages && '' != number_pages) {
      const npArray: string[] = number_pages.split(',');
      findBook.number_pages = [];
      findBook.number_pages[0] = parseInt(npArray[0]);
      findBook.number_pages[1] = parseInt(npArray[1]);
    }

    // Pega o isbn
    if (undefined != isbn && '' != isbn) findBook.isbn = isbn;

    // Pega a edição
    if (undefined != edition && '' != edition) findBook.edition = parseInt(edition);

    // Pega o título
    if (undefined != title && '' != title) findBook.title = title;

    if (undefined != status && '' != status) {
      if ('true' == status)
        findBook.status = true;
      else
        findBook.status = false;
    }

    const library = await this.libraryService.findOne(reqUser.libraryId);
    const books = await this.bookService.findAll(findBook, reqUser.libraryId);

    let bookData = [];
    for (let i = 0; i < books.length; i++) {
      const book = books[i];

      const authors = this.formatBookAuthors(book.authors);

      let list_tags = book.tags.map(tag => tag.description);
      let tags = list_tags.join(' - ');

      bookData.push({
        id: book.id,
        title: book.title,
        authors: (0 == authors.length) ? '-' : authors,
        genre: (null == book.genre) ? '-' : book.genre.description,
        type: (null == book.type) ? '-' : book.type.description,
        tags: (0 == tags.length) ? '-' : tags,
        status: (book.status) ? this.i18nService.translate('report.general.active') : this.i18nService.translate('report.general.inactive')
      });
    }

    // Cria os dados para o relatórios
    const pdfData: ReportDataDto = {
      layout: 'base',
      template: 'book-list',
      data: {
        title: library.description,
        subtitle: this.i18nService.translate('report.book.subtitle'),
        generated_in_date:
          this.i18nService.translate('report.general.generated_in') + ' ' +
          moment().format('DD/MM/YYYY'),
        generated_by_author:
          this.i18nService.translate('report.general.generated_by') + ' ' +
          process.env['APP_NAME'] + ' - ' +
          this.i18nService.translate('report.general.reports'),
        headers: [
          '#',
          this.i18nService.translate('report.book.headers.title'),
          this.i18nService.translate('report.book.headers.author'),
          this.i18nService.translate('report.book.headers.genre'),
          this.i18nService.translate('report.book.headers.type'),
          this.i18nService.translate('report.book.headers.tag'),
          this.i18nService.translate('report.book.headers.status')
        ],
        data: bookData,
      }
    };

    // Gera o buffer do PDF
    const pdfBuffer = await this.pdfService.generatePDF(pdfData);

    const responseData = this.getResponseData(pdfBuffer, 'book_list');
    res.set(responseData);
    res.end(pdfBuffer);
  }

  private formatBookAuthors(authors: Author[]) {
    const names = authors.map(author => author.name);
    if (names.length > 3) {
      // Exibe apenas os 3 primeiros e indica que há mais
      const firstThree = names.slice(0, 3).join(', ');
      return `${firstThree} ${this.i18nService.translate('report.general.and_others')}`;
    }

    if (names.length === 1) {
      return names[0];
    }

    if (names.length === 2) {
      return names.join(' e ');
    }

    if (names.length === 3) {
      return `${names[0]}, ${names[1]} e ${names[2]}`;
    }

    return '';
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
