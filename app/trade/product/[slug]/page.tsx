import Image from "next/image";
import { notFound } from "next/navigation";
import { getProductBySlug, tradeProducts } from "@/lib/trade/mock-data";
import QuantityMatrix from "@/components/trade/QuantityMatrix";

export function generateStaticParams() {
  return tradeProducts.map((p) => ({ slug: p.slug }));
}

export default function TradeProductPage({ params }: { params: { slug: string } }) {
  const product = getProductBySlug(params.slug);
  if (!product) notFound();

  return (
    <section className="mx-auto max-w-editorial px-6 py-16 md:px-10">
      <div className="grid gap-12 md:grid-cols-2">
        <div className="relative aspect-[4/5] overflow-hidden bg-trade-cream">
          <Image src={product.image} alt={product.name} fill className="object-cover" />
        </div>

        <div>
          <p className="text-xs text-trade-brown">{product.sku}</p>
          <h1 className="mt-2 font-trade-serif text-4xl">{product.name}</h1>
          <p className="mt-2 text-sm text-trade-brown">{product.fabric}</p>

          <div className="mt-6 flex items-baseline gap-4">
            <div>
              <p className="text-xs text-trade-brown">Retail MRP</p>
              <p className="text-lg text-trade-brown line-through">
                ₹{product.mrp.toLocaleString("en-IN")}
              </p>
            </div>
            <div>
              <p className="text-xs text-trade-bronze">Trade Price</p>
              <p className="font-trade-serif text-3xl">
                ₹{product.tradePrice.toLocaleString("en-IN")}
              </p>
            </div>
          </div>

          <div className="mt-4 flex gap-8 text-sm text-trade-brown">
            <span>MOQ: {product.moq} pieces</span>
            <span>Available: {product.availableUnits} units</span>
          </div>

          <div className="mt-8 border-t border-trade-line pt-6">
            <h2 className="text-xs tracking-[0.15em] text-trade-brown">
              VOLUME PRICING
            </h2>
            <table className="mt-3 w-full text-sm">
              <tbody>
                {product.volumeTiers.map((t) => (
                  <tr key={t.minQty} className="border-b border-trade-line/60">
                    <td className="py-2 text-trade-brown">
                      {t.minQty}–{t.maxQty ?? "+"}
                    </td>
                    <td className="py-2 text-right">
                      ₹{t.price.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 flex gap-6 text-sm">
            <button className="border-b border-trade-charcoal">Request Sample</button>
            <button className="border-b border-trade-charcoal">
              Download Product Sheet
            </button>
          </div>
        </div>
      </div>

      <div className="mt-14">
        <h2 className="font-trade-serif text-2xl">Build your order</h2>
        <div className="mt-6">
          <QuantityMatrix product={product} />
        </div>
      </div>
    </section>
  );
}
