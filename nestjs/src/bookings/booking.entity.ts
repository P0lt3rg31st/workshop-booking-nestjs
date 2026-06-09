import {
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Workshop } from '../workshops/workshop.entity';

@Entity('bookings')
@Unique('UQ_booking_user_workshop', ['user', 'workshop'])
export class Booking {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, (user) => user.bookings, { nullable: false, onDelete: 'CASCADE' })
  user: User;

  @ManyToOne(() => Workshop, (workshop) => workshop.bookings, { nullable: false, onDelete: 'CASCADE' })
  workshop: Workshop;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
