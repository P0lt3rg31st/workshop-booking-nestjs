import { IsUUID } from 'class-validator';

export class CreateBookingDto {
  @IsUUID('4', { message: 'workshopId должен быть UUID' })
  workshopId: string;
}
