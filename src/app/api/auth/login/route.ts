import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/db";
import bcryptjs from "bcryptjs";

import {
  generateTokens,
  setCookie,
  storeRefreshToken,
} from "@/utils/generateToken";
import { loginUserSchema } from "@/utils/validationchemas";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/auth/login
 * @desc    Login user
 * @access  public
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    const validation = loginUserSchema.safeParse({ email, password });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const matchedPassword = await bcryptjs.compare(password, user.password);

    if (!matchedPassword) {
      return NextResponse.json(
        { message: "Invalid email or password" },
        { status: 400 }
      );
    }

    const { accessToken, refreshToken } = generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken);
    const { accessTokenCookie, refreshTokenCookie } = setCookie(
      accessToken,
      refreshToken
    );

    return NextResponse.json(
      {
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      {
        status: 200,
        headers: {
          "Set-Cookie": `${accessTokenCookie}, ${refreshTokenCookie}`,
        },
      }
    );
  } catch (error) {
    console.log(error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
