import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/cart", "/checkout", "/favorites", "/profile"];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ ALWAYS allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 🔒 Check if route is protected
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  // ✅ Public route → allow
  if (!isProtected) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  if (!token) {
    const loginUrl = new URL("/account/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    await jwtVerify(token, secret);
    return NextResponse.next();
  } catch {
    const loginUrl = new URL("/account/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

/* 🔥 VERY IMPORTANT */
export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/favorites/:path*",
    "/profile/:path*",
  ],
};
