"use client";

import ProductCard from "@/components/Global/ProductCard";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import { IMSProduct } from "@/Types/Product";
import { COLLECTIONS } from "@/lib/collections";
import Link from "next/link";

type Props = {
  sections: {
    subcategory: string;
    totalProducts: number;
    products: IMSProduct[];
  }[];
};

/**
 * 👑 LUXURY REDESIGN: All Collections Page (Nangalia Ruchira Theme)
 * 
 * Elegant, spacious, expanded lookbook layout:
 * - Each collection is rendered as a standalone, spacious, fully expanded section (no hidden accordions!).
 * - Every section features:
 *    - An elegant, minimalist serif header block with the collection's narrative story description.
 *    - A clean, modern geometric 4-column grid displaying its top 4 featured products using our newly redesigned ProductCard.
 *    - A tracked uppercase link trigger prompting them to explore the full collection.
 */
const AllProductClient = ({ sections }: Props) => {
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
          `Discover our latest ${section.subcategory.toLowerCase()} collection crafted for every occasion.`,
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
    <div className="w-full bg-[#fcfbfa] py-12 transition-colors duration-300">
      
      {/* 1. HERO HEADER AREA */}
      <div className="max-w-7xl mx-auto px-6 text-center space-y-4 mb-20">
        <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          Vastra Portfolios
        </p>

        <h1 className="font-serif text-4xl md:text-5xl font-light text-neutral-800 tracking-wide uppercase leading-tight">
          Curated Collections
        </h1>

        <p className="max-w-2xl mx-auto text-sm leading-relaxed text-neutral-500 font-light">
          Browse our complete clothing portfolios, handcrafted with intention and organized cleanly to help you discover perfect silhouettes for every occasion.
        </p>
      </div>

      {/* 2. COLLECTION SECTIONS (One beautifully styled expanded section per collection) */}
      <div className="space-y-24 max-w-7xl mx-auto px-6">
        {orderedCollections.map(([collection, data]) => {
          const currentCollection = COLLECTIONS.find(
            (c) => c.label === collection,
          );

          if (!currentCollection) return null;
          const elementId = `collection-${currentCollection.slug}`;

          return (
            <section 
              key={collection} 
              id={elementId} 
              className="scroll-mt-32 space-y-8 border-b border-neutral-100 pb-16 last:border-b-0 last:pb-0"
            >
              {/* Collection narrative header */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3 max-w-3xl">
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-neutral-800 tracking-wide uppercase">
                    {collection}
                  </h2>
                  <p className="text-xs leading-relaxed text-neutral-500 font-light">
                    {data.description}
                  </p>
                </div>

                <Link
                  href={`/collections/${currentCollection.slug}`}
                  className="inline-flex text-[10px] tracking-widest font-bold uppercase text-[#6A0F1F] hover:underline underline-offset-4 transition duration-300"
                >
                  Explore Complete Collection ({data.products.length} items) →
                </Link>
              </div>

              {/* Top 4 products grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
                {data.products.slice(0, 4).map((product) => (
                  <ProductCard
                    key={product.productId}
                    product={product}
                    Linked
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>

    </div>
  );
};

export default AllProductClient;
