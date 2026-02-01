import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, Matches } from 'class-validator';

/**
 * DTO para validar los query params de búsqueda por datos personales.
 */
export class FindByPersonalDataQueryDto {
  @ApiPropertyOptional({
    description: 'Nombre del contacto',
    example: 'Juan',
  })
  @IsOptional()
  @IsString()
  firstName?: string;

  @ApiPropertyOptional({
    description: 'Apellido del contacto',
    example: 'Pérez',
  })
  @IsOptional()
  @IsString()
  lastName?: string;

  @ApiPropertyOptional({
    description: 'Fecha de nacimiento (formato YYYY-MM-DD)',
    example: '1990-05-15',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'dateOfBirth debe tener formato YYYY-MM-DD',
  })
  dateOfBirth?: string;

  @ApiPropertyOptional({
    description: 'Email del contacto',
    example: 'juan.perez@example.com',
  })
  @IsOptional()
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email?: string;
}
