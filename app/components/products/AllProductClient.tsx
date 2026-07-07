"use client";

import ProductCard from "@/components/Global/ProductCard";
import {
  collectionDescriptions,
  collectionMap,
  collectionOrder,
} from "@/lib/collectionMap";
import { IMSProduct } from "@/Types/Product";

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
    <section className="w-full pt-5 px-12 bg-[#f9f5ef]">
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

      {orderedCollections.map(([collection, data]) => (
        <section key={collection} className="mb-10">
          <div className="mb-2">
            <h2 className="text-3xl font-light text-[#5f5143] capitalize">
              {collection}
            </h2>

            <p className="mt-2 max-w-3xl text-[#7a6a5c] leading-7">
              {data.description}
            </p>

            <p className="mt-2 text-sm text-[#9b8a79]">
              {data.products.length} Products Products
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4 lg:gap-2">
            {data.products.map((product) => (
              <ProductCard key={product.productId} product={product} Linked />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default AllProductClient;
