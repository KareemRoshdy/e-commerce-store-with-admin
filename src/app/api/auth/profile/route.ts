import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";

import { verifyToken } from "@/utils/verifyToken";

/**
 ================================================================================================================================
 * @method  GET
 * @route   ~/api/auth/profile
 * @desc    Get User Profile
 * @access  private [Only Authenticated User]
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

    const user = await prisma.user.findUnique({
      where: {
        id: userPayload.userId,
      },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user }, { status: 200 });
  } catch {
    return NextResponse.json({ message: "Internal error" }, { status: 500 });
  }
}
