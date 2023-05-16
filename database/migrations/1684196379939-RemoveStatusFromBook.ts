import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveStatusFromBook1684196379939 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        ALTER TABLE book DROP COLUMN status;
      `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('');
  }
}
