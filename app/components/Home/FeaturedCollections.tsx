"use client";

import Link from "next/link";
import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import HorizontalScroll from "../Global/HorizontalScroll";
import { COLLECTIONS } from "@/lib/collections";

type Section = {
  subcategory: string;
  totalProducts: number;
  products: IMSProduct[];
};

type Props = {
  sections: Section[];
};

const FeaturedCollections = ({ sections }: Props) => {
  const groupedCollections: Record<
    string,
    {
      description: string;
      products: IMSProduct[];
    }
  > = {};

  sections.forEach((section) => {
    const collection =
      collectionMap[section.subcategory] ?? `✨ ${section.subcategory}`;

    if (!groupedCollections[collection]) {
      groupedCollections[collection] = {
        description:
          collectionDescriptions[collection] ??
          `Explore our ${section.subcategory.toLowerCase()} collection.`,
        products: [],
      };
    }

    groupedCollections[collection].products.push(...section.products);
  });

  const orderedCollections = [
    ...collectionOrder
      .filter((name) => groupedCollections[name])
      .map((name) => [name, groupedCollections[name]] as const),

    ...Object.entries(groupedCollections).filter(
      ([name]) => !collectionOrder.includes(name),
    ),
  ];

  return (
    <section className="py-14 dark:bg-black light:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-end mb-10">
          <div>
            <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
              Curated
            </p>

            <h2 className="text-4xl md:text-5xl font-semibold text-[#5f5143] mt-2">
              Featured Collections
            </h2>
          </div>

          <Link
            href="/collection"
            className="hidden md:block text-[#5f5143] hover:underline"
          >
            View All →
          </Link>
        </div>

        <HorizontalScroll customclass="w-[24rem]" className="gap-0" color={`#00000000`}>
          <div className="flex flex-nowrap gap-6 scrollbar-hide pb-4">
            {orderedCollections.map(([collection, data]) => {
              const first = data.products[0];
              const second = data.products[1] ?? data.products[0];
              const third = data.products[2] ?? data.products[0];
              const currentCollection = COLLECTIONS.find(
                (c) => c.label === collection,
              );

              return (
                <Link
                  key={collection}
                  href={`/collections/${currentCollection!.slug}`}
                  className="group shrink-0 snap-start"
                >
                  <div className="relative w-105 h-80 rounded-3xl overflow-hidden bg-linear-to-br dark:from-black from-[#f7f2eb] to-[#ece3d5] border border-[#e6d9c8]">
                    <Image
                      src={first.variants[0].images[0]}
                      alt={first.name}
                      width={140}
                      height={190}
                      className="absolute left-7 top-8 h-47.5 w-35 rounded-xl object-cover rotate-[-8deg] transition duration-500 group-hover:-translate-y-2"
                    />

                    <Image
                      src={second.variants[0].images[0]}
                      alt={second.name}
                      width={130}
                      height={180}
                      className="absolute right-36 top-4 h-45 w-32.5 rounded-xl object-cover rotate-0 transition duration-500 group-hover:-translate-y-3"
                    />

                    <Image
                      src={third.variants[0].images[0]}
                      alt={third.name}
                      width={130}
                      height={180}
                      className="absolute right-8 top-12 h-45 w-32.5 rounded-xl object-cover rotate-[8deg] transition duration-500 group-hover:-translate-y-3"
                    />

                    <div className="absolute bottom-0 left-0 w-full dark:bg-black/85 bg-white/85 backdrop-blur-md p-6">
                      <h3 className="text-2xl font-semibold text-[#5f5143]">
                        {collection}
                      </h3>

                      <p className="mt-2 text-sm text-[#7a6a5c] line-clamp-2">
                        {data.description}
                      </p>

                      <div className="mt-4 flex justify-between items-center">
                        <span className="text-sm text-[#957f6a]">
                          {data.products.length} Products
                        </span>

                        <span className="font-medium text-[#5f5143] group-hover:translate-x-1 transition">
                          Shop →
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </HorizontalScroll>
      </div>
    </section>
  );
};

export default FeaturedCollections;
