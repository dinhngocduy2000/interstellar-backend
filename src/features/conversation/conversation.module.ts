import { MiddlewareConsumer, Module } from "@nestjs/common";
import { ConversationController } from "./conversation.controller.js";
import { ConversationService } from "./conversation.service.js";
import { ConversationRepository } from "./conversation.repository.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Conversation } from "../../entities/index.js";
import { authMiddleware } from "../../middlewares/auth.js";

@Module({
  imports: [TypeOrmModule.forFeature([Conversation])],
  controllers: [ConversationController],
  providers: [ConversationService, ConversationRepository],
  exports: [ConversationService, ConversationRepository],
})
export class ConversationModule {
  configure(consume: MiddlewareConsumer) {
    consume.apply(authMiddleware).forRoutes(ConversationController);
  }
}
