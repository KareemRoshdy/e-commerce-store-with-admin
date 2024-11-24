import { NextRequest, NextResponse } from "next/server";

import prisma from "@/utils/db";
import bcryptjs from "bcryptjs";
import { signupUserSchema } from "@/utils/validationchemas";
import {
  generateTokens,
  setCookie,
  storeRefreshToken,
} from "@/utils/generateToken";

/**
 ================================================================================================================================
 * @method  POST
 * @route   ~/api/auth/signup
 * @desc    Create new account
 * @access  public
 ================================================================================================================================
*/
export async function POST(req: NextRequest) {
  try {
    const { name, email, password } = await req.json();

    const validation = signupUserSchema.safeParse({ name, email, password });

    if (!validation.success) {
      return NextResponse.json(
        { message: validation.error.errors[0].message },
        { status: 400 }
      );
    }

    const userExists = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (userExists) {
      return NextResponse.json(
        { message: "User already exists" },
        { status: 400 }
      );
    }

    const salt = await bcryptjs.genSalt(10);
    const hashedPassword = await bcryptjs.hash(password, salt);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
      },
    });

    // Authenticate User [JWT]
    const { accessToken, refreshToken } = generateTokens(user.id);
    await storeRefreshToken(user.id, refreshToken);

    const { accessTokenCookie, refreshTokenCookie } = setCookie(
      accessToken,
      refreshToken
    );

    return NextResponse.json(
      { user },
      {
        status: 201,
        headers: {
          "Set-Cookie": `${accessTokenCookie}, ${refreshTokenCookie}`,
        },
      }
    );
  } catch (error) {
    console.log("🚀 ~ POST ~ error:", error);
    return NextResponse.json("Internal error", { status: 500 });
  }
}
