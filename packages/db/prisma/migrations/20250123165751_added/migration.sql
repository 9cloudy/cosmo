/*
  Warnings:

  - Added the required column `friend_id` to the `chat` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "chat" ADD COLUMN     "friend_id" TEXT NOT NULL;
