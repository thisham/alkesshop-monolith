/*
  Warnings:

  - The primary key for the `shopping_report_product_user_pivots` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `user_id` on the `shopping_report_product_user_pivots` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `shopping_reports` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `shopping_report_product_user_pivots` DROP FOREIGN KEY `shopping_report_product_user_pivots_user_id_fkey`;

-- AlterTable
ALTER TABLE `shopping_report_product_user_pivots` DROP PRIMARY KEY,
    DROP COLUMN `user_id`,
    ADD PRIMARY KEY (`shopping_report_id`, `product_id`);

-- AlterTable
ALTER TABLE `shopping_reports` ADD COLUMN `user_id` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `shopping_reports` ADD CONSTRAINT `shopping_reports_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
