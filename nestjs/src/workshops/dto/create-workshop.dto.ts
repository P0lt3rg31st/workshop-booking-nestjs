import { IsDateString, IsInt, IsString, Max, Min, MinLength } from 'class-validator';

export class CreateWorkshopDto {
  @IsString()
  @MinLength(3)
  title: string;

  @IsString()
  @MinLength(10)
  description: string;

  @IsString()
  @MinLength(2)
  location: string;

  @IsDateString({}, { message: 'startsAt должен быть датой в ISO-формате' })
  startsAt: string;

  @IsInt()
  @Min(15)
  @Max(1440)
  durationMinutes: number;

  @IsInt()
  @Min(1)
  @Max(1000)
  capacity: number;
}
