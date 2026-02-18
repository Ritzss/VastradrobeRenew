import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET() {
  try {
    const result = await cloudinary.api.resources_by_tag("featured", {
      resource_type: "video",
      type: "upload",
      max_results: 20,
      direction: "desc",
    });

    const videos = result.resources.map((v: any) => ({
      id: v.public_id,
      url: v.secure_url,
      publicId: v.public_id,
    }));

    return Response.json({ videos });
  } catch (error) {
    return Response.json({ error: "Failed to fetch videos" }, { status: 500 });
  }
}
