import { IsNumber, IsOptional, IsString, Min, Max } from 'class-validator';

export class CalculateSolarDto {
  @IsOptional()
  @IsNumber()
  @Min(100)
  @Max(1000000)
  monthlyBillAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(10)
  @Max(100000)
  monthlyUnits?: number;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(25)
  electricityRate?: number = 8.0;

  @IsOptional()
  @IsString()
  state?: string = 'Uttar Pradesh';

  @IsOptional()
  @IsString()
  city?: string = 'Mau';

  @IsOptional()
  @IsString()
  roofType?: string = 'RCC Flat Roof';

  @IsOptional()
  @IsString()
  connectionType?: string = 'Domestic (LT)';
}
