import { headers } from "next/headers";
import VideoCarouselSection from "./VideoCarouselSection";
import HorizontalScroll from "../Global/HorizontalScroll";

type VideoItem = {
  id: string;
  videoUrl: string;
};

async function getVideos(): Promise<VideoItem[]> {
  const headersList = headers();
  const host = (await headersList).get("host");
  const protocol =
    process.env.NODE_ENV === "development" ? "http" : "https";

  const res = await fetch(
    `${protocol}://${host}/api/home/cloudinary-videos`,
    { next: { revalidate: 60 } }
  );

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

  return (
    <HorizontalScroll color="#DFC9AC">
      {userVideos.slice(0, 3).map((video) => (
        <VideoCarouselSection key={video.id} title="" videos={[video]} />
      ))}
    </HorizontalScroll>
  );
};

export default HomeVideos;
