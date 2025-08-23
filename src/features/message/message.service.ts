import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { MessageRepository } from "./message.repository.js";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { Message } from "../../entities/index.js";
import { v4 as uuidv4 } from "uuid";
import { ConversationRepository } from "../conversation/conversation.repository.js";
import { Pagination } from "../../common/interface/pagination.js";
import { ListMessageRequestDTO } from "../../dto/message/list-message-request.dto.js";

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository
  ) {}

  async chat(
    messageRequest: MessageRequestDTO,
    conversation_id: string
  ): Promise<unknown> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException("Conversation not found");
      }
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
  async list_messages(
    conversation_id: string,
    listMessageRequest: ListMessageRequestDTO
  ): Promise<[Message[], number]> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException("Conversation not found");
      }
      const pagination: Pagination = {
        page: listMessageRequest.page,
        limit: listMessageRequest.limit,
      };
      const res = await this.messageRepository.list(
        conversation_id,
        pagination
      );
      return res;
    } catch (error) {
      console.log(
        `Error when geting messages for conversation ${conversation_id}: ${error}`
      );
      throw new InternalServerErrorException(error);
    }
  }
}
