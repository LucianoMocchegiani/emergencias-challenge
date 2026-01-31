import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Person } from '../database/entities/person.entity';
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
  ) {}

  async create(dto: CreateContactDto): Promise<Person> {
    const existing = await this.personRepo.findOne({ where: { email: dto.email } });
    if (existing) {
      throw new ConflictException('Un contacto con este email ya existe');
    }
    const person = this.personRepo.create(dto);
    return this.personRepo.save(person);
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
    Object.assign(person, dto);
    return this.personRepo.save(person);
  }

  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    await this.personRepo.remove(person);
  }
}
