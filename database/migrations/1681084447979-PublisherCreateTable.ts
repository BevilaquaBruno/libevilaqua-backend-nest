import { MigrationInterface, QueryRunner } from 'typeorm';

export class PublisherCreateTable1681084447979 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE publisher (
          id INT NOT NULL AUTO_INCREMENT,
          name VARCHAR(50) NOT NULL,
          country VARCHAR(30),
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          CONSTRAINT PK_publisher PRIMARY KEY (id)
      );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE publisher;`);
  }
}
