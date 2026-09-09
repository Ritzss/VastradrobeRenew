"use client";

import { useMemo, useState } from "react";
import { tradeProducts } from "@/lib/trade/mock-data";

type Grid = Record<string, Record<string, number>>; // productSlug -> size -> qty

export default function QuickOrderPage() {
  const [query, setQuery] = useState("");
  const [grid, setGrid] = useState<Grid>({});

  const visibleProducts = useMemo(
    () =>
      tradeProducts.filter((p) =>
        p.name.toLowerCase().includes(query.toLowerCase())
      ),
    [query]
  );

  function setQty(slug: string, size: string, value: string) {
    const n = Math.max(0, Number(value.replace(/[^\d]/g, "")) || 0);
    setGrid((g) => ({
      ...g,
      [slug]: { ...g[slug], [size]: n },
    }));
  }

  function rowTotal(slug: string) {
    return Object.values(grid[slug] ?? {}).reduce((a, b) => a + b, 0);
  }

  const orderTotal = tradeProducts.reduce((sum, p) => sum + rowTotal(p.slug), 0);

  return (
    <section className="mx-auto max-w-editorial px-6 py-16 md:px-10">
      <p className="text-xs tracking-[0.25em] text-trade-bronze">QUICK ORDER</p>
      <h1 className="mt-3 font-trade-serif text-4xl">Build an order fast</h1>
      <p className="mt-2 text-sm text-trade-brown">
        Search for a style and enter quantities directly by size — no need to
        open each product page.
      </p>

      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search products…"
        className="mt-8 w-full max-w-sm border-b border-trade-line bg-transparent py-2 text-sm outline-none focus:border-trade-charcoal"
      />

      <div className="mt-8 overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-sm">
          <thead>
            <tr className="border-b border-trade-line text-left text-trade-brown">
              <th className="py-3 pr-4 font-normal">Product</th>
              {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                <th key={s} className="px-2 py-3 text-center font-normal">
                  {s}
                </th>
              ))}
              <th className="py-3 pl-4 text-right font-normal">Total</th>
            </tr>
          </thead>
          <tbody>
            {visibleProducts.map((p) => (
              <tr key={p.slug} className="border-b border-trade-line/60">
                <td className="py-4 pr-4">
                  <div className="font-trade-serif text-base">{p.name}</div>
                  <div className="text-xs text-trade-brown">
                    ₹{p.tradePrice.toLocaleString("en-IN")} · MOQ {p.moq}
                  </div>
                </td>
                {["XS", "S", "M", "L", "XL", "XXL"].map((s) => (
                  <td key={s} className="px-2 py-4 text-center">
                    {p.sizes.includes(s) ? (
                      <input
                        inputMode="numeric"
                        value={grid[p.slug]?.[s] || ""}
                        placeholder="0"
                        onChange={(e) => setQty(p.slug, s, e.target.value)}
                        className="w-12 border border-trade-line py-1 text-center outline-none focus:border-trade-charcoal"
                      />
                    ) : (
                      <span className="text-trade-line">—</span>
                    )}
                  </td>
                ))}
                <td className="py-4 pl-4 text-right font-medium">
                  {rowTotal(p.slug)}
                </td>
              </tr>
            ))}
            {visibleProducts.length === 0 && (
              <tr>
                <td colSpan={8} className="py-10 text-center text-trade-brown">
                  No products match &ldquo;{query}&rdquo;.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-trade-line pt-6">
        <p className="text-sm text-trade-brown">
          {orderTotal} unit{orderTotal === 1 ? "" : "s"} selected across{" "}
          {tradeProducts.filter((p) => rowTotal(p.slug) > 0).length} style(s)
        </p>
        <button
          type="button"
          disabled={orderTotal === 0}
          className="border border-trade-charcoal bg-trade-charcoal px-8 py-3 text-sm text-trade-offwhite transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add All to Order
        </button>
      </div>
    </section>
  );
}
