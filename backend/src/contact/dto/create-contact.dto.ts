import { IsString, IsNotEmpty, IsEmail, IsOptional } from 'class-validator';

export class CreateContactDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  fullName: string;

  @IsEmail({}, { message: 'Invalid email address format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  subject?: string;

  @IsNotEmpty({ message: 'Contact message text is required' })
  @IsString()
  message: string;
}
