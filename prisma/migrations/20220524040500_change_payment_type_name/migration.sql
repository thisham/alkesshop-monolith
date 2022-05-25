/*
  Warnings:

  - The values [Postpaid,Prepaid] on the enum `shopping_reports_payment_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `shopping_reports` MODIFY `payment_type` ENUM('POSTPAID', 'PREPAID') NOT NULL;
