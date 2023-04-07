/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { UserCreateTable1680738977433 } from './migrations/1680738977433-UserCreateTable';
import { GenreCreateTable1680885361688 } from './migrations/1680885361688-GenreCreateTable';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'a',
  password: 'a',
  database: 'a',
  migrations: [UserCreateTable1680738977433, GenreCreateTable1680885361688],
  migrationsTableName: 'migrations',
});
