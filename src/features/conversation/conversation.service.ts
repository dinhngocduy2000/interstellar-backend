import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConversationRepository } from "./conversation.repository.js";
import { ConversationRequestDTO } from "../../dto/conversation/conversation-request.dto.js";
import { Pagination } from "../../common/interface/pagination.js";
import { OrderOption } from "../../common/interface/order-option.js";
import { Conversation } from "../../entities/index.js";

@Injectable()
export class ConversationService {
  constructor(private readonly conversationRepository: ConversationRepository) {
    this.conversationRepository = conversationRepository;
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

      const [conversations, total] = await Promise.all([
        this.conversationRepository.list(
          conversationQuery,
          pagination,
          orderOption
        ),
        this.conversationRepository.count(conversationQuery),
      ]);
      return [conversations, total];
    } catch (error) {
      console.log(`Error in getListConversations: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
