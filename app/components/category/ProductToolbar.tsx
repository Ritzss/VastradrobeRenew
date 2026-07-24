"use client";

import { useAppContext } from "@/hooks/useAppContext";
import { SlidersHorizontal } from "lucide-react";

interface Props {
  count: number;
  onFilter: () => void;
}

export default function ProductToolbar({ count, onFilter }: Props) {
  const { sortBy, setSortBy } = useAppContext();

  return (
    <section className="sticky top-18 z-20 rounded-2xl border border-[#ece6df] dark:bg-[#1d1416]/90 bg-white/90 backdrop-blur-md p-4 sm:px-6 sm:py-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        {/* Left */}
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#957f6a]">
            Collection
          </p>

          <h2 className="mt-1 text-lg sm:text-xl font-medium text-[#5f5143] dark:text-white">
            {count} Products
          </h2>
        </div>

        {/* Right */}
        <div className="flex gap-3 w-full sm:w-auto">
          <button
            onClick={onFilter}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 rounded-full border border-[#e7ddd3] px-4 py-2.5 dark:bg-[#1d1416] dark:text-white hover:bg-[#faf8f5] dark:hover:bg-white dark:hover:text-black transition">
            <SlidersHorizontal size={18} />
            <span>Filter</span>
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="flex-1 sm:flex-none rounded-full border border-[#e7ddd3] px-4 py-2.5 dark:bg-[#1d1416] dark:text-white bg-white outline-none min-w-0 sm:min-w-45">
            <option value="featured">Featured</option>
            <option value="newest">Newest</option>
            <option value="price-low">Price: Low → High</option>
            <option value="price-high">Price: High → Low</option>
            <option value="name-asc">A → Z</option>
            <option value="name-desc">Z → A</option>
          </select>
        </div>
      </div>
    </section>
  );
}