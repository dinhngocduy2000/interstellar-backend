import { User } from "./entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";
export declare class UsersService {
    constructor();
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
