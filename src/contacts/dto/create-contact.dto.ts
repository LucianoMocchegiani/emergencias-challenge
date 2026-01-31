import {
  IsString,
  IsEmail,
  IsOptional,
  MinLength,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PhoneItemDto } from './phone-item.dto';
import { AddressItemDto } from './address-item.dto';

export class CreateContactDto {
  @IsString()
  @MinLength(1)
  firstName: string;

  @IsString()
  @MinLength(1)
  lastName: string;

  @IsOptional()
  @IsString()
  dateOfBirth?: string;

  @IsEmail()
  email: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PhoneItemDto)
  phones?: PhoneItemDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AddressItemDto)
  addresses?: AddressItemDto[];
}
