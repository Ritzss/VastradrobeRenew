import { notFound } from "next/navigation";
import { policies } from "@/lib/Policies";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Image from "next/image";

export default async function PolicyPage({
  params,
}: {
  params: { slug: string };
}) {
  const resolvedParams = await params;
  const policy = policies.find((p) => p.slug === resolvedParams.slug);
  if (!policy) return notFound();

  return (
    <article className="max-w-4xl mx-auto px-6 py-24">
      {/* HERO */}
      <div className="text-center mb-20">
        <p className="uppercase tracking-[0.35em] text-sm text-gray-500 mb-4">
          Vastra Policies
        </p>

        <h1 className="text-5xl font-semibold mb-6">{policy.title}</h1>

        {policy.description && (
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            {policy.description}
          </p>
        )}

        <div className="h-px w-24 bg-gray-300 mx-auto mt-10" />
      </div>

      {/* CONTENT */}
      {policy.content.map((section, index) => {
        if (section.type === "heading") {
          return (
            <ScrollReveal key={index}>
              <h2 className="text-2xl font-semibold mt-12 mb-4">
                {section.value}
              </h2>
            </ScrollReveal>
          );
        }

        if (section.type === "paragraph") {
          return (
            <ScrollReveal key={index}>
              <p className="text-gray-700 leading-relaxed mb-6 text-lg">
                {section.value}
              </p>
            </ScrollReveal>
          );
        }
        if (section.type === "images" && section.src) {
          const previousSection = policy.content[index - 1];

          // Only make side layout if previous section is paragraph (About block)
          if (previousSection?.type === "paragraph") {
            return (
              <ScrollReveal key={index}>
                <div className="flex flex-col h-full lg:flex-row items-center gap-16 my-20">
                  {/* IMAGE LEFT */}
                  <div className="flex flex-col items-center">
                    <div className="relative h-140 w-70 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                      <Image
                        src={section.src}
                        alt="VastraDrobe Headquarters"
                        fill
                        sizes="photo"
                      />
                    </div>
                    <p className="text-sm text-gray-500 mt-4">
                      VastraDrobe Headquarters
                    </p>
                  </div>

                  {/* TEXT RIGHT */}
                  <div className="lg:w-1/2 text-lg text-gray-700 leading-relaxed">
                    {previousSection.value}
                  </div>
                </div>
              </ScrollReveal>
            );
          }

          // Default full-width fallback
          return (
            <ScrollReveal key={index}>
              <div className="my-16 flex justify-center">
                <div className="relative w-full max-w-4xl h-112.5 rounded-2xl overflow-hidden shadow-sm border border-gray-200">
                  <Image
                    src={section.src}
                    alt="VastraDrobe Headquarters"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </ScrollReveal>
          );
        }

        if (section.type === "list" && section.items) {
          return (
            <ul
              key={index}
              className="list-disc pl-8 mb-8 space-y-3 text-gray-700"
            >
              {section.items.map((item, i) => (
                <li key={i}>{item}</li>
              ))}
            </ul>
          );
        }

        return null;
      })}
    </article>
  );
}
