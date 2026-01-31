import { IsString, IsInt, MinLength } from 'class-validator';
import { Type } from 'class-transformer';

export class PhoneItemDto {
  @IsString()
  @MinLength(1)
  number: string;

  @IsInt()
  @Type(() => Number)
  phoneTypeId: number;
}
