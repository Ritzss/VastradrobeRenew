// "use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";
// import { motion } from "framer-motion";

interface Props {
  limit?: number;
}

export default function BlogPreviewGrid({ limit }: Props) {
  const items = limit ? blogs.slice(0, limit) : blogs;

  const gridCols =
    items.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : items.length === 2
        ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-10 ${gridCols}`}>
      {items.map((blog) => (
        <Link key={blog.slug} href={`/blog/${blog.slug}`}>
          <div className="group cursor-pointer">
            {/* Image */}
            <div className="relative h-80 rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(149,127,106,0.15)]">
              <Image
                src={blog.coverImage}
                fill
                alt={blog.title}
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>

            {/* Text */}
            <div className="mt-6">
              <h3 className="text-xl text-[#5f5143] font-semibold group-hover:text-[#6a0f1f] transition">
                {blog.title}
              </h3>

              <p className="text-[#7a6a5c] mt-3 line-clamp-3">{blog.excerpt}</p>
            </div>
          </div>
        </Link>
        // </motion.div>
      ))}
    </div>
  );
}
