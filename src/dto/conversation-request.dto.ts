import { ApiProperty } from "@nestjs/swagger";
import { UUID } from "crypto";
import { Pagination } from "src/common/interface/pagination.js";

export class ConversationRequestDTO extends Pagination {
  @ApiProperty({
    description: "The field to sort by",
    default: "created_at",
    example: "created_at",
  })
  sort_by?: string;

  @ApiProperty({
    description: "The direction to sort by",
    default: "asc",
    example: "asc",
    enum: ["asc", "desc"],
  })
  sort_direction?: "asc" | "desc";

  @ApiProperty({
    description: "Whether to filter by pinned conversations",
    default: false,
    example: false,
  })
  is_pinned?: boolean;

  @ApiProperty({
    description: "The user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  user_id?: UUID;

  @ApiProperty({
    description: "The title of the conversation",
    default: "",
    example: "My first conversation",
  })
  title?: string;

  @ApiProperty({
    description: "The description of the conversation",
    default: "",
    example: "This is a description of my first conversation",
  })
  description?: string;
}
