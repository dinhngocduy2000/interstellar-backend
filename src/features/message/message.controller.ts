import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Query,
  Res,
  Sse,
  MessageEvent,
  UseGuards,
} from "@nestjs/common";
import { MessageService } from "./message.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { ListMessageRequestDTO } from "../../dto/message/list-message-request.dto.js";
import { ListMessageResponseDTO } from "../../dto/message/list-message-response.dto.js";
import { Response } from "express";
import { interval, map, Observable, take } from "rxjs";
import { SuccessResponse } from "../../common/interface/success-response.js";
import { MessageUpvoteRequestDTO } from "../../dto/message/message-upvote-request.dto.js";
import { MessageDownvoteRequestDTO } from "../../dto/message/message-downvote-request.dto.js";
import { JwtCookieAuthGuard } from "../../middlewares/auth.js";
@ApiTags("chat")
@Controller("/chat")
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Sse("/sse/:conversation_id")
  @UseGuards(JwtCookieAuthGuard) // JWT guard for authentication
  @ApiOperation({
    summary: "Send a message to the chatbot",
    description: "Send a message to the chatbot",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message sent successfully",
    type: String,
  })
  async chat(
    @Query() messageRequest: MessageRequestDTO,
    @Param("conversation_id") conversation_id: string,
    @Res() res: Response
  ): Promise<Observable<MessageEvent>> {
    const response = await this.messageService.chat(
      messageRequest,
      conversation_id
    );
    let index = 0;
    res.on("close", () => {
      console.log("Client disconnected");
      // Cleanup: e.g., remove from active connections map
      res.end();
    });
    return interval(10).pipe(
      // Emit every 500ms
      map(() => {
        // If we've sent all characters, start over or stop based on your needs
        if (index >= response.length) {
          index = 0; // Reset to loop, or you could complete the observable
        }
        const char = response[index];
        index++;
        if (index === response.length) {
          return { data: "end", type: "end" } as MessageEvent;
        }
        return { data: char } as MessageEvent; // Send one character
      }),
      take(response.length)
    );
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

  @Put("/upvote/:message_id")
  @ApiOperation({
    summary: "Upvote a message",
    description: "Upvote a message",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message upvoted successfully",
    type: SuccessResponse,
  })
  async upvoteMessage(
    @Param("message_id") message_id: string,
    @Body() messageUpvoteRequest: MessageUpvoteRequestDTO
  ): Promise<SuccessResponse> {
    await this.messageService.upvote_message(message_id, messageUpvoteRequest);
    return {
      message: "Message upvoted successfully",
      code: HttpStatus.OK,
    };
  }

  @Put("/downvote/:message_id")
  @ApiOperation({
    summary: "Downvote a message",
    description: "Downvote a message",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Message downvoted successfully",
    type: SuccessResponse,
  })
  async downvoteMessage(
    @Param("message_id") message_id: string,
    @Body() messageDownvoteRequest: MessageDownvoteRequestDTO
  ): Promise<SuccessResponse> {
    await this.messageService.downvote_message(
      message_id,
      messageDownvoteRequest
    );
    return {
      message: "Message downvoted successfully",
      code: HttpStatus.OK,
    };
  }
}
