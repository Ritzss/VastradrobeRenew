import ProductCardStatic from "@/components/Global/ProductCardStatic";
import { IMSProduct } from "@/Types/Product";
import InfiniteScrollWrapper from "../Global/InfiniteScrollWrapper";

type LatestArrivalsProps = {
  products: IMSProduct[];
};

export default function LatestArrivals({ products }: LatestArrivalsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="relative w-full mt-16">
      {/* LEFT FADE */}
      <div
        className="pointer-events-none absolute left-0 top-0 h-full w-16 z-10 
                  bg-gradient-to-r from-[#fffaf6] to-transparent"
      />

      {/* RIGHT FADE */}
      <div
        className="pointer-events-none absolute right-0 top-0 h-full w-16 z-10 
                  bg-gradient-to-l from-[#fffaf6] to-transparent"
      />

      <InfiniteScrollWrapper>
        {products.map((product) => (
          <div key={product.productId} className="w-72 shrink-0 px-3">
            <ProductCardStatic product={product} />
          </div>
        ))}
      </InfiniteScrollWrapper>
    </section>
  );
}
