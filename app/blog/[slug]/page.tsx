import ScrollReveal from "@/components/Global/ScrollReveal";
import { blogs } from "@/lib/blog";
import Image from "next/image";

export default async function BlogDetailPage({
  params,
}: {
  params: { slug: string };
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
    <article className="min-h-screen bg-[#F8F5F0] dark:bg-[#150e10] transition-colors duration-500">
      {/* ================= HERO ================= */}

      <section className="relative h-screen overflow-hidden">
        <Image
          src={blog.coverImage}
          alt={blog.title}
          fill
          priority
          className="object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/30 to-black/70" />

        <div className="absolute inset-0 flex items-end">
          <div className="w-full max-w-7xl mx-auto px-8 lg:px-16 pb-24">
            <p className="uppercase tracking-[8px] text-[#E4E198] text-xs mb-6">
              VastraDrobe Journal
            </p>

            <h1
              className="
            font-serif
            font-light
            text-white
            leading-[0.9]
            tracking-[-0.04em]
            max-w-5xl

            text-5xl
            md:text-7xl
            lg:text-[82px]
            xl:text-[96px]
          "
            >
              {blog.title}
            </h1>

            <div className="mt-12 grid lg:grid-cols-2 gap-16 items-end">
              <div className="w-24 h-[2px] bg-[#889551]" />

              <p className="max-w-xl text-white/90 text-lg leading-9">
                {shortIntro}
              </p>
            </div>
          </div>
        </div>

        <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center">
            <span className="text-white uppercase text-xs tracking-[4px] mb-3">
              Scroll
            </span>

            <div className="w-px h-14 bg-white/30">
              <div className="w-px h-6 bg-white animate-bounce" />
            </div>
          </div>
        </div>
      </section>

      {/* BODY CONTENT */}
      <section className="relative -mt-24 rounded-t-[70px] z-20 bg-[#F8F5F0] dark:bg-[#150e10] transition-colors duration-500">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-28">
          {blocks.map((block, index) => {
            const layout = block.image ? index % 3 : 3;

            return (
              <ScrollReveal key={index}>
                <section className="mb-40">
                  {/* Heading */}

                  {block.heading && (
                    <div className="mb-14">
                      <span className="uppercase tracking-[6px] text-xs text-[#889551] dark:text-[#A8C37A]">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2 className="mt-4 font-serif text-4xl md:text-6xl font-light leading-tight max-w-4xl text-[#231f1b] dark:text-white">
                        {block.heading}
                      </h2>
                    </div>
                  )}

                  {/* LAYOUT 1 */}

                  {layout === 0 && block.image && (
                    <div className="grid lg:grid-cols-12 gap-20 items-center">
                      <div className="lg:col-span-5">
                        <div className="relative aspect-[4/5] rounded-xl overflow-hidden">
                          <Image
                            src={block.image.src}
                            alt=""
                            fill
                            className="object-cover"
                          />
                        </div>
                      </div>

                      <div className="lg:col-span-7 space-y-8">
                        {block.image.text && (
                          <p className="italic text-[#889551] dark:text-[#A8C37A]">
                            {block.image.text}
                          </p>
                        )}

                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="max-w-2xl text-lg leading-9 text-[#665d54]"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* LAYOUT 2 */}

                  {layout === 1 && (
                    <div className="max-w-5xl mx-auto">
                      {block.paragraphs.map((p, i) => (
                        <p
                          key={i}
                          className={`leading-10 text-[#665d54] ${
                            i === 0
                              ? "text-2xl md:text-3xl font-serif"
                              : "mt-8 text-lg"
                          }`}
                        >
                          {p}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* LAYOUT 3 */}

                  {layout === 2 && block.image && (
                    <>
                      <div className="relative aspect-[16/8] rounded-2xl overflow-hidden">
                        <Image
                          src={block.image.src}
                          alt=""
                          fill
                          className="object-cover"
                        />
                      </div>

                      <div className="max-w-5xl mx-auto mt-12">
                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-lg leading-9 text-[#665d54] mb-8"
                          >
                            {p}
                          </p>
                        ))}
                      </div>
                    </>
                  )}

                  {/* LAYOUT 4 */}

                  {layout === 3 && (
                    <div className="grid lg:grid-cols-2 gap-16 items-start">
                      <div className="space-y-8">
                        {block.paragraphs.map((p, i) => (
                          <p
                            key={i}
                            className="text-lg leading-9 text-[#665d54] dark:text-neutral-300"
                          >
                            {p}
                          </p>
                        ))}
                      </div>

                      {block.list && (
                        <div className="rounded-3xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 shadow-xl overflow-hidden transition-colors duration-500">
                          <div className="px-8 py-5 border-b border-neutral-200 dark:border-neutral-800">
                            <span className="uppercase tracking-[4px] text-xs text-[#889551] dark:text-[#A8C37A]">
                              Key Points
                            </span>
                          </div>

                          <div className="p-8 md:p-10">
                            <ul
                              className={`space-y-5 pl-6 marker:text-[#889551] dark:marker:text-[#A8C37A] ${
                                block.list.style === "decimal"
                                  ? "list-decimal"
                                  : "list-disc"
                              }`}
                            >
                              {block.list.items.map((item, i) => (
                                <li
                                  key={i}
                                  className="text-[17px] leading-8 text-[#665d54] dark:text-neutral-300"
                                >
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
