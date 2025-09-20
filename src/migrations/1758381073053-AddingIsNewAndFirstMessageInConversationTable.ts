import { MigrationInterface, QueryRunner } from "typeorm";

export class AddingIsNewAndFirstMessageInConversationTable1758381073053
  implements MigrationInterface
{
  name = "AddingIsNewAndFirstMessageInConversationTable1758381073053";

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "first_message" character varying NOT NULL DEFAULT 'test'`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ADD "is_new" boolean NOT NULL DEFAULT false`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "created_at" SET DEFAULT '2025-09-20T15:11:14.624Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "updated_at" SET DEFAULT '2025-09-20T15:11:14.624Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "created_at" SET DEFAULT '2025-09-20T15:11:14.624Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "updated_at" SET DEFAULT '2025-09-20T15:11:14.624Z'`
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "updated_at" SET DEFAULT '2025-08-20T16:43:02.463Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "message" ALTER COLUMN "created_at" SET DEFAULT '2025-08-20T16:43:02.463Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "updated_at" SET DEFAULT '2025-08-20T16:43:02.463Z'`
    );
    await queryRunner.query(
      `ALTER TABLE "conversations" ALTER COLUMN "created_at" SET DEFAULT '2025-08-20T16:43:02.463Z'`
    );
    await queryRunner.query(`ALTER TABLE "conversations" DROP COLUMN "is_new"`);
    await queryRunner.query(
      `ALTER TABLE "conversations" DROP COLUMN "first_message"`
    );
  }
}
