import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async register(dto: RegisterDto) {
    const passwordHash = await bcrypt.hash(dto.password, 10);
    const user = await this.usersService.create({
      email: dto.email,
      displayName: dto.displayName,
      passwordHash,
    });

    return {
      accessToken: await this.createToken({ sub: user.id, email: user.email, role: user.role }),
      user: this.usersService.toResponse(user),
    };
  }

  async login(dto: LoginDto) {
    const user = await this.usersService.findByEmail(dto.email);

    if (!user) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    const passwordIsValid = await bcrypt.compare(dto.password, user.passwordHash);

    if (!passwordIsValid) {
      throw new UnauthorizedException('Неверный email или пароль');
    }

    return {
      accessToken: await this.createToken({ sub: user.id, email: user.email, role: user.role }),
      user: this.usersService.toResponse(user),
    };
  }

  private async createToken(payload: JwtPayload): Promise<string> {
    return this.jwtService.signAsync(payload);
  }
}
