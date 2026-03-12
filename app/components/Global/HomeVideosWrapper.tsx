"use client";

import dynamic from "next/dynamic";

const HomeVideos = dynamic(
  () => import("@/components/Home/HomeVideos"),
  { ssr: false }
);

export  default function HomeVideosWrapper() {
  return <HomeVideos />;
}