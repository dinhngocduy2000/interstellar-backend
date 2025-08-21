import { Injectable, InternalServerErrorException } from "@nestjs/common";
import { ConversationRepository } from "./conversation.repository.js";
import { ConversationRequestDTO } from "../../dto/conversation-request.dto.js";
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

      const [conversations, total] = await Promise.all([
        this.conversationRepository.list(
          { ...query, user_id: user_id },
          pagination,
          orderOption
        ),
        this.conversationRepository.count({ ...query, user_id: user_id }),
      ]);
      return [conversations, total];
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
