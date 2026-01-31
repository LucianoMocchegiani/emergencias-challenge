import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PhoneItemDto } from './phone-item.dto';
import { AddressItemDto } from './address-item.dto';

export class CreateContactDto {
  @ApiProperty({ example: 'Juan' })
  @IsString()
  @MinLength(1)
  firstName: string;

  @ApiProperty({ example: 'Pérez' })
  @IsString()
  @MinLength(1)
  lastName: string;

  @ApiPropertyOptional({ example: '1990-05-15' })
  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @ApiProperty({ example: 'juan@example.com' })
  @IsEmail()
  email: string;

  @ApiPropertyOptional({ type: [PhoneItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneItemDto)
  phones?: PhoneItemDto[];

  @ApiPropertyOptional({ type: [AddressItemDto] })
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressItemDto)
  addresses?: AddressItemDto[];
}
