import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Person } from './person.entity';

@Entity('address')
@Index(['personId'])
export class Address {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  personId: number;

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column({ type: 'text' })
  locality: string;

  @Column({ type: 'text' })
  street: string;

  @Column({ type: 'integer' })
  number: number;

  @Column({ type: 'text', nullable: true })
  notes: string;
}
