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

  return (
    <article className="light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)] min-h-screen py-28">
      <div className="max-w-4xl mx-auto px-6">
        {/* TITLE */}
        <ScrollReveal>
          <h1 className="text-4xl md:text-5xl font-semibold text-[#5f5143] mb-16 leading-tight">
            {blog.title}
          </h1>
        </ScrollReveal>

        {/* INTRO + COVER */}
        <div className="grid lg:grid-cols-2 gap-16 items-center mb-24">
          <div>
            {blog.content.map((section, index) => {
              if (section.type === "Intro") {
                return (
                  <ScrollReveal key={index} direction="right">
                    <p className="text-xl text-[#7a6a5c] leading-relaxed">
                      {section.value}
                    </p>
                  </ScrollReveal>
                );
              }
              return null;
            })}
          </div>

          <ScrollReveal direction="up">
            <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(149,127,106,0.15)]">
              <Image
                src={blog.coverImage}
                alt={blog.title}
                fill
                className="object-cover"
                priority
              />
            </div>
          </ScrollReveal>
        </div>

        {/* BODY CONTENT */}
        <div className="space-y-20">
          {blog.content.map((section, index) => {
            if (section.type === "heading") {
              return (
                <ScrollReveal key={index} direction="left">
                  <h2 className="text-3xl font-semibold text-[#5f5143] mt-16">
                    {section.value}
                  </h2>
                </ScrollReveal>
              );
            }

            if (section.type === "paragraph") {
              return (
                <ScrollReveal key={index} delay={100}>
                  <p className="text-[#7a6a5c] text-lg leading-relaxed">
                    {section.value}
                  </p>
                </ScrollReveal>
              );
            }

            if (section.type === "list" && section.items) {
              const listClass =
                section.style === "decimal" ? "list-decimal" : "list-disc";

              return (
                <ScrollReveal key={index} direction="up">
                  <ul
                    className={`pl-6 text-lg space-y-4 text-[#7a6a5c] ${listClass}`}
                  >
                    {section.items.map((item, i) => {
                      const [boldPart, rest] = item.split(":");
                      return (
                        <li key={i}>
                          {rest ? (
                            <>
                              <strong className="text-[#5f5143]">
                                {boldPart.trim()}:
                              </strong>{" "}
                              {rest.trim()}
                            </>
                          ) : (
                            item
                          )}
                        </li>
                      );
                    })}
                  </ul>
                </ScrollReveal>
              );
            }

            if (section.type === "image" && section.src) {
              return (
                <ScrollReveal key={index} direction="up">
                  <div className="my-16">
                    {section.value && (
                      <p className="text-lg text-[#7a6a5c] mb-10">
                        {section.value}
                      </p>
                    )}

                    <div className="relative aspect-[4/5] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(149,127,106,0.15)]">
                      <Image
                        src={section.src}
                        alt={blog.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            }

            return null;
          })}
        </div>
      </div>
    </article>
  );
}
