import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookAuthorCreateTable1681259133590 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE book_author(
                id INT NOT NULL AUTO_INCREMENT,
                authorId INT NOT NULL,
                bookId INT NOT NULL,

                CONSTRAINT PK_book_author PRIMARY KEY (id),

                CONSTRAINT FK_book_author FOREIGN KEY (bookId) references book(id) ON DELETE CASCADE,
                CONSTRAINT FK_author_book FOREIGN KEY (authorId) references author(id) ON DELETE CASCADE
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE book_author;`);
  }
}
