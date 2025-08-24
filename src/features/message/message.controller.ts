import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from "@nestjs/common";
import { MessageService } from "./message.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { MessageRequestDTO } from "../../dto/message/message-request.dto.js";
import { ListMessageRequestDTO } from "../../dto/message/list-message-request.dto.js";
import { ListMessageResponseDTO } from "../../dto/message/list-message-response.dto.js";
import { Response } from "express";
import { interval } from "rxjs";
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
    type: String,
    headers: {
      "Content-Type": {
        schema: {
          type: "text/event-stream",
          example: "text/event-stream",
        },
      },
      Connection: {
        schema: {
          type: "string",
          example: "keep-alive",
        },
      },
      "Access-Control-Allow-Origin": {
        schema: {
          type: "string",
          example: "*",
        },
      },
    },
  })
  async chat(
    @Body() messageRequest: MessageRequestDTO,
    @Param("conversation_id") conversation_id: string,
    @Res() res: Response
  ): Promise<unknown> {
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*"); // Adjust CORS as needed

    // Send a comment to keep the connection alive
    res.write(":ok\n\n");

    const response = await this.messageService.chat(
      messageRequest,
      conversation_id
    );

    // Simulate sending events every 5 seconds
    const subscription = interval(50).subscribe((count) => {
      const message = {
        id: count,
        event: "message",
        data: response[count],
      };
      // Send event in SSE format
      res.write(
        `id: ${message.id}\nevent: ${message.event}\ndata: ${JSON.stringify(message.data)}\n\n`
      );
      if (count === response.length - 1) {
        subscription.unsubscribe();
        res.end();
      }
    });

    // Handle client disconnect
    res.on("close", () => {
      subscription.unsubscribe();
      res.end();
    });
    return;
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
