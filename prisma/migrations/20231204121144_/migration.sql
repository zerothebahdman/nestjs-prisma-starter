/*
  Warnings:

  - You are about to drop the `email-change` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `email-verification` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `password-reset` table. If the table is not empty, all the data it contains will be lost.
  - Made the column `status` on table `user` required. This step will fail if there are existing NULL values in that column.

*/
-- CreateEnum
CREATE TYPE "Gender" AS ENUM ('male', 'female');

-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('email_verification', 'phone', 'reset_password');

-- DropForeignKey
ALTER TABLE "email-change" DROP CONSTRAINT "email-change_userId_fkey";

-- DropForeignKey
ALTER TABLE "email-verification" DROP CONSTRAINT "email-verification_userId_fkey";

-- DropForeignKey
ALTER TABLE "password-reset" DROP CONSTRAINT "password-reset_userId_fkey";

-- AlterTable
ALTER TABLE "user" ADD COLUMN     "gender" "Gender",
ALTER COLUMN "username" DROP NOT NULL,
ALTER COLUMN "status" SET NOT NULL;

-- DropTable
DROP TABLE "email-change";

-- DropTable
DROP TABLE "email-verification";

-- DropTable
DROP TABLE "password-reset";

-- CreateTable
CREATE TABLE "token" (
    "token" CHAR(250) NOT NULL,
    "user_id" UUID NOT NULL,
    "valid_until" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '1 day'::interval),
    "type" "TokenType" NOT NULL,

    CONSTRAINT "token_pkey" PRIMARY KEY ("token")
);

-- CreateIndex
CREATE UNIQUE INDEX "token_user_id_key" ON "token"("user_id");

-- AddForeignKey
ALTER TABLE "token" ADD CONSTRAINT "token_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
