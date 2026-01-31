import { IsString, IsOptional, IsInt, IsNotEmpty, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';

export class SearchByPhoneQueryDto {
  @IsString()
  @IsNotEmpty({ message: 'El número de teléfono es requerido' })
  @MinLength(1, { message: 'El número de teléfono es requerido' })
  number: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === undefined ? undefined : Number(value)))
  @IsInt({ message: 'phoneTypeId debe ser un número entero' })
  phoneTypeId?: number;

  @IsOptional()
  @IsString()
  typeName?: string;
}
