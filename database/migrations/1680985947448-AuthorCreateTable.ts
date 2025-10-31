import { MigrationInterface, QueryRunner } from 'typeorm';

export class AuthorCreateTable1680985947448 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE author(
            id INT NOT NULL AUTO_INCREMENT,
            name VARCHAR(60) NOT NULL,
            birth_date DATE DEFAULT NULL,
            death_date DATE DEFAULT NULL,
            bio TEXT,

            libraryId INT NOT NULL,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT PK_author PRIMARY KEY (id),
            
            CONSTRAINT FK_library_author FOREIGN KEY (libraryId) REFERENCES library(id)
        );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE author;`);
  }
}
