import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  Min,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @Min(8)
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsPhoneNumber()
  @IsNotEmpty()
  phone: string;
}

export default CreateUserDto;
