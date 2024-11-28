import jwt from "jsonwebtoken";
import { NextRequest } from "next/server";
import prisma from "./db";
import { User } from "@prisma/client";

type JWTPayload = {
  userId: string;
  iat: number;
  exp: number;
};

interface TokenError extends Error {
  name: "TokenExpiredError" | "JsonWebTokenError";
}

export function verifyToken(req: NextRequest): JWTPayload | null {
  try {
    const jwtToken = req.cookies.get("accessToken");
    const accessToken = jwtToken?.value as string;

    if (!accessToken) return null;

    const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;

    const userPayload = jwt.verify(
      accessToken,
      accessTokenSecret
    ) as JWTPayload;

    return userPayload;
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Error verifying token:", error);

      // Optionally handle specific error types
      if ((error as TokenError).name === "TokenExpiredError") {
        console.warn("Token has expired.");
      } else if ((error as TokenError).name === "JsonWebTokenError") {
        console.warn("Invalid token.");
      }
    }

    return null;
  }
}

export async function isAdmin(userId: string): Promise<boolean | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
    });

    if (!user) return null;

    return user.role === "admin";
  } catch {
    return null;
  }
}

export async function checkIsAdmin(token: string): Promise<string | null> {
  try {
    const privateKey = process.env.ACCESS_TOKEN_SECRET as string;
    const userPayload = jwt.verify(token, privateKey) as JWTPayload;

    if (!userPayload) return null;

    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) return null;

    return user.role;
  } catch {
    return null;
  }
}

export async function verifyTokenForPages(token: string): Promise<User | null> {
  try {
    const privateKey = process.env.ACCESS_TOKEN_SECRET as string;
    const userPayload = jwt.verify(token, privateKey) as JWTPayload;

    if (!userPayload) return null;

    const user = await prisma.user.findUnique({
      where: { id: userPayload.userId },
    });

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}
