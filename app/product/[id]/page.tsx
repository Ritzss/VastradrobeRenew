"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/Global/SkeletonLoader";
import { Product } from "@/Types/Product";

const SIZES = ["S", "M", "L", "XL"];

export default function ProductPage() {
  const { id } = useParams();
  const productId = Number(id);

  const { products, addToCart, setProducts } = useAppContext();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  /* ----------------------------------
     FETCH / HYDRATE PRODUCT
  -----------------------------------*/
  useEffect(() => {
    if (!productId) return;

    const existing = products.find((p) => p.id === productId);
    if (existing) {
      setProduct(existing);
      setActiveImage(existing.image);
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `https://fakestoreapi.com/products/${productId}`
        );
        const data: Product = await res.json();

        setProduct(data);
        setActiveImage(data.image);
        setProducts((prev) => [...prev, data]); // cache in context
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, products, setProducts]);

  /* ----------------------------------
     LOADING STATE
  -----------------------------------*/
  if (loading) {
    return (
      <div className="flex justify-center gap-6 p-10">
        <SkeletonLoader />
        <SkeletonLoader />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-10 text-xl text-center">
        Product not found
      </div>
    );
  }

  /* ----------------------------------
     RENDER
  -----------------------------------*/
  return (
    <div className="px-12 py-10 flex gap-14">
      {/* LEFT: THUMBNAILS */}
      <div className="flex flex-col gap-3 w-[15%]">
        {Array.from({ length: 4 }).map((_, i) => (
          <button
            key={i}
            className="border rounded-lg h-[12svh] relative hover:border-black"
            onClick={() => setActiveImage(product.image)}
          >
            <Image
              src={product.image}
              alt=""
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* CENTER: MAIN IMAGE */}
      <div className="relative w-[40%] aspect-3/4 bg-neutral-100 rounded-xl overflow-hidden">
        <Image
          src={activeImage}
          alt={product.title}
          fill
          priority
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* RIGHT: DETAILS */}
      <div className="flex flex-col gap-6 w-[35%]">
        <h1 className="text-3xl font-bold">{product.title}</h1>
        <p className="text-neutral-600">{product.description}</p>

        <div className="text-2xl font-semibold">
          ₹{Math.round(product.price * 100)}
        </div>

        {/* SIZE SELECT */}
        <div className="flex gap-3">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => setSelectedSize(size)}
              className={`border px-4 py-2 rounded-lg transition ${
                selectedSize === size
                  ? "bg-black text-white"
                  : "hover:bg-black hover:text-white"
              }`}
            >
              {size}
            </button>
          ))}
        </div>

        {/* ADD TO CART */}
        <button
          disabled={!selectedSize}
          onClick={() => addToCart(product.id)}
          className={`mt-4 px-8 py-3 rounded-lg text-white transition ${
            selectedSize
              ? "bg-black hover:scale-105"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {selectedSize ? "Add to Cart" : "Select Size"}
        </button>
      </div>
    </div>
  );
}
