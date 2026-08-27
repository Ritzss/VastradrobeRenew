"use client";

import Link from "next/link";
import clsx from "clsx";

const tabs = [
  {
    label: "All",
    href: "/all",
    value: "all",
  },
  {
    label: "Women",
    href: "/women",
    value: "women",
  },
  {
    label: "Men",
    href: "/men",
    value: "men",
  },
  {
    label: "Kids",
    href: "/kids",
    value: "kids",
  },
];

/**
 * 👑 LUXURY REDESIGN: Category Tab Selectors (Nangalia Ruchira Theme)
 *
 * Styled for premium look:
 * - 🔒 FIXED COLOR: Removed the basic bright red (#cd0000) and replaced it with your official,
 *   rich wine-red crimson (#6A0F1F) to look incredibly cohesive and premium.
 * - Sizing/Fonts: Spaced uppercase tracked typography.
 * - S-curve rounded capsule.
 */
export default function CategoryTabs({
  current,
}: {
  current: "all" | "women" | "men" | "kids";
}) {
  return (
    <div className="-mt-10 relative z-20 flex justify-center px-4">
      <div className="flex rounded-full bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 p-1.5 shadow-md">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={clsx( "px-5 sm:px-7 py-2.5 sm:py-3 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-widest transition-all duration-300", current === tab.value ? "bg-[#6A0F1F] dark:bg-[#e4e198] text-white dark:text-neutral-950 shadow-sm" : "text-neutral-500 dark:text-neutral-400 hover:text-neutral-800 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-900",)}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
