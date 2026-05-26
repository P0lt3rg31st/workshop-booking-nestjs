import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from '../auth/auth.module';
import { UsersModule } from '../users/users.module';
import { Workshop } from '../workshops/workshop.entity';
import { WorkshopsModule } from '../workshops/workshops.module';
import { Booking } from './booking.entity';
import { BookingsController } from './bookings.controller';
import { BookingsService } from './bookings.service';

@Module({
  imports: [TypeOrmModule.forFeature([Booking, Workshop]), AuthModule, UsersModule, WorkshopsModule],
  controllers: [BookingsController],
  providers: [BookingsService],
})
export class BookingsModule {}
