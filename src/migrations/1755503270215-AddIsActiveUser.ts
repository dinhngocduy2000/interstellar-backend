import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsActiveUser1755503270215 implements MigrationInterface {
    name = 'AddIsActiveUser1755503270215'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "isActive" boolean NOT NULL DEFAULT true`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isActive"`);
    }

}
