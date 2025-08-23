import {
  Body,
  Controller,
  HttpStatus,
  Param,
  Post,
  ValidationPipe,
} from "@nestjs/common";
import { MessageService } from "./message.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { SuccessResponse } from "../../common/interface/success-response.js";

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
}
