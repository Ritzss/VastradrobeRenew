/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function ColorVariants({
  productName,
  currentId,
}: {
  productName: string;
  currentId: number;
}) {
  const [variants, setVariants] = useState<any[]>([]);

  useEffect(() => {
    fetch(
      `/api/ims/public/products?name=${encodeURIComponent(productName)}`
    )
      .then((res) => res.json())
      .then((data) => setVariants(data.products || []));
  }, [productName]);

  if (variants.length <= 1) return null;

  return (
    <div>
      <p className="text-sm font-medium mb-2">Colors</p>
      <div className="flex gap-3">
        {variants.map((p) => (
          <Link
            key={p.productId}
            href={`/product/${p.productId}`}
            className={`w-8 h-8 rounded-full border ${p.productId === currentId ? "ring-2 ring-black" : ""}`}
            style={{ background: p.color || "#ccc" }}
          />
        ))}
      </div>
    </div>
  );
}
