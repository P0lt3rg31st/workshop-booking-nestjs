import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateWorkshopDto } from './dto/create-workshop.dto';
import { UpdateWorkshopDto } from './dto/update-workshop.dto';
import { WorkshopResponseDto } from './workshop-response.dto';
import { Workshop } from './workshop.entity';

@Injectable()
export class WorkshopsService {
  constructor(
    @InjectRepository(Workshop)
    private readonly workshopsRepository: Repository<Workshop>,
  ) {}

  async findAll(): Promise<WorkshopResponseDto[]> {
    // LEFT JOIN заранее подтягивает бронирования и помогает не получить N+1 при расчёте свободных мест.
    const workshops = await this.workshopsRepository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.bookings', 'booking')
      .orderBy('workshop.startsAt', 'ASC')
      .getMany();

    return workshops.map((workshop) => this.toResponse(workshop));
  }

  async findOne(id: string): Promise<WorkshopResponseDto> {
    const workshop = await this.findEntityWithBookings(id);
    return this.toResponse(workshop);
  }

  async create(dto: CreateWorkshopDto): Promise<WorkshopResponseDto> {
    this.validateFutureDate(dto.startsAt);

    const workshop = this.workshopsRepository.create({
      ...dto,
      startsAt: new Date(dto.startsAt),
    });

    const savedWorkshop = await this.workshopsRepository.save(workshop);
    return this.toResponse({ ...savedWorkshop, bookings: [] });
  }

  async update(id: string, dto: UpdateWorkshopDto): Promise<WorkshopResponseDto> {
    const workshop = await this.findEntityWithBookings(id);

    if (dto.startsAt) {
      this.validateFutureDate(dto.startsAt);
      workshop.startsAt = new Date(dto.startsAt);
    }

    if (dto.title !== undefined) workshop.title = dto.title;
    if (dto.description !== undefined) workshop.description = dto.description;
    if (dto.location !== undefined) workshop.location = dto.location;
    if (dto.durationMinutes !== undefined) workshop.durationMinutes = dto.durationMinutes;
    if (dto.capacity !== undefined) {
      const bookedSeats = workshop.bookings?.length || 0;

      if (dto.capacity < bookedSeats) {
        throw new BadRequestException('Новая вместимость не может быть меньше количества броней');
      }

      workshop.capacity = dto.capacity;
    }

    const savedWorkshop = await this.workshopsRepository.save(workshop);
    return this.toResponse(savedWorkshop);
  }

  async remove(id: string): Promise<void> {
    const workshop = await this.findEntityWithBookings(id);
    await this.workshopsRepository.remove(workshop);
  }

  async findEntityWithBookings(id: string): Promise<Workshop> {
    const workshop = await this.workshopsRepository
      .createQueryBuilder('workshop')
      .leftJoinAndSelect('workshop.bookings', 'booking')
      .where('workshop.id = :id', { id })
      .getOne();

    if (!workshop) {
      throw new NotFoundException('Мастер-класс не найден');
    }

    return workshop;
  }

  toResponse(workshop: Workshop): WorkshopResponseDto {
    const bookedSeats = workshop.bookings?.length || 0;

    return {
      id: workshop.id,
      title: workshop.title,
      description: workshop.description,
      location: workshop.location,
      startsAt: workshop.startsAt,
      durationMinutes: workshop.durationMinutes,
      capacity: workshop.capacity,
      bookedSeats,
      availableSeats: workshop.capacity - bookedSeats,
      createdAt: workshop.createdAt,
      updatedAt: workshop.updatedAt,
    };
  }

  private validateFutureDate(value: string): void {
    const startsAt = new Date(value);

    if (Number.isNaN(startsAt.getTime())) {
      throw new BadRequestException('Некорректная дата начала мастер-класса');
    }

    if (startsAt <= new Date()) {
      throw new BadRequestException('Нельзя создать мастер-класс на прошедшую дату');
    }
  }
}
