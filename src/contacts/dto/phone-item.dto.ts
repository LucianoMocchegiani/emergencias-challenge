import { IsString, IsInt, MinLength, Matches } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneItemDto {
  @ApiProperty({
    example: '+54 11 1234-5678',
    description:
      'Número de teléfono (acepta dígitos, espacios, guiones, paréntesis y +)',
  })
  @IsString()
  @MinLength(1, { message: 'El número de teléfono no puede estar vacío' })
  @Matches(/^[\d\s+\-()]+$/, {
    message:
      'El número de teléfono solo puede contener dígitos, espacios, guiones, paréntesis y el símbolo +',
  })
  number: string;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @Type(() => Number)
  phoneTypeId: number;
}
