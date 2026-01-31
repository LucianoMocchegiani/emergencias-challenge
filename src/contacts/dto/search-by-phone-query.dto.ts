import {
  IsString,
  IsOptional,
  IsInt,
  IsNotEmpty,
  MinLength,
} from 'class-validator';
import { Transform } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SearchByPhoneQueryDto {
  @ApiProperty({ example: '+541112345678', description: 'Número de teléfono' })
  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @MinLength(1, { message: 'El número de teléfono es requerido' })
  number: string;

  @ApiPropertyOptional({
    example: 1,
    type: Number,
    description: 'ID del tipo de teléfono',
  })
  @IsOptional()
  @Transform(({ value }) =>
    value === '' || value === undefined ? undefined : Number(value),
  )
  @IsInt({ message: 'phoneTypeId debe ser un número entero' })
  phoneTypeId?: number;

  @ApiPropertyOptional({
    example: 'móvil',
    description: 'Nombre del tipo (alternativa a phoneTypeId)',
  })
  @IsOptional()
  @IsString()
  typeName?: string;
}
