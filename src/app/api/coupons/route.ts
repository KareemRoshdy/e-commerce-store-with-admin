import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import { verifyToken } from "@/utils/verifyToken";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/coupons
 * @desc    Get Coupon
 * @access  private [Only Logged in users]
 ================================================================================================================================
*/

export async function GET(req: NextRequest) {
  try {
    const userPayload = verifyToken(req);
    if (!userPayload?.userId) {
      return NextResponse.json(
        { message: "No access token provided" },
        { status: 401 }
      );
    }

    const coupon = await prisma.coupon.findFirst({
      where: {
        userId: userPayload.userId,
        isActive: true,
      },
    });

    if (!coupon) {
      return NextResponse.json({ message: "No coupon found" }, { status: 404 });
    }

    return NextResponse.json({ coupon }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
