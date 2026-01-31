import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsInt,
  IsString,
  IsIn,
  IsOptional,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

const ACTIVITY_TYPES = ['call', 'meeting', 'email'] as const;

export class CreateActivityDto {
  @ApiProperty({ example: 1, description: 'ID del contacto (Person)' })
  @IsInt()
  @Type(() => Number)
  personId: number;

  @ApiProperty({
    enum: ['call', 'meeting', 'email'],
    example: 'call',
    description: 'Tipo de actividad',
  })
  @IsString()
  @IsIn(ACTIVITY_TYPES, {
    message: 'activityType debe ser uno de: call, meeting, email',
  })
  activityType: (typeof ACTIVITY_TYPES)[number];

  @ApiProperty({
    example: '2025-01-15T10:00:00Z',
    description: 'Fecha de la actividad (ISO string o formato legible)',
  })
  @IsString()
  @IsNotEmpty({ message: 'activityDate es requerido' })
  @MinLength(1, { message: 'activityDate es requerido' })
  activityDate: string;

  @ApiPropertyOptional({
    example: 'Llamada de seguimiento',
    description: 'Descripción opcional de la actividad',
  })
  @IsOptional()
  @IsString()
  description?: string;
}
