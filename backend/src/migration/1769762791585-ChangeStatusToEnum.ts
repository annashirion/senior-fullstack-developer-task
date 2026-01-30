import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeStatusToEnum1769762791585 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
         await queryRunner.query(`
            CREATE TABLE users_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                roles TEXT NOT NULL DEFAULT '["User"]',
                status TEXT NOT NULL DEFAULT 'Enabled'
            )
        `);

        await queryRunner.query(`
            INSERT INTO users_new (id, username, roles, status)
            SELECT 
                id, 
                username, 
                roles,
                CASE 
                    WHEN status = 1 THEN 'Enabled'
                    WHEN status = 0 THEN 'Disabled'
                    WHEN status IS NULL THEN 'Enabled'
                    ELSE 'Enabled'
                END as status
            FROM users
        `);

        await queryRunner.query(`DROP TABLE users`);
        await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE users_new (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL UNIQUE,
                roles TEXT NOT NULL DEFAULT '["User"]',
                status INTEGER NULL
            )
        `);

        await queryRunner.query(`
            INSERT INTO users_new (id, username, roles, status)
            SELECT 
                id, 
                username, 
                roles,
                CASE 
                    WHEN status = 'Enabled' THEN 1
                    WHEN status = 'Disabled' THEN 0
                    WHEN status = 'Deleted' THEN 0
                    ELSE NULL
                END as status
            FROM users
        `);

        await queryRunner.query(`DROP TABLE users`);
        await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
    }

}
