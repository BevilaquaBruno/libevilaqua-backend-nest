import { MigrationInterface, QueryRunner } from 'typeorm';

export class LoanCreateTable1682086092464 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
        CREATE TABLE loan(
            id INT NOT NULL AUTO_INCREMENT,
            description VARCHAR(250) NOT NULL,
            return_date DATE DEFAULT NULL,
            must_return_date DATE DEFAULT NULL,
            loan_date DATE,

            bookId INT,
            personId INT,

            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

            CONSTRAINT PK_loan PRIMARY KEY (id),

            CONSTRAINT FK_book_loan FOREIGN KEY (bookId) REFERENCES book(id),
            CONSTRAINT FK_person_loan FOREIGN KEY (personId) REFERENCES person(id)
        );
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE loan;`);
  }
}
