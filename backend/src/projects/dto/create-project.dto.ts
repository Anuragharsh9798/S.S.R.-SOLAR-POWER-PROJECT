import { IsString, IsNotEmpty, IsOptional, IsNumber, IsBoolean, Min, Max } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty({ message: 'Project title is required' })
  @IsString()
  title: string;

  @IsNotEmpty({ message: 'Project slug is required' })
  @IsString()
  slug: string;

  @IsNotEmpty({ message: 'Project type is required (Residential/Commercial)' })
  @IsString()
  type: string;

  @IsNotEmpty({ message: 'Location is required' })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Capacity string is required' })
  @IsString()
  capacity: string;

  @IsOptional()
  @IsNumber()
  capacityKw?: number;

  @IsOptional()
  @IsString()
  completedDate?: string;

  @IsOptional()
  @IsString()
  annualSavings?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number = 5;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  featuredImage?: string;

  @IsOptional()
  @IsBoolean()
  isFeatured?: boolean = false;
}
