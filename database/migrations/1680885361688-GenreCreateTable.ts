import { MigrationInterface, QueryRunner } from 'typeorm';

export class GenreCreateTable1680885361688 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE genre (
            id INT NOT NULL AUTO_INCREMENT,
            description VARCHAR(50) NOT NULL,

            libraryId INT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT PK_genre PRIMARY KEY (id),
            
            CONSTRAINT FK_library_genre FOREIGN KEY (libraryId) REFERENCES library(id) ON DELETE CASCADE
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE genre`);
  }
}
