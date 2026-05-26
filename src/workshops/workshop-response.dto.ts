export interface WorkshopResponseDto {
  id: string;
  title: string;
  description: string;
  location: string;
  startsAt: Date;
  durationMinutes: number;
  capacity: number;
  bookedSeats: number;
  availableSeats: number;
  createdAt: Date;
  updatedAt: Date;
}
