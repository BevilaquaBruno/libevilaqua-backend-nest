import { MigrationInterface, QueryRunner } from 'typeorm';

export class TypeCreateTable1681169961900 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE type(
        id INT NOT NULL AUTO_INCREMENT,
        description VARCHAR(50) NOT NULL,

        libraryId INT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT PK_type PRIMARY KEY (id),
        
        CONSTRAINT FK_library_type FOREIGN KEY (libraryId) REFERENCES library(id)
      );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE type;`);
  }
}
