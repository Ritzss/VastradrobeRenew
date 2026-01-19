import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json(
    { message: "Logged out successfully" },
    { status: 200 }
  );

  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: true,       // 🔥 MUST MATCH login
    sameSite: "lax",    // 🔥 MUST MATCH login
    path: "/",
    maxAge: 0,
  });

  return response;
}