import { Module } from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Message } from "../../entities/index.js";

@Module({
  imports: [TypeOrmModule.forFeature([Message])],
  providers: [MessageRepository],
  exports: [MessageRepository],
})
export class MessageModule {}
