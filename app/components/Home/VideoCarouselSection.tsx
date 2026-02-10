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
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">{title}</h2>

      <Carousel
        items={carouselItems}
        variant="media"
        loop
        baseWidth={360}
      />
    </section>
  );
};

export default VideoCarouselSection;
