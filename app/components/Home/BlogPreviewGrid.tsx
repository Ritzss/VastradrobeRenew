"use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";
import { motion } from "framer-motion";

interface Props {
  limit?: number;
}

export default function BlogPreviewGrid({ limit = 3 }: Props) {
  const items = blogs.slice(0, limit);

  return (
    <div className="grid md:grid-cols-3 gap-10">
      {items.map((blog, index) => (
        <motion.div
          key={blog.slug}
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: index * 0.15 }}
          viewport={{ once: true }}
        >
          <Link href={`/blog/${blog.slug}`}>
            <div className="group cursor-pointer">
              {/* Image */}
              <div className="relative h-[320px] rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(149,127,106,0.15)]">
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

                <p className="text-[#7a6a5c] mt-3 line-clamp-3">
                  {blog.excerpt}
                </p>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
