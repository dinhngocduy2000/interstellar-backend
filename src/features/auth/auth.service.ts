import {
  BadRequestException,
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from "@nestjs/common";
import { UserRepository } from "../users/user.repository.js";
import { RegisterDto } from "../../dto/register.dto.js";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { LoginDto } from "../../dto/login.dto.js";
import { LoginResponseDto } from "../../dto/login-response.dto.js";
import { JwtPayload } from "../../common/interface/jwt-payload.js";
import jwt from "jsonwebtoken";
import { User } from "../../entities/index.js";

@Injectable()
export class AuthService {
  constructor(private userRepository: UserRepository) {}

  async register(registerDto: RegisterDto): Promise<unknown> {
    try {
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
    } catch (error) {
      console.error(`ERROR REGISTERING USER: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    try {
      const user = await this.userRepository.findByUsername(loginDto.username);
      if (!user) {
        throw new BadRequestException("Invalid username or password");
      }
      const isPasswordValid = await bcrypt.compare(
        loginDto.password,
        user.password
      );
      if (!isPasswordValid) {
        throw new BadRequestException("Invalid username or password");
      }
      const payload: JwtPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: Date.now(),
      };
      const accessToken = jwt.sign(payload, process.env.JWT_SECRET ?? "", {
        expiresIn: "1h",
      });
      const refreshToken = jwt.sign(payload, process.env.JWT_SECRET ?? "", {
        expiresIn: "7d",
      });
      return {
        accessToken: `${accessToken}`,
        refreshToken,
        expiresIn: 3600,
        email: user.email,
        username: user.username,
        role: user.role,
      } as LoginResponseDto;
    } catch (error) {
      console.error(`ERROR LOGGING IN: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<LoginResponseDto> {
    try {
      const decodedRefreshToken = jwt.verify(
        refreshToken,
        process.env.JWT_SECRET ?? ""
      ) as JwtPayload;
      if (!decodedRefreshToken) {
        console.log("Invalid refresh token");
        throw new UnauthorizedException("Invalid refresh token");
      }
      if (decodedRefreshToken.exp && decodedRefreshToken.exp < Date.now()) {
        console.log("Refresh token expired");
        throw new UnauthorizedException("Refresh token expired");
      }
      const user = await this.userRepository.findById(decodedRefreshToken.id);
      if (!user) {
        throw new UnauthorizedException("User not found");
      }
      const newTokenPayload: JwtPayload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        iat: Date.now(),
      };
      const newAccessToken = jwt.sign(
        newTokenPayload,
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: "1h",
        }
      );
      const newRefreshToken = jwt.sign(
        newTokenPayload,
        process.env.JWT_SECRET ?? "",
        {
          expiresIn: "7d",
        }
      );

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
        expiresIn: 3600,
        email: user.email,
        username: user.username,
        role: user.role,
      } as LoginResponseDto;
    } catch (error) {
      console.error(`ERROR REFRESHING TOKEN: ${error}`);
      throw new InternalServerErrorException(error);
    }
  }
}
