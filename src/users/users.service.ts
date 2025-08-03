import {
  Injectable,
  ConflictException,
  BadRequestException,
} from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>
  ) {}

  async register(registerDto: RegisterDto): Promise<UserResponseDto> {
    const { email, username, password } = registerDto;

    // Check if user with email already exists
    const existingUserByEmail = await this.usersRepository.findOne({
      where: { email },
    });

    if (existingUserByEmail) {
      throw new ConflictException("User with this email already exists");
    }

    // Check if user with username already exists
    const existingUserByUsername = await this.usersRepository.findOne({
      where: { username },
    });

    if (existingUserByUsername) {
      throw new ConflictException("User with this username already exists");
    }

    // Hash password
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = this.usersRepository.create({
      email,
      username,
      password: hashedPassword,
    });

    const savedUser = await this.usersRepository.save(newUser);

    // Return user data without password
    const { password: _, ...userResponse } = savedUser;
    return userResponse as UserResponseDto;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { username } });
  }

  async findById(id: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { id } });
  }
}
