/*
  Warnings:

  - You are about to drop the column `picture` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `picture`,
    ADD COLUMN `picturePublicId` VARCHAR(191) NULL,
    ADD COLUMN `pictureUrl` VARCHAR(191) NULL;
