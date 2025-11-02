import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookTagCreateTable1681340103839 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE book_tag(
                id INT NOT NULL AUTO_INCREMENT,
                tagId INT NOT NULL,
                bookId INT NOT NULL,

                CONSTRAINT PK_book_tag PRIMARY KEY (id),

                CONSTRAINT FK_book_tag FOREIGN KEY (bookId) references book(id) ON DELETE CASCADE,
                CONSTRAINT FK_tag_book FOREIGN KEY (tagId) references tag(id) ON DELETE CASCADE
            );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE book_tag;`);
  }
}
