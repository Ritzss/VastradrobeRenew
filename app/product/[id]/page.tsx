"use client";

import { useParams } from "next/navigation";
import Image from "next/image";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import SkeletonLoader from "@/components/Global/SkeletonLoader";
import { IMSProduct } from "@/Types/Product";

const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function ProductPage() {
  const params = useParams();
  const id = params?.id;
  const productId = Number(id);

  const { products, addToCart, setProducts } = useAppContext();

  const [product, setProduct] = useState<IMSProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [activeImage, setActiveImage] = useState<string>("");

  useEffect(() => {
    if (!productId || Number.isNaN(productId)) {
      setLoading(false);
      return;
    }

    const existing = products.find(
      (p) => p.productId === productId
    );

    if (existing) {
      setProduct(existing);
      setActiveImage(
        existing.images?.[0] || "/Assets/Images/placeholder.png"
      );
      setLoading(false);
      return;
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_IMS_BASE_URL}/api/ims/public/products/${productId}`,
          { cache: "no-store" }
        );

        if (!res.ok) throw new Error("Fetch failed");

        const data = await res.json();
        const fetchedProduct: IMSProduct = data.product;

        setProduct(fetchedProduct);
        setActiveImage(
          fetchedProduct.images?.[0] || "/Assets/Images/placeholder.png"
        );

        setProducts((prev) =>
          prev.some((p) => p.productId === fetchedProduct.productId)
            ? prev
            : [...prev, fetchedProduct]
        );
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, products, setProducts]);

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

  const sizes =
    product.sizes && product.sizes.length > 0
      ? product.sizes
      : FALLBACK_SIZES;

  return (
    <div className="px-12 py-10 flex gap-14">
      {/* LEFT: THUMBNAILS */}
      <div className="flex flex-col gap-3 w-[15%]">
        {(product.images || []).map((img, i) => (
          <button
            key={i}
            className="border rounded-lg h-[12svh] relative hover:border-black"
            onClick={() => setActiveImage(img)}
          >
            <Image
              src={img}
              alt=""
              fill
              className="object-contain p-2"
            />
          </button>
        ))}
      </div>

      {/* CENTER IMAGE */}
      <div className="relative w-[40%] aspect-3/4 bg-neutral-100 rounded-xl overflow-hidden">
        <Image
          src={activeImage}
          alt={product.name}
          fill
          priority
          className="object-contain transition-transform duration-300 hover:scale-105"
        />
      </div>

      {/* DETAILS */}
      <div className="flex flex-col gap-6 w-[35%]">
        <h1 className="text-3xl font-bold">{product.name}</h1>
        <p className="text-neutral-600">{product.description}</p>

        <div className="text-2xl font-semibold">
          ₹{product.price}
        </div>

        {/* SIZE SELECT */}
        <div className="flex gap-3">
          {sizes.map((size) => (
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
          onClick={() => addToCart(product.productId)}
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
