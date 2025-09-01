import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from "@nestjs/common";
import { ConversationRepository } from "./conversation.repository.js";
import { ConversationRequestDTO } from "../../dto/conversation/conversation-request.dto.js";
import { Pagination } from "../../common/interface/pagination.js";
import { OrderOption } from "../../common/interface/order-option.js";
import { Conversation } from "../../entities/index.js";
import { DataSource } from "typeorm";
import { ConversationCreateRequestDTO } from "../../dto/conversation/conversation-create-request.dto.js";
import { v4 as uuidv4 } from "uuid";
import { ConversationPinRequestDTO } from "../../dto/conversation/conversation-pin-request.dto.js";

@Injectable()
export class ConversationService {
  constructor(
    private readonly conversationRepository: ConversationRepository,
    private readonly dataSource: DataSource
  ) {
    this.conversationRepository = conversationRepository;
    this.dataSource = dataSource;
  }

  async getConversation(id: string, user_id: string): Promise<Conversation> {
    try {
      const conversation = await this.conversationRepository.get({
        id: id,
        user_id: user_id,
      });
      if (!conversation) {
        console.error(`Conversation not found or already deleted`);
        throw new BadRequestException(
          "Conversation not found or already deleted"
        );
      }
      return conversation;
    } catch (error) {
      console.error(`Error in getConversation: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async getListConversations(
    query: ConversationRequestDTO,
    user_id: string
  ): Promise<[Conversation[], number]> {
    try {
      const pagination: Pagination = {
        page: query.page,
        limit: query.limit,
      };

      let orderOption: OrderOption | undefined = undefined;

      if (query.sort_by && query.sort_direction) {
        orderOption = {
          sort_by: query.sort_by,
          sort_direction: query.sort_direction,
        };
      }

      const conversationQuery: Partial<Conversation> = {};
      conversationQuery.user_id = user_id;
      if (query.is_pinned !== undefined) {
        conversationQuery.is_pinned = query.is_pinned;
      }
      if (query.title) {
        conversationQuery.title = query.title;
      }

      if (query.created_at) {
        conversationQuery.created_at = query.created_at;
      }

      if (query.updated_at) {
        conversationQuery.updated_at = query.updated_at;
      }

      const [conversations, total] = await this.conversationRepository.list(
        conversationQuery,
        pagination,
        orderOption
      );
      return [conversations, total];
    } catch (error) {
      console.log(`Error in getListConversations: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async createConversation(
    conversationCreateRequest: ConversationCreateRequestDTO,
    user_id: string
  ): Promise<unknown> {
    try {
      const conversation: Conversation = {
        id: uuidv4(),
        title: conversationCreateRequest.title,
        description: conversationCreateRequest.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        deleted_at: undefined,
        is_pinned: false,
        model: conversationCreateRequest.model,
        user_id: user_id,
        messages: [],
      };
      await this.conversationRepository.create(conversation);
      return;
    } catch (error) {
      console.error(`Error when creating a Conversation: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async deleteConversation(id: string): Promise<unknown> {
    try {
      const conversation = await this.conversationRepository.get({ id: id });
      if (!conversation) {
        console.error(`Conversation not found or already deleted`);
        throw new BadRequestException(
          "Conversation not found or already deleted"
        );
      }
      await this.conversationRepository.edit(id, {
        deleted_at: new Date().toISOString(),
      });
      return;
    } catch (error) {
      console.error(`Error when deleting a Conversation: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async getPinnedConversation(
    query: ConversationRequestDTO,
    user_id: string
  ): Promise<[Conversation[], number]> {
    try {
      const pagination: Pagination = {
        page: query.page,
        limit: query.limit,
      };
      const orderOption: OrderOption = {
        sort_by: "created_at",
        sort_direction: "desc",
      };
      const conversationQuery: Partial<Conversation> = {
        user_id: user_id,
        is_pinned: true,
      };
      const [conversations, total] = await this.conversationRepository.list(
        conversationQuery,
        pagination,
        orderOption
      );
      return [conversations, total];
    } catch (error) {
      console.error(`Error when getting pinned conversations: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
  async pinConversation(
    conversation_id: string,
    conversationPinRequest: ConversationPinRequestDTO
  ): Promise<unknown> {
    try {
      const conversation = await this.conversationRepository.get({
        id: conversation_id,
      });
      if (!conversation) {
        throw new BadRequestException(
          "Conversation not found or already deleted"
        );
      }
      await this.conversationRepository.edit(conversation_id, {
        is_pinned: conversationPinRequest.is_pinned,
      });
      return;
    } catch (error) {
      console.error(`Error when ${`pin/unpin`} a conversation: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
