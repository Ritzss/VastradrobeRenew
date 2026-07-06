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
  text?: string;
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
  text,
  color,
}: Props) {
  const normalizedCategory = category.toLowerCase();
  const categoryFilters = CATEGORY_MAP[normalizedCategory] || [
    normalizedCategory,
  ];

  const filteredProducts = products.filter((product) =>
    categoryFilters.includes(product.category?.toLowerCase() || ""),
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
    <section className="relative mx-auto px-6">
      {/* ================= MOBILE ================= */}
      <div className="md:hidden">
        <HorizontalScroll color={color}>
          {filteredProducts.slice(0, 3).map((product) => (
            <div key={product.productId} className="w-[75%] shrink-0 px-3">
              <ProductCardStatic product={product} text={text || ""} />
            </div>
          ))}
        </HorizontalScroll>

        <div className="flex justify-center mt-12">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="capitalize px-8 py-3 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#5f5143] hover:text-white transition"
          >
            browse all {category}
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex justify-center gap-10">
        {filteredProducts.slice(0, 3).map((product) => (
          <ScrollReveal key={product.productId}>
            <div className="w-70">
              <ProductCardStatic product={product} text={text || ""} />
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Desktop Button */}
      <div className="hidden md:flex justify-center mt-5">
        <Link
          href={`/${encodeURIComponent(category.toLowerCase())}#categoryPage`}
          className={`px-10 py-3 capitalize rounded-full border border-${text} border-[#5f5143] text-${text} text-[#5f5143] hover:bg-[#5f5143] hover:text-white transition`}
        >
          Browse All {category}
        </Link>
      </div>
    </section>
  );
}
