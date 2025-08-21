import { ApiProperty } from "@nestjs/swagger";

export class OrderOption {
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
}
