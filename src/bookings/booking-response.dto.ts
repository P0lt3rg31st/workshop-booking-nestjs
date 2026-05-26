import { WorkshopResponseDto } from '../workshops/workshop-response.dto';

export interface BookingResponseDto {
  id: string;
  createdAt: Date;
  workshop: WorkshopResponseDto;
}
