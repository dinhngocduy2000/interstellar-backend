import { ConflictException, Injectable } from "@nestjs/common";
import { UserRepository } from "../users/user.repository.js";
import { RegisterDto } from "../users/dto/register.dto.js";
import bcrypt from "bcryptjs";
import { User } from "../users/entities/user.entity.js";
import { v4 as uuidv4 } from "uuid";

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<unknown> {
    const existingUser = await this.userRepository.findByUsername(
      registerDto.username
    );
    if (existingUser) {
      throw new ConflictException(
        "An account with this username already exist"
      );
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const data: User = {
      id: uuidv4(),
      email: registerDto.email,
      username: registerDto.username,
      password: hashedPassword,
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      role: "user",
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    await this.userRepository.create(data);
    return;
  }
}
