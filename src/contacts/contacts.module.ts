import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Person } from '../database/entities/person.entity';
import { Phone } from '../database/entities/phone.entity';
import { PhoneType } from '../database/entities/phone-type.entity';
import { Address } from '../database/entities/address.entity';
import { ContactsController } from './contacts.controller';
import { ContactsService } from './contacts.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Person, Phone, PhoneType, Address]),
  ],
  controllers: [ContactsController],
  providers: [ContactsService],
  exports: [ContactsService],
})
export class ContactsModule {}
