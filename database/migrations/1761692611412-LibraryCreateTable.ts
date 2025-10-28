import { MigrationInterface, QueryRunner } from "typeorm";

export class LibraryCreateTable1761692611412 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE library (
                id INT NOT NULL AUTO_INCREMENT,
                description VARCHAR(50) NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                CONSTRAINT PK_library PRIMARY KEY (id)
            );`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE library;`);
    }
}
