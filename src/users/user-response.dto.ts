import { Role } from './role.enum';

export interface UserResponseDto {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  createdAt: Date;
}
