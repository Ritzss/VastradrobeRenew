"use client";

import { useMemo, useState } from "react";
import { TradeProduct } from "@/lib/trade/types";
import { priceForQuantity } from "@/lib/trade/mock-data";

export default function QuantityMatrix({ product }: { product: TradeProduct }) {
  const [color, setColor] = useState(product.colors[0]);
  const [quantities, setQuantities] = useState<Record<string, number>>(
    Object.fromEntries(product.sizes.map((s) => [s, 0]))
  );

  const totalUnits = useMemo(
    () => Object.values(quantities).reduce((a, b) => a + b, 0),
    [quantities]
  );

  const unitPrice = priceForQuantity(product, totalUnits || product.moq);
  const totalPrice = unitPrice * totalUnits;
  const meetsMoq = totalUnits === 0 || totalUnits >= product.moq;

  function setQty(size: string, value: string) {
    const n = Math.max(0, Number(value.replace(/[^\d]/g, "")) || 0);
    setQuantities((q) => ({ ...q, [size]: n }));
  }

  return (
    <div className="border border-trade-line p-6">
      <div>
        <span className="text-xs text-trade-brown">Color</span>
        <div className="mt-2 flex flex-wrap gap-2">
          {product.colors.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setColor(c)}
              className={`border px-4 py-1.5 text-sm transition-colors duration-200 ${
                color === c
                  ? "border-trade-charcoal bg-trade-charcoal text-trade-offwhite"
                  : "border-trade-line hover:border-trade-charcoal"
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[420px] border-collapse text-sm">
          <thead>
            <tr>
              {product.sizes.map((s) => (
                <th
                  key={s}
                  className="border-b border-trade-line pb-2 text-center font-normal text-trade-brown"
                >
                  {s}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              {product.sizes.map((s) => (
                <td key={s} className="pt-3 text-center">
                  <input
                    inputMode="numeric"
                    value={quantities[s] || ""}
                    placeholder="0"
                    onChange={(e) => setQty(s, e.target.value)}
                    className="w-14 border border-trade-line py-1.5 text-center outline-none focus:border-trade-charcoal"
                  />
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="mt-6 flex flex-wrap items-end justify-between gap-4 border-t border-trade-line pt-5">
        <div>
          <p className="text-xs text-trade-brown">
            {totalUnits} unit{totalUnits === 1 ? "" : "s"} · ₹{unitPrice.toLocaleString("en-IN")} / unit
          </p>
          <p className="mt-1 font-trade-serif text-2xl">
            ₹{totalPrice.toLocaleString("en-IN")}
          </p>
          {!meetsMoq && (
            <p className="mt-1 text-xs text-red-700">
              Minimum order quantity is {product.moq} units.
            </p>
          )}
        </div>
        <button
          type="button"
          disabled={totalUnits === 0 || !meetsMoq}
          className="border border-trade-charcoal bg-trade-charcoal px-8 py-3 text-sm text-trade-offwhite transition-colors duration-300 ease-editorial hover:bg-transparent hover:text-trade-charcoal disabled:cursor-not-allowed disabled:opacity-40"
        >
          Add to Trade Order
        </button>
      </div>
    </div>
  );
}
