import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
} from "@nestjs/common";
import { MessageService } from "./message.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { SuccessResponse } from "../../common/interface/success-response.js";
import { ListMessageRequestDTO } from "../../dto/message/list-message-request.dto.js";
import { ListMessageResponseDTO } from "../../dto/message/list-message-response.dto.js";

@ApiTags("chat")
@Controller("/chat")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post("/:conversation_id")
  @ApiOperation({
    summary: "Send a message to the chatbot",
    description: "Send a message to the chatbot",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message sent successfully",
    type: SuccessResponse,
  })
  async chat(
    @Body() messageRequest: MessageRequestDTO,
    @Param("conversation_id") conversation_id: string
  ): Promise<SuccessResponse> {
    await this.messageService.chat(messageRequest, conversation_id);
    const response: SuccessResponse = {
      message: "Message sent successfully",
      code: HttpStatus.OK,
    };
    return response;
  }

  @Get("/:conversation_id")
  @ApiOperation({
    summary: "Get messages for a conversation",
    description: "Get messages for a conversation",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Messages fetched successfully",
    type: ListMessageResponseDTO,
  })
  async listMessages(
    @Param("conversation_id") conversation_id: string,
    @Query() listMessageRequest: ListMessageRequestDTO
  ): Promise<ListMessageResponseDTO> {
    const [messages, total] = await this.messageService.list_messages(
      conversation_id,
      listMessageRequest
    );
    const response: ListMessageResponseDTO = {
      data: messages,
      total: total,
    };
    return response;
  }
}
