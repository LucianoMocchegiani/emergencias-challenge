import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ContactActivity } from '../database/entities/contact-activity.entity';
import { Person } from '../database/entities/person.entity';

@Injectable()
export class ActivitiesService {
  constructor(
    @InjectRepository(ContactActivity)
    private readonly activityRepo: Repository<ContactActivity>,
    @InjectRepository(Person)
    private readonly personRepo: Repository<Person>,
  ) {}
}
