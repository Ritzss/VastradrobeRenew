import { headers } from "next/headers";
import VideoStrip from "./VideoStrip";

type VideoItem = {
  id: string;
  videoUrl: string;
};

async function getVideos(): Promise<VideoItem[]> {
  // In Next 16, headers() must be awaited
  const headersList = await headers();
  const host = headersList.get("host");

  if (!host) return [];

  const protocol = process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(`${protocol}://${host}/api/home/cloudinary-videos`, {
    next: { revalidate: 60 },
  });

  if (!res.ok) {
    console.error("Video fetch failed:", res.status);
    return [];
  }

  const data = await res.json();

  return (data.videos || []).map((v: any) => ({
    id: v.id,
    videoUrl: v.url,
  }));
}

const HomeVideos = async () => {
  const userVideos = await getVideos();

  if (!userVideos.length) return null;

  return <VideoStrip videos={userVideos.slice(0, 3)} />;
};

export default HomeVideos;
