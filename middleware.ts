import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const protectedRoutes = [
  "/cart",
  "/checkout",
  "/favroites",
  "/profile",
];

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  const isProtected = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

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
  } catch (err) {
    const loginUrl = new URL("/account/login", req.url);
    loginUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    "/cart/:path*",
    "/checkout/:path*",
    "/favroites/:path*",
    "/profile/:path*",
  ],
};
