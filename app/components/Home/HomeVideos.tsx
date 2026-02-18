"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import VideoCarouselSection from "./VideoCarouselSection";
import HorizontalScroll from "../Global/HorizontalScroll";

type VideoItem = {
  id: string;
  videoUrl: string;
};

const HomeVideos = () => {
  const [userVideos, setUserVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    const loadUserVideos = async () => {
      try {
        const res = await fetch("/api/home/cloudinary-videos", {
          cache: "no-store",
        });

        const data = await res.json();

        setUserVideos(
          (data.videos || []).map((v: any) => ({
            id: v.id,
            videoUrl: v.url,
          }))
        );
      } catch (err) {
        console.error("Failed to fetch videos:", err);
      }
    };

    loadUserVideos();
  }, []);

  if (!userVideos.length) return null;

  return (
    <HorizontalScroll color="#DFC9AC">
      {userVideos.map((video) => (
        <VideoCarouselSection
          key={video.id}
          title=""
          videos={[video]} // 👈 each section gets ONE video
        />
      ))}
    </HorizontalScroll>
  );
};

export default HomeVideos;
