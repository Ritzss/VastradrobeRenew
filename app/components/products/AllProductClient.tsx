"use client";

import ProductCard from "@/components/Global/ProductCard";
import { IMSProduct } from "@/Types/Product";

type Props = {
  sections: {
    subcategory: string;
    totalProducts: number;
    products: IMSProduct[];
  }[];
};

const AllProductClient = ({ sections }: Props) => {
  const openings = ["Discover", "Explore", "Shop", "Browse", "Find"];

  const qualities = [
    "premium",
    "trendy",
    "stylish",
    "comfortable",
    "high-quality",
  ];

  const occasions = [
    "everyday wear",
    "casual outings",
    "special occasions",
    "modern wardrobes",
    "all seasons",
  ];

  const getDescription = (subcategory: string, totalProducts: number) => {
    const seed = subcategory
      .split("")
      .reduce((sum, char) => sum + char.charCodeAt(0), 0);

    const opening = openings[seed % openings.length];
    const quality = qualities[seed % qualities.length];
    const occasion = occasions[seed % occasions.length];

    return `${opening} ${totalProducts} ${quality} ${subcategory.toLowerCase()} at VastraDrobe. Shop quality designs, comfortable fits, and timeless styles perfect for ${occasion}.`;
  };

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

      {sections.map((section) => (
        <section key={section.subcategory} className="mb-10">
          <div className="mb-2">
            <h2 className="text-3xl font-light text-[#5f5143] capitalize">
              {section.subcategory}
            </h2>

            <p className="mt-2 max-w-3xl text-[#7a6a5c] leading-7">
               {getDescription(section.subcategory, section.totalProducts)}
            </p>

            <p className="mt-2 text-sm text-[#9b8a79]">
              {section.totalProducts} Products
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-2">
            {section.products.map((product) => (
              <ProductCard key={product.productId} product={product} Linked />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default AllProductClient;
