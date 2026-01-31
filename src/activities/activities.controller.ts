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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiQuery,
} from '@nestjs/swagger';
import { ActivitiesService } from './activities.service';
import { CreateActivityDto } from './dto/create-activity.dto';

const ACTIVITY_TYPES = ['call', 'meeting', 'email'];

@ApiTags('Activities')
@Controller('activities')
export class ActivitiesController {
  constructor(private readonly activitiesService: ActivitiesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear actividad de contacto' })
  @ApiBody({ type: CreateActivityDto })
  @ApiResponse({ status: 201, description: 'Actividad creada' })
  @ApiResponse({ status: 400, description: 'Validación fallida' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
  async create(@Body() dto: CreateActivityDto) {
    return this.activitiesService.create(dto);
  }

  @Get()
  @ApiOperation({ summary: 'Buscar actividades por contacto y tipo' })
  @ApiQuery({ name: 'personId', required: true, type: Number, description: 'ID del contacto' })
  @ApiQuery({
    name: 'activityType',
    required: true,
    enum: ['call', 'meeting', 'email'],
    description: 'Tipo de actividad',
  })
  @ApiResponse({ status: 200, description: 'Contacto y actividades encontrados' })
  @ApiResponse({ status: 400, description: 'personId o activityType inválidos' })
  @ApiResponse({ status: 404, description: 'Contacto no encontrado' })
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
