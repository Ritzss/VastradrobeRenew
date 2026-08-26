import type { Metadata } from "next";
import ScrollReveal from "@/components/Global/ScrollReveal";
import { blogs } from "@/lib/blog";
import Image from "next/image";

type Props = {
  params: Promise<{ slug: string }>;
};

/* =========================================================
   SEO METADATA
========================================================= */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;

  const blog = blogs.find((b) => b.slug === slug);

  if (!blog) {
    return {
      title: "Blog Not Found | VastraDrobe",
      description: "The requested VastraDrobe blog could not be found.",
    };
  }

  const intro =
    blog.content.find((section) => section.type === "Intro")?.value ?? "";

  const description =
    intro.length > 160 ? `${intro.substring(0, 157)}...` : intro;

  return {
    title: `${blog.title} | VastraDrobe`,

    description,

    keywords: [
      "VastraDrobe",
      "fashion",
      "fashion tips",
      "style guide",
      "clothing",
      "outfit ideas",
      "fashion trends",
      "wardrobe guide",
      "clothing color guide",
      blog.title,
    ],

    authors: [
      {
        name: "VastraDrobe",
      },
    ],

    creator: "VastraDrobe",
    publisher: "VastraDrobe",

    alternates: {
      canonical: `https://vastradrobe.com/blog/${blog.slug}`,
    },

    openGraph: {
      title: `${blog.title} | VastraDrobe`,
      description,
      url: `https://vastradrobe.com/blog/${blog.slug}`,
      siteName: "VastraDrobe",
      type: "article",
      locale: "en_IN",

      images: [
        {
          url: blog.coverImage,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${blog.title} | VastraDrobe`,
      description,
      images: [blog.coverImage],
    },

    robots: {
      index: true,
      follow: true,

      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

/* =========================================================
   TYPES
========================================================= */

type BlogBlock = {
  heading?: string;

  image?: {
    src: string;
    text?: string;
  };

  paragraphs: string[];

  list?: {
    items: string[];
    style?: "disc" | "decimal";
  };

  table?: {
    headers: string[];
    rows: string[][];
  };

  faq?: {
    question: string;
    answer: string;
  };
};

/* =========================================================
   PAGE
========================================================= */

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;

  const blog = blogs.find((b) => b.slug === resolvedParams.slug);

  if (!blog) return null;

  /* =======================================================
     CONVERT BLOG CONTENT INTO RENDERABLE BLOCKS
  ======================================================= */

  const blocks: BlogBlock[] = [];

  let current: BlogBlock = {
    paragraphs: [],
  };

  const pushCurrent = () => {
    if (
      current.heading ||
      current.image ||
      current.paragraphs.length ||
      current.list ||
      current.table ||
      current.faq
    ) {
      blocks.push(current);
    }
  };

  for (const section of blog.content) {
    /* Ignore Intro because it is displayed in the hero */
    if (section.type === "Intro") continue;

    /* ---------------- HEADING ---------------- */

    if (section.type === "heading") {
      pushCurrent();

      current = {
        heading: section.value,
        paragraphs: [],
      };
    } else if (section.type === "paragraph") {

    /* ---------------- PARAGRAPH ---------------- */
      current.paragraphs.push(section.value ?? "");
    } else if (section.type === "image") {

    /* ---------------- IMAGE ---------------- */
      current.image = {
        src: section.src!,
        text: section.value,
      };
    } else if (section.type === "list") {

    /* ---------------- LIST ---------------- */
      current.list = {
        items: section.items ?? [],
        style: section.style,
      };
    } else if (section.type === "table") {

    /* ---------------- TABLE ---------------- */
      current.table = {
        headers: section.headers ?? [],
        rows: section.rows ?? [],
      };
    } else if (section.type === "faq") {

    /* ---------------- FAQ ---------------- */
      current.faq = {
        question: section.question ?? "",
        answer: section.answer ?? "",
      };
    }
  }

  pushCurrent();

  const intro =
    blog.content.find((section) => section.type === "Intro")?.value ?? "";

  const shortIntro =
    intro.length > 220 ? `${intro.substring(0, 220)}...` : intro;

  return (
    <article className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 transition-colors duration-500 select-none">
      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="relative h-screen overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          sizes="100vw"
          className="object-cover object-top pointer-events-none"
          draggable={false}
        />

        <div className="absolute inset-0 bg-linear-to-b from-black/20 via-black/45 to-black/85" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 space-y-6">
            <p className="uppercase tracking-[0.35em] text-[#e4e198] text-xs font-semibold">
              VastraDrobe Journal
            </p>

            <h1 className="font-serif font-light text-white leading-none tracking-wide max-w-5xl text-4xl sm:text-6xl lg:text-[76px] xl:text-[86px] uppercase">
              {blog.title}
            </h1>

            <div className="pt-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="w-20 h-0.5 bg-[#e4e198] mt-3" />

              <p className="max-w-xl text-white/90 text-xs sm:text-sm font-sans font-light tracking-wide leading-relaxed">
                {shortIntro}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 hidden md:block">
          <div className="flex flex-col items-center">
            <span className="text-white uppercase text-[9px] tracking-[4px] font-bold mb-3">
              Scroll
            </span>

            <div className="w-px h-14 bg-white/20">
              <div className="w-px h-6 bg-white animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          BLOG BODY
      ===================================================== */}

      <section className="relative -mt-20 rounded-t-3xl z-20 bg-[#fcfbfa] dark:bg-black border-t border-neutral-100 dark:border-neutral-900 transition-colors duration-500">
        <div className="max-w-5xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          {blocks.map((block, index) => {
            const layout = block.image ? index % 3 : 3;

            return (
              <ScrollReveal key={index}>
                <section className="mb-24 sm:mb-32">
                  {/* =================================================
                      SECTION HEADING
                  ================================================= */}

                  {block.heading && (
                    <div className="mb-10">
                      <span className="font-mono text-xs uppercase tracking-[0.2em] text-[#6A0F1F] dark:text-[#e4e198] font-bold">
                        {String(index + 1).padStart(2, "0")} / Section
                      </span>

                      <h2 className="mt-3 font-serif text-2xl sm:text-4xl font-light leading-tight max-w-4xl text-neutral-800 dark:text-white uppercase tracking-wide">
                        {block.heading}
                      </h2>
                    </div>
                  )}

                  {/* =================================================
                      IMAGE + TEXT
                  ================================================= */}

                  {layout === 0 && block.image && (
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                      <div className="md:col-span-5">
                        <div className="relative aspect-4/5 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-900 shadow-xs bg-[#faf9f6] dark:bg-neutral-950">
                          <Image
                            src={block.image.src}
                            alt={block.heading ?? blog.title}
                            fill
                            sizes="(max-width: 768px) 100vw, 40vw"
                            className="object-cover object-top pointer-events-none"
                            draggable={false}
                          />
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-6">
                        {block.image.text && (
                          <p className="italic text-xs font-serif text-[#6A0F1F] dark:text-[#e4e198]">
                            &ldquo;{block.image.text}&rdquo;
                          </p>
                        )}

                        {block.paragraphs.map((paragraph, i) => (
                          <p
                            key={i}
                            className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      STANDARD TEXT
                  ================================================= */}

                  {/* =================================================
    STANDARD TEXT + IMAGE
================================================= */}

                  {layout === 1 && (
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                      {/* Image */}
                      {block.image && (
                        <div className="md:col-span-5">
                          <div className="relative aspect-4/5 rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-900 shadow-xs bg-[#faf9f6] dark:bg-neutral-950">
                            <Image
                              src={block.image.src}
                              alt={
                                block.image.text ?? block.heading ?? blog.title
                              }
                              fill
                              sizes="(max-width: 768px) 100vw, 40vw"
                              className="object-cover object-top pointer-events-none"
                              draggable={false}
                            />
                          </div>
                        </div>
                      )}

                      {/* Text */}
                      <div
                        className={
                          block.image
                            ? "md:col-span-7 space-y-6"
                            : "md:col-span-12 space-y-6"
                        }
                      >
                        {block.image?.text && (
                          <p className="italic text-xs font-serif text-[#6A0F1F] dark:text-[#e4e198]">
                            &ldquo;{block.image.text}&rdquo;
                          </p>
                        )}

                        {block.paragraphs.map((paragraph, i) => (
                          <p
                            key={i}
                            className={`text-neutral-500 dark:text-neutral-400 leading-relaxed font-light tracking-wide ${
                              i === 0
                                ? "text-lg sm:text-xl font-serif text-neutral-800 dark:text-white"
                                : "text-xs sm:text-sm font-sans"
                            }`}
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      FULL WIDTH IMAGE
                  ================================================= */}

                  {layout === 2 && block.image && (
                    <div className="space-y-10">
                      <div className="relative aspect-video rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 shadow-xs">
                        <Image
                          src={block.image.src}
                          alt={block.heading ?? blog.title}
                          fill
                          sizes="100vw"
                          className="object-cover object-top pointer-events-none"
                          draggable={false}
                        />
                      </div>

                      {block.image.text && (
                        <p className="italic text-xs font-serif text-[#6A0F1F] dark:text-[#e4e198]">
                          &ldquo;{block.image.text}&rdquo;
                        </p>
                      )}

                      <div className="space-y-6">
                        {block.paragraphs.map((paragraph, i) => (
                          <p
                            key={i}
                            className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                          >
                            {paragraph}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      STANDARD CONTENT / LIST
                  ================================================= */}

                  {layout === 3 && (
                    <div className="space-y-8 w-full">
                      {block.paragraphs.length > 0 && (
                        <div className="space-y-6">
                          {block.paragraphs.map((paragraph, i) => (
                            <p
                              key={i}
                              className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                            >
                              {paragraph}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* =================================================
                          LIST CARD
                      ================================================= */}

                      {block.list && (
                        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-xs overflow-hidden">
                          <div className="px-6 py-4 border-b border-neutral-100 dark:border-neutral-900 bg-neutral-50/50 dark:bg-neutral-900/10">
                            <span className="uppercase tracking-[0.2em] text-[10px] text-[#6A0F1F] dark:text-[#e4e198] font-bold">
                              Key Notes
                            </span>
                          </div>

                          <div className="p-6 sm:p-8 md:p-10">
                            <ul
                              className={`space-y-5 pl-4 marker:text-[#6A0F1F] dark:marker:text-[#e4e198] text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide ${
                                block.list.style === "decimal"
                                  ? "list-decimal"
                                  : "list-disc"
                              }`}
                            >
                              {block.list.items.map((item, i) => (
                                <li key={i} className="leading-relaxed">
                                  {item}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {/* =================================================
                      TABLE
                  ================================================= */}

                  {block.table && (
                    <div className="mt-10 overflow-hidden rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 shadow-xs">
                      <div className="overflow-x-auto">
                        <table className="w-full min-w-162.5 border-collapse">
                          <thead>
                            <tr className="bg-[#6A0F1F] dark:bg-[#e4e198]">
                              {block.table.headers.map(
                                (header, headerIndex) => (
                                  <th
                                    key={headerIndex}
                                    className="px-5 py-4 text-left text-[10px] sm:text-xs uppercase tracking-[0.15em] font-bold text-white dark:text-[#29231f] border-r border-white/10 last:border-r-0"
                                  >
                                    {header}
                                  </th>
                                ),
                              )}
                            </tr>
                          </thead>

                          <tbody>
                            {block.table.rows.map((row, rowIndex) => (
                              <tr
                                key={rowIndex}
                                className="border-t border-neutral-100 dark:border-neutral-800 hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors"
                              >
                                {row.map((cell, cellIndex) => (
                                  <td
                                    key={cellIndex}
                                    className={`px-5 py-4 text-xs sm:text-sm leading-relaxed text-neutral-600 dark:text-neutral-300 border-r border-neutral-100 dark:border-neutral-800 last:border-r-0 ${
                                      cellIndex === 0
                                        ? "font-medium text-neutral-800 dark:text-white"
                                        : ""
                                    }`}
                                  >
                                    {cell}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}

                  {/* =================================================
                      FAQ
                  ================================================= */}

                  {block.faq && (
                    <div className="mt-10 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950 overflow-hidden shadow-xs">
                      <div className="px-6 sm:px-8 py-6">
                        <p className="text-[10px] uppercase tracking-[0.2em] font-bold text-[#6A0F1F] dark:text-[#e4e198] mb-3">
                          Frequently Asked Question
                        </p>

                        <h3 className="font-serif text-xl sm:text-2xl text-neutral-800 dark:text-white leading-tight">
                          {block.faq.question}
                        </h3>
                      </div>

                      <div className="border-t border-neutral-100 dark:border-neutral-800 px-6 sm:px-8 py-6">
                        <p className="text-xs sm:text-sm leading-relaxed tracking-wide text-neutral-500 dark:text-neutral-400">
                          {block.faq.answer}
                        </p>
                      </div>
                    </div>
                  )}
                </section>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </article>
  );
}
