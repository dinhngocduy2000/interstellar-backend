import { MigrationInterface, QueryRunner } from "typeorm";

export class GenerateConversationANdMessageTable1755708181019 implements MigrationInterface {
    name = 'GenerateConversationANdMessageTable1755708181019'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "conversations" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "description" character varying, "created_at" character varying DEFAULT '2025-08-20T16:43:02.463Z', "updated_at" character varying DEFAULT '2025-08-20T16:43:02.463Z', "deleted_at" character varying, "is_pinned" boolean NOT NULL DEFAULT false, "model" character varying NOT NULL, "user_id" character varying NOT NULL, CONSTRAINT "PK_ee34f4f7ced4ec8681f26bf04ef" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "message" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "author" character varying NOT NULL, "created_at" character varying DEFAULT '2025-08-20T16:43:02.463Z', "updated_at" character varying DEFAULT '2025-08-20T16:43:02.463Z', "is_upvote" boolean NOT NULL DEFAULT false, "is_downvote" boolean NOT NULL DEFAULT false, "content" character varying NOT NULL, "conversation_id" character varying NOT NULL, "conversationId" uuid, CONSTRAINT "PK_ba01f0a3e0123651915008bc578" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "message" ADD CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f" FOREIGN KEY ("conversationId") REFERENCES "conversations"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "message" DROP CONSTRAINT "FK_7cf4a4df1f2627f72bf6231635f"`);
        await queryRunner.query(`DROP TABLE "message"`);
        await queryRunner.query(`DROP TABLE "conversations"`);
    }

}
