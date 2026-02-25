import ProductCardStatic from "@/components/Global/ProductCardStatic";
import { IMSProduct } from "@/Types/Product";
import InfiniteScrollWrapper from "../Global/InfiniteScrollWrapper";

type LatestArrivalsProps = {
  products: IMSProduct[];
};

export default function LatestArrivals({ products }: LatestArrivalsProps) {
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full px-4 md:px-8 mt-14">
      <InfiniteScrollWrapper>
        {products.map((product) => (
          <div key={product.productId} className="w-75 shrink-0">
            <ProductCardStatic
              product={product}
              height="h-[60vh]"
              classNameInner="h-[53vh] w-full rounded-2xl"
            >
              <div className="uppercase text-[#6a0f1f] text-center m-2 w-full font-bold">
                {product.name}
              </div>
            </ProductCardStatic>
          </div>
        ))}
      </InfiniteScrollWrapper>
    </section>
  );
}