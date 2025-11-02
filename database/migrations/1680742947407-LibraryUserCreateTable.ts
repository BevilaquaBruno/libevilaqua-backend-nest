import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryUserCreateTable1680742947407 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE library_user (
                id INT NOT NULL AUTO_INCREMENT,
                userId INT,
                libraryId INT,
                email_verified_at DATETIME default NULL,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT PK_library PRIMARY KEY (id),
                CONSTRAINT FK_library_user FOREIGN KEY (libraryId) references library(id) ON DELETE CASCADE,
                CONSTRAINT FK_user_library FOREIGN KEY (userId) references user(id) ON DELETE CASCADE
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE library_user;`);
    }
}
