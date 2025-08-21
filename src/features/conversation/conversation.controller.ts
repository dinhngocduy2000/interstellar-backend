import { Controller, Get, HttpStatus, Query, Request } from "@nestjs/common";
import { ConversationService } from "./conversation.service.js";
import { ApiOperation, ApiResponse } from "@nestjs/swagger";
import { ConversationRequestDTO } from "../../dto/conversation-request.dto.js";
import { JwtPayload } from "../../common/interface/jwt-payload.js";
import { ResponseDataWithPagination } from "../../common/interface/response-data-with-pagination.js";
import { Conversation } from "../../entities/index.js";

@Controller("conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get("")
  @ApiOperation({ summary: "Get all conversations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversations fetched successfully",
    type: ResponseDataWithPagination<Conversation>,
  })
  async getListConversations(
    @Query() query: ConversationRequestDTO,
    @Request() req: JwtPayload
  ): Promise<ResponseDataWithPagination<Conversation>> {
    const [conversations, total] =
      await this.conversationService.getListConversations(query, req.id);
    return {
      data: conversations,
      total: total,
    };
  }
}
