/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';

import { UserCreateTable1680738977433 } from './migrations/1680738977433-UserCreateTable';
import { GenreCreateTable1680885361688 } from './migrations/1680885361688-GenreCreateTable';
import { AuthorCreateTable1680985947448 } from './migrations/1680985947448-AuthorCreateTable';
import { AddTimestampAuthor1680990089730 } from './migrations/1680990089730-AddTimestampAuthor';
import { AddTimestampUser1680990994368 } from './migrations/1680990994368-AddTimestampUser';
import { AddTimestampGenre1680991025720 } from './migrations/1680991025720-AddTimestampGenre';
import { PublisherCreateTable1681084447979 } from './migrations/1681084447979-PublisherCreateTable';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  migrations: [
    UserCreateTable1680738977433,
    GenreCreateTable1680885361688,
    AuthorCreateTable1680985947448,
    AddTimestampAuthor1680990089730,
    AddTimestampUser1680990994368,
    AddTimestampGenre1680991025720,
    PublisherCreateTable1681084447979,
  ],
  migrationsTableName: 'migrations',
});
