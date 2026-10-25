-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'PAID');

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "claim_number" TEXT NOT NULL,
    "referrer_name" TEXT NOT NULL,
    "referrer_phone" TEXT NOT NULL,
    "friend_name" TEXT NOT NULL,
    "friend_phone" TEXT NOT NULL,
    "friend_city" TEXT NOT NULL,
    "reward_amount" DECIMAL(10,2),
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "admin_notes" TEXT,
    "reviewed_by" TEXT,
    "reviewed_at" TIMESTAMP(3),
    "rejection_reason" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "referrals_claim_number_key" ON "referrals"("claim_number");

-- CreateIndex
CREATE INDEX "referrals_claim_number_idx" ON "referrals"("claim_number");

-- CreateIndex
CREATE INDEX "referrals_referrer_phone_idx" ON "referrals"("referrer_phone");

-- CreateIndex
CREATE INDEX "referrals_friend_phone_idx" ON "referrals"("friend_phone");

-- CreateIndex
CREATE INDEX "referrals_status_idx" ON "referrals"("status");

-- CreateIndex
CREATE INDEX "referrals_created_at_idx" ON "referrals"("created_at");
