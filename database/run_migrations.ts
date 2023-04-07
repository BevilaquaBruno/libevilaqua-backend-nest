/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { UserCreateTable1680738977433 } from './migrations/1680738977433-UserCreateTable';
import { GenreCreateTable1680885361688 } from './migrations/1680885361688-GenreCreateTable';

import * as dotenv from 'dotenv';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: process.env['DB_HOST'],
  port: Number(process.env['DB_PORT']),
  username: process.env['DB_USERNAME'],
  password: process.env['DB_PASSWORD'],
  database: process.env['DB_DATABASE'],
  migrations: [UserCreateTable1680738977433, GenreCreateTable1680885361688],
  migrationsTableName: 'migrations',
});
