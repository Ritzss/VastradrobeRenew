/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState, useMemo } from "react";
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from "@/components/Global/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Link from "next/link";
import { sizeGuide } from "@/lib/sizeGuide";
import SizeGuideModal from "@/components/products/SizeGuideModal";
import { toast } from "sonner";
import { fbPixel } from "@/lib/facebookpixel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Dialog, DialogContent } from "../UI/dialog";
import { whatsappMessages } from "@/lib/whatsapp";
import { useWhatsApp } from "@/context/WhatsAppContext";

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
  const searchParams = useSearchParams();

  const selectedColorFromURL = searchParams.get("color");
  const productId = Number(product.productId);
  const { addToCart, cartItems, removeFromCart } = useAppContext();

  const initialVariant =
    product.variants.find(
      (variant) =>
        variant.color.toLowerCase() === selectedColorFromURL?.toLowerCase(),
    ) ??
    product.variants?.[0] ??
    null;

  const [selectedVariant, setSelectedVariant] = useState(initialVariant);
  const [selectedDesign, setSelectedDesign] = useState(
    initialVariant?.designs?.[0] || null,
  );
  // const [activeImage, setActiveImage] = useState(
  //   product.variants?.[0]?.images?.[0] || "/Assets/Images/Newplaceholder.png",
  // );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  //  const router = useRouter();
  // const productId = Number(product.productId);

  // const { addToCart, cartItems, removeFromCart } = useAppContext();
  // const [activeIndex, setActiveIndex] = useState(0);
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

  const { setMessage } = useWhatsApp();

  // const { setMessage } = useWhatsApp();

  useEffect(() => {
    setMessage(
      whatsappMessages.product(
        product.name,
        selectedVariant?.color,
        selectedSize ?? undefined,
        window.location.href,
      ),
    );
  }, [product.name, selectedVariant?.color, selectedSize, setMessage]);

  // useEffect(() => {
  //   setActiveIndex(0);
  // }, [selectedVariant]);

  useEffect(() => {
    if (!selectedColorFromURL) return;

    const variant =
      product.variants.find(
        (v) => v.color.toLowerCase() === selectedColorFromURL.toLowerCase(),
      ) ?? product.variants[0];

    setSelectedVariant(variant);
  }, [selectedColorFromURL, product]);

  useEffect(() => {
    const KEY = "recentlyViewed";

    const existing: number[] = JSON.parse(localStorage.getItem(KEY) || "[]");

    const updated = [
      product.productId,
      ...existing.filter((id) => id !== product.productId),
    ].slice(0, 12);

    localStorage.setItem(KEY, JSON.stringify(updated));
  }, [product.productId]);
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
  //     activeImages?.[0] || "/Assets/Images/Newplaceholder.png",
  //   );
  //   setSelectedSize(null);
  // }, [selectedVariant]);

  const guide = product.sizeChartType
    ? (sizeGuide as Record<string, { size: string }[]>)[
        product.sizeChartType
      ] || []
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

  const activeImages = selectedDesign?.images?.length
    ? selectedDesign.images
    : selectedVariant?.images || [];

  const sizes = selectedDesign?.sizes?.length
    ? selectedDesign.sizes
    : selectedVariant?.sizes?.length
      ? selectedVariant.sizes
      : FALLBACK_SIZES;

  const stockMap = useMemo(() => {
    if (!inventory?.length || !selectedVariant) return {};

    const inventoryRecord = inventory.find(
      (item: any) =>
        item.color.toLowerCase() === selectedVariant.color.toLowerCase(),
    );

    if (!inventoryRecord) return {};

    // Product with designs
    if (
      selectedDesign &&
      inventoryRecord.designs &&
      Object.keys(inventoryRecord.designs).length > 0
    ) {
      return inventoryRecord.designs[selectedDesign.design] ?? {};
    }

    // Product without designs
    return inventoryRecord.sizes ?? {};
  }, [inventory, selectedVariant, selectedDesign]);

  // console.log(inventory);

  useEffect(() => {
    if (!product) return;

    fbPixel.viewContent({
      id: String(product.productId),
      name: product.name,
      price: product.price,
    });
  }, [product]);

  useEffect(() => {
    if (!inventory.length) return;
    const availableSize = sizes.find((size) => stockMap[size] > 0) || sizes[0];
    setSelectedSize(availableSize);
  }, [inventory, sizes, stockMap]);

  useEffect(() => {
    if (!selectedVariant) return;

    setSelectedDesign(selectedVariant.designs?.[0] || null);
    setSelectedSize(null);
    setSelectedImage(0);
  }, [selectedVariant]);

  const isInCart = cartItems.some(
    (item) =>
      item.productId === productId &&
      item.size === selectedSize &&
      item.color === selectedVariant?.color,
  );

  const getStock = (size: string) => Number(stockMap[size] ?? 0);

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;

    if (getStock(selectedSize) <= 0) {
      toast.error("This size is out of stock.");
      return;
    }

    if (isInCart) {
      removeFromCart(productId, selectedSize, selectedVariant.color);
    } else {
      addToCart(productId, selectedSize, selectedVariant.color);
    }
  };

  const categoryLabel = ["boys", "girls"].includes(
    product.category.toLowerCase(),
  )
    ? "Kids"
    : product.category;

  const categorySlug = ["boys", "girls"].includes(
    product.category.toLowerCase(),
  )
    ? "kids"
    : product.category.toLowerCase();

  const handleBuyNow = () => {
    if (!selectedSize || !selectedVariant) return;

    router.push(
      `/checkout?buyNow=${productId}&productId=${productId}&size=${selectedSize}&color=${selectedVariant.color}&qty=1`,
    );
  };

  return (
    <div className="px-6 md:px-12 py-12 space-y-12 pt-5">
      {/* BREADCRUMB */}
      <nav className="mb-6 text-sm text-[#957f6a]">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-[#5f5143]">
              Home
            </Link>
          </li>

          <li>
            <span className="text-[#c8b9a8]">›</span>
          </li>

          <li>
            <Link
              href={`/${categorySlug}`}
              className="capitalize hover:text-[#5f5143]"
            >
              {categoryLabel}
            </Link>
          </li>

          <li>
            <span className="text-[#c8b9a8]">›</span>
          </li>

          <li className="font-medium text-[#5f5143] w-[30%] line-clamp-1">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* TOP SECTION */}
      <section className="grid lg:grid-cols-2 gap-16 items-start">
        {/* IMAGE SECTION */}
        <div className="space-y-6">
          {/* <div
            className="w-full flex relative overflow-x-auto snap-x snap-mandatory scrollbar-hide"
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
          {/* 🔴 DOT INDICATOR */}
          {/* <div className="md:hidden absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {(selectedVariant?.images || []).map((_, i) => (
              <div
                key={i}
                className={`h-2 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-[#cd0000] w-4" : "bg-gray-300 w-2"}`}
              />
            ))}
          </div>
          </div> */}

          {/* MAIN IMAGE - NO CROPPING */}
          <div className="md:grid gap-4 sticky top-24">
            <div className="grid grid-cols-2 gap-4">
              {activeImages.slice(0, 3).map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setOpenGallery(true);
                  }}
                  className="relative aspect-3/5 overflow-hidden rounded-2xl bg-[#f8f8f8] group"
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover transition duration-500"
                  />
                </div>
              ))}

              {/* Last Image */}
              {activeImages.length > 3 && (
                <button
                  onClick={() => {
                    setSelectedImage(3);
                    setOpenGallery(true);
                  }}
                  className="relative aspect-3/5 overflow-hidden rounded-2xl group"
                >
                  <Image
                    src={activeImages[3]}
                    alt={product.name}
                    fill
                    sizes="(max-width:768px) 100vw, 50vw"
                    className="object-cover brightness-50 transition duration-500"
                  />

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
                    <span className="text-5xl font-bold">
                      +{activeImages.length - 3}
                    </span>

                    <span className="mt-2 text-sm tracking-[0.25em] uppercase">
                      View All
                    </span>
                  </div>
                </button>
              )}
            </div>
          </div>

          {/* THUMBNAILS
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
          </div> */}
        </div>

        {/* DETAILS SECTION */}
        <div className="space-y-8">
          <div>
            <h1 className="text-3xl font-semibold text-[#5f5143]">
              {product.name}
            </h1>
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
                    className={`px-5 py-2 rounded-full border text-sm capitalize transition ${selectedVariant?.color === variant.color ? "bg-[#5f5143] text-white border-[#5f5143]" : "dark:text-[#5f5143] border-[#e6d8c8] hover:bg-[#f3e7d8]"}`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {selectedVariant?.designs?.length ? (
            <div>
              <p className="mb-3 text-sm font-medium text-[#5f5143]">Design</p>

              <div className="flex gap-3 flex-wrap">
                {selectedVariant.designs.map((design) => (
                  <button
                    key={design.design}
                    onClick={() => {
                      setSelectedDesign(design);
                      setSelectedImage(0);
                    }}
                    className={`px-5 py-2 rounded-full border text-sm transition ${
                      selectedDesign?.design === design.design
                        ? "bg-[#5f5143] text-white border-[#5f5143]"
                        : "dark:text-[#5f5143] border-[#e6d8c8] hover:bg-[#f3e7d8]"
                    }`}
                  >
                    {design.design}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

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
                    className={`px-5 py-2 rounded-full border border-[#e6d8c8] text-sm transition ${selectedSize === size ? "bg-[#5f5143] text-white border-[#5f5143]" : "dark:text-[#5f5143] hover:bg-[#f3e7d8]"} ${qty === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                  >
                    {size}
                    {stockMap[size] !== undefined && stockMap[size] < 10 && (
                      <span className="ml-2 text-xs text-red-500">
                        {stockMap[size]} left, Hurry!
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
            {selectedSize && (
              <p
                className={`mt-3 text-sm font-medium ${
                  (getStock(selectedSize) ?? 0) > 0
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {(getStock(selectedSize) ?? 0) > 0
                  ? (getStock(selectedSize) ?? 0) <= 10
                    ? `Only ${getStock(selectedSize)} left`
                    : "In Stock"
                  : "Out of Stock"}
              </p>
            )}
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
          {selectedSize && (getStock(selectedSize) ?? 0) > 0 ? (
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
              <button
                onClick={() => {
                  toast.success("Will be notified when restocked");
                }}
                className="flex-1 flex justify-center py-4 rounded-full bg-[#5f5143] text-white hover:bg-[#6a0f1f] transition disabled:opacity-40"
              >
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
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setShowProductDetails((prev) => !prev)}
              className="w-full flex items-center justify-between text-sm font-medium bg-[#2b2b2b10] dark:bg-white px-4 py-3 rounded-xl hover:bg-[#2b2b2b20] dark:hover:bg-[#ffffffc0] transition-all duration-300"
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
              className={`overflow-scroll scrollbar-hide transition-all duration-500 ${
                showProductDetails
                  ? "max-h-170 opacity-100 mt-6"
                  : "max-h-0 opacity-0"
              }`}
            >
              <div className="bg-gray-50 rounded-xl p-5 text-sm space-y-3">
                {/* TOP HIGHLIGHTS */}
                <h3 className="font-semibold text-2xl mb-2">Top Highlights</h3>

                <div className="flex gap-y-3 gap-x-6 text-gray-700">
                  <div className="flex flex-col gap-y-3 gap-x-6 ml-5 w-[45%]">
                    {product.productDetails?.material && (
                      <>
                        <span className="text-xl text-black">Material</span>
                        <ul className="ml-6 list-disc space-y-1 font-medium">
                          {product.productDetails.material
                            .split(",")
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ul>
                      </>
                    )}

                    <div className="mt-3">
                      <span className="text-xl text-black">Description</span>
                      <p
                        className={`ml-2 font-medium transition-all duration-300 ${!showFullDescription ? "line-clamp-3" : ""}`}
                      >
                        {product.description}
                      </p>

                      {product.description &&
                        product.description.length > 120 && (
                          <button
                            onClick={() =>
                              setShowFullDescription((prev) => !prev)
                            }
                            className="mt-2 text-sm font-medium text-[#6a0f1f] underline"
                          >
                            {showFullDescription ? "Show Less" : "Show More"}
                          </button>
                        )}
                    </div>

                    {product.productDetails?.closureType && (
                      <>
                        <span className="text-xl text-black">Closure Type</span>
                        <span className="ml-2 font-medium">
                          {product.productDetails.closureType}
                        </span>
                      </>
                    )}
                  </div>

                  <div className="flex flex-col gap-y-3 gap-x-6 ml-5 w-[45%]">
                    {product.productDetails?.careInstructions && (
                      <>
                        <span className="text-xl text-black">
                          Care Instructions
                        </span>
                        <ul className="ml-6 list-disc space-y-1 font-medium">
                          {product.productDetails.careInstructions
                            .split(",")
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ul>
                      </>
                    )}

                    {product.productDetails?.style && (
                      <>
                        <span className="text-xl text-black">Style</span>
                        <ul className="ml-6 list-disc space-y-1 font-medium">
                          {product.productDetails.style
                            .split(",")
                            .map((item, index) => (
                              <li key={index}>{item.trim()}</li>
                            ))}
                        </ul>
                      </>
                    )}

                    {product.productDetails?.pattern && (
                      <>
                        <span className="text-xl text-black">Pattern</span>
                        <span className="ml-2 font-medium">
                          {product.productDetails.pattern}
                        </span>
                      </>
                    )}

                    {product.productDetails?.countryOfOrigin && (
                      <>
                        <span className="text-xl text-black">
                          Country of Origin
                        </span>
                        <span className="ml-2 font-medium">
                          {product.productDetails.countryOfOrigin}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {/* ADDITIONAL INFO */}
                {(product.productDetails?.manufacturer ||
                  product.productDetails?.unitCount) && (
                  <>
                    <h3 className="font-semibold text-2xl mt-6 mb-2">
                      Additional Information
                    </h3>

                    <div className="flex gap-y-3 gap-x-6 text-gray-700">
                      <div className="flex flex-col gap-y-3 gap-x-6 ml-5">
                        {product.productDetails?.manufacturer && (
                          <>
                            <span className="text-xl text-black">
                              Manufacturer
                            </span>
                            <span className="ml-2 font-medium capitalize">
                              {product.productDetails.manufacturer}
                            </span>
                          </>
                        )}
                      </div>

                      <div className="flex flex-col gap-y-3 gap-x-6 ml-5">
                        {product.productDetails?.unitCount && (
                          <>
                            <span className="text-xl text-black">
                              Unit Count
                            </span>
                            <span className="ml-2 font-medium">
                              {product.productDetails.unitCount}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
      {showSizeGuide && (
        <div className="fixed h-full inset-0 bg-neutral-950/50 flex items-center justify-center z-50">
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

      <Dialog open={openGallery} onOpenChange={setOpenGallery}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden">
          <div className="grid lg:grid-cols-[90px_1fr] h-full">
            {/* Thumbnails */}

            <div className="hidden lg:flex flex-col gap-3 scrollbar-hide overflow-y-auto p-4 border-r">
              {activeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 ${
                    selectedImage === index
                      ? "border-[#5f5143]"
                      : "border-gray-200"
                  }`}
                >
                  <Image src={img} fill alt="" className="object-contain" />
                </button>
              ))}
            </div>

            {/* Main Image */}

            <div className="relative flex items-center justify-center overflow-hidden rounded-2xl">
              {/* Blurred Background */}
              <Image
                src={activeImages[selectedImage]}
                fill
                alt={selectedVariant.color}
                aria-hidden
                className="object-cover scale-100 opacity-100"
              />

              {/* Optional overlay for better contrast */}
              <div className="absolute inset-0 bg-white/40 dark:bg-neutral-950/30 backdrop-blur-sm rounded-xl" />

              {/* Main Product */}
              <div className="relative z-10 aspect-square w-full">
                <Image
                  src={activeImages[selectedImage]}
                  fill
                  alt={selectedVariant.color}
                  className="object-contain p-8"
                  priority
                />
              </div>

              {/* Left Button */}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? activeImages.length - 1 : prev - 1,
                  )
                }
                className="absolute left-6 z-20 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur dark:bg-neutral-900/80"
              >
                <ChevronLeft size={24} />
              </button>

              {/* Right Button */}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === activeImages.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-6 z-20 rounded-full bg-white/80 p-3 shadow-lg backdrop-blur dark:bg-neutral-900/80"
              >
                <ChevronRight size={24} />
              </button>

              {/* Counter */}
              <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-neutral-950/70 px-4 py-2 text-white backdrop-blur">
                {selectedImage + 1} / {activeImages.length}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
