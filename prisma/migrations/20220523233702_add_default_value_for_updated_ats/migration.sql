-- AlterTable
ALTER TABLE `products` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `shopping_report_product_user_pivots` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `shopping_reports` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `users` MODIFY `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
