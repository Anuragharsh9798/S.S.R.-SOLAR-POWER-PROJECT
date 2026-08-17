import { IsString, IsNotEmpty, IsOptional, IsUrl } from 'class-validator';

export class CreateGovtStatDto {
  @IsNotEmpty({ message: 'Metric title is required' })
  @IsString()
  metric: string;

  @IsNotEmpty({ message: 'Metric value is required' })
  @IsString()
  value: string;

  @IsNotEmpty({ message: 'Unit of measurement is required' })
  @IsString()
  unit: string;

  @IsNotEmpty({ message: 'Government source name is required' })
  @IsString()
  source: string;

  @IsOptional()
  @IsUrl({}, { message: 'Source URL must be a valid URL' })
  sourceUrl?: string;

  @IsOptional()
  @IsString()
  effectiveDate?: string;

  @IsOptional()
  @IsString()
  lastVerifiedAt?: string;
}
