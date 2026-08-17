import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';

export class TestRequestDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}
