import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('phone_type')
export class PhoneType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'text' })
  typeName: string;
}
