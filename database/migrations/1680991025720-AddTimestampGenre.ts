import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddTimestampGenre1680991025720 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE genre ADD COLUMN (
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
          );`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE genre DROP COLUMN created_at, updated_at;`,
    );
  }
}
