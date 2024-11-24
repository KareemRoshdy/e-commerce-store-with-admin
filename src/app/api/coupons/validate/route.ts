import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/coupons/validate
 * @desc    Validate Coupon Code
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/

export async function POST(req: NextRequest) {
  try {
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const { code } = await req.json();

    const coupon = await prisma.coupon.findFirst({
      where: {
        userId: userPayload.userId,
        isActive: true,
        code,
      },
    });

    if (!coupon) {
      return NextResponse.json(
        { message: "Coupon not found" },
        { status: 404 }
      );
    }

    if (coupon.expirationDate < new Date()) {
      await prisma.coupon.update({
        where: {
          id: coupon.id,
        },
        data: {
          isActive: false,
        },
      });
      return NextResponse.json({ message: "Coupon expired" }, { status: 400 });
    }

    return NextResponse.json(
      {
        discountPercentage: coupon.discountPercentage,
        code: coupon.code,
      },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
