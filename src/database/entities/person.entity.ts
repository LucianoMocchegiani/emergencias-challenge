import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
} from 'typeorm';

@Entity('person')
export class Person {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  firstName: string;

  @Column({ type: 'text' })
  lastName: string;

  @Column({ type: 'text', nullable: true })
  dateOfBirth: string;

  @Column({ type: 'text' })
  email: string;
}
