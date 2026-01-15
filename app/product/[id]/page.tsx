"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/hooks/useAppContext";

export default function ProductPage() {
  const { id } = useParams();
  const { products, addToCart } = useAppContext();

  const product = products.find(p => p.id === Number(id));

  if (!product) {
    return <div className="p-10">Loading product...</div>;
  }

  return (
    <div className="min-h-dvh px-12 py-10 grid grid-cols-2 gap-16">
      {/* IMAGE */}
      <div className="relative aspect-3/4 rounded-xl w-160 h-150 overflow-hidden bg-neutral-100">
        <Image
          src={product.image}
          alt={product.title}
          fill
          className="object-contain transition-transform duration-300 hover:scale-105"
          priority
        />
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-6">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-neutral-600">{product.description}</p>

        <div className="text-2xl font-semibold">
          ₹{Math.round(product.price * 100)}
        </div>

        <button
          onClick={() => addToCart(product.id)}
          className="mt-4 w-fit px-8 py-3 bg-black text-white rounded-lg hover:scale-105 transition"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
