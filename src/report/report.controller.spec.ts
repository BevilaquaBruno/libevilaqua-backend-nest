import { Test, TestingModule } from '@nestjs/testing';
import { ReportController } from './report.controller';
import { PdfService } from '../pdf/pdf.service';
import { mockPdfService } from '../pdf/mocks/pdf.service.mock';
import { JwtService } from '@nestjs/jwt';
import { mockJwtService } from '../auth/mocks/jwt.service.mock';
import { mockLibraryService } from '../library/mocks/library.service.mock';
import { mockAuthorService } from '../author/mocks/author.service.mock';
import { mockGenreService } from '../genre/mocks/genre.service.mock';
import { mockPersonService } from '../person/mocks/person.service.mock';
import { mockPublisherService } from '../publisher/mocks/publisher.service.mock';
import { mockTagService } from '../tag/mocks/tag.service.mock';
import { mockTypeService } from '../type/mocks/type.service.mock';
import { mockUserService } from '../user/mocks/user.service.mock';
import { mockLoanService } from '../loan/mocks/loan.service.mock';
import { LibraryService } from '../library/library.service';
import { AuthorService } from '../author/author.service';
import { GenreService } from '../genre/genre.service';
import { PersonService } from '../person/person.service';
import { PublisherService } from '../publisher/publisher.service';
import { TagService } from '../tag/tag.service';
import { TypeService } from '../type/type.service';
import { UserService } from '../user/user.service';
import { LoanService } from '../loan/loan.service';
import { I18nService } from 'nestjs-i18n';
import { mockI18nService } from '../i18n/mocks/i18n.service.mock';
import { BookService } from '../book/book.service';
import { mockBookService } from '../book/mocks/book.service.mock';

describe('ReportController', () => {
  let controller: ReportController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReportController],
      providers: [
        { provide: JwtService, useValue: mockJwtService },
        { provide: PdfService, useValue: mockPdfService },
        { provide: LibraryService, useValue: mockLibraryService },
        { provide: AuthorService, useValue: mockAuthorService },
        { provide: GenreService, useValue: mockGenreService },
        { provide: PersonService, useValue: mockPersonService },
        { provide: PublisherService, useValue: mockPublisherService },
        { provide: TagService, useValue: mockTagService },
        { provide: TypeService, useValue: mockTypeService },
        { provide: UserService, useValue: mockUserService },
        { provide: LoanService, useValue: mockLoanService },
        { provide: BookService, useValue: mockBookService },
        { provide: I18nService, useValue: mockI18nService },
      ],
    }).compile();

    controller = module.get<ReportController>(ReportController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
