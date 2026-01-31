import { IsString, IsInt, MinLength } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class PhoneItemDto {
  @ApiProperty({ example: '+54 11 1234-5678' })
  @IsString()
  @MinLength(1)
  number: string;

  @ApiProperty({ example: 1, type: Number })
  @IsInt()
  @Type(() => Number)
  phoneTypeId: number;
}
