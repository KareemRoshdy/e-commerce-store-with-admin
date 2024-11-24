import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

import prisma from "@/utils/db";

class TokenExpiredError extends Error {
  name = "TokenExpiredError";
}

export const protectRoute = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("accessToken");

    const accessToken = token?.value as string;
    if (!accessToken) {
      return NextResponse.json(
        { message: "Unauthorized - no access token provided - 1" },
        { status: 401 }
      );
    }

    try {
      const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
      const decoded = jwt.verify(accessToken, accessTokenSecret) as {
        userId: string;
      };

      const user = await prisma.user.findUnique({
        where: {
          id: decoded.userId,
        },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true,
          updatedAt: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      return NextResponse.next();
    } catch (error: unknown) {
      if (error instanceof TokenExpiredError) {
        return NextResponse.json(
          { message: "Unauthorized - no access token provided - 2" },
          { status: 401 }
        );
      }
      throw error;
    }
  } catch {
    return NextResponse.json({ message: "Server Error" }, { status: 500 });
  }
};
