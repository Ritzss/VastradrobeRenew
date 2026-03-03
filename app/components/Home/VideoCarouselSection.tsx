// components/Home/VideoCarouselSection.tsx
"use client";

import Carousel from "../UI/Carousel";

type VideoItem = {
  id: string;
  videoUrl: string;
};

type Props = {
  title: string;
  videos: VideoItem[];
};

const VideoCarouselSection = ({ title, videos }: Props) => {
  if (!videos.length) return null;

  const carouselItems = videos.map((v, i) => ({
    id: i + 1,
    video: v.videoUrl,
  }));

  return (
    <section className="flex justify-center py-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <div className="hidden md:block">
        <Carousel items={carouselItems} variant="media" loop baseWidth={360} />
      </div>
      <div className="block md:hidden">
        <Carousel items={carouselItems} variant="media" loop baseWidth={300} />
      </div>
    </section>
  );
};

export default VideoCarouselSection;
