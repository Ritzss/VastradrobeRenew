/* eslint-disable @typescript-eslint/no-unused-expressions */
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
import SizeGuideModal from "@/components/products/SizeGuideModal";
import { IoExitOutline } from "react-icons/io5";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa6";
import { sizeGuide } from "@/lib/sizeGuide";

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
  const [activeIndex, setActiveIndex] = useState(0);
  const [showProductDetails, setShowProductDetails] = useState(false);
  useEffect(() => {
  console.log("Product inside client:", product.variants);
}, [product]);

  /* ---------------- VARIANT STATE ---------------- */

  const [selectedVariant, setSelectedVariant] = useState(
    product.variants?.[0] || null,
  );

  const [activeImage, setActiveImage] = useState(
    product.variants?.[0]?.images?.[0] || "/Assets/Images/Newplaceholder.png",
  );

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
  }, [selectedVariant]);
  /* ---------------- SIZE LOGIC ---------------- */

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

  const guide = product.sizeChartType
    ? sizeGuide[product.sizeChartType] || []
    : [];

  const selectedSizeData = guide.find((row) => row.size === selectedSize);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === selectedSize &&
      item.color === selectedVariant?.color,
  );
  const getStock = (size: string) => stockMap[size] ?? null;

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

  console.log("PDP product variants:", product.variants);

  return (
    <div className="px-10 py-8 flex flex-col gap-16">
      {/* BREADCRUMB */}
      <nav className="text-sm mb-4">
        <ol className="flex flex-wrap items-center gap-2 text-gray-500">
          <li>
            <Link href="/" className="hover:text-black transition">
              Home
            </Link>
          </li>
          <li className="text-gray-400">{">"}</li>
          <li>
            <Link
              href={`/${product.category?.toLowerCase()}`}
              className="hover:text-black transition capitalize"
            >
              {product.category}
            </Link>
          </li>
           {product.subcategory && (
            <>
              <li className="text-gray-400">{">"}</li>
              <li>
                <Link
                  href={`/${product.category?.toLowerCase()}?subcategory=${product.subcategory}`}
                  className="hover:text-black transition capitalize"
                >
                  {product.subcategory}
                </Link>
              </li>
            </>
          )}
          <li className="text-gray-400">{">"}</li>
          <li className="text-black font-medium line-clamp-1">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* TOP SECTION */}
      <section className="lg:flex gap-7">
        {/* IMAGE SECTION */}
        <div className="flex relative md:flex-row flex-col-reverse gap-14">
          <div className="hidden md:flex flex-col gap-3 lg:w-[14%] w-[20%]">
            {(selectedVariant?.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="relative h-[14vh] rounded-lg overflow-hidden border"
              >
                <Image src={img} fill alt={product.name} />
              </button>
            ))}
          </div>

          {/* 📱 MOBILE IMAGE SLIDER */}
          <div
            className="md:hidden flex relative overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
                className="relative min-w-full h-[70vh] snap-center bg-neutral-100"
              >
                <Image
                  src={img}
                  fill
                  sizes="100vw"
                  alt={product.name}
                  className="object-cover"
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

          {/* MAIN IMAGE */}
          <div className="relative hidden md:block border mb-5 lg:w-[69%] w-[90%] h-[87vh] aspect-4/4 bg-neutral-100 rounded-xl overflow-hidden">
            <Image
              src={activeImage}
              fill
              alt={product.name}
              sizes="photo"
              className=""
              priority
            />
          </div>
        </div>

        {/* DETAILS */}
        <div className="flex flex-col gap-6 lg:w-[40%]">
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="text-2xl font-semibold">
            ₹{product.price}
            {product.mrp && (
              <>
                <span className="ml-3 text-sm line-through text-gray-400">
                  ₹{product.mrp}
                </span>
              </>
            )}
          </div>

          {/* COLORS */}
          {product.variants.length > 1 && (
            <div>
              <p className="font-medium mb-2">Colors</p>
              <div className="flex gap-3 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`rounded-lg px-3 py-2 text-sm capitalize ${
                      selectedVariant?.color === variant.color
                        ? "text-[#6a0f1f]"
                        : "text-gray-500"
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
                    className={`px-4 py-2 rounded-lg border ${
                      selectedSize === size
                        ? "bg-black text-white"
                        : "hover:bg-black hover:text-white"
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
          <div className="flex gap-2">
            <button
              type="button"
              disabled={!selectedSize || stockMap[selectedSize] === 0}
              onClick={handleCartToggle}
              className="mt-4 px-8 py-3 w-[60%] bg-black text-white rounded-lg hover:scale-[1.02] transition-all duration-200 flex justify-center items-center disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {selectedSize && stockMap[selectedSize] === 0 ? (
                "Out of Stock"
              ) : isInCart ? (
                <>
                  Remove Item
                  <MdOutlineRemoveShoppingCart className="text-2xl ml-2" />
                </>
              ) : (
                <>
                  Add to Cart
                  <FaCartArrowDown className="text-2xl ml-2" />
                </>
              )}
            </button>
            <button
              disabled={!selectedSize || stockMap[selectedSize] === 0}
              onClick={handleBuyNow}
              className="mt-4 px-8 py-3 w-[40%] bg-[#cd0000] text-white rounded-lg hover:scale-[1.02] transition-all duration-200 flex justify-center items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Buy Now <IoExitOutline className="text-2xl" />
            </button>
      
          </div>
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
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
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
      <ScrollReveal>
        {similarProducts.length > 0 && (
          <section>
            <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
            <div className="flex gap-6 overflow-x-auto pb-4">
              {similarProducts.slice(0, 8).map((p) => (
                <div key={p.productId} className="min-w-80">
                  <ProductCard
                    product={p}
                    className="w-full bg-white border"
                    height="h-[72vh] md:h-[60vh]"
                    classNameInner="h-[60vh] md:h-[49vh] mt-4 rounded-lg"
                  />
                </div>
              ))}
            </div>
          </section>
        )}
      </ScrollReveal>
    </div>
  );
}
