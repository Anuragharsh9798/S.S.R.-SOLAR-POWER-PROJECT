import { IsOptional, IsString } from 'class-validator';

export class ApproveReferralDto {
  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class RejectReferralDto {
  @IsOptional()
  @IsString()
  rejectionReason?: string;

  @IsOptional()
  @IsString()
  adminNotes?: string;
}

export class MarkPaidReferralDto {
  @IsOptional()
  @IsString()
  adminNotes?: string;
}
