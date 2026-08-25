"use client";

import Image from "next/image";
import { CATEGORY_BANNERS } from "@/lib/categoryBanner";

interface Props {
  category: "all" | "women" | "men" | "kids";
}

export default function CategoryHero({ category }: Props) {
  const banner = CATEGORY_BANNERS[category];

  return (
    <section className="relative h-[65vh] sm:h-[50vh] md:h-[45vh] lg:h-[55vh] overflow-hidden rounded-2xl">
      {/* Mobile */}
      <Image
        src={banner.image.mobile}
        alt={banner.title}
        fill
        priority
       sizes="100vw, 1200px"
        className="object-cover md:hidden"
      />

      {/* Desktop */}
      <Image
        src={banner.image.desktop}
        alt={banner.title}
        fill
        priority
        sizes="100vw, 1200px"
        className="hidden object-cover md:block"
      />

      <div className="absolute inset-0 bg-linear-to-r from-transparent via-black/30 to-black/50" />

      <div className="absolute inset-0 flex items-center">
        <div className="max-w-xl px-6 md:px-10 lg:px-16 text-white">
          {/* Your text here */}
        </div>
      </div>
    </section>
  );
}