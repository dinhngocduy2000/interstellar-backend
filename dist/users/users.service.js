"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsersService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bcrypt = require("bcryptjs");
const user_entity_1 = require("./entities/user.entity");
let UsersService = class UsersService {
    usersRepository;
    constructor(usersRepository) {
        this.usersRepository = usersRepository;
    }
    async register(registerDto) {
        const { email, username, password } = registerDto;
        const existingUserByEmail = await this.usersRepository.findOne({
            where: { email },
        });
        if (existingUserByEmail) {
            throw new common_1.ConflictException("User with this email already exists");
        }
        const existingUserByUsername = await this.usersRepository.findOne({
            where: { username },
        });
        if (existingUserByUsername) {
            throw new common_1.ConflictException("User with this username already exists");
        }
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = this.usersRepository.create({
            email,
            username,
            password: hashedPassword,
        });
        const savedUser = await this.usersRepository.save(newUser);
        const { password: _, ...userResponse } = savedUser;
        return userResponse;
    }
    async findByEmail(email) {
        return this.usersRepository.findOne({ where: { email } });
    }
    async findByUsername(username) {
        return this.usersRepository.findOne({ where: { username } });
    }
    async findById(id) {
        return this.usersRepository.findOne({ where: { id } });
    }
};
exports.UsersService = UsersService;
exports.UsersService = UsersService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_entity_1.User)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UsersService);
//# sourceMappingURL=users.service.js.map