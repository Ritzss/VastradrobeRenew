import Image from "next/image";
import Link from "next/link";
import { tradeCollections } from "@/lib/trade/mock-data";

export default function TradeCollections() {
  return (
    <section id="collections" className="mx-auto max-w-editorial px-6 py-24 md:px-10">
      <div className="flex items-baseline justify-between">
        <h2 className="font-trade-serif text-3xl md:text-4xl">
          Trade collections
        </h2>
      </div>

      <div className="mt-12 grid gap-x-6 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
        {tradeCollections.map((c) => (
          <Link key={c.slug} href={`/trade/collections/${c.slug}`} className="group block">
            <div className="relative aspect-[4/5] overflow-hidden bg-trade-cream">
              <Image
                src={c.image}
                alt={c.name}
                fill
                className="object-cover transition-transform duration-700 ease-editorial group-hover:scale-105"
              />
            </div>
            <div className="mt-4 flex items-start justify-between gap-4">
              <div>
                <h3 className="font-trade-serif text-xl">{c.name}</h3>
                <p className="mt-1 text-sm leading-relaxed text-trade-brown">
                  {c.description}
                </p>
              </div>
              <span className="whitespace-nowrap text-xs text-trade-bronze">
                {c.productCount} styles
              </span>
            </div>
            <span className="mt-3 inline-block border-b border-trade-charcoal text-sm">
              Explore
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
}
