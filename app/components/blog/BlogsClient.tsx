"use client";

import { blogs } from "../../lib/blog";
import AnimatedList from "../UI/AnimatedList";
import BlogPreviewGrid from "@/components/Home/BlogPreviewGrid";

interface BlogClientProps {
  limit?: number;
  showTitle?: boolean;
}

const BlogClient = ({ limit, showTitle = true }: BlogClientProps) => {
  const items = limit ? blogs.slice(0, limit) : blogs;

  return (
    <section className="min-h-screen light:bg-[#f8f5f1] pt-32 pb-24 px-6">
      <div className="max-w-6xl mx-auto">
        {showTitle && (
          <div className="text-center mb-20">
            <h1 className="text-5xl font-semibold text-[#5f5143]">
              Vastra Journal
            </h1>
            <p className="text-[#7a6a5c] mt-4">
              Stories on craftsmanship, culture, and conscious fashion.
            </p>
          </div>
        )}

        <BlogPreviewGrid />
      </div>
    </section>
  );
};

export default BlogClient;
