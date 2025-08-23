import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { Message } from "../../entities/index.js";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class MessageService {
  constructor(private readonly messageRepository: MessageRepository) {}

  async chat(
    messageRequest: MessageRequestDTO,
    conversation_id: string
  ): Promise<unknown> {
    try {
      const messageEntity: Message = {
        id: uuidv4(),
        author: "user",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: messageRequest.content,
        conversation_id: conversation_id,
      };

      await this.messageRepository.create(messageEntity);
      return;
    } catch (error) {
      console.log(`Error in creating Message: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
