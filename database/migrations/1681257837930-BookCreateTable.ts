import { MigrationInterface, QueryRunner } from 'typeorm';

export class BookCreateTable1681257837930 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
    CREATE TABLE book(
        id INT NOT NULL AUTO_INCREMENT,
        title VARCHAR(250) NOT NULL,
        edition INT,
        isbn CHAR(13),
        number_pages INT,
        release_year INT,
        status INT NOT NULL DEFAULT 1 COMMENT '1=Free;2=Loaned;3=Lost',
        obs TEXT,

        genreId INT,
        publisherId INT,
        typeId INT,

        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

        CONSTRAINT PK_book PRIMARY KEY (id),

        CONSTRAINT FK_genre_book FOREIGN KEY (genreId) REFERENCES genre(id),
        CONSTRAINT FK_publisher_book FOREIGN KEY (publisherId) REFERENCES publisher(id),
        CONSTRAINT FK_type_book FOREIGN KEY (typeId) REFERENCES type(id)
    );`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE book;`);
  }
}
