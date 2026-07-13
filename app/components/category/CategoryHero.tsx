"use client";

import Image from "next/image";
import { CATEGORY_BANNERS } from "@/lib/categoryBanner";

interface Props {
  category: "all" | "women" | "men" | "kids";
}

export default function CategoryHero({ category }: Props) {
  const banner = CATEGORY_BANNERS[category];

  return (
    <section className="relative h-[55vh] min-h-105 overflow-hidden rounded-3xl">
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        sizes="100vw"
        priority
        className="object-cover"
      />

      <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/30 to-black/50" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-xl px-10 lg:px-16 text-white">
          {/* <p className="uppercase tracking-[0.35em] text-sm mb-4 opacity-90">
            VastraDrobe
          </p> */}

          {/* <h1 className="text-5xl lg:text-6xl font-light leading-tight">
            {banner.title}
          </h1>

          <p className="mt-6 text-lg text-white/90">
            {banner.subtitle}
          </p>

          <button className="mt-10 rounded-full bg-white text-black px-8 py-4 hover:px-10 transition-all duration-500">
            {banner.button}
          </button> */}
        </div>
      </div>
    </section>
  );
}