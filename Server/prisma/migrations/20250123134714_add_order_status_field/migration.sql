/*
  Warnings:

  - You are about to drop the column `picturePublicId` on the `user` table. All the data in the column will be lost.
  - You are about to drop the column `pictureUrl` on the `user` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `user` DROP COLUMN `picturePublicId`,
    DROP COLUMN `pictureUrl`;
