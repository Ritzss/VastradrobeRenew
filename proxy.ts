import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = ["/cart", "/checkout", "/favorites", "/profile"];
const authRoutes = ["/account/login", "/account/register"];

if (!process.env.JWT_SECRET) {
  throw new Error("JWT_SECRET is not defined");
}

const secret = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Always allow API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const token = req.cookies.get("token")?.value;

  // 🔐 HANDLE AUTH ROUTES (login/register)
  if (authRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      return NextResponse.next(); // not logged in → allowed
    }

    try {
      
      await jwtVerify(token, secret);

      // logged in → redirect away from auth pages
      return NextResponse.redirect(new URL("/profile", req.url));
    } catch {
      // token invalid → allow login/register
      return NextResponse.next();
    }
  }

  // 🔒 HANDLE PROTECTED ROUTES
  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );

  if (!isProtected) {
    return NextResponse.next();
  }

  // no token → redirect to login
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
    "/account/login",
    "/account/register",
  ],
};