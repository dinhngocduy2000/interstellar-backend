import {
  Controller,
  Get,
  HttpStatus,
  Query,
  Request,
  ValidationPipe,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConversationRequestDTO } from "../../dto/conversation/conversation-request.dto.js";
import { JwtPayload } from "../../common/interface/jwt-payload.js";
import { ListConversationResponseDTO } from "../../dto/conversation/conversation-response.dto.js";
@ApiTags("conversation")
@Controller("/conversation")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get("/")
  @ApiOperation({ summary: "Get all conversations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversations fetched successfully",
    type: ListConversationResponseDTO,
  })
  async getListConversations(
    @Query(ValidationPipe) query: ConversationRequestDTO,
    @Request() req: JwtPayload
  ): Promise<ListConversationResponseDTO> {
    const [conversations, total] =
      await this.conversationService.getListConversations(query, req.id);
    return {
      data: conversations,
      total: total,
    };
  }
}
