import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
import OpenAI, { OpenAIError } from "openai";
import { ResponseCreateParamsNonStreaming } from "openai/resources/responses/responses.js";
import { Stream } from "openai/streaming";
import { MessageUpvoteRequestDTO } from "../../dto/message/message-upvote-request.dto.js";

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepository: MessageRepository,
    private readonly conversationRepository: ConversationRepository
  ) {}

  async chat(
    messageRequest: MessageRequestDTO,
    conversation_id: string
  ): Promise<// Stream<OpenAI.Responses.ResponseStreamEvent> & {
  //   _request_id?: string | null;
  // }
  string> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException("Conversation not found");
      }

      // --------------- Update database -------------

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

      const openai_response = "Hello, how can i help you today?";
      const botReplyEntity: Message = {
        id: uuidv4(),
        author: "bot",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        is_upvote: false,
        is_downvote: false,
        content: messageRequest.content,
        conversation_id: conversation_id,
      };

      await Promise.all([
        this.messageRepository.create(messageEntity),
        this.messageRepository.create(botReplyEntity),
      ]);

      // --------------- OpenAI generate response -------------
      const openai_input: ResponseCreateParamsNonStreaming = {
        model: "gpt-4o",
        input: [
          {
            role: "user",
            content: messageRequest.content,
          },
        ],
      };
      return openai_response;
    } catch (error) {
      console.log(`Error in creating Message: ${error}`);
      if (error instanceof OpenAIError) {
        throw new HttpException(error.message, HttpStatus.TOO_MANY_REQUESTS);
      }
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

  async upvote_message(
    message_id: string,
    message_upvote_request: MessageUpvoteRequestDTO
  ): Promise<unknown> {
    try {
      const message = await this.messageRepository.get({
        id: message_id,
      });
      if (!message) {
        console.error(`Message not found or has been deleted`);
        throw new BadRequestException("Message not found or has been deleted");
      }
      await this.messageRepository.edit(message_id, {
        is_upvote: message_upvote_request.upvote,
      });
      return;
    } catch (error) {
      console.error(`Error when upvoting message ${message_id}: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async openai_chat(openai_input: ResponseCreateParamsNonStreaming): Promise<
    Stream<OpenAI.Responses.ResponseStreamEvent> & {
      _request_id?: string | null;
    }
  > {
    try {
      const client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
      const openai_response = await client.responses.create({
        ...openai_input,
        stream: true,
      });
      for await (const chunk of openai_response) {
        console.log(chunk);
      }
      return openai_response;
    } catch (error) {
      const openai_error: OpenAIError = error;
      console.log(`Error in openai_chat: ${openai_error}`);
      // if (openai_error.code === RateLimitError) {
      //   console.log("Rate limit exceeded");
      //   throw new BadRequestException("Rate limit exceeded");
      // }
      throw new OpenAIError(error);
    }
  }
}
