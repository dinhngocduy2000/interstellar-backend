import { MiddlewareConsumer, Module } from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "../../entities/index.js";
import { MessageService } from "./message.service.js";
import { MessageController } from "./message.controller.js";
import { authMiddleware, JwtCookieAuthGuard } from "../../middlewares/auth.js";
import { ConversationModule } from "../conversation/conversation.module.js";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [TypeOrmModule.forFeature([Message]), ConversationModule],
  providers: [
    MessageRepository,
    MessageService,
    JwtCookieAuthGuard,
    JwtService,
  ],
  exports: [MessageRepository, MessageService],
  controllers: [MessageController],
})
export class MessageModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(authMiddleware)
      .exclude("chat/sse/:conversation_id")
      .forRoutes(MessageController);
  }
}
