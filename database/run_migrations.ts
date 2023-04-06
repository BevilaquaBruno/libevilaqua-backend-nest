/* eslint-disable prettier/prettier */
import { DataSource } from 'typeorm';
import { UserCreateTable1680738977433 } from './migrations/1680738977433-UserCreateTable';

export const AppDataSource = new DataSource({
  type: 'mysql',
  host: 'localhost',
  port: 3306,
  username: 'usernme',
  password: 'password',
  database: 'database',
  migrations: [UserCreateTable1680738977433],
  migrationsTableName: 'migrations',
});
