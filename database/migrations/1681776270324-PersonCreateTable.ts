import { MigrationInterface, QueryRunner } from 'typeorm';

export class PersonCreateTable1681776270324 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE person(
        id INT NOT NULL AUTO_INCREMENT,
        name VARCHAR(250) NOT NULL,
        cpf CHAR(14),
        cep CHAR(9),
        state ENUM('AC','AL','AP','AM','BA','CE','DF','ES','GO','MA','MT','MS','MG','PA','PB','PR','PE','PI','RJ','RN','RS','RO','RR','SC','SP','SE','TO'),
        city VARCHAR(30),
        district VARCHAR(100),
        street VARCHAR(100),
        number VARCHAR(5),
        obs TEXT,

        libraryId INT NOT NULL,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT PK_person PRIMARY KEY (id),
        
        CONSTRAINT FK_library_person FOREIGN KEY (libraryId) REFERENCES library(id) ON DELETE CASCADE
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE person;`);
  }
}
