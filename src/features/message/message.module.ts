import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "../../entities/index.js";
import { MessageService } from "./message.service.js";
import { MessageController } from "./message.controller.js";
import { authMiddleware } from "../../middlewares/auth.js";
import { ConversationModule } from "../conversation/conversation.module.js";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationModule],
  providers: [MessageRepository, MessageService],
  exports: [MessageRepository, MessageService],
  controllers: [MessageController],
})
export class MessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(authMiddleware).forRoutes(MessageController);
  }
}
