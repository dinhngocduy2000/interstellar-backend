import { UsersService } from "./users.service";
import { RegisterDto } from "./dto/register.dto";
import { UserResponseDto } from "./dto/user-response.dto";
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UsersService);
    register(registerDto: RegisterDto): Promise<UserResponseDto>;
}
