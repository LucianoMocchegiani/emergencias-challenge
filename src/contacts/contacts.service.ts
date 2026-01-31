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

  /**
   * Crea un contacto (Person) y opcionalmente sus teléfonos y direcciones.
   * @param dto Datos del contacto; phones y addresses son opcionales.
   * @returns La Person creada.
   * @throws ConflictException si ya existe un contacto con el mismo email.
   * @throws BadRequestException si algún phoneTypeId no existe en PhoneType.
   */
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

  /** Valida que todos los phoneTypeId existan en la tabla PhoneType. Lanza BadRequestException si alguno no existe. */
  private async validatePhoneTypeIds(phoneTypeIds: number[]): Promise<void> {
    const uniqueIds = [...new Set(phoneTypeIds)];
    for (const id of uniqueIds) {
      const exists = await this.phoneTypeRepo.findOne({ where: { id } });
      if (!exists) {
        throw new BadRequestException(`Tipo de teléfono con id ${id} no existe`);
      }
    }
  }

  /**
   * Busca un contacto por email.
   * @param email Email del contacto.
   * @returns La Person con ese email o null si no existe.
   */
  async findByEmail(email: string): Promise<Person | null> {
    return this.personRepo.findOne({ where: { email } });
  }

  /**
   * Busca contactos por datos personales (filtros opcionales).
   * @param filters firstName, lastName, dateOfBirth, email (todos opcionales).
   * @returns Lista de Person que coinciden con los filtros enviados.
   */
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

  /**
   * Busca un contacto por id.
   * @param id ID del contacto.
   * @returns La Person con ese id o null si no existe.
   */
  async findOne(id: number): Promise<Person | null> {
    return this.personRepo.findOne({ where: { id } });
  }

  /**
   * Busca el contacto (Person) que tiene un teléfono con el número y tipo dados.
   * @param number Número de teléfono
   * @param phoneTypeId ID del tipo de teléfono (opcional si se pasa typeName)
   * @param typeName Nombre del tipo de teléfono (opcional si se pasa phoneTypeId). Si ambos están presentes, se usa phoneTypeId.
   * @returns La Person que tiene ese teléfono con ese tipo, o null si no existe. Si hay varios, devuelve la primera.
   * @throws BadRequestException si number vacío, si no se proporciona phoneTypeId ni typeName, o si el tipo no existe.
   */
  async findContactByPhoneNumberAndType(
    number: string,
    phoneTypeId?: number,
    typeName?: string,
  ): Promise<Person | null> {
    const num = typeof number === 'string' ? number.trim() : '';
    if (!num) {
      throw new BadRequestException('El número de teléfono es requerido');
    }

    const hasId =
      phoneTypeId !== undefined &&
      phoneTypeId !== null &&
      (typeof phoneTypeId === 'number' || String(phoneTypeId).trim() !== '');
    const hasName = typeName !== undefined && typeName !== null && String(typeName).trim() !== '';
    if (!hasId && !hasName) {
      throw new BadRequestException('Debe proporcionar phoneTypeId o typeName');
    }

    let resolvedPhoneTypeId: number;
    if (hasId) {
      const typeExists = await this.phoneTypeRepo.findOne({ where: { id: Number(phoneTypeId) } });
      if (!typeExists) {
        throw new BadRequestException('Tipo de teléfono no válido o no existe');
      }
      resolvedPhoneTypeId = Number(phoneTypeId);
    } else {
      const typeByName = await this.phoneTypeRepo.findOne({
        where: { typeName: String(typeName).trim() },
      });
      if (!typeByName) {
        throw new BadRequestException('Tipo de teléfono no válido o no existe');
      }
      resolvedPhoneTypeId = typeByName.id;
    }

    const phone = await this.phoneRepo
      .createQueryBuilder('phone')
      .innerJoinAndSelect('phone.person', 'person')
      .where('phone.number = :number', { number: num })
      .andWhere('phone.phoneTypeId = :phoneTypeId', { phoneTypeId: resolvedPhoneTypeId })
      .getOne();

    return phone?.person ?? null;
  }

  /**
   * Actualiza un contacto por id. Si se envían phones o addresses, reemplazan los existentes.
   * @param id ID del contacto.
   * @param dto Campos a actualizar (todos opcionales); phones y addresses reemplazan por completo si se envían.
   * @returns La Person actualizada.
   * @throws NotFoundException si el contacto no existe.
   * @throws ConflictException si se cambia el email y ya existe otro contacto con ese email.
   * @throws BadRequestException si algún phoneTypeId no existe en PhoneType.
   */
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

  /**
   * Elimina un contacto por id. Los teléfonos y direcciones se borran en cascada.
   * @param id ID del contacto.
   * @throws NotFoundException si el contacto no existe.
   */
  async remove(id: number): Promise<void> {
    const person = await this.findOne(id);
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    await this.personRepo.remove(person);
  }
}
