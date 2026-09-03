import { Prisma, User } from '@prisma/client';
import { UserRepository } from '../repositories/user.repository';
import { HashService } from './hash.service';
import { CreateUserPayload, UpdateUserPayload } from '../app/types/types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async getAllUsers(): Promise<User[]> {
    return this.userRepository.findAll();
  }

  async getUserById(id: string): Promise<User | null> {
    return this.userRepository.findById(id);
  }

  async createUser(data: CreateUserPayload): Promise<User> {
    // Hash the plain text password using the new HashService
    const hashedPassword = await HashService.hashPassword(data.password);
    
    // Check if user with email already exists
    const existingUser = await this.userRepository.findByEmail(data.email);
    if (existingUser) {
      throw new Error('User with this email already exists');
    }

    const { password, ...userData } = data;

    return this.userRepository.create({
      ...userData,
      passwordHash: hashedPassword
    });
  }

  async updateUser(id: string, data: UpdateUserPayload): Promise<User> {
    const { password, ...updateData } = data;
    const payload: any = { ...updateData };

    if (password) {
      payload.passwordHash = await HashService.hashPassword(password);
    }

    return this.userRepository.update(id, payload);
  }

  async deleteUser(id: string): Promise<User> {
    return this.userRepository.delete(id);
  }
}
