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

  return (
    <article className="px-6 py-12 max-w-5xl mx-auto">
      <ScrollReveal>
        <h1 className="text-4xl font-semibold mb-8">{blog?.title}</h1>
      </ScrollReveal>

      <div className="lg:flex gap-20 p-5 mb-10">
        <div>
          {blog?.content.map((section, index) => {
            if (section.type === "Intro") {
              return (
                <ScrollReveal key={index} direction="right">
                  <div className="text-xl font-extralight">{section.value}</div>
                </ScrollReveal>
              );
            }
          })}
        </div>
        <ScrollReveal direction="up">
          <div className="relative rounded-lg overflow-hidden h-70 md:w-100 md:h-90 border m-5 lg:m-0">
            <Image
              src={`${blog?.coverImage}`}
              alt={`${blog?.title}`}
              fill
              priority
            />
          </div>
        </ScrollReveal>
      </div>

      {blog?.content.map((section, index) => {
        if (section.type === "heading") {
          return (
            <ScrollReveal key={index} direction="left">
              <h2 className="text-3xl font-semibold mt-10 mb-4">
                {section.value}
              </h2>
            </ScrollReveal>
          );
        }

        if (section.type === "paragraph") {
          return (
            <ScrollReveal key={index} delay={100}>
              <p className="text-gray-700 p-4 text-xl leading-relaxed mb-6">
                {section.value}
              </p>
            </ScrollReveal>
          );
        }

        if (section.type === "list" && section.items) {
          const listClass =
            section.style === "decimal" ? "list-decimal" : "list-disc";

          // 🔥 SIDE LAYOUT
          if (section.layout === "side-left" && section.src) {
            return (
              <ScrollReveal key={index} direction="up">
                <div className="flex flex-col lg:flex-row items-start gap-16 my-16">
                  {/* IMAGE LEFT */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative md:w-125 w-100 h-87.5 rounded-2xl overflow-hidden border border-black">
                      <Image
                        src={section.src}
                        alt="List visual"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* LIST RIGHT */}
                  <div className="lg:w-1/2">
                    <ul
                      className={`pl-6 text-lg space-y-4 text-gray-700 ${listClass}`}
                    >
                      {section.items.map((item, i) => {
                        const [boldPart, rest] = item.split(":");
                        return (
                          <ScrollReveal key={i} delay={i * 120}>
                            <li>
                              {rest ? (
                                <>
                                  <strong>{boldPart.trim()}:</strong>{" "}
                                  {rest.trim()}
                                </>
                              ) : (
                                item
                              )}
                            </li>
                          </ScrollReveal>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          }

          if (section.layout === "side-right" && section.src) {
            return (
              <ScrollReveal key={index} direction="up">
                <div className="flex flex-col lg:flex-row-reverse items-start gap-16 my-16">
                  {/* IMAGE LEFT */}
                  <div className="lg:w-1/2 flex justify-center">
                    <div className="relative w-125 h-87.5 rounded-2xl overflow-hidden border">
                      <Image
                        src={section.src}
                        alt="List visual"
                        fill
                        className="object-cover"
                      />
                    </div>
                  </div>

                  {/* LIST RIGHT */}
                  <div className="lg:w-1/2">
                    <ul
                      className={`pl-6 text-lg space-y-4 text-gray-700 ${listClass}`}
                    >
                      {section.items.map((item, i) => {
                        const [boldPart, rest] = item.split(":");
                        return (
                          <ScrollReveal key={i} delay={i * 120}>
                            <li>
                              {rest ? (
                                <>
                                  <strong>{boldPart.trim()}:</strong>{" "}
                                  {rest.trim()}
                                </>
                              ) : (
                                item
                              )}
                            </li>
                          </ScrollReveal>
                        );
                      })}
                    </ul>
                  </div>
                </div>
              </ScrollReveal>
            );
          }

          // 🔹 DEFAULT STACKED LIST
          return (
            <ul
              key={index}
              className={`pl-16 text-lg space-y-3 mb-6 text-gray-700  ${listClass}`}
            >
              {section.items.map((item, i) => {
                const [boldPart, rest] = item.split(":");
                return (
                  <ScrollReveal key={i} delay={i * 120}>
                    <li>
                      {rest ? (
                        <>
                          <strong>{boldPart.trim()}:</strong> {rest.trim()}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  </ScrollReveal>
                );
              })}
            </ul>
          );
        }

        if (section.type === "image" && section.src) {
          return (
            <ScrollReveal key={index} direction="up">
              <div className="flex flex-col lg:flex-row items-center gap-16 my-20">
                {/* Optional text support */}
                {section.value && (
                  <div className="lg:w-1/2 text-xl font-light leading-relaxed">
                    {section.value}
                  </div>
                )}

                <div className="lg:w-1/2 flex justify-center">
                  <div className="relative md:w-125 w-100 h-87.5 rounded-2xl overflow-hidden border border-black shadow-sm">
                    <Image
                      src={section.src}
                      alt={blog?.title || "Blog image"}
                      fill
                      className="object-cover"
                    />
                  </div>
                </div>
              </div>
            </ScrollReveal>
          );
        }

        return null;
      })}
    </article>
  );
}
