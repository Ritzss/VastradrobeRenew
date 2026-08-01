import { notFound } from "next/navigation";
import { policies } from "@/lib/Policies";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Image from "next/image";

export default async function PolicyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const resolvedParams = await params;
  const policy = policies.find((p) => p.slug === resolvedParams.slug);
  if (!policy) return notFound();

  return (
    <article className="min-h-screen bg-[#fcfbfa] dark:bg-black text-neutral-800 dark:text-neutral-200 py-24 md:py-32 px-4 sm:px-6 lg:px-8 transition-colors duration-300 select-none">
      <div className="max-w-3xl mx-auto space-y-16">
        {/* ================= 🏛️ HERO HEADER (Spacious Minimal Layout) ================= */}
        <div className="text-center space-y-3">
          <p className="text-[10px] font-bold text-[#6A0F1F] dark:text-[#e4e198] tracking-[0.25em] uppercase">
            Store Policies
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
            {policy.title}
          </h1>

          {policy.description && (
            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed pt-2">
              {policy.description}
            </p>
          )}

          <div className="h-px w-20 bg-neutral-200 dark:bg-neutral-800 mx-auto mt-10" />
        </div>

        {/* ================= 🏛️ EDITORIAL CONTENT AREA ================= */}
        <div className="space-y-10">
          {policy.content.map((section, index) => {
            // 1. Heading Elements
            if (section.type === "heading") {
              return (
                <ScrollReveal key={index}>
                  <h2 className="font-serif text-lg sm:text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide border-b border-neutral-100 dark:border-neutral-900 pb-3 mt-12 mb-6">
                    {section.value}
                  </h2>
                </ScrollReveal>
              );
            }

            // 2. Paragraph Elements
            if (section.type === "paragraph") {
              return (
                <ScrollReveal key={index}>
                  <p className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed mb-6">
                    {section.value}
                  </p>
                </ScrollReveal>
              );
            }

            // 3. Image Showcases
            if (section.type === "images" && section.src) {
              const previousSection = policy.content[index - 1];

              // Side-by-side Layout (if previous is paragraph)
              if (previousSection?.type === "paragraph") {
                return (
                  <ScrollReveal key={index}>
                    <div className="flex flex-col h-full lg:flex-row items-center gap-12 my-16">
                      {/* Left side Image */}
                      <div className="flex flex-col items-center shrink-0">
                        <div className="relative h-96 w-56 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950">
                          <Image
                            src={section.src}
                            alt="VastraDrobe Brand"
                            fill
                            className="object-cover object-top"
                            sizes="224px"
                          />
                        </div>
                        <p className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase mt-4">
                          VastraDrobe Studio
                        </p>
                      </div>

                      {/* Right side Text */}
                      <div className="text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide leading-relaxed">
                        {previousSection.value}
                      </div>
                    </div>
                  </ScrollReveal>
                );
              }

              // Full Width Layout Fallback
              return (
                <ScrollReveal key={index}>
                  <div className="my-12 flex justify-center">
                    <div className="relative w-full h-80 sm:h-96 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950">
                      <Image
                        src={section.src}
                        alt="VastraDrobe Collection"
                        fill
                        className="object-cover object-top"
                        sizes="(max-width: 768px) 100vw, 768px"
                      />
                    </div>
                  </div>
                </ScrollReveal>
              );
            }

            // 4. List Elements
            if (section.type === "list" && section.items) {
              return (
                <ScrollReveal key={index}>
                  <ul className="list-disc pl-6 space-y-2.5 text-neutral-500 dark:text-neutral-400 text-xs sm:text-sm font-light font-sans tracking-wide mb-8">
                    {section.items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item}
                      </li>
                    ))}
                  </ul>
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
