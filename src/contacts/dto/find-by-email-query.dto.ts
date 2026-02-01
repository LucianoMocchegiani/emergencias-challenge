import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty } from 'class-validator';

/**
 * DTO para validar el query param de búsqueda por email.
 */
export class FindByEmailQueryDto {
  @ApiProperty({
    description: 'Email del contacto a buscar',
    example: 'juan.perez@example.com',
  })
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El formato del email no es válido' })
  email: string;
}
