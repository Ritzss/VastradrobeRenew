"use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";

interface Props {
  limit?: number;
}

/**
 * Magazine-style editorial blog preview.
 *
 * Design:
 * - Large cinematic featured article
 * - Floating secondary stories
 * - Editorial typography
 * - Minimal borders
 * - Strong negative space
 * - Fashion-magazine inspired composition
 */
export default function BlogPreviewGrid({ limit }: Props) {
  const items = limit ? blogs.slice(0, limit) : blogs;

  if (!items.length) return null;

  const featured = items[0];
  const secondary = items.slice(1, 4);

  return (
    <div className="relative">
      {/* =========================================================
          FEATURED STORY
          ========================================================= */}

      <Link href={`/blog/${featured.slug}`} className="group relative block">
        <article>
          {/* Featured image */}

          <div className=" relative aspect-video overflow-hidden bg-[#e9e3da] dark:bg-neutral-900">
            <Image
              src={featured.coverImage}
              alt={featured.title}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 100vw"
              className=" object-cover transition-transform duration-1200 ease-out group-hover:scale-[1.025]"
            />

            {/* Cinematic overlay */}

            <div className=" absolute inset-0 bg-linear-to-t from-black/75 via-black/20 to-transparent " />

            {/* Top metadata */}

            <div className=" absolute left-5 right-5 top-5 flex items-center justify-between sm:left-8 sm:right-8 sm:top-8">
              <span className=" text-[9px] font-semibold uppercase tracking-[0.3em] text-white/90">
                Vastra Journal
              </span>

              <span className=" text-[9px] uppercase tracking-[0.2em] text-white/70">
                01 / {String(items.length).padStart(2, "0")}
              </span>
            </div>

            {/* Featured content */}

            <div className=" absolute bottom-6 left-5 right-5 sm:bottom-10 sm:left-8 sm:right-8 lg:bottom-12 ">
              <div className="mb-3 flex items-center gap-3">
                <span className="h-px w-7 bg-white/60" />

                <span className=" text-[8px] uppercase tracking-[0.25em] text-white/80">
                  {featured.date}
                </span>
              </div>

              <h3
                className=" max-w-4xl font-serif text-3xl font-light leading-[1.08] tracking-tight text-white sm:text-4xl lg:text-5xl xl:text-6xl
                "
              >
                {featured.title}
              </h3>

              <div className="mt-5 flex items-center gap-3">
                <span
                  className=" text-[9px] font-semibold uppercase tracking-[0.25em] text-white
                  "
                >
                  Read story
                </span>

                <span
                  className=" text-base text-white transition-transform duration-300 group-hover:translate-x-2
                  "
                >
                  →
                </span>
              </div>
            </div>
          </div>
        </article>
      </Link>

      {/* =========================================================
          SECONDARY STORIES
          ========================================================= */}

      {secondary.length > 0 && (
        <div
          className=" mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3
          "
        >
          {secondary.map((blog, index) => (
            <Link key={blog.slug} href={`/blog/${blog.slug}`} className="group">
              <article>
                {/* Image */}

                <div
                  className=" relative aspect-4/3 overflow-hidden bg-[#e9e3da] dark:bg-neutral-900
                  "
                >
                  <Image
                    src={blog.coverImage}
                    alt={blog.title}
                    fill
                    sizes="
                      (max-width: 640px) 100vw,
                      (max-width: 1024px) 50vw,
                      33vw
                    "
                    className=" object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]
                    "
                  />

                  {/* Number */}

                  <span
                    className=" absolute left-4 top-4 text-[9px] font-semibold tracking-[0.25em] text-white drop-shadow-sm
                    "
                  >
                    {String(index + 2).padStart(2, "0")}
                  </span>

                  {/* Hover arrow */}

                  <span
                    className=" absolute bottom-4 right-4 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#40372f] opacity-0 transition-all duration-300 group-hover:opacity-100
                    "
                  >
                    ↗
                  </span>
                </div>

                {/* Text */}

                <div className="pt-4">
                  <div className="flex items-center gap-3">
                    <span
                      className=" text-[8px] font-semibold uppercase tracking-[0.25em] text-[#6A0F1F] dark:text-[#e4e198]
                      "
                    >
                      Journal
                    </span>

                    <span className="h-px w-4 bg-[#cfc5ba] dark:bg-neutral-700" />

                    <span
                      className=" text-[8px] uppercase tracking-[0.18em] text-[#9a8876]
                      "
                    >
                      {blog.date}
                    </span>
                  </div>

                  <h3
                    className=" mt-2 font-serif text-lg font-light leading-tight tracking-[-0.015em] text-[#40372f] transition-colors duration-300 group-hover:text-[#6A0F1F] dark:text-white dark:group-hover:text-[#e4e198]
                    "
                  >
                    {blog.title}
                  </h3>

                  <p
                    className=" mt-2 line-clamp-2 text-xs leading-5 text-[#85766a] dark:text-neutral-400
                    "
                  >
                    {blog.excerpt}
                  </p>

                  <div
                    className=" mt-3 flex items-center gap-2
                    "
                  >
                    <span
                      className=" text-[8px] font-semibold uppercase tracking-[0.2em] text-[#40372f] dark:text-neutral-300
                      "
                    >
                      Explore
                    </span>

                    <span
                      className=" text-xs text-[#6A0F1F] transition-transform duration-300 group-hover:translate-x-1 dark:text-[#e4e198]
                      "
                    >
                      →
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}

      {/* =========================================================
          BOTTOM EDITORIAL LINE
          ========================================================= */}

      <div className="mt-10 flex items-center justify-between border-t border-[#d8d0c7] pt-5 dark:border-neutral-800">
        <span className=" text-[8px] font-semibold uppercase tracking-[0.3em] text-[#9a8876] ">
          The Vastra Journal
        </span>

        <Link
          href="/blog"
          className=" group/all flex items-center gap-2 text-[8px] font-semibold uppercase tracking-[0.25em] text-[#6A0F1F] dark:text-[#e4e198]
          "
        >
          View all stories
          <span className="transition-transform duration-300 group-hover/all:translate-x-1.5">
            →
          </span>
        </Link>
      </div>
    </div>
  );
}
