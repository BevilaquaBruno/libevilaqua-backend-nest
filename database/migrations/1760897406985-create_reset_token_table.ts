import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateResetTokenTable1760897406985 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE reset_tokens (
                id INT NOT NULL AUTO_INCREMENT,
                userId INT NOT NULL,
                token VARCHAR(255) NOT NULL,
                expiresAt DATETIME NOT NULL,

                used BOOLEAN NOT NULL DEFAULT FALSE,

                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

                CONSTRAINT PK_reset_password PRIMARY KEY (id),

                CONSTRAINT FK_reset_tokens_user FOREIGN KEY (userId) REFERENCES user(id) ON DELETE CASCADE
            );
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE reset_tokens;`);
    }

}
