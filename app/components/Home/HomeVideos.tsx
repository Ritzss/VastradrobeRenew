// components/Home/HomeVideos.tsx
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
  // const [instagramVideos, setInstagramVideos] = useState<VideoItem[]>([]);
  // const [facebookVideos, setFacebookVideos] = useState<VideoItem[]>([]);
  // const [youtubeVideos, setYoutubeVideos] = useState<VideoItem[]>([]);
  // const [whatsappVideos, setWhatsappVideos] = useState<VideoItem[]>([]);

  useEffect(() => {
    // USER UPLOADS (Cloudinary – already working)
    const loadUserVideos = async () => {
      const res = await fetch("/api/home/cloudinary-videos", {
        cache: "no-store",
      });
      const data = await res.json();

      setUserVideos(
        (data.videos || []).map((v: any) => ({
          id: v.id,
          videoUrl: v.url,
        })),
      );
    };

    // STATIC / ADMIN-CONTROLLED (for now)
    // setInstagramVideos([
    //   {
    //     id: "insta-1",
    //     videoUrl: "https://res.cloudinary.com/dwhn5ec09/video/upload/v1770723515/vastraVideoss_yssu65.mp4",
    //   },
    // ]);

    // setFacebookVideos([
    //   {
    //     id: "fb-1",
    //     videoUrl: "https://res.cloudinary.com/dwhn5ec09/video/upload/v1770723515/vastraVideoss_yssu65.mp4",
    //   },
    // ]);

    // setYoutubeVideos([
    //   {
    //     id: "yt-1",
    //     videoUrl: "https://res.cloudinary.com/dwhn5ec09/video/upload/v1770723515/vastraVideoss_yssu65.mp4",
    //   },
    // ]);

    // setWhatsappVideos([
    //   {
    //     id: "wa-1",
    //     videoUrl: "https://res.cloudinary.com/dwhn5ec09/video/upload/v1770723515/vastraVideoss_yssu65.mp4",
    //   },
    // ]);

    loadUserVideos();
  }, []);

  return (
    <HorizontalScroll>
      <VideoCarouselSection title="" videos={userVideos} />
      {/* 
      <VideoCarouselSection
        title="Instagram Stories"
        videos={instagramVideos}
      />

      <VideoCarouselSection
        title="Facebook Reviews"
        videos={facebookVideos}
      />

      <VideoCarouselSection
        title="YouTube Highlights"
        videos={youtubeVideos}
      />

      <VideoCarouselSection
        title="WhatsApp Reviews"
        videos={whatsappVideos}
      /> */}
    </HorizontalScroll>
  );
};

export default HomeVideos;
