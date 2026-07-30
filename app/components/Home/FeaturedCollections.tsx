"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import { COLLECTIONS } from "@/lib/collections";
import HorizontalScroll from "@/components/Global/HorizontalScroll";

type Section = {
  subcategory: string;
  totalProducts: number;
  products: IMSProduct[];
};

type Props = {
  sections: Section[];
};

/**
 * 👑 LUXURY SUB-COMPONENT: Collection Card (Nangalia Ruchira Theme)
 * 
 * Implements premium tactile responsiveness:
 * - 📱 Mobile/Touch Screens: Utilizes IntersectionObserver to automatically trigger 
 *   stacked image lifting/tilting animations when the card scrolls into view!
 * - 🖥️ Desktop: Maintains smooth, crisp hover lifts and rotations.
 * - 🚫 Non-Draggable: Sets draggable={false} and select-none to ensure flawless mouse dragging.
 */
const CollectionCard = ({ collection, data, isMobile }: { collection: string; data: any; isMobile: boolean }) => {
  const [inView, setInView] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMobile) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setInView(entry.isIntersecting);
      },
      { threshold: 0.5, rootMargin: "-10px" } // Trigger when card occupies half the viewport screen
    );

    if (cardRef.current) {
      observer.observe(cardRef.current);
    }

    return () => observer.disconnect();
  }, [isMobile]);

  const first = data.products[0];
  const second = data.products[1] ?? data.products[0];
  const third = data.products[2] ?? data.products[0];
  const currentCollection = COLLECTIONS.find((c) => c.label === collection);

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

  // Determine lift classes dynamically
  const liftFirst = inView 
    ? "-translate-y-2 rotate-[-6deg]" 
    : "group-hover:-translate-y-2 group-hover:rotate-[-6deg] rotate-[-8deg]";

  const liftSecond = inView 
    ? "-translate-y-3" 
    : "group-hover:-translate-y-3 rotate-0";

  const liftThird = inView 
    ? "-translate-y-2 rotate-[6deg]" 
    : "group-hover:-translate-y-2 group-hover:rotate-[6deg] rotate-[8deg]";

  return (
    <Link
      href={`/collections/${currentCollection.slug}`}
      className={`group shrink-0 block ${isMobile ? "w-[80vw] px-1" : ""}`}
    >
      {/* Card Container (Clean geometric design) */}
      <div 
        ref={cardRef} 
        className="relative w-full h-80 rounded-2xl overflow-hidden bg-[#faf9f6] dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 shadow-xs transition duration-300"
      >
        
        {/* Layered Product Images (Draggable set to false, pointer-events-none & select-none) */}
        <Image
          src={getProductImage(first)}
          alt={first.name}
          width={140}
          height={190}
          className={`absolute left-7 top-8 h-47.5 w-35 rounded-xl object-cover shadow-md transition duration-500 select-none pointer-events-none ${liftFirst}`}
          draggable={false}
        />

        <Image
          src={getProductImage(second)}
          alt={second.name}
          width={130}
          height={180}
          className={`absolute right-36 top-4 h-45 w-32.5 rounded-xl object-cover shadow-lg transition duration-500 select-none pointer-events-none ${liftSecond}`}
          draggable={false}
        />

        <Image
          src={getProductImage(third)}
          alt={third.name}
          width={130}
          height={180}
          className={`absolute right-8 top-12 h-45 w-32.5 rounded-xl object-cover shadow-md transition duration-500 select-none pointer-events-none ${liftThird}`}
          draggable={false}
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
            <span>
              {data.products.length} Products
            </span>

            <span className="text-[#6A0F1F] dark:text-[#e4e198] group-hover:translate-x-1.5 transition duration-300 flex items-center gap-1">
              Shop <span>→</span>
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
};

/**
 * 👑 LUXURY REDESIGN: Featured Collections Grid (Nangalia Ruchira Theme)
 * 
 * Optimized Responsive Layout:
 * - 🖥️ Desktop: Arranges automatically in a premium, geometric 3-column grid layout (3 columns, 2 rows).
 * - 📱 Mobile/Touch: Drag-to-scroll horizontal carousel for smooth, swipeable touch/mouse gestures with zero spacing blocks.
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
      <div className="max-w-7xl mx-auto">
        
        {/* SECTION HEADER (Premium uppercase layout) */}
        <div className="flex justify-between items-end mb-12 px-6">
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

        {/* 🔒 MOBILE / TABLET VIEW: Premium click-and-drag Horizontal Scroll (Full-Bleed) */}
        <div className="block md:hidden w-full px-0 mx-0">
          <HorizontalScroll className="gap-0 w-full" color="text-neutral-500">
            {orderedCollections.map(([collection, data]) => (
              <CollectionCard
                key={collection}
                collection={collection}
                data={data}
                isMobile={true}
              />
            ))}
          </HorizontalScroll>
        </div>

        {/* 🔒 DESKTOP VIEW: Geometric Grid Layout */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-8 px-6">
          {orderedCollections.map(([collection, data]) => (
            <CollectionCard
              key={collection}
              collection={collection}
              data={data}
              isMobile={false}
            />
          ))}
        </div>

      </div>
    </section>
  );
};

export default FeaturedCollections;
