/*
  Warnings:

  - Added the required column `provider` to the `users` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Providers" AS ENUM ('CREDENTAILS', 'GOOGLE', 'GITHUB');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "provider" "Providers" NOT NULL,
ALTER COLUMN "password" DROP NOT NULL;
