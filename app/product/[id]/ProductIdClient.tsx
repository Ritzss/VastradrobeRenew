/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { sizeGuide } from "@/lib/sizeGuide";
import SizeGuideModal from "@/components/products/SizeGuideModal";
import { toast } from "sonner";

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

  //  const router = useRouter();
  // const productId = Number(product.productId);

  // const { addToCart, cartItems, removeFromCart } = useAppContext();
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProductDetails, setShowProductDetails] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);
  useEffect(() => {
    // console.log("Product inside client:", product.variants);
    // console.log("Inventory inside client:", inventory);
  }, [product]);

  /* ---------------- VARIANT STATE ---------------- */

  // const [selectedVariant, setSelectedVariant] = useState(
  //   product.variants?.[0] || null,
  // );

  // const [activeImage, setActiveImage] = useState(
  //   product.variants?.[0]?.images?.[0] || "/Assets/Images/Newplaceholder.png",
  // );

  // const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariant]);
  /* ---------------- SIZE LOGIC ---------------- */

  // const sizes = selectedVariant?.sizes?.length
  //   ? selectedVariant.sizes
  //   : FALLBACK_SIZES;

  // const stockMap = useMemo(() => {
  //   return inventory.reduce((acc: any, item: any) => {
  //     acc[item.size] = item.quantity;
  //     return acc;
  //   }, {});
  // }, [inventory]);

  // useEffect(() => {
  //   if (!inventory.length) return;

  //   const availableSize = sizes.find((size) => stockMap[size] > 0) || sizes[0];

  //   setSelectedSize(availableSize);
  // }, [inventory, sizes, stockMap]);

  // useEffect(() => {
  //   if (!selectedVariant) return;

  //   setActiveImage(
  //     selectedVariant.images?.[0] || "/Assets/Images/Newplaceholder.png",
  //   );
  //   setSelectedSize(null);
  // }, [selectedVariant]);

  const guide = product.sizeChartType
    ? sizeGuide[product.sizeChartType] || []
    : [];

  const selectedSizeData = guide.find((row) => row.size === selectedSize);

  // const isInCart = cartItems.some(
  //   (item) =>
  //     item.productId === productId &&
  //     item.size === selectedSize &&
  //     item.color === selectedVariant?.color,
  // );
  // const getStock = (size: string) => stockMap[size] ?? null;

  // const handleCartToggle = () => {
  //   if (!selectedSize || !selectedVariant) return;

  //   isInCart
  //     ? removeFromCart(productId, selectedSize, selectedVariant.color)
  //     : addToCart(productId, selectedSize, selectedVariant.color);
  // };

  // const handleBuyNow = () => {
  //   if (!selectedSize || !selectedVariant) return;

  //   router.push(
  //     `/checkout?buyNow=1&productId=${productId}&size=${selectedSize}&color=${selectedVariant.color}&qty=1`,
  //   );
  // };

  // console.log("PDP product variants:", product.variants);

  const sizes = selectedVariant?.sizes?.length
    ? selectedVariant.sizes
    : FALLBACK_SIZES;

  const stockMap = useMemo(() => {
    return inventory.reduce((acc: any, item: any) => {
      acc[item.size] = item.quantity;
      return acc;
    }, {});
  }, [inventory]);

  // console.log(inventory);

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

  const getStock = (size: string) => stockMap[size] ?? null;

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;

    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isInCart
      ? removeFromCart(productId, selectedSize, selectedVariant.color)
      : addToCart(productId, selectedSize, selectedVariant.color);
  };

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariant) return;

    router.push(
      `/checkout?buyNow=${productId}&productId=${productId}&size=${selectedSize}&color=${selectedVariant.color}&qty=1`,
    );
  };

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
          <div
            className="md:hidden w-full flex relative overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.clientWidth;
              const index = Math.round(scrollLeft / width);
              setActiveIndex(index);
            }}
          >
            {(selectedVariant?.images || []).map((img, i) => (
              <div
                key={i}
                className="relative shrink-0 snap-center bg-neutral-100"
              >
                <Image
                  src={img}
                  width={390}
                  height={500}
                  sizes="100vw"
                  alt={product.name}
                  className="h-auto object-contain"
                  priority={i === 0}
                />
              </div>
            ))}
          </div>

          {/* 🔴 DOT INDICATOR */}
          <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {(selectedVariant?.images || []).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-[#cd0000] w-4" : "bg-gray-300 w-2"
                }`}
              />
            ))}
          </div>

          {/* MAIN IMAGE - NO CROPPING */}
          <div className="hidden md:block w-full bg-[#f3e7d8] rounded-4xl shadow-[0_30px_80px_rgba(149,127,106,0.15)] overflow-hidden">
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
          <div className="hidden md:flex gap-4">
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
            <div className="mt-3">
              <p
                className={`text-[#7a6a5c] transition-all duration-300 ${
                  !showFullDescription ? "line-clamp-3" : ""
                }`}
              >
                {product.description}
              </p>

              {product.description && product.description.length > 120 && (
                <button
                  onClick={() => setShowFullDescription((prev) => !prev)}
                  className="mt-2 text-sm font-medium text-[#6a0f1f] underline"
                >
                  {showFullDescription ? "Show Less" : "Show More"}
                </button>
              )}
            </div>
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
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-2 rounded-full border text-sm capitalize transition ${
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
            <p className="font-medium mb-2">Size</p>
            <div className="flex gap-3 flex-wrap">
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
                    {stockMap[size] !== undefined && stockMap[size] < 15 && (
                      <span className="ml-2 text-xs text-gray-500">
                        ({stockMap[size]})
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSize &&
              (stockMap[selectedSize] > 0 ? (
                <p className="mt-3 text-green-600 text-sm">In Stock</p>
              ) : (
                <p className="mt-3 text-red-600 text-sm">Out of Stock</p>
              ))}
            {selectedSizeData && (
              <div className="mt-4 border rounded-xl p-4 bg-gray-50 text-sm space-y-2">
                <h4 className="font-medium">
                  Size {selectedSize} Measurements
                </h4>

                {Object.entries(selectedSizeData).map(([key, value]) => {
                  if (key === "size") return null;

                  return (
                    <div key={key} className="flex justify-between">
                      <span className="capitalize text-gray-600">
                        {key.replace(/([A-Z])/g, " $1")}
                      </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  );
                })}
                <button
                  onClick={() => setShowSizeGuide(true)}
                  className="text-sm underline text-[#6a0f1f]"
                >
                  View Full Size Guide
                </button>
              </div>
            )}
          </div>

          {/* BUTTONS */}
          {(product?.stock ?? 0) > 0 ? (
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
          ) : (
            <div className="relative flex top-3 left-3">
              <button onClick={()=>{toast.success("Will be notified when restocked")}} className="flex-1 flex justify-center py-4 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition disabled:opacity-40">
                {`Notify Me When Available (Sold Out)`}
              </button>
            </div>
          )}
          <div className="mt-6 border-t pt-4 text-sm text-gray-600 space-y-2">
            <div className="flex items-center gap-2">
              <span>🚚</span>
              <p>Free shipping on orders above ₹999</p>
            </div>

            <div className="flex items-center gap-2">
              <span>🔄</span>
              <p>7-day easy returns</p>
            </div>

            <div className="flex items-center gap-2">
              <span>🔒</span>
              <p>100% secure checkout</p>
            </div>
          </div>
        </div>
      </section>
      <div className="mt-6 border-t pt-6">
        <button
          onClick={() => setShowProductDetails((prev) => !prev)}
          className="w-full flex items-center justify-between text-sm font-medium bg-[#2b2b2b10] px-4 py-3 rounded-xl hover:bg-[#2b2b2b20] transition-all duration-300"
        >
          <span>
            {showProductDetails
              ? "Hide Product Details"
              : "View Product Details"}
          </span>

          <IoIosArrowDown
            size={20}
            className={`transition-transform duration-300 ${
              showProductDetails ? "rotate-180" : "rotate-0"
            }`}
          />
        </button>

        <div
          className={`overflow-hidden transition-all duration-500 ${
            showProductDetails
              ? "max-h-150 opacity-100 mt-6"
              : "max-h-0 opacity-0"
          }`}
        >
          <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
            {/* TOP HIGHLIGHTS */}
            <h3 className="font-semibold text-base mb-2">Top Highlights</h3>

            <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-gray-700">
              {product.productDetails?.material && (
                <>
                  <span className="text-gray-500">Material</span>
                  <span className="font-medium">
                    {product.productDetails.material}
                  </span>
                </>
              )}

              {product.productDetails?.closureType && (
                <>
                  <span className="text-gray-500">Closure Type</span>
                  <span className="font-medium">
                    {product.productDetails.closureType}
                  </span>
                </>
              )}

              {product.productDetails?.careInstructions && (
                <>
                  <span className="text-gray-500">Care Instructions</span>
                  <span className="font-medium">
                    {product.productDetails.careInstructions}
                  </span>
                </>
              )}

              {product.productDetails?.style && (
                <>
                  <span className="text-gray-500">Style</span>
                  <span className="font-medium">
                    {product.productDetails.style}
                  </span>
                </>
              )}

              {product.productDetails?.pattern && (
                <>
                  <span className="text-gray-500">Pattern</span>
                  <span className="font-medium">
                    {product.productDetails.pattern}
                  </span>
                </>
              )}

              {product.productDetails?.countryOfOrigin && (
                <>
                  <span className="text-gray-500">Country of Origin</span>
                  <span className="font-medium">
                    {product.productDetails.countryOfOrigin}
                  </span>
                </>
              )}
            </div>

            {/* ADDITIONAL INFO */}
            {(product.productDetails?.manufacturer ||
              product.productDetails?.unitCount) && (
              <>
                <h3 className="font-semibold text-base mt-6 mb-2">
                  Additional Information
                </h3>

                <div className="grid grid-cols-2 gap-y-3 gap-x-6 text-gray-700">
                  {product.productDetails?.manufacturer && (
                    <>
                      <span className="text-gray-500">Manufacturer</span>
                      <span className="font-medium">
                        {product.productDetails.manufacturer}
                      </span>
                    </>
                  )}

                  {product.productDetails?.unitCount && (
                    <>
                      <span className="text-gray-500">Unit Count</span>
                      <span className="font-medium">
                        {product.productDetails.unitCount}
                      </span>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </div>
      {showSizeGuide && (
        <div className="fixed h-full inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl max-w-3xl w-full relative">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-3 right-3"
            >
              ✕
            </button>

            <SizeGuideModal product={product} />
          </div>
        </div>
      )}

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <ScrollReveal>
          <section className="mt-24">
            <h2 className="text-3xl font-semibold text-[#5f5143] mb-12 text-center">
              You May Also Like
            </h2>

            <div className="grid md:grid-cols-4 gap-8">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard Linked key={p.productId} product={p} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}
    </div>
  );
}
