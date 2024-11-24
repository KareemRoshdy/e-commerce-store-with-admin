import jwt from "jsonwebtoken";
import { serialize } from "cookie";
import { ridesClient } from "./redis.js";

// Set Cookie with JWT
export function setCookie(accessToken: string, refreshToken: string) {
  const accessTokenCookie = serialize("accessToken", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 15 * 60 * 1000, // 15 minutes
  });

  const refreshTokenCookie = serialize("refreshToken", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return { accessTokenCookie, refreshTokenCookie };
}

// Generate [Access & Refresh] Tokens
export const generateTokens = (userId: string) => {
  const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET as string;
  const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET as string;

  const accessToken = jwt.sign({ userId }, accessTokenSecret, {
    expiresIn: "15m",
  });

  const refreshToken = jwt.sign({ userId }, refreshTokenSecret, {
    expiresIn: "7d",
  });

  return { accessToken, refreshToken };
};

// Store Refresh Token in Rides
export const storeRefreshToken = async (
  userId: string,
  refreshToken: string
) => {
  await ridesClient.set(
    `refresh_token:${userId}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60 /* 7 Days */
  );
};
