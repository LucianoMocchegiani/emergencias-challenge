import { IsString, IsEmail, IsOptional, MinLength } from 'class-validator';

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
}
