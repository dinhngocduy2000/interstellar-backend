import { Repository } from "typeorm";
import { User } from "./entities/user.entity";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";
export declare class UsersService {
    private usersRepository;
    constructor(usersRepository: Repository<User>);
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
    findByEmail(email: string): Promise<User | null>;
    findByUsername(username: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
}
