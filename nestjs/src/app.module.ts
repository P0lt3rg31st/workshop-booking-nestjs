import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { Booking } from './bookings/booking.entity';
import { BookingsModule } from './bookings/bookings.module';
import { User } from './users/user.entity';
import { UsersModule } from './users/users.module';
import { Workshop } from './workshops/workshop.entity';
import { WorkshopsModule } from './workshops/workshops.module';
import { HealthController } from './health.controller';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'sqljs',
      location: process.env.SQLITE_DATABASE || 'data/workshop_booking.sqlite',
      autoSave: true,
      entities: [User, Workshop, Booking],
      synchronize: true,
      logging: false,
    }),
    UsersModule,
    AuthModule,
    WorkshopsModule,
    BookingsModule,
  ],
  controllers: [HealthController],
})
export class AppModule {}
