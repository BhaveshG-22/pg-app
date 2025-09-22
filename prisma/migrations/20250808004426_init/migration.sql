/*
  Warnings:

  - You are about to drop the column `downloadCount` on the `generation_results` table. All the data in the column will be lost.
  - You are about to drop the column `isSelected` on the `generation_results` table. All the data in the column will be lost.
  - You are about to drop the column `qualityScore` on the `generation_results` table. All the data in the column will be lost.
  - You are about to drop the column `isFeatured` on the `presets` table. All the data in the column will be lost.
  - You are about to drop the column `popularity` on the `presets` table. All the data in the column will be lost.
  - You are about to drop the column `usageCount` on the `presets` table. All the data in the column will be lost.
  - You are about to drop the column `variables` on the `presets` table. All the data in the column will be lost.
  - You are about to drop the column `deleteAt` on the `user_images` table. All the data in the column will be lost.
  - You are about to drop the column `generationCount` on the `user_images` table. All the data in the column will be lost.
  - You are about to drop the column `isDeleted` on the `user_images` table. All the data in the column will be lost.
  - You are about to drop the column `lastUsedAt` on the `user_images` table. All the data in the column will be lost.
  - You are about to drop the column `subscriptionTier` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `credit_transactions` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `favorites` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `preset_input_fields` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `trending_presets` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "public"."credit_transactions" DROP CONSTRAINT "credit_transactions_generationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."credit_transactions" DROP CONSTRAINT "credit_transactions_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."favorites" DROP CONSTRAINT "favorites_generationId_fkey";

-- DropForeignKey
ALTER TABLE "public"."favorites" DROP CONSTRAINT "favorites_userId_fkey";

-- DropForeignKey
ALTER TABLE "public"."preset_input_fields" DROP CONSTRAINT "preset_input_fields_presetId_fkey";

-- DropForeignKey
ALTER TABLE "public"."trending_presets" DROP CONSTRAINT "trending_presets_presetId_fkey";

-- AlterTable
ALTER TABLE "public"."generation_results" DROP COLUMN "downloadCount",
DROP COLUMN "isSelected",
DROP COLUMN "qualityScore";

-- AlterTable
ALTER TABLE "public"."presets" DROP COLUMN "isFeatured",
DROP COLUMN "popularity",
DROP COLUMN "usageCount",
DROP COLUMN "variables";

-- AlterTable
ALTER TABLE "public"."user_images" DROP COLUMN "deleteAt",
DROP COLUMN "generationCount",
DROP COLUMN "isDeleted",
DROP COLUMN "lastUsedAt";

-- AlterTable
ALTER TABLE "public"."users" DROP COLUMN "subscriptionTier";

-- DropTable
DROP TABLE "public"."credit_transactions";

-- DropTable
DROP TABLE "public"."favorites";

-- DropTable
DROP TABLE "public"."preset_input_fields";

-- DropTable
DROP TABLE "public"."trending_presets";

-- DropEnum
DROP TYPE "public"."InputFieldType";

-- DropEnum
DROP TYPE "public"."SubscriptionTier";

-- DropEnum
DROP TYPE "public"."TransactionType";

-- DropEnum
DROP TYPE "public"."TrendingLabel";
