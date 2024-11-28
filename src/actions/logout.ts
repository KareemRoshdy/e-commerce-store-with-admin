import { ridesClient } from "@/utils/redis";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

export const logout = async () => {
  try {
    const refreshToken = (await cookies()).get("refreshToken");

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

    return true;
  } catch {
    return null;
  }
};
