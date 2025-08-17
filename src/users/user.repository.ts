import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository, SelectQueryBuilder, In } from "typeorm";
import { User } from "./entities/user.entity.js";

@Injectable()
export class UserRepository {
  constructor(
    @InjectRepository(User)
    private readonly repository: Repository<User>
  ) {}

  // Basic CRUD operations
  async create(userData: Partial<User>): Promise<User> {
    const user = this.repository.create(userData);
    return this.repository.save(user);
  }

  async save(user: User): Promise<User> {
    return this.repository.save(user);
  }

  async findById(id: string): Promise<User | null> {
    return this.repository.findOne({ where: { id } });
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.repository.findOne({ where: { email } });
  }

  async findByUsername(username: string): Promise<User | null> {
    return this.repository.findOne({ where: { username } });
  }

  async findAll(): Promise<User[]> {
    return this.repository.find();
  }

  async update(id: string, updateData: Partial<User>): Promise<User | null> {
    await this.repository.update(id, updateData);
    return this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    return result.affected ? result.affected > 0 : false;
  }

  async softDelete(id: string): Promise<boolean> {
    const result = await this.repository.softDelete(id);
    return result.affected ? result.affected > 0 : false;
  }

  // Advanced query methods
  async findWithPagination(
    page: number = 1,
    limit: number = 10,
    filters?: {
      role?: string;
      search?: string;
      isActive?: boolean;
    }
  ): Promise<{
    users: User[];
    total: number;
    page: number;
    totalPages: number;
  }> {
    const queryBuilder = this.repository.createQueryBuilder("user");

    // Apply filters
    if (filters?.role) {
      queryBuilder.andWhere("user.role = :role", { role: filters.role });
    }

    if (filters?.search) {
      queryBuilder.andWhere(
        "(user.firstName ILIKE :search OR user.lastName ILIKE :search OR user.username ILIKE :search OR user.email ILIKE :search)",
        { search: `%${filters.search}%` }
      );
    }

    if (filters?.isActive !== undefined) {
      queryBuilder.andWhere("user.isActive = :isActive", {
        isActive: filters.isActive,
      });
    }

    // Get total count
    const total = await queryBuilder.getCount();

    // Apply pagination
    const offset = (page - 1) * limit;
    queryBuilder.orderBy("user.createdAt", "DESC").skip(offset).take(limit);

    const users = await queryBuilder.getMany();

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit),
    };
  }

  async findByRole(role: string): Promise<User[]> {
    return this.repository.find({ where: { role } });
  }

  async findActiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: true } });
  }

  async findInactiveUsers(): Promise<User[]> {
    return this.repository.find({ where: { isActive: false } });
  }

  async findUsersCreatedBetween(
    startDate: Date,
    endDate: Date
  ): Promise<User[]> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .orderBy("user.createdAt", "DESC")
      .getMany();
  }

  async findUsersByLastLogin(lastLoginThreshold: Date): Promise<User[]> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.lastLoginAt >= :lastLoginThreshold", { lastLoginThreshold })
      .orderBy("user.lastLoginAt", "DESC")
      .getMany();
  }

  async findUsersWithSimilarNames(name: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.firstName ILIKE :name OR user.lastName ILIKE :name", {
        name: `%${name}%`,
      })
      .getMany();
  }

  async findUsersByEmailDomain(domain: string): Promise<User[]> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.email LIKE :domain", { domain: `%@${domain}` })
      .getMany();
  }

  // Bulk operations
  async bulkUpdate(ids: string[], updateData: Partial<User>): Promise<number> {
    const result = await this.repository.update(ids, updateData);
    return result.affected || 0;
  }

  async bulkDelete(ids: string[]): Promise<number> {
    const result = await this.repository.delete(ids);
    return result.affected || 0;
  }

  // Statistics and analytics
  async getUserCount(): Promise<number> {
    return this.repository.count();
  }

  async getUserCountByRole(): Promise<{ role: string; count: number }[]> {
    return this.repository
      .createQueryBuilder("user")
      .select("user.role", "role")
      .addSelect("COUNT(user.id)", "count")
      .groupBy("user.role")
      .getRawMany();
  }

  async getUserCountByDateRange(
    startDate: Date,
    endDate: Date
  ): Promise<number> {
    return this.repository
      .createQueryBuilder("user")
      .where("user.createdAt BETWEEN :startDate AND :endDate", {
        startDate,
        endDate,
      })
      .getCount();
  }

  // Custom query builder for complex queries
  createQueryBuilder(alias: string = "user"): SelectQueryBuilder<User> {
    return this.repository.createQueryBuilder(alias);
  }

  // Transaction support
  async executeInTransaction<T>(
    operation: (repository: Repository<User>) => Promise<T>
  ): Promise<T> {
    return this.repository.manager.transaction(async (manager) => {
      const transactionRepository = manager.getRepository(User);
      return operation(transactionRepository);
    });
  }

  // Exists checks
  async existsById(id: string): Promise<boolean> {
    const count = await this.repository.count({ where: { id } });
    return count > 0;
  }

  async existsByEmail(email: string): Promise<boolean> {
    const count = await this.repository.count({ where: { email } });
    return count > 0;
  }

  async existsByUsername(username: string): Promise<boolean> {
    const count = await this.repository.count({ where: { username } });
    return count > 0;
  }

  // Find with relations
  async findByIdWithRelations(
    id: string,
    relations: string[] = []
  ): Promise<User | null> {
    return this.repository.findOne({ where: { id }, relations });
  }

  async findByEmailWithRelations(
    email: string,
    relations: string[] = []
  ): Promise<User | null> {
    return this.repository.findOne({ where: { email }, relations });
  }

  // Find multiple with relations - using In() instead of deprecated findByIds
  async findByIdsWithRelations(
    ids: string[],
    relations: string[] = []
  ): Promise<User[]> {
    return this.repository.find({ where: { id: In(ids) }, relations });
  }
}
