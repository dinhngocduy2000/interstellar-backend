import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import { IsNotEmpty, IsNumber, IsString } from "class-validator";
import { Pagination } from "src/common/interface/pagination.js";

export class ListMessageRequestDTO implements Pagination {
  @ApiProperty({
    description: "The page number",
    example: 1,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  page: number;

  @ApiProperty({
    description: "The number of items per page",
    example: 10,
  })
  @IsNotEmpty()
  @IsNumber()
  @Transform(({ value }) => parseInt(value, 10))
  limit: number;
}
