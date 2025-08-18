import { Injectable, ConflictException } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "./dto/register.dto.js";
import { User } from "./entities/user.entity.js";
import { UserResponseDto } from "./dto/user-response.dto.js";
import { UserRepository } from "./user.repository.js";

@Injectable()
export class UsersService {
  constructor(private userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { email, username, password } = registerDto;

    // Check if user with email already exists
    const existingUserByEmail = await this.userRepository.findByEmail(email);

    if (existingUserByEmail) {
      throw new ConflictException("User with this email already exists");
    }

    // Check if user with username already exists
    const existingUserByUsername =
      await this.userRepository.findByUsername(username);

    if (existingUserByUsername) {
      throw new ConflictException("User with this username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await this.userRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    // Return user data without password
    const { password: _password, ...userResponse } = newUser;
    return userResponse as UserResponseDto;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.userRepository.findByEmail(email);
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.userRepository.findByUsername(username);
  }

  async findById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  // Additional methods using the repository
  async findAll(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    return this.userRepository.update(id, updateData);
  }

  async delete(id: string): Promise<boolean> {
    return this.userRepository.delete(id);
  }

  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: {
      role?: string;
      search?: string;
      isActive?: boolean;
    }
  ) {
    return this.userRepository.findWithPagination(page, limit, filters);
  }

  async findByRole(role: string): Promise<User[]> {
    return this.userRepository.findByRole(role);
  }

  async getUserCount(): Promise<number> {
    return this.userRepository.getUserCount();
  }

  async getUserCountByRole(): Promise<{ role: string; count: number }[]> {
    return this.userRepository.getUserCountByRole();
  }
}
