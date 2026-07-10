"use client";

import ProductCard from "@/components/Global/ProductCard";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import { IMSProduct } from "@/Types/Product";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { RiArrowDownWideFill } from "react-icons/ri";

type Props = {
  sections: {
    subcategory: string;
    totalProducts: number;
    products: IMSProduct[];
  }[];
};

const AllProductClient = ({ sections }: Props) => {
  // const openings = ["Discover", "Explore", "Shop", "Browse", "Find"];

  // const qualities = [
  //   "premium",
  //   "trendy",
  //   "stylish",
  //   "comfortable",
  //   "high-quality",
  // ];

  // const occasions = [
  //   "everyday wear",
  //   "casual outings",
  //   "special occasions",
  //   "modern wardrobes",
  //   "all seasons",
  // ];

  // const getDescription = (subcategory: string, totalProducts: number) => {
  //   const seed = subcategory
  //     .split("")
  //     .reduce((sum, char) => sum + char.charCodeAt(0), 0);

  //   const opening = openings[seed % openings.length];
  //   const quality = qualities[seed % qualities.length];
  //   const occasion = occasions[seed % occasions.length];

  //   return `${opening} ${totalProducts} ${quality} ${subcategory.toLowerCase()} at VastraDrobe. Shop quality designs, comfortable fits, and timeless styles perfect for ${occasion}.`;
  // };

  const [openCollections, setOpenCollections] = useState<string[]>([]);

  const groupedCollections: Record<
    string,
    {
      description: string;
      products: IMSProduct[];
    }
  > = {};

  const toggleCollection = (collection: string) => {
    setOpenCollections((prev) =>
      prev.includes(collection)
        ? prev.filter((c) => c !== collection)
        : [...prev, collection],
    );
  };

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
    <section className="w-full pt-5 px-12 not-dark:bg-[radial-gradient(circle_at_top,#fffdfd_0%,#fff8f8_35%,#fff4f4_100%)]">
      <h1 className="sr-only">All Fashion Products | VastraDrobe</h1>

      <div className="flex flex-col items-center">
        <h1 className="mb-3 text-4xl md:text-5xl font-light tracking-tight text-[#5f5143]">
          Curated for Every Occasion
        </h1>

        <p className="mb-16 max-w-3xl text-center leading-7 text-[#7a6a5c]">
          Browse our complete collection of contemporary fashion, thoughtfully
          organized by category to help you discover styles for every occasion.
        </p>
      </div>

      {orderedCollections.map(([collection, data]) => {
        const isOpen = openCollections.includes(collection);

        return (
          <section key={collection} className="border-b border-[#ece5db] py-6">
            <button
              onClick={() => toggleCollection(collection)}
              className="flex w-full items-center justify-between text-left"
            >
              <h2 className="text-2xl font-light capitalize text-[#5f5143]">
                {collection}
              </h2>

              <span
                className={`transition-transform duration-900 dark:text-[#5f5143] ${
                  isOpen ? "rotate-180" : ""
                }`}
              >
                <RiArrowDownWideFill size={32} />

              </span>
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.35 }}
                  className="overflow-hidden"
                >
                  <div className="pt-6">
                    <p className="max-w-3xl text-[#7a6a5c]">
                      {data.description}
                    </p>

                    <p className="mt-2 text-sm text-[#9b8a79]">
                      {data.products.length} Products
                    </p>

                    <div className="mt-6 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
                      {data.products.map((product) => (
                        <ProductCard
                          key={product.productId}
                          product={product}
                          Linked
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>
        );
      })}
    </section>
  );
};

export default AllProductClient;
