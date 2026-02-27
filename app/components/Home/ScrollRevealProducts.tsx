// import ProductCard from "../Global/ProductCard";
import HorizontalScroll from "@/components/Global/HorizontalScroll";
import { IMSProduct } from "@/Types/Product";
import EmptyState from "../Global/EmptyState";
import Link from "next/link";
import ScrollReveal from "../Global/ScrollReveal";
import ProductCardStatic from "../Global/ProductCardStatic";

type Props = {
  products: IMSProduct[];
  category: string;
  title?: string;
  color?: string;
};

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
  ethnic: ["ethnic"],
};

export default function ScrollRevealProducts({
  products,
  category,
  title,
  color,
}: Props) {
  const normalizedCategory = category.toLowerCase();
  const categoryFilters =
    CATEGORY_MAP[normalizedCategory] || [normalizedCategory];

  const filteredProducts = products.filter((product) =>
    categoryFilters.includes(product.category?.toLowerCase() || "")
  );

  if (filteredProducts.length === 0)
    return (
      <EmptyState
        title="We’re Still Stitching This One Together"
        description="New pieces are being crafted with care. Stay tuned for thoughtfully designed additions."
        buttonText="Browse All Products →"
        buttonLink="/"
      />
    );

  return (
    <section className="mx-auto my-18 px-2">
      <ScrollReveal>
        <h2 className="text-xl font-semibold mb-6 text-gray-800">
          {title ?? `Explore ${category}`}
        </h2>
      </ScrollReveal>

      {/* ---------- MOBILE ---------- */}
      <div className="md:hidden">
        <HorizontalScroll color={color}>
          {filteredProducts.slice(0, 3).map((product) => (
              <div key={product.productId} className="w-full sm:w-[60%] shrink-0">
                <ProductCardStatic
                  product={product}
                  className="md:w-[95%] group w-full active:scale-102 active:shadow-[0_0_10px_#000] duration-700 transition-all"
                  height="h-[60vh]"
                  classNameInner="h-[47vh] rounded-2xl"
               
                >
                  <div className="uppercase text-[#6a0f1f] text-center m-2 w-full">
                  {product.name}
                  <div className="hidden group-active:block text-[#6a0f1f]">
                    {`(${product.variants?.[0]?.color ?? ""})`}[[]]
                  </div>
                </div>
                </ProductCardStatic>
              </div>
          ))}
        </HorizontalScroll>

        <div className="flex justify-center mt-6">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="group inline-block border border-black px-8 py-3 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300"
          >
            Browse All {category.toUpperCase()} →
          </Link>
        </div>
      </div>

      {/* ---------- DESKTOP ---------- */}
      <div className="hidden md:flex flex-wrap justify-evenly">
        {filteredProducts.slice(0, 3).map((product) => (
          <ScrollReveal key={product.productId}>
            <div className="md:w-[48%] lg:w-[28vw] cardWidth">
              <ProductCardStatic
                product={product}
                height="h-[63vh]"
                classNameInner="h-[53vh] rounded-2xl"
                className="md:w-full py-1.5 group w-[85%] hover:scale-102 hover:shadow-[0_0_10px] duration-700 transition-all"
              >
                <div className="uppercase flex flex-col text-[#6a0f1f] text-center m-2 w-full">
                  {product.name}
                  <div className="hidden group-hover:block">
                    {`(${product.variants?.[0]?.color ?? ""})`}
                  </div>
                </div>
              </ProductCardStatic>
            </div>
          </ScrollReveal>
        ))}

        <div className="w-full flex justify-center mt-6">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="group border border-black px-8 py-3 rounded-full hover:bg-[#6a0f1f] hover:text-white transition-all duration-300"
          >
            Browse All {category.toUpperCase()} →
          </Link>
        </div>
      </div>
    </section>
  );
}