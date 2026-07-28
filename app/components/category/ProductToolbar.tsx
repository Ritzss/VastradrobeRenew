"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  count: number;
  onFilter: () => void;
}

/**
 * 👑 LUXURY REDESIGN: Product Toolbar (Nangalia Ruchira Theme)
 *
 * Elegant layout features:
 * - Geometric shape: Swapped bulky rounded-full elements for crisp, clean rectangular buttons.
 * - Spaced uppercase tracked typography for titles and selectors.
 * - Backdrop: bg-white/95 with subtle neutral gray lines.
 */
export default function ProductToolbar({ count, onFilter }: Props) {
  const { sortBy, setSortBy } = useAppContext();

  return (
    <section className="sticky top-20 sm:top-24 z-20 rounded-xl border border-neutral-100 dark:border-neutral-900 bg-white/95 dark:bg-black/95 backdrop-blur-md p-4 sm:px-6 sm:py-4 shadow-xs transition duration-300">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left info area */}
        <div className="space-y-0.5">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Collection Filter
          </p>

          <h2 className="font-serif text-lg sm:text-xl font-light text-neutral-800 dark:text-white uppercase tracking-wide">
            {count} Products found
          </h2>
        </div>

        {/* Right action area */}
        <div className="flex gap-3 w-full sm:w-auto">
          {/* Minimalist Filter trigger */}
          <button
            onClick={onFilter}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-md border border-neutral-200 dark:border-neutral-800 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 hover:border-neutral-800 dark:hover:border-neutral-500 transition cursor-pointer shadow-xs"
          >
            <SlidersHorizontal size={14} />
            <span>Filter By</span>
          </button>

          {/* Minimalist Sort selector */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none rounded-md border border-neutral-200 dark:border-neutral-800 px-5 py-3 text-[10px] font-bold uppercase tracking-widest text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 outline-none hover:border-neutral-800 dark:hover:border-neutral-500 transition cursor-pointer shadow-xs min-w-0 sm:min-w-45"
          >
            <option value="featured">Featured Sort</option>
            <option value="newest">Newest Arrivals</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name-asc">Alphabetical: A → Z</option>
            <option value="name-desc">Alphabetical: Z → A</option>
          </select>
        </div>
      </div>
    </section>
  );
}
