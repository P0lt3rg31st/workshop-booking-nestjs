import { IsEmail, IsString, MinLength } from 'class-validator';

export class RegisterDto {
  @IsEmail({}, { message: 'Email должен быть корректным' })
  email: string;

  @IsString()
  @MinLength(2, { message: 'Имя должно содержать минимум 2 символа' })
  displayName: string;

  @IsString()
  @MinLength(6, { message: 'Пароль должен содержать минимум 6 символов' })
  password: string;
}
