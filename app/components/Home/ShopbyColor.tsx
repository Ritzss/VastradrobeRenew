/* eslint-disable @typescript-eslint/no-explicit-any */
// import ColorCard from "./ColorCard";
import { SHOP_BY_COLORS } from "@/lib/shopByColors";
import ColorCard from "../Global/ColorCard";

type Props = {
  products: any[];
};

export default function ShopByColor({ products }: Props) {
  const getProducts = (variants: string[]) => {
    return products.filter((product) =>
      product.variants.some((variant: any) =>
        variants.some((v) => v.toLowerCase() === variant.color.toLowerCase()),
      ),
    );
  };

  return (
    <section className="py-20 light:bg-[#fffaf6]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-14">
          <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
            Discover
          </p>

          <h2 className="text-5xl font-semibold text-[#5f5143] mt-3">
            Shop By Color
          </h2>
        </div>

        <div
          className=" grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 lg:gap-6 auto-rows-[500px]"
        >
          {/* Black */}
          <div className="lg:row-span-2">
            <ColorCard
              {...SHOP_BY_COLORS[0]}
              title={SHOP_BY_COLORS[0].name}
              href="/shop-by-color/black"
              products={getProducts(SHOP_BY_COLORS[0].variants)}
            />
          </div>

          {/* Blue */}
          <ColorCard
            {...SHOP_BY_COLORS[1]}
            title={SHOP_BY_COLORS[1].name}
            href="/shop-by-color/blue"
            products={getProducts(SHOP_BY_COLORS[1].variants)}
          />

          {/* Brown */}
          <ColorCard
            {...SHOP_BY_COLORS[2]}
            title={SHOP_BY_COLORS[2].name}
            href="/shop-by-color/brown"
            products={getProducts(SHOP_BY_COLORS[2].variants)}
          />

          {/* Green */}
          <div className="lg:row-span-2">
            <ColorCard
              {...SHOP_BY_COLORS[3]}
              title={SHOP_BY_COLORS[3].name}
              href="/shop-by-color/green"
              products={getProducts(SHOP_BY_COLORS[3].variants)}
            />
          </div>

          {/* Pink */}
          <ColorCard
            {...SHOP_BY_COLORS[4]}
            title={SHOP_BY_COLORS[4].name}
            href="/shop-by-color/pink"
            products={getProducts(SHOP_BY_COLORS[4].variants)}
          />

          {/* White */}
          <ColorCard
            {...SHOP_BY_COLORS[5]}
            title={SHOP_BY_COLORS[5].name}
            href="/shop-by-color/white"
            products={getProducts(SHOP_BY_COLORS[5].variants)}
          />
        </div>
      </div>
    </section>
  );
}
