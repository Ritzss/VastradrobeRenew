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
        <section
          key={section.subcategory}
          className="mb-15"
        >
          <div className="mb-8">
            <h2 className="text-3xl font-light text-[#5f5143] capitalize">
              {section.subcategory}
            </h2>

            <p className="mt-2 max-w-3xl text-[#7a6a5c] leading-7">
              Explore our latest{" "}
              <span className="font-medium">
                {section.subcategory.toLowerCase()}
              </span>{" "}
              collection featuring premium fabrics, timeless designs, and
              versatile styles crafted for everyday comfort and effortless
              fashion.
            </p>

            <p className="mt-2 text-sm text-[#9b8a79]">
              {section.totalProducts} Products
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-6 lg:gap-2">
            {section.products.map((product) => (
              <ProductCard
                key={product.productId}
                product={product}
                Linked
              />
            ))}
          </div>
        </section>
      ))}
    </section>
  );
};

export default AllProductClient;