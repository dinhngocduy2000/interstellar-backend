import { ApiProperty } from "@nestjs/swagger";
import { ResponseDataWithPagination } from "src/common/interface/response-data-with-pagination.js";
import { Conversation, Message } from "src/entities/index.js";

export class ConversationResponseDTO implements Conversation {
  @ApiProperty({
    description: "The ID of the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id: string;

  @ApiProperty({
    description: "The title of the conversation",
    example: "My first conversation",
  })
  title: string;

  @ApiProperty({
    description: "The description of the conversation",
    example: "This is a description of my first conversation",
  })
  description?: string;

  @ApiProperty({
    description: "The created_at of the conversation",
    example: "2021-01-01",
  })
  created_at: string;

  @ApiProperty({
    description: "The updated_at of the conversation",
    example: "2021-01-01",
  })
  updated_at: string;

  @ApiProperty({
    description: "Whether the conversation is pinned",
    example: false,
  })
  is_pinned: boolean;

  @ApiProperty({
    description: "The model of the conversation",
    example: "gpt-4o",
  })
  model: string;

  @ApiProperty({
    description: "The user ID of the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  user_id: string;

  @ApiProperty({
    description: "The messages of the conversation",
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        content: "Hello, how are you?",
      },
    ],
  })
  messages: Message[];

  @ApiProperty({
    description: "The deleted_at of the conversation",
    example: "2021-01-01",
  })
  deleted_at?: string;

  @ApiProperty({
    description: "The first_message of the conversation",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  first_message: string;

  @ApiProperty({
    description: "The conversation is newly created or not",
    example: false,
  })
  is_new: boolean;
}

export class ListConversationResponseDTO
  implements ResponseDataWithPagination<ConversationResponseDTO>
{
  @ApiProperty({
    description: "The conversations",
    type: [ConversationResponseDTO],
    example: [
      {
        id: "123e4567-e89b-12d3-a456-426614174000",
        title: "My first conversation",
        description: "This is a description of my first conversation",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
        is_pinned: false,
        model: "gpt-4o",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        messages: [],
        deleted_at: null,
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174001",
        title: "My second conversation",
        description: "This is a description of my second conversation",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
        is_pinned: false,
        model: "gpt-4o",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        messages: [],
        deleted_at: null,
      },
      {
        id: "123e4567-e89b-12d3-a456-426614174002",
        title: "My third conversation",
        description: "This is a description of my third conversation",
        created_at: "2021-01-01",
        updated_at: "2021-01-01",
        is_pinned: false,
        model: "gpt-4o",
        user_id: "123e4567-e89b-12d3-a456-426614174000",
        messages: [],
        deleted_at: null,
      },
    ],
  })
  data: ConversationResponseDTO[];

  @ApiProperty({
    description: "The total number of conversations",
    example: 10,
  })
  total: number;
}
