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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env['DB_HOST'],
      port: Number(process.env['DB_PORT']),
      username: process.env['DB_USERNAME'],
      password: process.env['DB_PASSWORD'],
      database: process.env['DB_DATABASE'],
      autoLoadEntities: true,
      synchronize: false,
      timezone: '-03:00',
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
  ],
  providers: [MailService],
})
export class AppModule {}
