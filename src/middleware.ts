import { NextResponse, NextRequest } from "next/server";

export async function middleware(req: NextRequest) {
  const jwtToken = req.cookies.get("accessToken");
  const token = jwtToken?.value as string;

  if (token) {
    if (
      req.nextUrl.pathname === "/auth/login" ||
      req.nextUrl.pathname === "/auth/signup"
    ) {
      return NextResponse.redirect(new URL("/", req.url));
    }
  }
}

export const config = {
  matcher: ["/auth/signup", "/auth/login"],
};
