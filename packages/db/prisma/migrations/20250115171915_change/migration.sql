/*
  Warnings:

  - The primary key for the `friends` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `friends` table. All the data in the column will be lost.
  - You are about to drop the column `total_chats` on the `friends` table. All the data in the column will be lost.
  - Added the required column `status` to the `friends` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "status" AS ENUM ('PENDING', 'CONFIRMED', 'DENIED');

-- AlterTable
ALTER TABLE "friends" DROP CONSTRAINT "friends_pkey",
DROP COLUMN "id",
DROP COLUMN "total_chats",
ADD COLUMN     "fnd_id" SERIAL NOT NULL,
ADD COLUMN     "status" "status" NOT NULL,
ALTER COLUMN "friendIds" SET NOT NULL,
ALTER COLUMN "friendIds" SET DATA TYPE TEXT,
ADD CONSTRAINT "friends_pkey" PRIMARY KEY ("fnd_id");

-- CreateTable
CREATE TABLE "chat" (
    "chat_id" SERIAL NOT NULL,
    "user_id" TEXT NOT NULL,
    "last_message" TEXT NOT NULL,
    "last_time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "chat_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "text" (
    "text_id" SERIAL NOT NULL,
    "chat_id" INTEGER NOT NULL,
    "time" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "text_pkey" PRIMARY KEY ("text_id")
);

-- AddForeignKey
ALTER TABLE "chat" ADD CONSTRAINT "chat_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "text" ADD CONSTRAINT "text_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "chat"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;
