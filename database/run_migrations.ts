/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { LibraryCreateTable1679534437979 } from './migrations/1679534437979-LibraryCreateTable';
import { UserCreateTable1680738977433 } from './migrations/1680738977433-UserCreateTable';
import { LibraryUserCreateTable1680742947407 } from './migrations/1680742947407-LibraryUserCreateTable';
import { GenreCreateTable1680885361688 } from './migrations/1680885361688-GenreCreateTable';
import { AuthorCreateTable1680985947448 } from './migrations/1680985947448-AuthorCreateTable';
import { PublisherCreateTable1681084447979 } from './migrations/1681084447979-PublisherCreateTable';
import { TypeCreateTable1681169961900 } from './migrations/1681169961900-TypeCreateTable';
import { TagCreateTable1681252869985 } from './migrations/1681252869985-TagCreateTable';
import { BookCreateTable1681257837930 } from './migrations/1681257837930-BookCreateTable';
import { BookAuthorCreateTable1681259133590 } from './migrations/1681259133590-BookAuthorCreateTable';
import { BookTagCreateTable1681340103839 } from './migrations/1681340103839-BookTagCreateTable';
import { PersonCreateTable1681776270324 } from './migrations/1681776270324-PersonCreateTable';
import { LoanCreateTable1682086092464 } from './migrations/1682086092464-LoanCreateTable';
import { CreateResetTokenTable1760897406985 } from './migrations/1760897406985-CreateResetTokenTable';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  migrations: [
    LibraryCreateTable1679534437979,
    UserCreateTable1680738977433,
    LibraryUserCreateTable1680742947407,
    GenreCreateTable1680885361688,
    AuthorCreateTable1680985947448,
    PublisherCreateTable1681084447979,
    TypeCreateTable1681169961900,
    TagCreateTable1681252869985,
    BookCreateTable1681257837930,
    BookAuthorCreateTable1681259133590,
    BookTagCreateTable1681340103839,
    PersonCreateTable1681776270324,
    LoanCreateTable1682086092464,
    CreateResetTokenTable1760897406985,
  ],
  migrationsTableName: 'migrations',
});
