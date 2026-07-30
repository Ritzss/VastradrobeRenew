"use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";

interface Props {
  limit?: number;
}

/**
 * 👑 LUXURY REDESIGN: Blog Preview Grid (Nangalia Ruchira Theme)
 * 
 * Styled for premium editorial look:
 * - Geometric shape: Swapped rounded-[28px] and heavy shadows for elegant, clean rounded-2xl with thin borders.
 * - Image scale-up zooms beautifully on card hover.
 * - Luxury tracking-widest typography:
 *   * Meta tag (date/category): text-[9px] font-bold text-[#6A0F1F] dark:text-[#e4e198] uppercase tracking-widest.
 *   * Title: font-serif text-lg sm:text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide mt-3 line-clamp-2 leading-snug.
 *   * Excerpt: text-xs leading-relaxed text-neutral-500 font-light mt-2.
 * - Added delicate "Read Article →" link.
 */
export default function BlogPreviewGrid({ limit }: Props) {
  const items = limit ? blogs.slice(0, limit) : blogs;

  const gridCols =
    items.length === 1
      ? "grid-cols-1 max-w-md mx-auto"
      : items.length === 2
        ? "grid-cols-1 md:grid-cols-2 max-w-4xl mx-auto"
        : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3";

  return (
    <div className={`grid gap-12 lg:gap-14 ${gridCols}`}>
      {items.map((blog) => (
        <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group block">
          <div className="flex flex-col text-left space-y-4">
            
            {/* Immersive cover image with smooth zoom transition */}
            <div className="relative aspect-[4/3] w-full rounded-2xl overflow-hidden bg-[#faf9f6] border border-neutral-100 dark:border-neutral-900 shadow-xs transition duration-300">
              <Image
                src={blog.coverImage}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                alt={blog.title}
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-102"
              />
            </div>

            {/* Editorial Details & Content */}
            <div className="space-y-1">
              {/* Meta Categories */}
              <p className="text-[9px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.25em] uppercase">
                {blog.date || "Vastra Journal"}
              </p>

              {/* Title (Luxurious Serif) */}
              <h3 className="font-serif text-lg sm:text-xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-snug line-clamp-2 transition-colors duration-200 group-hover:text-[#6A0F1F] dark:group-hover:text-[#e4e198]">
                {blog.title}
              </h3>

              {/* Excerpt */}
              <p className="text-neutral-500 dark:text-neutral-400 text-xs leading-relaxed font-light font-sans tracking-wide line-clamp-3">
                {blog.excerpt}
              </p>

              {/* Minimal Read Trigger link */}
              <div className="pt-2">
                <span className="text-[9px] tracking-widest font-bold uppercase text-[#6A0F1F] dark:text-[#e4e198] hover:underline underline-offset-4 inline-flex items-center gap-1 transition duration-300">
                  Read Article <span className="group-hover:translate-x-1.5 transition duration-300">→</span>
                </span>
              </div>
            </div>

          </div>
        </Link>
      ))}
    </div>
  );
}
