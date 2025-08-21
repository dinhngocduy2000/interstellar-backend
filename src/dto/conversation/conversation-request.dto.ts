// src/dto/conversation-request.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import {
  IsOptional,
  IsString,
  IsBoolean,
  IsUUID,
  IsInt,
  Min,
} from "class-validator";
import { Transform } from "class-transformer";
import { Pagination } from "../../common/interface/pagination.js";

export class ConversationRequestDTO implements Pagination {
  @ApiProperty({
    description: "Page number for pagination",
    example: 1,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  page: number;

  @ApiProperty({
    description: "Number of items per page",
    example: 10,
    required: false,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;

  @ApiProperty({
    description: "The field to sort by",
    default: "created_at",
    example: "created_at",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  sort_by?: string;

  @ApiProperty({
    description: "The direction to sort by",
    default: "asc",
    example: "asc",
    enum: ["asc", "desc"],
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  sort_direction?: "asc" | "desc";

  @ApiProperty({
    description: "Whether to filter by pinned conversations",
    default: false,
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === "true" || value === true)
  is_pinned?: boolean;

  @ApiProperty({
    description: "The user ID",
    example: "123e4567-e89b-12d3-a456-426614174000",
    required: false,
  })
  @IsOptional()
  @IsUUID()
  user_id?: string;

  @ApiProperty({
    description: "The title of the conversation",
    default: "",
    example: "My first conversation",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  title?: string;

  @ApiProperty({
    description: "The description of the conversation",
    default: "",
    example: "This is a description of my first conversation",
    required: false,
  })
  @IsOptional()
  @IsString()
  @Transform(({ value }) => value?.trim())
  description?: string;

  @ApiProperty({
    description: "The created_at of the conversation",
    default: "",
    example: "2021-01-01",
    required: false,
  })
  @IsOptional()
  @IsString()
  created_at?: string;

  @ApiProperty({
    description: "The updated_at of the conversation",
    default: "",
    example: "2021-01-01",
    required: false,
  })
  @IsOptional()
  @IsString()
  updated_at?: string;
}
