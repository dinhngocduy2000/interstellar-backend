import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Post,
  Query,
  Request,
  ValidationPipe,
} from "@nestjs/common";
import { ConversationService } from "./conversation.service.js";
import { ApiOperation, ApiResponse, ApiTags } from "@nestjs/swagger";
import { ConversationRequestDTO } from "../../dto/conversation/conversation-request.dto.js";
import { JwtPayload } from "../../common/interface/jwt-payload.js";
import {
  ConversationResponseDTO,
  ListConversationResponseDTO,
} from "../../dto/conversation/conversation-response.dto.js";
import { SuccessResponse } from "../../common/interface/success-response.js";
import { ConversationCreateRequestDTO } from "../../dto/conversation/conversation-create-request.dto.js";
import { Request as MiddlewareRequest } from "express";
import { ConversationPinRequestDTO } from "../../dto/conversation/conversation-pin-request.dto.js";

@ApiTags("conversations")
@Controller("/conversations")
export class ConversationController {
  constructor(private readonly conversationService: ConversationService) {}

  @Get("/pinned")
  @ApiOperation({ summary: "Get all pinned conversations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversations fetched successfully",
    type: ListConversationResponseDTO,
  })
  async getPinnedConversations(
    @Query(ValidationPipe) query: ConversationRequestDTO,
    @Request() req: MiddlewareRequest
  ): Promise<ListConversationResponseDTO> {
    const user = req.user as JwtPayload;
    const [conversations, total] =
      await this.conversationService.getPinnedConversation(query, user.id);
    return {
      data: conversations,
      total: total,
    };
  }

  @Post("/pinned/:id")
  @ApiOperation({
    summary: "Pin/unpin a conversation",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversation pinned/unpinned successfully",
    type: SuccessResponse,
  })
  async pinConversation(
    @Param("id") id: string,
    @Body() conversationPinRequest: ConversationPinRequestDTO
  ): Promise<SuccessResponse> {
    await this.conversationService.pinConversation(id, conversationPinRequest);
    return {
      message: "Conversation pinned successfully",
      code: HttpStatus.OK,
    };
  }

  @Get("/")
  @ApiOperation({ summary: "Get all conversations" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversations fetched successfully",
    type: ListConversationResponseDTO,
  })
  async getListConversations(
    @Query(ValidationPipe) query: ConversationRequestDTO,
    @Request() req: MiddlewareRequest
  ): Promise<ListConversationResponseDTO> {
    const user = req.user as JwtPayload;
    const [conversations, total] =
      await this.conversationService.getListConversations(query, user.id);
    return {
      data: conversations,
      total: total,
    };
  }

  @Post("/")
  @ApiOperation({ summary: "Create a conversation" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversation created successfully",
    type: SuccessResponse,
  })
  async createConversation(
    @Body() conversationCreateRequest: ConversationCreateRequestDTO,
    @Request() req: MiddlewareRequest
  ): Promise<SuccessResponse> {
    const user = req.user as JwtPayload;
    await this.conversationService.createConversation(
      conversationCreateRequest,
      user.id
    );
    const successResponse: SuccessResponse = {
      message: "Conversation created successfully",
      code: HttpStatus.OK,
    };
    return successResponse;
  }

  @Delete("/:id")
  @ApiOperation({ summary: "Delete a conversation" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversation deleted successfully",
    type: SuccessResponse,
  })
  async deleteConversation(@Param("id") id: string): Promise<SuccessResponse> {
    await this.conversationService.deleteConversation(id);
    const successResponse: SuccessResponse = {
      message: "Conversation deleted successfully",
      code: HttpStatus.OK,
    };
    return successResponse;
  }

  @Get("/:id")
  @ApiOperation({ summary: "Get a conversation" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Conversation fetched successfully",
    type: ConversationResponseDTO,
  })
  async getConversation(
    @Param("id") id: string,
    @Request() req: MiddlewareRequest
  ): Promise<ConversationResponseDTO> {
    const user = req.user as JwtPayload;
    const conversation = await this.conversationService.getConversation(
      id,
      user.id
    );
    return conversation;
  }
}
