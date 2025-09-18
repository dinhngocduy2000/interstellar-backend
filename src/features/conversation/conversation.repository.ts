import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Pagination } from "../../common/interface/pagination.js";
import { Conversation } from "../../entities/index.js";
import { IsNull, Repository } from "typeorm";
import { OrderOption } from "../../common/interface/order-option.js";

@Injectable()
export class ConversationRepository {
  constructor(
    @InjectRepository(Conversation)
    private readonly repository: Repository<Conversation>
  ) {}

  async create(conversation: Conversation): Promise<Conversation> {
    const newConversation = this.repository.create(conversation);
    return await this.repository.save(newConversation);
  }

  async edit(
    id: string,
    conversation: Partial<Conversation>
  ): Promise<unknown> {
    await this.repository.update(id, conversation);
    return;
  }

  async delete(id: string): Promise<unknown> {
    await this.repository.delete(id);
    return;
  }

  async get(
    conversationQuery: Partial<Conversation>
  ): Promise<Conversation | null> {
    return await this.repository.findOne({
      where: { ...conversationQuery, deleted_at: IsNull() },
    });
  }

  async list(
    conversationQuery: Partial<Conversation>,
    pagination?: Pagination,
    orderOption?: OrderOption
  ): Promise<[Conversation[], number]> {
    return await this.repository.findAndCount({
      where: { ...conversationQuery, deleted_at: IsNull() },
      order: orderOption
        ? {
            [orderOption?.sort_by ?? "updated_at"]:
              orderOption?.sort_direction ?? "das",
          }
        : {
            updated_at: "DESC",
          },
      skip: pagination ? (pagination?.page - 1) * pagination?.limit : undefined,
      take: pagination ? pagination?.limit : undefined,
    });
  }
}
