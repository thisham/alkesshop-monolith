/*
  Warnings:

  - You are about to drop the column `bankName` on the `shopping_reports` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `shopping_reports` DROP COLUMN `bankName`,
    ADD COLUMN `bank_name` VARCHAR(191) NULL;
