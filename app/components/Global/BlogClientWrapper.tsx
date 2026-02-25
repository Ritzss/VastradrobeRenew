"use client";

import dynamic from "next/dynamic";

const BlogClient = dynamic(
  () => import("@/blog/BlogsClient"),
  { ssr: false }
);

export default function BlogClientWrapper(props: any) {
  return <BlogClient {...props} />;
}