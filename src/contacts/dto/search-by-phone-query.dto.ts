import {
  IsString,
  IsInt,
  IsNotEmpty,
  MinLength,
  Matches,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class SearchByPhoneQueryDto {
  @ApiProperty({
    example: '+54 11 1234-5678',
    description:
      'Número de teléfono (acepta dígitos, espacios, guiones, paréntesis y +)',
  })
  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @MinLength(1, { message: 'El número de teléfono es requerido' })
  @Matches(/^[\d\s+\-()]+$/, {
    message:
      'El número de teléfono solo puede contener dígitos, espacios, guiones, paréntesis y el símbolo +',
  })
  number: string;

  @ApiProperty({
    example: 1,
    type: Number,
    description: 'ID del tipo de teléfono (ej. 1 móvil, 2 casa, 3 trabajo)',
  })
  @Type(() => Number)
  @IsInt({ message: 'phoneTypeId debe ser un número entero' })
  phoneTypeId: number;
}
