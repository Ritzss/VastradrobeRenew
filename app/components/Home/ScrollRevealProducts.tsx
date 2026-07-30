import HorizontalScroll from "@/components/Global/HorizontalScroll";
import { IMSProduct } from "@/Types/Product";
import EmptyState from "../Global/EmptyState";
import Link from "next/link";
import ScrollReveal from "../Global/ScrollReveal";
import ProductCard from "../Global/ProductCard";

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

/**
 * 👑 LUXURY REDESIGN: Category Showcase (Nangalia Ruchira Theme)
 *
 * Centralized components:
 * - Replaced legacy duplicate "ProductCardStatic" imports with our unified central "ProductCard"!
 */
export default function ScrollRevealProducts({
  products,
  category,
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
    <section className="relative w-full px-0 mx-0">
      {/* ================= MOBILE ================= */}
      <div className="md:hidden w-full px-0 mx-0">
        <HorizontalScroll className="gap-0 w-full" color={color}>
          {filteredProducts.slice(0, 3).map((product) => (
            <div key={product.productId} className="w-[45vw] shrink-0 px-1">
              <ProductCard product={product} />
            </div>
          ))}
        </HorizontalScroll>

        <div className="flex justify-center mt-12">
          <Link
            href={`/${encodeURIComponent(category.toLowerCase())}`}
            className="text-[10px] tracking-widest font-bold uppercase px-8 py-3.5 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#5f5143] hover:text-white transition"
          >
            browse all {category}
          </Link>
        </div>
      </div>

      {/* ================= DESKTOP ================= */}
      <div className="hidden md:flex justify-center gap-6">
        {filteredProducts.slice(0, 3).map((product) => (
          <ScrollReveal key={product.productId}>
            <div className="w-70">
              <ProductCard product={product} />
            </div>
          </ScrollReveal>
        ))}
      </div>

      {/* Desktop Button */}
      <div className="hidden md:flex justify-center mt-8">
        <Link
          href={`/${encodeURIComponent(category.toLowerCase())}#categoryPage`}
          className="px-10 py-3.5 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#5f5143] hover:text-white text-xs font-semibold uppercase tracking-widest transition"
        >
          Browse All {category}
        </Link>
      </div>
    </section>
  );
}
