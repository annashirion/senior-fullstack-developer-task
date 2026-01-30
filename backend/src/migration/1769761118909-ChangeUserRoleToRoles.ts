import { MigrationInterface, QueryRunner } from "typeorm";

export class ChangeUserRoleToRoles1769761118909 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
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
                CASE 
                    WHEN role = 'Admin' THEN '["Admin"]'
                    WHEN role = 'Editor' THEN '["Editor"]'
                    WHEN role = 'User' THEN '["User"]'
                    ELSE json_array(role)
                END as roles,
                status
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
                role TEXT NOT NULL DEFAULT 'User',
                status INTEGER NULL
            )
        `);

        await queryRunner.query(`
            INSERT INTO users_new (id, username, role, status)
            SELECT 
                id, 
                username, 
                COALESCE(json_extract(roles, '$[0]'), 'User') as role,
                status
            FROM users
        `);

        await queryRunner.query(`DROP TABLE users`);
        await queryRunner.query(`ALTER TABLE users_new RENAME TO users`);
    }

}
