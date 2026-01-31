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
  @IsInt()
  @Type(() => Number)
  personId: number;

  @IsString()
  @IsIn(ACTIVITY_TYPES, {
    message: 'activityType debe ser uno de: call, meeting, email',
  })
  activityType: (typeof ACTIVITY_TYPES)[number];

  @IsString()
  @IsNotEmpty({ message: 'activityDate es requerido' })
  @MinLength(1, { message: 'activityDate es requerido' })
  activityDate: string;

  @IsOptional()
  @IsString()
  description?: string;
}
