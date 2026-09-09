import jwt from "jsonwebtoken";
import User from "@/model/User";
import { connectDB } from "@/lib/db";

export async function verifyUser(req: { headers: { get: (arg0: string) => string; }; }) {
  await connectDB();

  const token = req.headers
    .get("cookie")
    ?.split("; ")
    .find((c: string) => c.startsWith("token="))
    ?.split("=")[1];

  if (!token) {
    return null;
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) return null;

    const decoded = jwt.verify(token, secret) as { id?: string };

    const user = await User.findById(decoded.id);

    if (!user) return null;

    return user;
  } catch {
    return null;
  }
}