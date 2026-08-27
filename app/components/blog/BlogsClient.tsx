"use client";

import Link from "next/link";
import Image from "next/image";
import { blogs } from "@/lib/blog";

interface BlogClientProps {
  showTitle?: boolean;
}

/**
 * Vastra Journal archive page.
 *
 * This is intentionally separate from BlogPreviewGrid because:
 * - Homepage = curated preview
 * - Blog page = complete editorial archive
 * - Gives the journal its own visual identity
 * - Avoids coupling homepage and blog layouts
 */
const BlogClient = ({ showTitle = true }: BlogClientProps) => {
  return (
    <section
      className="
        min-h-screen
        bg-[#fcfbfa]
        px-5
        pb-24
        pt-16
        transition-colors
        duration-300
        dark:bg-black
        sm:px-8
        lg:px-12
      "
    >
      <div className="mx-auto max-w-7xl">
        {/* =========================================================
            JOURNAL HEADER
            ========================================================= */}

        {showTitle && (
          <header className="mb-16 border-b border-[#ded8d1] pb-12 dark:border-neutral-800">
            <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
              <div>
                {/* Eyebrow */}

                <div className="mb-5 flex items-center gap-3">
                  <span className="h-px w-8 bg-[#6A0F1F] dark:bg-[#e4e198]" />

                  <p
                    className="
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-[0.3em]
                      text-[#6A0F1F]
                      dark:text-[#e4e198]
                    "
                  >
                    Vastra Journal
                  </p>
                </div>

                {/* Main title */}

                <h1
                  className="
                    max-w-4xl
                    font-serif
                    text-4xl
                    font-light
                    leading-[1.05]
                    tracking-[-0.025em]
                    text-[#332d28]
                    sm:text-5xl
                    md:text-6xl
                    lg:text-7xl
                    dark:text-white
                  "
                >
                  Beyond Fabric.
                  <br />
                  <span className="text-[#8b7b6c] dark:text-neutral-500">
                    Into Thought.
                  </span>
                </h1>

                {/* Description */}

                <p
                  className="
                    mt-6
                    max-w-xl
                    text-sm
                    font-light
                    leading-7
                    tracking-wide
                    text-[#756a60]
                    dark:text-neutral-400
                  "
                >
                  Stories about style, craftsmanship, conscious living,
                  materials, and the ideas shaping the way we dress.
                </p>
              </div>

              {/* Archive count */}

              <div className="lg:text-right">
                <span
                  className="
                    block
                    font-serif
                    text-4xl
                    font-light
                    text-[#40372f]
                    dark:text-white
                  "
                >
                  {String(blogs.length).padStart(2, "0")}
                </span>

                <span
                  className="
                    text-[8px]
                    font-semibold
                    uppercase
                    tracking-[0.28em]
                    text-[#9a8876]
                  "
                >
                  Stories &amp; Essays
                </span>
              </div>
            </div>
          </header>
        )}

        {/* =========================================================
            ARTICLE ARCHIVE
            ========================================================= */}

        {blogs.length > 0 ? (
          <div className="grid gap-x-7 gap-y-14 sm:grid-cols-2 lg:grid-cols-12 lg:gap-x-10 lg:gap-y-16">
            {blogs.map((blog, index) => {
              const isFeatured = index === 0;

              return (
                <Link
                  key={blog.slug}
                  href={`/blog/${blog.slug}`}
                  className={`
                    group block
                    ${
                      isFeatured
                        ? "sm:col-span-2 lg:col-span-8"
                        : "lg:col-span-4"
                    }
                  `}
                >
                  <article>
                    {/* =================================================
                        IMAGE
                        ================================================= */}

                    <div
                      className={`
                        relative
                        overflow-hidden
                        bg-[#e9e3da]
                        dark:bg-neutral-900
                        ${
                          isFeatured
                            ? "aspect-[16/9]"
                            : "aspect-[4/3]"
                        }
                      `}
                    >
                      <Image
                        src={blog.coverImage}
                        alt={blog.title}
                        fill
                        sizes={
                          isFeatured
                            ? "(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 66vw"
                            : "(max-width: 1024px) 50vw, 33vw"
                        }
                        className="
                          object-cover
                          transition-transform
                          duration-700
                          ease-out
                          group-hover:scale-[1.035]
                        "
                      />

                      {/* Image overlay */}

                      <div
                        className="
                          absolute
                          inset-0
                          bg-gradient-to-t
                          from-black/35
                          via-transparent
                          to-transparent
                          opacity-60
                          transition-opacity
                          duration-500
                          group-hover:opacity-40
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
                          tracking-[0.28em]
                          text-white/90
                        "
                      >
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      {/* Featured badge */}

                      {isFeatured && (
                        <span
                          className="
                            absolute
                            right-5
                            top-5
                            border
                            border-white/40
                            bg-black/10
                            px-3
                            py-1.5
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-white
                            backdrop-blur-sm
                          "
                        >
                          Featured
                        </span>
                      )}

                      {/* Hover arrow */}

                      <span
                        className="
                          absolute
                          bottom-5
                          right-5
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-full
                          bg-white
                          text-[#40372f]
                          opacity-0
                          translate-y-2
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
                        ARTICLE INFORMATION
                        ================================================= */}

                    <div className={isFeatured ? "pt-6" : "pt-5"}>
                      {/* Metadata */}

                      <div className="flex items-center gap-3">
                        <span
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.27em]
                            text-[#6A0F1F]
                            dark:text-[#e4e198]
                          "
                        >
                          Vastra Journal
                        </span>

                        <span className="h-px w-5 bg-[#cec5bb] dark:bg-neutral-700" />

                        <span
                          className="
                            text-[8px]
                            uppercase
                            tracking-[0.18em]
                            text-[#9a8876]
                          "
                        >
                          {blog.date}
                        </span>
                      </div>

                      {/* Title */}

                      <h2
                        className={`
                          mt-3
                          max-w-3xl
                          font-serif
                          font-light
                          leading-[1.12]
                          tracking-[-0.02em]
                          text-[#40372f]
                          transition-colors
                          duration-300
                          group-hover:text-[#6A0F1F]
                          dark:text-white
                          dark:group-hover:text-[#e4e198]
                          ${
                            isFeatured
                              ? "text-2xl sm:text-3xl lg:text-4xl"
                              : "text-xl"
                          }
                        `}
                      >
                        {blog.title}
                      </h2>

                      {/* Excerpt */}

                      <p
                        className={`
                          mt-3
                          max-w-2xl
                          text-xs
                          leading-6
                          text-[#85766a]
                          dark:text-neutral-400
                          ${
                            isFeatured
                              ? "line-clamp-3 sm:text-sm"
                              : "line-clamp-2"
                          }
                        `}
                      >
                        {blog.excerpt}
                      </p>

                      {/* Read */}

                      <div className="mt-5 flex items-center gap-3">
                        <span
                          className="
                            text-[8px]
                            font-semibold
                            uppercase
                            tracking-[0.25em]
                            text-[#40372f]
                            dark:text-neutral-300
                          "
                        >
                          Read article
                        </span>

                        <span
                          className="
                            text-sm
                            text-[#6A0F1F]
                            transition-transform
                            duration-300
                            group-hover:translate-x-2
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
        ) : (
          /* =========================================================
             EMPTY STATE
             ========================================================= */

          <div className="py-24 text-center">
            <p
              className="
                font-serif
                text-2xl
                font-light
                text-[#40372f]
                dark:text-white
              "
            >
              The journal is taking shape.
            </p>

            <p
              className="
                mt-2
                text-xs
                tracking-wide
                text-[#85766a]
                dark:text-neutral-500
              "
            >
              New stories are coming soon.
            </p>
          </div>
        )}

        {/* =========================================================
            FOOTER LINE
            ========================================================= */}

        {blogs.length > 0 && (
          <div className="mt-20 flex items-center justify-between border-t border-[#ded8d1] pt-5 dark:border-neutral-800">
            <span
              className="
                text-[8px]
                font-semibold
                uppercase
                tracking-[0.3em]
                text-[#9a8876]
              "
            >
              Vastra Journal
            </span>

            <span
              className="
                text-[8px]
                uppercase
                tracking-[0.2em]
                text-[#9a8876]
              "
            >
              {blogs.length} stories
            </span>
          </div>
        )}
      </div>
    </section>
  );
};

export default BlogClient;