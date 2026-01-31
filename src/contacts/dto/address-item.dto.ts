import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AddressItemDto {
  @ApiProperty({ example: 'CABA' })
  @IsString()
  @MinLength(1)
  locality: string;

  @ApiProperty({ example: 'Av. Corrientes' })
  @IsString()
  @MinLength(1)
  street: string;

  @ApiProperty({ example: 1234, type: Number })
  @IsInt()
  @Type(() => Number)
  number: number;

  @ApiPropertyOptional({ example: 'Oficina' })
  @IsOptional()
  @IsString()
  notes?: string;
}
