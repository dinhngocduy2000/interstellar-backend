import { ApiProperty } from "@nestjs/swagger";

export class Pagination {
  @ApiProperty({
    description: "The page number",
    example: 1,
  })
  page: number;

  @ApiProperty({
    description: "The number of items per page",
    example: 10,
  })
  limit: number;
}
