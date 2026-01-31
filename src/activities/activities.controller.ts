import {
  Controller,
  Post,
  Get,
  Body,
  Query,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

const ACTIVITY_TYPES = ['call', 'meeting', 'email'];

@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get()
  async findByContactAndType(
    @Query('personId') personId: string,
    @Query('activityType') activityType: string,
  ) {
    if (
      personId === undefined ||
      personId === null ||
      String(personId).trim() === ''
    ) {
      throw new BadRequestException('El query param personId es requerido');
    }
    if (
      activityType === undefined ||
      activityType === null ||
      String(activityType).trim() === ''
    ) {
      throw new BadRequestException('El query param activityType es requerido');
    }
    const type = String(activityType).trim().toLowerCase();
    if (!ACTIVITY_TYPES.includes(type)) {
      throw new BadRequestException(
        'activityType debe ser uno de: call, meeting, email',
      );
    }
    const id = Number(personId);
    if (Number.isNaN(id)) {
      throw new BadRequestException('personId debe ser un número entero');
    }
    return this.activitiesService.findByContactAndType(id, type);
  }
}
