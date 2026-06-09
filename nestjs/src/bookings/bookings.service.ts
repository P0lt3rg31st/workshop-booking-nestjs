import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsersService } from '../users/users.service';
import { WorkshopsService } from '../workshops/workshops.service';
import { BookingResponseDto } from './booking-response.dto';
import { Booking } from './booking.entity';
import { CreateBookingDto } from './dto/create-booking.dto';

@Injectable()
export class BookingsService {
  constructor(
    @InjectRepository(Booking)
    private readonly bookingsRepository: Repository<Booking>,
    private readonly workshopsService: WorkshopsService,
    private readonly usersService: UsersService,
  ) {}

  async create(userId: string, dto: CreateBookingDto): Promise<BookingResponseDto> {
    const user = await this.usersService.findById(userId);
    const workshop = await this.workshopsService.findEntityWithBookings(dto.workshopId);

    if (workshop.startsAt <= new Date()) {
      throw new BadRequestException('Нельзя записаться на прошедший мастер-класс');
    }

    const existingBooking = await this.bookingsRepository.findOne({
      where: {
        user: { id: userId },
        workshop: { id: dto.workshopId },
      },
    });

    if (existingBooking) {
      throw new ConflictException('Вы уже записаны на этот мастер-класс');
    }

    const bookedSeats = await this.bookingsRepository.count({
      where: { workshop: { id: dto.workshopId } },
    });

    if (bookedSeats >= workshop.capacity) {
      throw new BadRequestException('На мастер-класс уже нет свободных мест');
    }

    const booking = this.bookingsRepository.create({ user, workshop });

    try {
      const savedBooking = await this.bookingsRepository.save(booking);
      return this.toResponse(savedBooking);
    } catch {
      // Дублирование дополнительно защищено уникальным ограничением в БД.
      throw new ConflictException('Вы уже записаны на этот мастер-класс');
    }
  }

  async findMine(userId: string): Promise<BookingResponseDto[]> {
    const bookings = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.workshop', 'workshop')
      .leftJoinAndSelect('workshop.bookings', 'workshopBooking')
      .where('booking.userId = :userId', { userId })
      .orderBy('booking.createdAt', 'DESC')
      .getMany();

    return bookings.map((booking) => this.toResponse(booking));
  }

  async cancel(userId: string, bookingId: string): Promise<void> {
    const booking = await this.bookingsRepository
      .createQueryBuilder('booking')
      .leftJoinAndSelect('booking.user', 'user')
      .where('booking.id = :bookingId', { bookingId })
      .andWhere('user.id = :userId', { userId })
      .getOne();

    if (!booking) {
      throw new NotFoundException('Бронирование не найдено');
    }

    await this.bookingsRepository.remove(booking);
  }

  private toResponse(booking: Booking): BookingResponseDto {
    return {
      id: booking.id,
      createdAt: booking.createdAt,
      workshop: this.workshopsService.toResponse(booking.workshop),
    };
  }
}
