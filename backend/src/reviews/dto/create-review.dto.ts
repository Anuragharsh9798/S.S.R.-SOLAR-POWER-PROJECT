import { IsString, IsNotEmpty, IsOptional, IsNumber, Min, Max } from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty({ message: 'Full name is required' })
  @IsString()
  name: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number = 5;

  @IsOptional()
  @IsNumber()
  systemSizeKw?: number;

  @IsOptional()
  @IsString()
  solarType?: string;

  @IsOptional()
  @IsString()
  installType?: string;

  @IsOptional()
  @IsString()
  performance?: string;

  @IsOptional()
  @IsString()
  experience?: string;

  @IsOptional()
  likedAspects?: string[];

  @IsNotEmpty({ message: 'Review quote text is required' })
  @IsString()
  quote: string;
}
