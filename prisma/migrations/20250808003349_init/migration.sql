-- CreateEnum
CREATE TYPE "public"."SubscriptionTier" AS ENUM ('FREE', 'PRO', 'PREMIUM');

-- CreateEnum
CREATE TYPE "public"."InputFieldType" AS ENUM ('TEXT', 'TEXTAREA', 'SELECT', 'NUMBER');

-- CreateEnum
CREATE TYPE "public"."AspectRatio" AS ENUM ('SQUARE', 'PORTRAIT', 'VERTICAL', 'LANDSCAPE', 'STANDARD');

-- CreateEnum
CREATE TYPE "public"."OutputSize" AS ENUM ('SQUARE', 'PORTRAIT', 'VERTICAL', 'LANDSCAPE', 'STANDARD');

-- CreateEnum
CREATE TYPE "public"."GenerationStatus" AS ENUM ('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED');

-- CreateEnum
CREATE TYPE "public"."TransactionType" AS ENUM ('PURCHASE', 'USAGE', 'REFUND', 'BONUS');

-- CreateEnum
CREATE TYPE "public"."TrendingLabel" AS ENUM ('HOT', 'RISING', 'NEW', 'POPULAR');

-- CreateTable
CREATE TABLE "public"."users" (
    "id" TEXT NOT NULL,
    "clerkId" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "avatar" TEXT,
    "credits" INTEGER NOT NULL DEFAULT 0,
    "totalCreditsUsed" INTEGER NOT NULL DEFAULT 0,
    "subscriptionTier" "public"."SubscriptionTier" NOT NULL DEFAULT 'FREE',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."presets" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "badge" TEXT NOT NULL,
    "badgeColor" TEXT NOT NULL,
    "credits" INTEGER NOT NULL,
    "category" TEXT NOT NULL,
    "beforeImage" TEXT NOT NULL,
    "afterImage" TEXT NOT NULL,
    "variables" TEXT[],
    "usageCount" INTEGER NOT NULL DEFAULT 0,
    "popularity" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "presets_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."preset_input_fields" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "placeholder" TEXT NOT NULL,
    "type" "public"."InputFieldType" NOT NULL,
    "required" BOOLEAN NOT NULL DEFAULT false,
    "order" INTEGER NOT NULL,
    "options" TEXT[],
    "minLength" INTEGER,
    "maxLength" INTEGER,
    "defaultValue" TEXT,

    CONSTRAINT "preset_input_fields_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."user_images" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "fileName" TEXT NOT NULL,
    "originalFileName" TEXT NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "mimeType" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "generationCount" INTEGER NOT NULL DEFAULT 0,
    "lastUsedAt" TIMESTAMP(3),
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "deleteAt" TIMESTAMP(3),

    CONSTRAINT "user_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."generations" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "userImageId" TEXT NOT NULL,
    "aspectRatio" "public"."AspectRatio" NOT NULL,
    "outputSize" "public"."OutputSize" NOT NULL,
    "isPrivate" BOOLEAN NOT NULL DEFAULT false,
    "hasWatermark" BOOLEAN NOT NULL DEFAULT true,
    "inputValues" JSONB NOT NULL,
    "finalPrompt" TEXT NOT NULL,
    "status" "public"."GenerationStatus" NOT NULL DEFAULT 'PENDING',
    "creditsUsed" INTEGER NOT NULL,
    "processingTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),

    CONSTRAINT "generations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."generation_results" (
    "id" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "width" INTEGER NOT NULL,
    "height" INTEGER NOT NULL,
    "fileSize" INTEGER NOT NULL,
    "qualityScore" DOUBLE PRECISION,
    "processingTime" INTEGER NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "downloadCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "generation_results_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."favorites" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "generationId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "favorites_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."credit_transactions" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" "public"."TransactionType" NOT NULL,
    "amount" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "stripePaymentId" TEXT,
    "price" INTEGER,
    "generationId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "credit_transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."trending_presets" (
    "id" TEXT NOT NULL,
    "presetId" TEXT NOT NULL,
    "weeklyUsage" INTEGER NOT NULL DEFAULT 0,
    "monthlyUsage" INTEGER NOT NULL DEFAULT 0,
    "growthRate" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "trendingRank" INTEGER NOT NULL,
    "trendingLabel" "public"."TrendingLabel" NOT NULL,
    "weekStart" TIMESTAMP(3) NOT NULL,
    "lastUpdated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "trending_presets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_clerkId_key" ON "public"."users"("clerkId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "public"."users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "presets_slug_key" ON "public"."presets"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "favorites_userId_generationId_key" ON "public"."favorites"("userId", "generationId");

-- CreateIndex
CREATE UNIQUE INDEX "trending_presets_presetId_weekStart_key" ON "public"."trending_presets"("presetId", "weekStart");

-- AddForeignKey
ALTER TABLE "public"."preset_input_fields" ADD CONSTRAINT "preset_input_fields_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."user_images" ADD CONSTRAINT "user_images_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generations" ADD CONSTRAINT "generations_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generations" ADD CONSTRAINT "generations_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."presets"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generations" ADD CONSTRAINT "generations_userImageId_fkey" FOREIGN KEY ("userImageId") REFERENCES "public"."user_images"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."generation_results" ADD CONSTRAINT "generation_results_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."favorites" ADD CONSTRAINT "favorites_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."generations"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."credit_transactions" ADD CONSTRAINT "credit_transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."credit_transactions" ADD CONSTRAINT "credit_transactions_generationId_fkey" FOREIGN KEY ("generationId") REFERENCES "public"."generations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."trending_presets" ADD CONSTRAINT "trending_presets_presetId_fkey" FOREIGN KEY ("presetId") REFERENCES "public"."presets"("id") ON DELETE CASCADE ON UPDATE CASCADE;
