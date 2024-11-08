/*
  Warnings:

  - A unique constraint covering the columns `[publicId]` on the table `users` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateTable
CREATE TABLE "friends" (
    "id" SERIAL NOT NULL,
    "user_Id" TEXT NOT NULL,
    "total_chats" INTEGER NOT NULL,
    "friendIds" TEXT[],
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "friends_id_key" ON "friends"("id");

-- CreateIndex
CREATE UNIQUE INDEX "friends_user_Id_key" ON "friends"("user_Id");

-- CreateIndex
CREATE UNIQUE INDEX "users_publicId_key" ON "users"("publicId");

-- AddForeignKey
ALTER TABLE "friends" ADD CONSTRAINT "friends_user_Id_fkey" FOREIGN KEY ("user_Id") REFERENCES "users"("publicId") ON DELETE RESTRICT ON UPDATE CASCADE;
