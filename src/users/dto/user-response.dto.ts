import { ApiProperty, ApiResponse } from "@nestjs/swagger";

export class UserResponseDto {
  @ApiProperty({
    description: "The ID of the user",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  id!: string;

  @ApiProperty({
    description: "The email of the user",
    example: "john@example.com",
  })
  email!: string;

  @ApiProperty({
    description: "The username of the user",
    example: "john_doe",
  })
  username!: string;

  @ApiProperty({
    description: "The date and time the user was created",
    example: "2021-01-01T00:00:00.000Z",
  })
  createdAt!: Date;
}
