import { Coupon } from "@prisma/client";
import prisma from "./db";

export async function createNewCoupon(userId: string): Promise<Coupon> {
  const coupon = await prisma.coupon.findUnique({
    where: { userId },
  });

  if (coupon) {
    await prisma.coupon.delete({
      where: { userId },
    });
  }

  const newCoupon = await prisma.coupon.create({
    data: {
      code: "GIFT" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      expirationDate: new Date(new Date().setMonth(new Date().getMonth() + 1)),
      isActive: true,
      discountPercentage: 10,
      userId,
    },
  });

  return newCoupon;
}
