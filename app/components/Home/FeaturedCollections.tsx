"use client";

import Link from "next/link";
import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import { COLLECTIONS } from "@/lib/collections";

type Section = {
  subcategory: string;
  totalProducts: number;
  products: IMSProduct[];
};

type Props = {
  sections: Section[];
};

/**
 * 👑 LUXURY REDESIGN: Featured Collections Grid (Nangalia Ruchira Theme)
 *
 * Optimized Responsive Layout:
 * - 🖥️ Desktop: Arranges automatically in a premium, geometric 3-column grid layout (3 columns, 2 rows).
 * - 📱 Mobile: Gracefully degrades into a side-scrollable horizontal carousel for smooth, swipeable touch gestures.
 */
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
    <section className="py-16 bg-[#fcfbfa] dark:bg-black border-t border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        {/* SECTION HEADER (Premium uppercase layout) */}
        <div className="flex justify-between items-end mb-12">
          <div className="space-y-1">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Curated Picks
            </p>

            <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
              Featured Collections
            </h2>
          </div>

          <Link
            href="/collection"
            className="hidden md:inline-flex text-[10px] tracking-widest font-bold uppercase text-[#6A0F1F] dark:text-[#e4e198] hover:underline underline-offset-4 transition"
          >
            View All Collections →
          </Link>
        </div>

        {/* 🔒 HYBRID GRID-CAROUSEL:
            - Mobile: 'flex overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-4' (side scrollable)
            - Desktop: 'md:grid md:grid-cols-2 lg:grid-cols-3 md:overflow-x-visible md:pb-0 gap-8' (geometric clean grid)
        */}
        <div className="flex overflow-x-auto md:overflow-x-visible snap-x snap-mandatory scrollbar-hide pb-4 md:pb-0 gap-6 md:grid md:grid-cols-2 lg:grid-cols-3 md:gap-8">
          {orderedCollections.map(([collection, data]) => {
            const first = data.products[0];
            const second = data.products[1] ?? data.products[0];
            const third = data.products[2] ?? data.products[0];
            const currentCollection = COLLECTIONS.find(
              (c) => c.label === collection,
            );

            if (!currentCollection) return null;

            const getProductImage = (product: IMSProduct) => {
              const variant = product.variants?.[0];
              const design = variant?.designs?.[0];

              return (
                design?.images?.[0] ||
                variant?.images?.[0] ||
                "/Assets/Images/Newplaceholder.png"
              );
            };

            return (
              <Link
                key={collection}
                href={`/collections/${currentCollection.slug}`}
                className="group shrink-0 snap-start block w-85 sm:w-95 md:w-auto"
              >
                {/* Card Container (Clean geometric design) */}
                <div className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#faf9f6] dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 shadow-xs transition duration-300">
                  {/* Layered Product Images */}
                  <Image
                    src={getProductImage(first)}
                    alt={first.name}
                    width={140}
                    height={190}
                    className="absolute left-7 top-8 h-47.5 w-35 rounded-xl object-cover rotate-[-8deg] shadow-md transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[-6deg]"
                  />

                  <Image
                    src={getProductImage(second)}
                    alt={second.name}
                    width={130}
                    height={180}
                    className="absolute right-36 top-4 h-45 w-32.5 rounded-xl object-cover rotate-0 shadow-lg transition duration-500 group-hover:-translate-y-3"
                  />

                  <Image
                    src={getProductImage(third)}
                    alt={third.name}
                    width={130}
                    height={180}
                    className="absolute right-8 top-12 h-45 w-32.5 rounded-xl object-cover rotate-[8deg] shadow-md transition duration-500 group-hover:-translate-y-2 group-hover:rotate-[6deg]"
                  />

                  {/* Bottom Details Panel */}
                  <div className="absolute bottom-0 left-0 right-0 bg-white/95 dark:bg-neutral-900/95 border-t border-neutral-100 dark:border-neutral-800 p-6 space-y-2 z-10 transition duration-300">
                    <h3 className="font-serif text-xl sm:text-2xl font-light text-neutral-800 dark:text-white tracking-wide uppercase leading-tight">
                      {collection}
                    </h3>

                    <p className="text-xs text-neutral-500 dark:text-neutral-400 line-clamp-1 leading-relaxed">
                      {data.description}
                    </p>

                    <div className="pt-2 flex justify-between items-center border-t border-neutral-50 dark:border-neutral-800 text-[10px] tracking-widest font-bold uppercase text-neutral-400 dark:text-neutral-500">
                      <span>{data.products.length} Products</span>

                      <span className="text-[#6A0F1F] dark:text-[#e4e198] group-hover:translate-x-1.5 transition duration-300 flex items-center gap-1">
                        Shop <span>→</span>
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCollections;
