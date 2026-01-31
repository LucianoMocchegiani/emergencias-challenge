import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Person } from './person.entity';

export enum ActivityType {
  Call = 'call',
  Meeting = 'meeting',
  Email = 'email',
}

@Entity('contact_activities')
@Index(['personId'])
@Index(['activityType'])
export class ContactActivity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personId: number;

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column({ type: 'text' })
  activityType: ActivityType;

  @Column({ type: 'text' })
  activityDate: string;

  @Column({ type: 'text', nullable: true })
  description: string;
}
