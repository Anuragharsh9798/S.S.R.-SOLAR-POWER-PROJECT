import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsNumber,
  Matches,
  Min,
  Max,
} from 'class-validator';

export class CreateQuotationDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  fullName: string;

  @IsNotEmpty({ message: 'Mobile phone number is required' })
  @IsString()
  @Matches(/^[6-9]\d{9}$/, {
    message: 'Mobile number must be a valid 10-digit Indian phone number',
  })
  phone: string;

  @IsOptional()
  @IsEmail({}, { message: 'Invalid email address format' })
  email?: string;

  @IsNotEmpty({ message: 'Address is required' })
  @IsString()
  address: string;

  @IsOptional()
  @IsString()
  houseNumber?: string;

  @IsOptional()
  @IsString()
  area?: string;

  @IsNotEmpty({ message: 'City is required' })
  @IsString()
  city: string;

  @IsOptional()
  @IsString()
  district?: string;

  @IsOptional()
  @IsString()
  state?: string = 'Uttar Pradesh';

  @IsOptional()
  @IsString()
  pincode?: string;

  @IsOptional()
  @IsNumber()
  @Min(-90, { message: 'Latitude must be between -90 and 90' })
  @Max(90, { message: 'Latitude must be between -90 and 90' })
  latitude?: number;

  @IsOptional()
  @IsNumber()
  @Min(-180, { message: 'Longitude must be between -180 and 180' })
  @Max(180, { message: 'Longitude must be between -180 and 180' })
  longitude?: number;

  @IsOptional()
  @IsString()
  accuracy?: string;

  @IsOptional()
  @IsString()
  googleMapsUrl?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyBillAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  monthlyUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(25)
  electricityRate?: number = 8.0;

  @IsOptional()
  @IsString()
  solarType?: string = 'On-Grid';

  @IsOptional()
  @IsString()
  contactTime?: string = 'Any Time';

  @IsOptional()
  @IsString()
  message?: string;
}
