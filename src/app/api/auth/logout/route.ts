import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

import { ridesClient } from "@/utils/redis.js";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/auth/logout
 * @desc    Logout user
 * @access  public
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken");

    const refreshTokenValue = refreshToken?.value as string;

    if (refreshTokenValue) {
      const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
      const decoded = jwt.verify(refreshTokenValue, refreshTokenSecret) as {
        userId: string;
      };
      await ridesClient.del(`refresh_token:${decoded.userId}`);
    }

    (await cookies()).delete("refreshToken");
    (await cookies()).delete("accessToken");

    return NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
