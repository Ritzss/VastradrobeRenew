/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState, useMemo } from "react";
import {
  Plus,
  Minus,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  ArrowRight,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
} from "lucide-react";
import ProductCard from "@/components/Global/ProductCard";
import { useRouter, useSearchParams } from "next/navigation";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Link from "next/link";
import { sizeGuide } from "@/lib/sizeGuide";
import SizeGuideModal from "@/components/products/SizeGuideModal";
import { toast } from "sonner";
import { fbPixel } from "@/lib/facebookpixel";
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

  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>(
    {
      story: true,
      details: false,
      shipping: false,
    },
  );

  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const { setMessage } = useWhatsApp();

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

  const guide = product.sizeChartType
    ? (sizeGuide as Record<string, { size: string }[]>)[
        product.sizeChartType
      ] || []
    : [];

  const selectedSizeData = guide.find((row) => row.size === selectedSize);

  const activeImages = selectedDesign?.images?.length
    ? selectedDesign.images
    : selectedVariant?.images || [];

  const sizes = selectedDesign?.sizes?.length
    ? selectedDesign.sizes
    : selectedVariant?.sizes?.length
      ? selectedVariant.sizes
      : FALLBACK_SIZES;

  const stockMap = useMemo(() => {
    return inventory.reduce((acc: any, item: any) => {
      acc[item.size] = item.quantity;
      return acc;
    }, {});
  }, [inventory]);

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

  const getStock = (size: string) => stockMap[size] ?? null;

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;
    isInCart
      ? removeFromCart(productId, selectedSize, selectedVariant.color)
      : addToCart(productId, selectedSize, selectedVariant.color);
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

  const toggleAccordion = (key: string) => {
    setOpenAccordions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-16">
      {/* 1. BREADCRUMB (Premium uppercase minimalist typography) */}
      <nav className="text-[10px] uppercase tracking-[0.25em] text-neutral-400 font-semibold border-b border-neutral-50 pb-5">
        <ol className="flex flex-wrap items-center gap-2">
          <li>
            <Link href="/" className="hover:text-neutral-800 transition">
              Home
            </Link>
          </li>
          <li>
            <span className="text-neutral-300">/</span>
          </li>
          <li>
            <Link
              href={`/${categorySlug}`}
              className="hover:text-neutral-800 transition"
            >
              {categoryLabel}
            </Link>
          </li>
          <li>
            <span className="text-neutral-300">/</span>
          </li>
          <li className="text-neutral-800 font-bold truncate max-w-[200px] sm:max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* 2. MAIN SECTION (Immersive columns layout) */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT: GRID IMAGES SHOWCASE (2 Columns of high-definition images on desktop, clean grid layout) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeImages.map((image, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedImage(index);
                  setOpenGallery(true);
                }}
                className={`relative aspect-[3/4.5] overflow-hidden rounded-xl bg-[#faf9f6] border border-neutral-100/50 cursor-zoom-in group ${
                  index === 0 ? "sm:col-span-2 aspect-[3/4]" : ""
                }`}
              >
                <Image
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  className="object-cover object-top transition duration-700 ease-out group-hover:scale-102"
                />
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: DETAILS & PURCHASING CONTROLS */}
        <div className="lg:col-span-5 space-y-8 sticky top-28">
          {/* Product Header details */}
          <div className="space-y-4">
            <h1 className="font-serif text-2xl sm:text-3xl font-light text-neutral-800 tracking-wide uppercase leading-tight">
              {product.name}
            </h1>

            <div className="flex items-baseline gap-4 pt-1 border-b border-neutral-100 pb-5">
              <span className="font-serif text-2xl font-semibold text-[#6A0F1F]">
                ₹{product.price}
              </span>
              {product.mrp && (
                <span className="text-sm font-light text-neutral-400 line-through">
                  MRP ₹{product.mrp}
                </span>
              )}
            </div>
          </div>

          {/* COLOR SWATCHES (Sleek, minimalist outline buttons) */}
          {product.variants.length > 1 && (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Select Color
              </p>
              <div className="flex gap-2 flex-wrap">
                {product.variants.map((variant) => (
                  <button
                    key={variant.color}
                    onClick={() => setSelectedVariant(variant)}
                    className={`px-5 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                      selectedVariant?.color === variant.color
                        ? "bg-[#6A0F1F] text-white border-[#6A0F1F]"
                        : "bg-white border-neutral-200 hover:border-neutral-800 text-neutral-700"
                    }`}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* DESIGN SWATCHES */}
          {selectedVariant?.designs?.length ? (
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Select Design
              </p>
              <div className="flex gap-2 flex-wrap">
                {selectedVariant.designs.map((design) => (
                  <button
                    key={design.design}
                    onClick={() => {
                      setSelectedDesign(design);
                      setSelectedImage(0);
                    }}
                    className={`px-5 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                      selectedDesign?.design === design.design
                        ? "bg-[#6A0F1F] text-white border-[#6A0F1F]"
                        : "bg-white border-neutral-200 hover:border-neutral-800 text-neutral-700"
                    }`}
                  >
                    {design.design}
                  </button>
                ))}
              </div>
            </div>
          ) : null}

          {/* SIZES SELECTOR */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                Select Size
              </p>
              <button
                onClick={() => setShowSizeGuide(true)}
                className="text-[9px] uppercase tracking-widest font-semibold text-[#6A0F1F] hover:underline underline-offset-4 cursor-pointer"
              >
                Size Guide
              </button>
            </div>

            <div className="flex gap-2.5 flex-wrap">
              {sizes.map((size) => {
                const qty = getStock(size);
                return (
                  <button
                    key={size}
                    disabled={qty === 0}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-sm border flex items-center justify-center text-xs font-semibold tracking-wider transition duration-200 cursor-pointer ${
                      selectedSize === size
                        ? "bg-[#6A0F1F] text-white border-[#6A0F1F]"
                        : "bg-white border-neutral-200 hover:border-neutral-800 text-neutral-700"
                    } ${qty === 0 ? "opacity-35 cursor-not-allowed bg-neutral-50 border-neutral-100" : ""}`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>

            {selectedSize && (
              <div className="flex items-center justify-between text-xs pt-1">
                {stockMap[selectedSize] > 0 ? (
                  <span className="text-green-600 font-medium">
                    ✓ Item In Stock
                  </span>
                ) : (
                  <span className="text-red-500 font-medium">
                    ✕ Out of Stock
                  </span>
                )}
                {stockMap[selectedSize] > 0 && stockMap[selectedSize] < 10 && (
                  <span className="text-red-500 font-semibold animate-pulse">
                    Only {stockMap[selectedSize]} left, Order soon!
                  </span>
                )}
              </div>
            )}

            {/* Custom sizing measurements */}
            {selectedSizeData && (
              <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50/50 text-xs space-y-2 mt-2">
                <h4 className="font-semibold uppercase tracking-wider text-neutral-800 text-[10px]">
                  Size {selectedSize} Guide measurements (Inches)
                </h4>
                <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 pt-1 text-neutral-600">
                  {Object.entries(selectedSizeData).map(([key, value]) => {
                    if (key === "size") return null;
                    return (
                      <div
                        key={key}
                        className="flex justify-between border-b border-neutral-100/50 pb-1"
                      >
                        <span className="capitalize text-neutral-400 font-medium">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="font-bold text-neutral-800">
                          {value}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* CALL-TO-ACTION BUTTONS */}
          <div className="pt-2">
            {(product?.stock ?? 0) > 0 ? (
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  disabled={!selectedSize}
                  onClick={handleCartToggle}
                  className={`flex-1 py-4 text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition duration-300 cursor-pointer ${
                    isInCart
                      ? "bg-red-600 text-white hover:bg-red-700"
                      : "bg-[#6A0F1F] text-white hover:bg-neutral-900 shadow-md"
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {isInCart ? "Remove from Bag" : "Add to Bag"}
                </button>

                <button
                  disabled={!selectedSize}
                  onClick={handleBuyNow}
                  className="flex-1 py-4 border border-neutral-300 hover:border-neutral-800 text-neutral-800 bg-white hover:bg-neutral-50 text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition duration-300 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Buy It Now
                </button>
              </div>
            ) : (
              <button
                onClick={() =>
                  toast.success(
                    "You will be notified as soon as this item is restocked!",
                  )
                }
                className="w-full py-4 bg-neutral-900 text-white text-xs font-semibold uppercase tracking-widest rounded-md hover:bg-black transition cursor-pointer"
              >
                Notify Me When Available (Sold Out)
              </button>
            )}
          </div>

          {/* SECURITY & TRUST MARKS */}
          <div className="grid grid-cols-3 gap-4 border-t border-neutral-100 pt-6 text-[10px] font-bold text-neutral-500 uppercase tracking-widest text-center">
            <div className="flex flex-col items-center gap-1.5">
              <Truck size={15} className="text-neutral-400" />
              <p className="leading-tight">
                Free shipping
                <br />
                <span className="text-neutral-400 font-medium">Over ₹999</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-1.5 border-x border-neutral-100">
              <RefreshCw size={15} className="text-neutral-400" />
              <p className="leading-tight">
                7-Day Easy
                <br />
                <span className="text-neutral-400 font-medium">Returns</span>
              </p>
            </div>
            <div className="flex flex-col items-center gap-1.5">
              <ShieldCheck size={15} className="text-neutral-400" />
              <p className="leading-tight">
                100% Secure
                <br />
                <span className="text-neutral-400 font-medium">Checkouts</span>
              </p>
            </div>
          </div>

          {/* 3. LUXURY ACCORDIONS (FAQ-Style minimal border dividers) */}
          <div className="border-t border-neutral-100 pt-3">
            {/* ACCORDION 1: Product Story */}
            {product.description && (
              <div className="border-b border-neutral-100 py-4">
                <button
                  onClick={() => toggleAccordion("story")}
                  className="w-full flex items-center justify-between text-left text-neutral-800 font-semibold uppercase tracking-widest text-[10px] cursor-pointer"
                >
                  <span>Product Story</span>
                  {openAccordions.story ? (
                    <Minus size={12} />
                  ) : (
                    <Plus size={12} />
                  )}
                </button>
                {openAccordions.story && (
                  <p className="mt-4 text-xs font-light text-neutral-600 leading-relaxed font-sans tracking-wide">
                    {product.description}
                  </p>
                )}
              </div>
            )}

            {/* ACCORDION 2: Fabric & Care */}
            <div className="border-b border-neutral-100 py-4">
              <button
                onClick={() => toggleAccordion("details")}
                className="w-full flex items-center justify-between text-left text-neutral-800 font-semibold uppercase tracking-widest text-[10px] cursor-pointer"
              >
                <span>Fabric & Care Details</span>
                {openAccordions.details ? (
                  <Minus size={12} />
                ) : (
                  <Plus size={12} />
                )}
              </button>
              {openAccordions.details && (
                <div className="mt-4 text-xs font-light text-neutral-600 leading-relaxed font-sans tracking-wide space-y-4">
                  {product.productDetails?.material && (
                    <div className="space-y-1">
                      <span className="font-bold uppercase tracking-wider text-neutral-700 text-[9px]">
                        Material:
                      </span>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.productDetails.material
                          .split(",")
                          .map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {product.productDetails?.careInstructions && (
                    <div className="space-y-1">
                      <span className="font-bold uppercase tracking-wider text-neutral-700 text-[9px]">
                        Care Instructions:
                      </span>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.productDetails.careInstructions
                          .split(",")
                          .map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  )}

                  {product.productDetails?.pattern && (
                    <div>
                      <span className="font-bold uppercase tracking-wider text-neutral-700 text-[9px]">
                        Pattern:
                      </span>
                      <span className="ml-2 capitalize">
                        {product.productDetails.pattern}
                      </span>
                    </div>
                  )}

                  {product.productDetails?.style && (
                    <div className="space-y-1">
                      <span className="font-bold uppercase tracking-wider text-neutral-700 text-[9px]">
                        Style:
                      </span>
                      <ul className="list-disc pl-5 space-y-1">
                        {product.productDetails.style
                          .split(",")
                          .map((item, index) => (
                            <li key={index}>{item.trim()}</li>
                          ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* ACCORDION 3: Additional Shipping details */}
            <div className="border-b border-neutral-100 py-4">
              <button
                onClick={() => toggleAccordion("shipping")}
                className="w-full flex items-center justify-between text-left text-neutral-800 font-semibold uppercase tracking-widest text-[10px] cursor-pointer"
              >
                <span>Shipping & Returns</span>
                {openAccordions.shipping ? (
                  <Minus size={12} />
                ) : (
                  <Plus size={12} />
                )}
              </button>
              {openAccordions.shipping && (
                <p className="mt-4 text-xs font-light text-neutral-600 leading-relaxed font-sans tracking-wide">
                  Each garment is thoughtfully handcrafted with care inside
                  India. Default delivery takes 5–7 business days. We offer
                  easy, hassle-free 7-day returns on all un-worn items. Reach
                  out to our support at support@vastradrobe.com for any tracking
                  queries.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 4. MODALS (Size Guide Modal) */}
      {showSizeGuide && (
        <div className="fixed h-full inset-0 bg-neutral-950/40 backdrop-blur-xs flex items-center justify-center z-50 animate-fadeIn">
          <div className="bg-white p-6 rounded-2xl max-w-2xl w-[90vw] relative shadow-2xl border border-neutral-100">
            <button
              onClick={() => setShowSizeGuide(false)}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-neutral-50 text-neutral-400 hover:text-black transition cursor-pointer"
              aria-label="Close Size Guide"
            >
              <X size={18} />
            </button>
            <SizeGuideModal product={product} />
          </div>
        </div>
      )}

      {/* 5. SIMILAR PRODUCTS SHOWCASE (Geometric elegant card listings) */}
      {similarProducts.length > 0 && (
        <ScrollReveal>
          <section className="pt-16 border-t border-neutral-100">
            <h2 className="font-serif text-2xl text-neutral-800 mb-12 text-center uppercase tracking-wide">
              You May Also Like
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
              {similarProducts.slice(0, 4).map((p) => (
                <ProductCard Linked key={p.productId} product={p} />
              ))}
            </div>
          </section>
        </ScrollReveal>
      )}

      {/* 6. IMMERSIVE LIGHTBOX GALLERY */}
      <Dialog open={openGallery} onOpenChange={setOpenGallery}>
        <DialogContent className="max-w-7xl w-[95vw] h-[95vh] p-0 overflow-hidden rounded-2xl border-none">
          <div className="grid lg:grid-cols-[100px_1fr] h-full bg-white">
            {/* Thumbnails Sidebar */}
            <div className="hidden lg:flex flex-col gap-3 scrollbar-hide overflow-y-auto p-4 border-r border-neutral-100">
              {activeImages.map((img, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImage(index)}
                  className={`relative w-16 h-20 rounded-lg overflow-hidden border-2 transition duration-200 cursor-pointer ${
                    selectedImage === index
                      ? "border-[#6A0F1F]"
                      : "border-neutral-100 hover:border-neutral-400"
                  }`}
                >
                  <Image src={img} fill alt="" className="object-cover" />
                </button>
              ))}
            </div>

            {/* Main Lightbox Product Display */}
            <div className="relative flex items-center justify-center overflow-hidden">
              <Image
                src={activeImages[selectedImage]}
                fill
                alt={selectedVariant.color}
                aria-hidden
                className="object-cover blur-md opacity-25 scale-105"
              />
              <div className="absolute inset-0 bg-white/30 backdrop-blur-xs" />

              {/* Central high-definition image */}
              <div className="relative z-10 aspect-[3/4.5] w-full max-w-lg shadow-xl rounded-xl overflow-hidden bg-white">
                <Image
                  src={activeImages[selectedImage]}
                  fill
                  alt={selectedVariant.color}
                  className="object-cover"
                  priority
                />
              </div>

              {/* Slider Left Arrow */}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === 0 ? activeImages.length - 1 : prev - 1,
                  )
                }
                className="absolute left-6 z-20 rounded-full bg-white/95 p-3 shadow-lg hover:bg-white transition cursor-pointer text-neutral-800"
              >
                <ChevronLeft size={20} strokeWidth={1.5} />
              </button>

              {/* Slider Right Arrow */}
              <button
                onClick={() =>
                  setSelectedImage((prev) =>
                    prev === activeImages.length - 1 ? 0 : prev + 1,
                  )
                }
                className="absolute right-6 z-20 rounded-full bg-white/95 p-3 shadow-lg hover:bg-white transition cursor-pointer text-neutral-800"
              >
                <ChevronRight size={20} strokeWidth={1.5} />
              </button>

              {/* Slide Index Counter indicator */}
              <div className="absolute bottom-6 left-1/2 z-20 -translate-x-1/2 rounded-full bg-neutral-900/80 px-4 py-1.5 text-[10px] tracking-widest font-bold text-white uppercase backdrop-blur-xs">
                {selectedImage + 1} / {activeImages.length}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
