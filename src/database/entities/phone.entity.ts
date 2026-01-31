import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { Person } from './person.entity';
import { PhoneType } from './phone-type.entity';

@Entity('phone')
@Index(['personId'])
@Index(['phoneTypeId'])
export class Phone {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  number: string;

  @Column()
  personId: number;

  @ManyToOne(() => Person, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'personId' })
  person: Person;

  @Column()
  phoneTypeId: number;

  @ManyToOne(() => PhoneType, { onDelete: 'RESTRICT' })
  @JoinColumn({ name: 'phoneTypeId' })
  phoneType: PhoneType;
}
