import { Module, OnModuleInit } from '@nestjs/common';
import { ReportController } from './report.controller';
import { PdfService } from '../pdf/pdf.service';
import { LibraryService } from '../library/library.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Library } from '../library/entities/library.entity';
import { Author } from '../author/entities/author.entity';
import { AuthorService } from '../author/author.service';
import * as hbs from 'handlebars';
import * as fs from 'fs';
import * as path from 'path';
import { Genre } from '../genre/entities/genre.entity';
import { GenreService } from '../genre/genre.service';
import { Person } from '../person/entities/person.entity';
import { PersonService } from '../person/person.service';
import { Publisher } from '../publisher/entities/publisher.entity';
import { PublisherService } from '../publisher/publisher.service';
import { Tag } from '../tag/entities/tag.entity';
import { TagService } from '../tag/tag.service';
import { Type } from '../type/entities/type.entity';
import { TypeService } from '../type/type.service';
import { User } from '../user/entities/user.entity';
import { UserService } from '../user/user.service';
import { LibraryUser } from '../user/entities/library-user.entity';
import { Loan } from '../loan/entities/loan.entity';
import { LoanService } from '../loan/loan.service';
import { Book } from '../book/entities/book.entity';
import { BookService } from '../book/book.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Library,
      Author,
      Genre,
      Person,
      Publisher,
      Tag,
      Type,
      User,
      LibraryUser,
      Loan,
      Book,
    ]),
  ],
  controllers: [ReportController],
  providers: [
    PdfService,
    LibraryService,
    AuthorService,
    GenreService,
    PersonService,
    PublisherService,
    TagService,
    TypeService,
    UserService,
    LoanService,
    BookService,
  ],
})
export class ReportModule implements OnModuleInit {
  onModuleInit() {
    // Registra os partials
    const partialsDir = path.join(
      process.cwd(),
      'src',
      'report',
      'html',
      'partials',
    );
    const files = fs.readdirSync(partialsDir);

    files.forEach((file) => {
      const match = /^([^.]+).hbs$/.exec(file);
      if (!match) return;

      const name = match[1];
      const template = fs.readFileSync(path.join(partialsDir, file), 'utf8');
      hbs.registerPartial(name, template);
    });

    //console.log(`🧩 Handlebars partials registrados: ${files.join(', ')}`);
  }
}
