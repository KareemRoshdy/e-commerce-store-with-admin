-- DropForeignKey
ALTER TABLE "Order" DROP CONSTRAINT "Order_cartItemId_fkey";

-- AddForeignKey
ALTER TABLE "Order" ADD CONSTRAINT "Order_cartItemId_fkey" FOREIGN KEY ("cartItemId") REFERENCES "CartItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
