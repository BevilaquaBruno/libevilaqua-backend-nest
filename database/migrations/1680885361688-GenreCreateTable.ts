import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenreCreateTable1680885361688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE genre (
            id INT NOT NULL AUTO_INCREMENT,
            description VARCHAR(50) NOT NULL,
            CONSTRAINT PK_genre PRIMARY KEY (id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE genre`);
  }
}
