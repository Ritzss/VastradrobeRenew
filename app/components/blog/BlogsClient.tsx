"use client";

import BlogPreviewGrid from "@/components/Home/BlogPreviewGrid";

interface BlogClientProps {
  showTitle?: boolean;
}

/**
 * 👑 LUXURY REDESIGN: Vastra Journal Page (Nangalia Ruchira Theme)
 *
 * Styled for premium look:
 * - Backdrop: bg-[#fcfbfa] with spacious paddings.
 * - Header standardized: Classic uppercase tracked typography combined with fine serif main titles.
 */
const BlogClient = ({ showTitle = true }: BlogClientProps) => {
  return (
    <section className="min-h-screen bg-[#fcfbfa] dark:bg-black pt-16 pb-24 px-6 transition-colors duration-300">
      <div className="max-w-6xl mx-auto">
        {/* HEADER BLOCK (Premium uppercase tracked styling) */}
        {showTitle && (
          <div className="text-center mb-16 space-y-2">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Vastra Journal
            </p>

            <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
              Beyond Fabric. Into Thought.
            </h1>

            <p className="text-neutral-500 dark:text-neutral-400 max-w-xl mx-auto text-xs font-light font-sans tracking-wide leading-relaxed">
              Explore our stories on sustainable craftsmanship, slow lifestyle
              design, and the conscious materials shaping modern wardrobes.
            </p>
          </div>
        )}

        <BlogPreviewGrid />
      </div>
    </section>
  );
};

export default BlogClient;
