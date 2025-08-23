import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Message } from "../../entities/index.js";
import { Repository } from "typeorm";

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
}
