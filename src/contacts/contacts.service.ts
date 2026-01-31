import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../database/entities/person.entity';
import { Phone } from '../database/entities/phone.entity';
import { PhoneType } from '../database/entities/phone-type.entity';
import { Address } from '../database/entities/address.entity';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';

export interface FindByPersonalDataFilters {
  firstName?: string;
  lastName?: string;
  dateOfBirth?: string;
  email?: string;
}

@Injectable()
export class ContactsService {
  constructor(
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
    @InjectRepository(Phone)
    private readonly phoneRepo: Repository<Phone>,
    @InjectRepository(PhoneType)
    private readonly phoneTypeRepo: Repository<PhoneType>,
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}

  async create(dto: CreateContactDto): Promise<Person> {
    const existing = await this.personRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Un contacto con este email ya existe');
    }
    const person = this.personRepo.create(dto);
    const savedPerson = await this.personRepo.save(person);

    if (dto.phones?.length) {
      await this.validatePhoneTypeIds(dto.phones.map((p) => p.phoneTypeId));
      for (const p of dto.phones) {
        await this.phoneRepo.save(
          this.phoneRepo.create({ number: p.number, phoneTypeId: p.phoneTypeId, personId: savedPerson.id }),
        );
      }
    }
    if (dto.addresses?.length) {
      for (const a of dto.addresses) {
        await this.addressRepo.save(
          this.addressRepo.create({
            personId: savedPerson.id,
            locality: a.locality,
            street: a.street,
            number: a.number,
            notes: a.notes,
          }),
        );
      }
    }

    return savedPerson;
  }

  private async validatePhoneTypeIds(phoneTypeIds: number[]): Promise<void> {
    const uniqueIds = [...new Set(phoneTypeIds)];
    for (const id of uniqueIds) {
      const exists = await this.phoneTypeRepo.findOne({ where: { id } });
      if (!exists) {
        throw new BadRequestException(`Tipo de teléfono con id ${id} no existe`);
      }
    }
  }

  async findByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findOne({ where: { email } });
  }

  async findByPersonalData(filters: FindByPersonalDataFilters): Promise<Person[]> {
    const where: Partial<Person> = {};
    if (filters.firstName !== undefined && filters.firstName !== '') {
      where.firstName = filters.firstName;
    }
    if (filters.lastName !== undefined && filters.lastName !== '') {
      where.lastName = filters.lastName;
    }
    if (filters.dateOfBirth !== undefined && filters.dateOfBirth !== '') {
      where.dateOfBirth = filters.dateOfBirth;
    }
    if (filters.email !== undefined && filters.email !== '') {
      where.email = filters.email;
    }
    return this.personRepo.find({ where });
  }

  async findOne(id: number): Promise<Person | null> {
    return this.personRepo.findOne({ where: { id } });
  }

  async update(id: number, dto: UpdateContactDto): Promise<Person> {
    const person = await this.findOne(id);
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    if (dto.email !== undefined && dto.email !== person.email) {
      const existing = await this.personRepo.findOne({ where: { email: dto.email } });
      if (existing) {
        throw new ConflictException('Un contacto con este email ya existe');
      }
    }
    const { phones, addresses, ...personData } = dto;
    Object.assign(person, personData);
    await this.personRepo.save(person);

    if (phones !== undefined) {
      await this.phoneRepo.delete({ personId: id });
      if (phones.length) {
        await this.validatePhoneTypeIds(phones.map((p) => p.phoneTypeId));
        for (const p of phones) {
          await this.phoneRepo.save(
            this.phoneRepo.create({ number: p.number, phoneTypeId: p.phoneTypeId, personId: id }),
          );
        }
      }
    }
    if (addresses !== undefined) {
      await this.addressRepo.delete({ personId: id });
      if (addresses.length) {
        for (const a of addresses) {
          await this.addressRepo.save(
            this.addressRepo.create({
              personId: id,
              locality: a.locality,
              street: a.street,
              number: a.number,
              notes: a.notes,
            }),
          );
        }
      }
    }

    const updated = await this.personRepo.findOne({ where: { id } });
    return updated ?? person;
  }

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    await this.personRepo.remove(person);
  }
}
