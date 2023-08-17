-- CreateEnum
CREATE TYPE "AccountStatus" AS ENUM ('pending', 'confirmed', 'compromised');

-- CreateTable
CREATE TABLE "email-change" (
    "token" CHAR(21) NOT NULL,
    "newEmail" TEXT NOT NULL,
    "userId" UUID NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '1 day'::interval),

    CONSTRAINT "email-change_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "email-verification" (
    "token" CHAR(250) NOT NULL,
    "userId" UUID NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '1 day'::interval),

    CONSTRAINT "email-verification_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "password-reset" (
    "token" CHAR(21) NOT NULL,
    "userId" UUID NOT NULL,
    "validUntil" TIMESTAMP(6) NOT NULL DEFAULT (timezone('utc'::text, now()) + '1 day'::interval),

    CONSTRAINT "password-reset_pkey" PRIMARY KEY ("token")
);

-- CreateTable
CREATE TABLE "user" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "username" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "middleName" TEXT,
    "avatar" TEXT,
    "status" "AccountStatus" DEFAULT 'pending',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "birthDate" DATE,
    "createdAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('UTC'::text, now()),
    "updatedAt" TIMESTAMP(6) NOT NULL DEFAULT timezone('UTC'::text, now()),
    "deletedAt" TIMESTAMP(3),

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "email-change_userId_key" ON "email-change"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "email-verification_userId_key" ON "email-verification"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "password-reset_userId_key" ON "password-reset"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "user_username_key" ON "user"("username");

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "email-change" ADD CONSTRAINT "email-change_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "email-verification" ADD CONSTRAINT "email-verification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "password-reset" ADD CONSTRAINT "password-reset_userId_fkey" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE;
