import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GenreModule } from './genre/genre.module';
import { AuthorModule } from './author/author.module';
import { PublisherModule } from './publisher/publisher.module';
import { TypeModule } from './type/type.module';
import { TagModule } from './tag/tag.module';
import { BookModule } from './book/book.module';
import { PersonModule } from './person/person.module';
import { LoanModule } from './loan/loan.module';
import { MailService } from './mail/mail.service';
import { MailModule } from './mail/mail.module';
import { LibraryModule } from './library/library.module';
import { PdfService } from './pdf/pdf.service';
import { ReportModule } from './report/report.module';
import { AcceptLanguageResolver, I18nModule } from 'nestjs-i18n';
import * as path from 'path';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { I18nInterceptor } from './i18n/i18n.interceptor';

@Module({
  imports: [
    I18nModule.forRoot({
      fallbackLanguage: 'pt-BR',
      loaderOptions: {
        path: path.join(process.cwd(), 'src', 'i18n'),
        watch: process.env.NODE_ENV !== 'test', // desativa watch em testes
      },
      resolvers: [new AcceptLanguageResolver()],
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database:
        process.env.NODE_ENV === 'test'
          ? 'libevilaqua_test'
          : process.env['DB_DATABASE'],
      autoLoadEntities: true,
      synchronize: false,
      ssl:
        process.env.NODE_ENV === 'production'
          ? { rejectUnauthorized: false }
          : false,
      extra: {
        options: '-c timezone=America/Sao_Paulo',
      }
    }),
    UserModule,
    AuthModule,
    GenreModule,
    AuthorModule,
    PublisherModule,
    TypeModule,
    TagModule,
    BookModule,
    PersonModule,
    LoanModule,
    MailModule,
    LibraryModule,
    ReportModule,
  ],
  providers: [
    MailService,
    PdfService,
    {
      provide: APP_INTERCEPTOR,
      useClass: I18nInterceptor,
    },
  ],
  controllers: [],
})
export class AppModule { }
