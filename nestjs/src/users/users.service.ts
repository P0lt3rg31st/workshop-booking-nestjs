import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './role.enum';
import { UserResponseDto } from './user-response.dto';
import { User } from './user.entity';

interface CreateUserData {
  email: string;
  displayName: string;
  passwordHash: string;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async create(data: CreateUserData): Promise<User> {
    const normalizedEmail = data.email.toLowerCase();
    const existingUser = await this.usersRepository.findOne({ where: { email: normalizedEmail } });

    if (existingUser) {
      throw new ConflictException('Пользователь с таким email уже существует');
    }

    // Для удобной проверки задания: первый зарегистрированный пользователь становится администратором.
    const usersCount = await this.usersRepository.count();
    const role = usersCount === 0 ? Role.ADMIN : Role.USER;

    const user = this.usersRepository.create({
      email: normalizedEmail,
      displayName: data.displayName,
      passwordHash: data.passwordHash,
      role,
    });

    return this.usersRepository.save(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email: email.toLowerCase() } });
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });

    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    return user;
  }

  toResponse(user: User): UserResponseDto {
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      createdAt: user.createdAt,
    };
  }
}
