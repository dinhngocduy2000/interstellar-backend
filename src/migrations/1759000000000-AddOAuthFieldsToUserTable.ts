import { MigrationInterface, QueryRunner } from "typeorm";

export class AddOAuthFieldsToUserTable1759000000000
  implements MigrationInterface
{
  name = "AddOAuthFieldsToUserTable1759000000000";

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Make existing fields nullable for OAuth users
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" DROP NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastName" DROP NOT NULL`
    );

    // Add OAuth fields
    await queryRunner.query(
      `ALTER TABLE "users" ADD "oauthProvider" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "oauthProviderId" character varying`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ADD "emailVerified" boolean NOT NULL DEFAULT false`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove OAuth fields
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "emailVerified"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauthProviderId"`);
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "oauthProvider"`);

    // Restore NOT NULL constraints
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "lastName" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "firstName" SET NOT NULL`
    );
    await queryRunner.query(
      `ALTER TABLE "users" ALTER COLUMN "password" SET NOT NULL`
    );
  }
}

