import { IsString, IsInt, IsOptional, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class AddressItemDto {
  @IsString()
  @MinLength(1)
  locality: string;

  @IsString()
  @MinLength(1)
  street: string;

  @IsInt()
  @Type(() => Number)
  number: number;

  @IsOptional()
  @IsString()
  notes?: string;
}
