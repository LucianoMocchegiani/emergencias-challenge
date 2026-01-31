import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  OneToMany,
} from 'typeorm';
import { Phone } from './phone.entity';
import { Address } from './address.entity';

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

  @OneToMany(() => Phone, (phone) => phone.person)
  phones: Phone[];

  @OneToMany(() => Address, (addr) => addr.person)
  addresses: Address[];
}
