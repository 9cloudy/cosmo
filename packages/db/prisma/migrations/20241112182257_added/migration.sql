/*
  Warnings:

  - The values [CREDENTAILS] on the enum `Providers` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Providers_new" AS ENUM ('CREDENTIALS', 'GOOGLE', 'GITHUB');
ALTER TABLE "users" ALTER COLUMN "provider" TYPE "Providers_new" USING ("provider"::text::"Providers_new");
ALTER TYPE "Providers" RENAME TO "Providers_old";
ALTER TYPE "Providers_new" RENAME TO "Providers";
DROP TYPE "Providers_old";
COMMIT;

-- DropIndex
DROP INDEX "friends_id_key";

-- DropIndex
DROP INDEX "friends_user_Id_key";

-- DropIndex
DROP INDEX "users_id_key";

-- AlterTable
ALTER TABLE "friends" ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "users" ADD CONSTRAINT "users_pkey" PRIMARY KEY ("id");
