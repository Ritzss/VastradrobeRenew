/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import { IMSProduct } from "@/Types/Product";
// import { useRouter } from "next/router";
import { useAppContext } from "@/hooks/useAppContext";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProductQuickViewProps {
  product: IMSProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const ProductQuickView = ({
  product,
  isOpen,
  onClose,
  onNext,
  onPrev,
}: ProductQuickViewProps) => {
  const [selectedColor, setSelectedColor] = useState(0);
  const [selectedSize, setSelectedSize] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const router = useRouter();

  const { addToCart, removeFromCart, cartItems } = useAppContext();

  const selectedVariant = product?.variants?.[selectedColor];

  const productId = Number(product?.productId);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === selectedSize &&
      item.color === selectedVariant?.color,
  );

  useEffect(() => {
    if (!product) return;

    setSelectedColor(0);
    setSelectedSize("");
    setActiveImage(0);
  }, [product, product?.productId]);

  useEffect(() => {
    if (!isOpen) return;

    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onNext, onPrev]);

  if (!isOpen || !product) return null;

  const activeColorIndex = product.variants?.[selectedColor]
    ? selectedColor
    : 0;

  const currentVariant = product.variants?.[activeColorIndex];

  const activeImageIndex = currentVariant?.images?.[activeImage]
    ? activeImage
    : 0;

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;

    if (isInCart) {
      removeFromCart(productId, selectedSize, selectedVariant.color);
    } else {
      addToCart(productId, selectedSize, selectedVariant.color);
    }
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariant) return;

    router.push(
      `/checkout?buyNow=${productId}&productId=${productId}&size=${selectedSize}&color=${selectedVariant.color}&qty=1`,
    );
  };

  return (
    <div
      className="fixed inset-0 z-9999 bg-black/70 backdrop-blur-sm flex items-center justify-center p-2 md:p-6"
      onClick={onClose}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative bg-white w-full max-w-7xl h-[95dvh] rounded-3xl overflow-hidden shadow-[0_25px_80px_rgba(0,0,0,0.25)] animate-in fade-in zoom-in-95 duration-300"
      >
        {/* CLOSE */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-50 bg-white shadow-md rounded-full p-2"
        >
          <X size={20} />
        </button>

        {/* PREV */}
        <button
          onClick={onPrev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-full p-3"
        >
          <ChevronLeft size={22} />
        </button>

        {/* NEXT */}
        <button
          onClick={onNext}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-50 bg-white shadow-lg rounded-full p-3"
        >
          <ChevronRight size={22} />
        </button>

        <div className="grid md:grid-cols-[42%_58%] h-full">
          {/* IMAGE */}
          <div className="relative bg-linear-to-br from-[#f8f4ef] to-[#efe7dc] h-[45vh] md:h-full overflow-hidden">
            {product.mrp && product.mrp > product.price && (
              <div className="absolute top-5 left-5 z-20 bg-black text-white px-4 py-2 rounded-full text-xs font-medium tracking-[0.15em] uppercase">
                {Math.round(
                  ((product.mrp - product.price) / product.mrp) * 100,
                )}
                % Off
              </div>
            )}
            {/* <Link href={`/product/${productId}`}> */}
              <Image
                src={
                  currentVariant?.images?.[activeImageIndex] ??
                  "/placeholder.png"
                }
                alt={product.name}
                fill
                priority
                sizes="50vw"
                className="object-cover"
              />
            {/* </Link> */}
            {currentVariant?.images?.length > 1 && (
              <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex gap-2">
                {currentVariant.images.map((image, index) => (
                  <button
                    key={`${image}-${index}`}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-14 w-14 rounded-lg overflow-hidden border-2 ${
                      activeImage === index ? "border-black" : "border-white"
                    }`}
                  >
                    <Image src={image} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* DETAILS */}
          <div className="flex flex-col overflow-y-auto p-6 md:p-10">
            <p className="text-xs uppercase tracking-[0.3em] text-[#9a8571]">
              {product.category}
            </p>

            <h2 className="mt-4 text-4xl md:text-5xl font-light tracking-tight text-[#2e2924]">
              {product.name}
            </h2>

            <div className="flex items-end gap-4 mt-6">
              <span className="text-2xl font-semibold text-[#3d342d]">
                ₹{product.price}
              </span>

              {product.mrp && product.mrp > product.price && (
                <span className="line-through text-gray-400">
                  ₹{product.mrp}
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2 mt-5">
              {product.brand && (
                <span className="px-3 py-1 rounded-full bg-[#f5efe8] text-xs uppercase tracking-wider">
                  {product.brand}
                </span>
              )}

              <span className="px-3 py-1 rounded-full bg-[#f5efe8] text-xs uppercase tracking-wider">
                {currentVariant.color}
              </span>

              <span className="px-3 py-1 rounded-full bg-[#f5efe8] text-xs uppercase tracking-wider">
                Premium
              </span>
            </div>

            {product.description && (
              <div className="mt-8">
                <p
                  className={`text-[#6a5f55] leading-8 text-[15px] transition-all duration-300 ${
                    showFullDescription ? "" : "line-clamp-4"
                  }`}
                >
                  {product.description}
                </p>

                {product.description.length > 150 && (
                  <button
                    onClick={() => setShowFullDescription(!showFullDescription)}
                    className="mt-2 text-sm font-medium text-[#3d342d] hover:underline"
                  >
                    {showFullDescription ? "Read Less" : "Read More"}
                  </button>
                )}
              </div>
            )}

            {product.variants.length > 1 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium uppercase mb-3">Color</h3>

                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant, index) => (
                    <button
                      key={variant.color}
                      onClick={() => {
                        setSelectedColor(index);
                        setSelectedSize("");
                        setActiveImage(0);
                      }}
                      className={`px-4 py-2 rounded-md border ${
                        selectedColor === index
                          ? "bg-black text-white border-black"
                          : "border-gray-300"
                      }`}
                    >
                      <>
                        {variant.color}
                        {selectedColor === index && (
                          <span className="ml-2">✓</span>
                        )}
                      </>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {currentVariant?.sizes?.length > 0 && (
              <div className="mt-8">
                <h3 className="text-sm font-medium uppercase mb-3">Size</h3>

                <div className="flex flex-wrap gap-2">
                  {currentVariant.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-md border ${
                        selectedSize === size
                          ? "bg-black text-white border-black"
                          : "border-gray-300"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <Link
              href={`/product/${productId}`}
              className="inline-flex items-center gap-2 text-sm font-medium text-[#3d342d] hover:gap-3 transition-all"
            >
              Explore The Product
              <span>→</span>
            </Link>

            <div className="sticky bottom-0 bg-white border-t border-[#eee] pt-6 mt-8 flex flex-col gap-3">
              <button
                onClick={handleCartToggle}
                disabled={!selectedSize}
                className="w-full bg-[#2d2722] text-white py-4 rounded-xl tracking-wide hover:opacity-90 transition disabled:opacity-50"
              >
                {isInCart ? "✓ Added To Bag" : "👜 Add To Bag"}
              </button>

              <button
                onClick={handleBuyNow}
                disabled={!selectedSize}
                className="w-full border border-[#2d2722] text-[#2d2722] py-4 rounded-xl hover:bg-[#2d2722] hover:text-white transition disabled:opacity-50"
              >
                ⚡ Buy Instantly
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductQuickView;
