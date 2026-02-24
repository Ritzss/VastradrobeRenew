import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.search
      .expression("tags=hero")
      .sort_by("created_at", "desc")
      .max_results(10)
      .execute();

    const assets = result.resources.map((item: any) => ({
      id: item.public_id,
      url: item.secure_url,
      resource_type: item.resource_type, // image | video
    }));

    return Response.json({ assets });
  } catch (error) {
    return Response.json(
      { error: "Failed to fetch hero assets" },
      { status: 500 }
    );
  }
}