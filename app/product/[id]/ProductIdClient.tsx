"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from "@/components/Global/ProductCard";
import { useRouter } from "next/navigation";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Link from "next/link";

const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function ProductPDPClient({
  product,
  similarProducts,
  inventory,
}: {
  product: IMSProduct;
  similarProducts: IMSProduct[];
  inventory: any[];
}) {
  const router = useRouter();
  const productId = Number(product.productId);
  const { addToCart, cartItems, removeFromCart } = useAppContext();

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );
  const [activeImage, setActiveImage] = useState(
    product.variants?.[0]?.images?.[0] || "/Assets/Images/Newplaceholder.png",
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  const sizes = selectedVariant?.sizes?.length
    ? selectedVariant.sizes
    : FALLBACK_SIZES;

  const stockMap = useMemo(() => {
    return inventory.reduce((acc: any, item: any) => {
      acc[item.size] = item.quantity;
      return acc;
    }, {});
  }, [inventory]);

  useEffect(() => {
    if (!inventory.length) return;
    const availableSize = sizes.find((size) => stockMap[size] > 0) || sizes[0];
    setSelectedSize(availableSize);
  }, [inventory, sizes, stockMap]);

  useEffect(() => {
    if (!selectedVariant) return;
    setActiveImage(
      selectedVariant.images?.[0] || "/Assets/Images/Newplaceholder.png",
    );
    setSelectedSize(null);
  }, [selectedVariant]);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === selectedSize &&
      item.color === selectedVariant?.color,
  );

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;

    isInCart
      ? removeFromCart(productId, selectedSize, selectedVariant.color)
      : addToCart(productId, selectedSize, selectedVariant.color);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariant) return;

    router.push(
      `/checkout?buyNow=1&productId=${productId}&size=${selectedSize}&color=${selectedVariant.color}&qty=1`,
    );
  };

  const getStock = (size: string) => stockMap[size] ?? null;

  return (
    <div className="px-6 md:px-12 py-12 space-y-12 pt-28">
      {/* BREADCRUMB */}
      <nav className="text-sm text-[#957f6a]">
        <ol className="flex gap-2">
          <li>
            <Link href="/" className="hover:text-[#5f5143]">
              Home
            </Link>
          </li>
          <li>/</li>
          <li className="text-[#5f5143] font-medium">{product.name}</li>
        </ol>
      </nav>

      {/* TOP SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-start">
        {/* IMAGE SECTION */}
        <div className="space-y-6">
          {/* MAIN IMAGE - NO CROPPING */}
          <div className="w-full bg-[#f3e7d8] rounded-[32px] shadow-[0_30px_80px_rgba(149,127,106,0.15)] overflow-hidden">
            <Image
              src={activeImage}
              width={800}
              height={1000}
              alt={product.name}
              className="w-full h-auto object-contain"
              priority
            />
          </div>

          {/* THUMBNAILS */}
          <div className="flex gap-4">
            {(selectedVariant?.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="w-20 bg-[#f3e7d8] rounded-xl overflow-hidden"
              >
                <Image
                  src={img}
                  width={200}
                  height={300}
                  alt=""
                  className="w-full h-auto object-contain"
                />
              </button>
            ))}
          </div>
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#5f5143]">
              {product.name}
            </h1>
            <p className="mt-3 text-[#7a6a5c]">{product.description}</p>
          </div>

          {/* PRICE */}
          <div className="flex items-center gap-4">
            <span className="text-3xl font-semibold text-[#5f5143]">
              ₹{product.price}
            </span>
            {product.mrp && (
              <span className="text-sm line-through text-[#957f6a]">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {/* COLORS */}
          {product.variants.length > 1 && (
            <div>
              <p className="mb-3 text-sm font-medium text-[#5f5143]">Color</p>
              <div className="flex gap-3">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-2 rounded-full border text-sm transition ${
                      selectedVariant?.color === variant.color
                        ? "bg-[#5f5143] text-white border-[#5f5143]"
                        : "border-[#e6d8c8] hover:bg-[#f3e7d8]"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* SIZES */}
          <div>
            <p className="mb-3 text-sm font-medium text-[#5f5143]">Size</p>

            <div className="flex flex-wrap gap-3">
              {sizes.map((size) => {
                const qty = getStock(size);
                return (
                  <button
                    key={size}
                    disabled={qty === 0}
                    onClick={() => setSelectedSize(size)}
                    className={`px-5 py-2 rounded-full border border-[#e6d8c8] text-sm transition ${
                      selectedSize === size
                        ? "bg-[#5f5143] text-white border-[#5f5143]"
                        : "hover:bg-[#f3e7d8]"
                    } ${qty === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* BUTTONS */}
          <div className="flex gap-4 pt-4">
            <button
              disabled={!selectedSize}
              onClick={handleBuyNow}
              className="flex-1 py-4 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition disabled:opacity-40"
            >
              Buy Now
            </button>

            <button
              disabled={!selectedSize}
              onClick={handleCartToggle}
              className="flex-1 py-4 rounded-full border border-[#5f5143] text-[#5f5143] hover:bg-[#f3e7d8] transition disabled:opacity-40"
            >
              {isInCart ? "Remove" : "Add to Cart"}
            </button>
          </div>
        </div>
      </section>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <ScrollReveal>
          <section className="mt-24">
            <h2 className="text-3xl font-semibold text-[#5f5143] mb-12 text-center">
              You May Also Like
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard key={p.productId} product={p} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}
