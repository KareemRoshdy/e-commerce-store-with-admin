import { NextRequest, NextResponse } from "next/server";

import { isAdmin, verifyToken } from "@/utils/verifyToken";
import {
  getAnalyticsData,
  getDailySalesData,
} from "@/utils/get-analytics-data";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/admin/analytics
 * @desc    Get All Analytics [users, sales, total-amount]
 * @access  private [Only Admin]
 ================================================================================================================================
*/
export async function GET(req: NextRequest) {
  try {
    const userPayload = verifyToken(req);

    if (!userPayload) {
      return NextResponse.json(
        { message: "Unauthorized - Token missing or invalid" },
        { status: 401 }
      );
    }

    const admin = await isAdmin(userPayload?.userId);
    if (!admin) {
      return NextResponse.json(
        { message: "Unauthorized - Admin only" },
        { status: 401 }
      );
    }

    const analyticsData = await getAnalyticsData();

    const endDate = new Date();
    const startDate = new Date(endDate.getTime() - 7 * 24 * 60 * 60 * 1000);

    const dailySalesData = await getDailySalesData(startDate, endDate);

    return NextResponse.json(
      { analyticsData, dailySalesData },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
