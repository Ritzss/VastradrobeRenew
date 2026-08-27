"use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";

interface Props {
  limit?: number;
}

/**
 * Editorial blog preview for the homepage.
 *
 * The layout intentionally keeps the section compact:
 * - Large editorial imagery
 * - Minimal metadata
 * - Serif article titles
 * - Subtle hover interactions
 * - Featured first article on larger screens
 */
export default function BlogPreviewGrid({ limit }: Props) {
  const items = limit ? blogs.slice(0, limit) : blogs;

  if (!items.length) {
    return null;
  }

  return (
    <div className="grid gap-8 lg:grid-cols-12 lg:gap-10">
      {items.map((blog, index) => {
        const isFeatured = index === 0 && items.length >= 3;

        return (
          <Link
            key={blog.slug}
            href={`/blog/${blog.slug}`}
            className={`
              group block
              ${
                isFeatured
                  ? "lg:col-span-7"
                  : "lg:col-span-5"
              }
              ${index > 0 ? "lg:col-start-8" : ""}
            `}
          >
            <article
              className={`
                ${
                  isFeatured
                    ? "lg:flex lg:flex-col"
                    : "flex flex-col"
                }
              `}
            >
              {/* =================================================
                  IMAGE
                  ================================================= */}

              <div
                className={`
                  relative
                  overflow-hidden
                  bg-[#e9e3da]
                  ${
                    isFeatured
                      ? "aspect-16/10"
                      : "aspect-video"
                  }
                `}
              >
                <Image
                  src={blog.coverImage}
                  alt={blog.title}
                  fill
                  sizes={
                    isFeatured
                      ? "(max-width: 1024px) 100vw, 58vw"
                      : "(max-width: 1024px) 100vw, 42vw"
                  }
                  className="
                    object-cover
                    transition-transform
                    duration-700
                    ease-out
                    group-hover:scale-[1.035]
                  "
                />

                {/* Soft editorial overlay */}

                <div
                  className="
                    absolute
                    inset-0
                    bg-linear-to-t
                    from-black/25
                    via-transparent
                    to-transparent
                    opacity-50
                    transition-opacity
                    duration-500
                    group-hover:opacity-30
                  "
                />

                {/* Article number */}

                <span
                  className="
                    absolute
                    left-5
                    top-5
                    text-[9px]
                    font-semibold
                    tracking-[0.25em]
                    text-white/90
                  "
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Read indicator */}

                <span
                  className="
                    absolute
                    right-5
                    top-5
                    flex
                    h-9
                    w-9
                    translate-y-1
                    items-center
                    justify-center
                    rounded-full
                    bg-white/90
                    text-[#4d433a]
                    opacity-0
                    transition-all
                    duration-300
                    group-hover:translate-y-0
                    group-hover:opacity-100
                  "
                >
                  ↗
                </span>
              </div>

              {/* =================================================
                  CONTENT
                  ================================================= */}

              <div
                className={`
                  pt-5
                  ${
                    isFeatured
                      ? "lg:pt-6"
                      : "lg:pt-4"
                  }
                `}
              >
                {/* Meta */}

                <div className="flex items-center gap-3">
                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.25em]
                      text-[#6A0F1F]
                      dark:text-[#e4e198]
                    "
                  >
                    Vastra Journal
                  </span>

                  <span className="h-px w-5 bg-[#cfc5ba] dark:bg-neutral-700" />

                  <span
                    className="
                      text-[9px]
                      uppercase
                      tracking-[0.18em]
                      text-[#9a8876]
                    "
                  >
                    {blog.date}
                  </span>
                </div>

                {/* Title */}

                <h3
                  className={`
                    mt-3
                    font-serif
                    font-light
                    leading-tight
                    tracking-[-0.01em]
                    text-[#40372f]
                    transition-colors
                    duration-300
                    group-hover:text-[#6A0F1F]
                    dark:text-white
                    dark:group-hover:text-[#e4e198]
                    ${
                      isFeatured
                        ? "text-2xl sm:text-3xl"
                        : "text-xl"
                    }
                  `}
                >
                  {blog.title}
                </h3>

                {/* Excerpt */}

                <p
                  className="
                    mt-2
                    line-clamp-2
                    max-w-2xl
                    text-xs
                    leading-6
                    text-[#85766a]
                    dark:text-neutral-400
                  "
                >
                  {blog.excerpt}
                </p>

                {/* Read article */}

                <div className="mt-4 flex items-center">
                  <span
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.2em]
                      text-[#6A0F1F]
                      dark:text-[#e4e198]
                    "
                  >
                    Read story
                  </span>

                  <span
                    className="
                      ml-2
                      text-sm
                      text-[#6A0F1F]
                      transition-transform
                      duration-300
                      group-hover:translate-x-1.5
                      dark:text-[#e4e198]
                    "
                  >
                    →
                  </span>
                </div>
              </div>
            </article>
          </Link>
        );
      })}
    </div>
  );
}