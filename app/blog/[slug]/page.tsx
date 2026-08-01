import ScrollReveal from "@/components/Global/ScrollReveal";
import { blogs } from "@/lib/blog";
import Image from "next/image";

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const blog = blogs.find((b) => b.slug === resolvedParams.slug);

  if (!blog) return null;

  const blocks: {
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
  }[] = [];

  let current: (typeof blocks)[0] = {
    paragraphs: [],
  };

  for (const section of blog.content) {
    if (section.type === "Intro") continue;

    if (section.type === "heading") {
      if (
        current.heading ||
        current.image ||
        current.paragraphs.length ||
        current.list
      ) {
        blocks.push(current);
      }

      current = {
        heading: section.value,
        paragraphs: [],
      };
    } else if (section.type === "paragraph") {
      current.paragraphs.push(section.value ?? "");
    } else if (section.type === "image") {
      current.image = {
        src: section.src!,
        text: section.value,
      };
    } else if (section.type === "list") {
      current.list = {
        items: section.items ?? [],
        style: section.style,
      };
    }
  }

  blocks.push(current);

  const intro = blog.content.find((s) => s.type === "Intro")?.value ?? "";

  const shortIntro =
    intro.length > 220 ? intro.substring(0, 220) + "..." : intro;

  return (
    <article className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 transition-colors duration-500 select-none">
      {/* ================= 🏛️ HERO NARRATIVE SECTION ================= */}
      <section className="relative h-screen overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          className="object-cover object-top pointer-events-none"
          draggable={false}
        />

        {/* Cinematic dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/45 to-black/85" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pb-24 space-y-6">
            <p className="uppercase tracking-[0.35em] text-[#e4e198] text-xs font-semibold">
              VastraDrobe Journal
            </p>

            <h1 className="font-serif font-light text-white leading-[1.0] tracking-wide max-w-5xl text-4xl sm:text-6xl lg:text-[76px] xl:text-[86px] uppercase">
              {blog.title}
            </h1>

            <div className="pt-6 grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
              <div className="w-20 h-[2px] bg-[#e4e198] mt-3" />

              <p className="max-w-xl text-white/90 text-xs sm:text-sm font-sans font-light tracking-wide leading-relaxed">
                {shortIntro}
              </p>
            </div>
          </div>
        </div>

        {/* Scroll Indicator */}
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

      {/* ================= 🏛️ BODY JOURNAL CONTENT ================= */}
      <section className="relative -mt-20 rounded-t-3xl z-20 bg-[#fcfbfa] dark:bg-black border-t border-neutral-100 dark:border-neutral-900 transition-colors duration-500">
        <div className="max-w-4xl mx-auto px-6 sm:px-8 py-20 sm:py-28">
          {blocks.map((block, index) => {
            const layout = block.image ? index % 3 : 3;

            return (
              <ScrollReveal key={index}>
                <section className="mb-24 sm:mb-32">
                  {/* Segment Heading */}
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

                  {/* LAYOUT 1: Left Image, Right Text */}
                  {layout === 0 && block.image && (
                    <div className="grid md:grid-cols-12 gap-10 items-center">
                      <div className="md:col-span-5">
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden border border-neutral-100 dark:border-neutral-900 shadow-xs bg-[#faf9f6] dark:bg-neutral-950">
                          <Image
                            src={block.image.src}
                            alt=""
                            fill
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

                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 2: Standard Center Text Segment */}
                  {layout === 1 && (
                    <div className="space-y-6">
                      {block.paragraphs.map((p, i) => (
                        <p
                          key={i}
                          className={`text-neutral-500 dark:text-neutral-400 leading-relaxed font-light tracking-wide ${
                            i === 0
                              ? "text-lg sm:text-xl font-serif text-neutral-800 dark:text-white"
                              : "text-xs sm:text-sm font-sans"
                          }`}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* LAYOUT 3: Grand Full-width Editorial Banner image */}
                  {layout === 2 && block.image && (
                    <div className="space-y-10">
                      <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 shadow-xs">
                        <Image
                          src={block.image.src}
                          alt=""
                          fill
                          className="object-cover object-top pointer-events-none"
                          draggable={false}
                        />
                      </div>

                      <div className="space-y-6">
                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 4: Stacked Full Width (Paragraphs on Top, Key Notes Card on Bottom to prevent whitespace gaps) */}
                  {layout === 3 && (
                    <div className="space-y-8 w-full">
                      {/* Introductory Paragraphs (Full Width) */}
                      <div className="space-y-6">
                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed"
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {/* Key Notes Summary Card (Full Width) */}
                      {block.list && (
                        <div className="rounded-2xl border border-neutral-100 dark:border-neutral-900 bg-white dark:bg-neutral-950 shadow-xs overflow-hidden transition duration-300">
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
                </section>
              </ScrollReveal>
            );
          })}
        </div>
      </section>
    </article>
  );
}
