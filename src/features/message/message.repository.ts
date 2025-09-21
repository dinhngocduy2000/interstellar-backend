import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../../entities/index.js";
import { Repository } from "typeorm";
import { Pagination } from "../../common/interface/pagination.js";

@Injectable()
export class MessageRepository {
  constructor(
    @InjectRepository(Message)
    private readonly repository: Repository<Message>
  ) {
    this.repository = repository;
  }

  async create(message: Message): Promise<unknown> {
    const newMessage = this.repository.create(message);
    return await this.repository.save(newMessage);
  }

  async list(
    conversation_id: string,
    pagination: Pagination
  ): Promise<[Message[], number]> {
    const list_messages = await this.repository.findAndCount({
      where: {
        conversation_id: conversation_id,
      },
      order: {
        created_at: "ASC",
      },
      skip: (pagination.page - 1) * pagination.limit,
      take: pagination.limit,
    });
    return list_messages;
  }

  async get(messageQuery: Partial<Message>): Promise<Message | null> {
    return await this.repository.findOne({
      where: { ...messageQuery },
    });
  }

  async edit(id: string, message: Partial<Message>): Promise<unknown> {
    await this.repository.update(id, message);
    return;
  }
}
