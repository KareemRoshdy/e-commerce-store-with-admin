import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

import { ridesClient } from "@/utils/redis.js";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/auth/refresh-token
 * @desc    Refresh the access token
 * @access  public
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    const refreshToken = req.cookies.get("refreshToken");

    const refreshTokenValue = refreshToken?.value as string;

    if (!refreshTokenValue) {
      return NextResponse.json(
        { message: "no refresh token provided" },
        { status: 401 }
      );
    }

    const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;
    const decoded = jwt.verify(refreshTokenValue, refreshTokenSecret) as {
      userId: string;
    };

    const storedToken = await ridesClient.get(
      `refresh_token:${decoded.userId}`
    );

    if (storedToken !== refreshTokenValue) {
      return NextResponse.json(
        { message: "no refresh token provided" },
        { status: 401 }
      );
    }

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

    const accessToken = jwt.sign(
      { userId: decoded.userId },
      accessTokenSecret,
      { expiresIn: "15m" }
    );

    (await cookies()).set("accessToken", accessToken);

    return NextResponse.json(
      { message: "Token refreshed successfully" },
      { status: 200 }
    );
  } catch {
    return NextResponse.json("Internal error", { status: 500 });
  }
}
