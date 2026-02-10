"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import VideoEmbed from "./HomeVideoEmbed";
import Carousel from "../UI/Carousel";

type HomeVideosProps = {
  variant?: "grid" | "carousel";
};

const HomeVideos = ({ variant = "grid" }: HomeVideosProps) => {
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // 🔹 STATIC CAROUSEL VIDEO (WORKS INDEPENDENTLY)
  // const carouselItems = [
  //   {
  //     id: 1,
  //     video:
  //       "https://res.cloudinary.com/dwhn5ec09/video/upload/v1770717472/VID-20260210-WA0015_xb50lo.mp4",
  //   },
  // ];

 useEffect(() => {
  const loadVideos = async () => {
    try {
      const res = await fetch("/api/home/cloudinary-videos");
      const data = await res.json();
      setVideos(data.videos || []);
    } catch (err) {
      console.error("Failed to load Cloudinary videos", err);
    } finally {
      setLoading(false);
    }
  };

  loadVideos();
}, []);

console.log(videos);


const carouselItems = videos.map((v, index) => ({
  id: index + 1,
  video: v.url,
}));


  if (loading) return null;

  // ⛔ only grid depends on API
  if (variant === "grid" && !videos.length) return null;

  return (
    <section className="px-6 py-10">
      <h2 className="text-2xl font-bold mb-6">Watch Our Stories</h2>

      {variant === "grid" ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((v: any) => (
            <VideoEmbed key={v._id} source={v.source} url={v.url} />
          ))}
        </div>
      ) : (
        <Carousel
          items={carouselItems}
          variant="media"
          loop
          baseWidth={360}
        />
      )}
    </section>
  );
};

export default HomeVideos;
