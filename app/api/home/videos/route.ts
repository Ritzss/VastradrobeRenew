import { connectDB } from "@/lib/db";
import HomeVideo from "@/model/HomeVideo";

export async function GET() {
  await connectDB();

  const videos = await HomeVideo.find({ isActive: true })
    .sort({ order: 1, createdAt: -1 })
    .lean();

  return Response.json({ videos });
}
