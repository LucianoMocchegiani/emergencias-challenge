import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  ContactActivity,
  ActivityType,
} from '../database/entities/contact-activity.entity';
import { Person } from '../database/entities/person.entity';
import { CreateActivityDto } from './dto/create-activity.dto';

/** Resultado de búsqueda de actividades por contacto y tipo: datos del contacto y lista de actividades. */
export interface ContactActivitiesResult {
  contact: {
    firstName: string;
    lastName: string;
    email: string;
    dateOfBirth: string | null;
  };
  activities: ContactActivity[];
}

/** Servicio de actividades de contacto: creación y búsqueda por contacto y tipo. */
@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ContactActivity)
    private readonly activityRepo: Repository<ContactActivity>,
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
  ) {}

  /**
   * Crea una actividad asociada a un contacto.
   * @param dto personId, activityType ('call'|'meeting'|'email'), activityDate, description (opcional).
   * @returns La actividad creada.
   * @throws NotFoundException si el contacto (personId) no existe.
   */
  async create(dto: CreateActivityDto): Promise<ContactActivity> {
    const person = await this.personRepo.findOne({ where: { id: dto.personId } });
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    const activity = this.activityRepo.create({
      personId: dto.personId,
      activityType: dto.activityType as ActivityType,
      activityDate: dto.activityDate,
      description: dto.description,
    });
    return this.activityRepo.save(activity);
  }

  /**
   * Busca actividades de un contacto por tipo (call, meeting, email). Devuelve datos del contacto y la lista de actividades.
   * @param personId ID del contacto.
   * @param activityType Tipo de actividad: 'call', 'meeting' o 'email'.
   * @returns Objeto con contact (firstName, lastName, email, dateOfBirth) y activities (array). activities puede ser [].
   * @throws NotFoundException si el contacto no existe.
   */
  async findByContactAndType(
    personId: number,
    activityType: string,
  ): Promise<ContactActivitiesResult> {
    const person = await this.personRepo.findOne({ where: { id: personId } });
    if (!person) {
      throw new NotFoundException('Contacto no encontrado');
    }
    const activities = await this.activityRepo.find({
      where: { personId, activityType: activityType as ActivityType },
      order: { activityDate: 'ASC' },
    });
    return {
      contact: {
        firstName: person.firstName,
        lastName: person.lastName,
        email: person.email,
        dateOfBirth: person.dateOfBirth ?? null,
      },
      activities,
    };
  }
}
