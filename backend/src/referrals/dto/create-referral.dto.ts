import { IsString, IsNotEmpty, Matches } from 'class-validator';
import { Transform } from 'class-transformer';

export class CreateReferralDto {
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Referrer name is required' })
  @IsString()
  referrerName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, '') : value,
  )
  @IsNotEmpty({ message: 'Referrer phone number is required' })
  @IsString()
  @Matches(/^(\+91|91|[0]?)?[6-9]\d{9}$/, {
    message:
      'Invalid referrer phone number format. Must be a valid 10-digit phone number (e.g., +919876543210 or 9876543210).',
  })
  referrerPhone: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Friend name is required' })
  @IsString()
  friendName: string;

  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().replace(/\s+/g, '') : value,
  )
  @IsNotEmpty({ message: 'Friend phone number is required' })
  @IsString()
  @Matches(/^(\+91|91|[0]?)?[6-9]\d{9}$/, {
    message:
      'Invalid friend phone number format. Must be a valid 10-digit phone number (e.g., +919123456789 or 9123456789).',
  })
  friendPhone: string;

  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  @IsNotEmpty({ message: 'Friend city is required' })
  @IsString()
  friendCity: string;
}
