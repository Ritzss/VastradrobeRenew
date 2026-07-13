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

export default function CategoryTabs({
  current,
}: {
  current: "all" | "women" | "men" | "kids";
}) {
  return (
    <div className="-mt-10 relative z-20 flex justify-center">
      <div className="flex rounded-full dark:bg-black/85 bg-white dark:shadow-[#1a1a1a] shadow-xl border border-neutral-200 p-2">
        {tabs.map((tab) => (
          <Link
            key={tab.value}
            href={tab.href}
            className={clsx(
              "px-7 py-3 rounded-full text-sm font-medium transition-all duration-300",
              current === tab.value
                ? "bg-[#cd0000] text-white"
                : "text-neutral-600 dark:hover:bg-[#1a1a1a] dark:hover:text-[#cd0000] hover:bg-neutral-100"
            )}
          >
            {tab.label}
          </Link>
        ))}
      </div>
    </div>
  );
}