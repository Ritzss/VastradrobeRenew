/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState, useMemo, useRef } from "react";
import {
  Plus,
  Minus,
  ChevronDown,
  ShieldCheck,
  Truck,
  RefreshCw,
  ChevronLeft,
  ChevronRight,
  X,
  Heart,
  Check,
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
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

// Import Swiper core styles
import "swiper/css";
import "swiper/css/pagination";
import { ProductReview, ReviewRating } from "@/Types/Reviews";
import ProductReviewForm from "./ProductReviewForm";
import GuestReviewForm from "./GuestReviewForm";

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

  const {
    addToCart,
    cartItems,
    removeFromCart,
    user,
    favCollections,
    addToCollection,
    removeFromCollection,
  } = useAppContext();

  const [pdpWishlistOpen, setPdpWishlistOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  // Review data loaded from VastraDrobe's review API.
  // Product information itself continues to come from IMS.
  const [reviews, setReviews] = useState<ProductReview[]>([]);

  const [reviewRating, setReviewRating] = useState<ReviewRating>({
    average: 0,
    count: 0,
    distribution: {
      5: 0,
      4: 0,
      3: 0,
      2: 0,
      1: 0,
    },
  });

  const [reviewLoading, setReviewLoading] = useState(true);
  const [reviewPage, setReviewPage] = useState(1);
  const [hasMoreReviews, setHasMoreReviews] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (
        pdpWishlistOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setPdpWishlistOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("touchstart", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("touchstart", handleClickOutside);
    };
  }, [pdpWishlistOpen]);

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
  const [selectedReviewPurchase, setSelectedReviewPurchase] =
    useState<ReviewPurchase | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [openGallery, setOpenGallery] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  type ReviewPurchase = {
    orderId: string;
    orderNumber: string;
    productId: number;
    variant: {
      color: string;
      design: string;
    };
    size: string;
    quantity: number;
    purchasedAt: string;
  };

  const [reviewedPurchases, setReviewedPurchases] = useState<
    (ReviewPurchase & {
      reviewId: string;
      rating: number;
      reviewedAt: string;
    })[]
  >([]);
  const [hasPurchasedProduct, setHasPurchasedProduct] = useState(false);
  const [eligiblePurchases, setEligiblePurchases] = useState<ReviewPurchase[]>(
    [],
  );
  const [eligibilityLoading, setEligibilityLoading] = useState(false);
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

  const isWishlisted = Object.values(favCollections || {}).some((set) =>
    set.has(productId),
  );

  // Helper to standardise display folder names
  const getDisplayFolderName = (colName: string) => {
    const lower = colName.trim().toLowerCase();
    if (
      lower === "favorites" ||
      lower === "default" ||
      lower === "my wishlist" ||
      lower === "default folder"
    ) {
      return "Default Folder";
    }
    return colName;
  };

  // Helper to standardise backend folder names
  const getBackendFolderName = (colName: string) => {
    const lower = colName.trim().toLowerCase();
    if (lower === "default folder") return "Favorites";
    return colName;
  };

  // Finds which folder currently contains this product (for single folder behavior!)
  const currentProductFolder = useMemo(() => {
    return (
      Object.entries(favCollections || {}).find(([_, set]) =>
        set.has(productId),
      )?.[0] || null
    );
  }, [favCollections, productId]);

  // Handles moving a product to a selected folder on the PDP (Single folder behavior!)
  const handleMoveToFolder = async (colName: string) => {
    setPdpWishlistOpen(false);

    const targetFolder = colName;
    const currentFolder = currentProductFolder;

    if (
      currentFolder &&
      getBackendFolderName(currentFolder).toLowerCase() ===
        getBackendFolderName(targetFolder).toLowerCase()
    ) {
      toast.info(`Already saved in ${getDisplayFolderName(colName)}`);
      return;
    }

    // 1. Add to the new selected folder
    await addToCollection(getBackendFolderName(targetFolder), productId);

    // 2. Remove from the current folder (if it exists)
    if (currentFolder) {
      await removeFromCollection(
        getBackendFolderName(currentFolder),
        productId,
      );
    }

    toast.success(`Moved to ${getDisplayFolderName(colName)}`);
  };

  const getStock = (size: string) => Number(stockMap[size] ?? 0);

  const handleCartToggle = () => {
    if (!selectedSize || !selectedVariant) return;
    if (getStock(selectedSize) <= 0) {
      toast.error("This size is out of stock.");
      return;
    }
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

  const loadReviews = async (page = 1, append = false) => {
    try {
      setReviewLoading(true);

      const res = await fetch(
        `/api/reviews?productId=${productId}&page=${page}&limit=10`,
      );

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Failed to load reviews");
      }

      // Replace the list for the first page.
      // Append additional reviews when the user clicks "Load More".
      setReviews((prev) =>
        append ? [...prev, ...(data.reviews || [])] : data.reviews || [],
      );

      setReviewRating(
        data.rating || {
          average: 0,
          count: 0,
          distribution: {
            5: 0,
            4: 0,
            3: 0,
            2: 0,
            1: 0,
          },
        },
      );

      setReviewPage(page);
      setHasMoreReviews(data.pagination?.hasNextPage ?? false);
    } catch (error) {
      console.error("Failed to load product reviews:", error);
    } finally {
      setReviewLoading(false);
    }
  };

  const loadReviewEligibility = async () => {
    try {
      setEligibilityLoading(true);

      const res = await fetch(`/api/reviews/eligible?productId=${productId}`, {
        credentials: "include",
      });

      const data = await res.json();

      if (!res.ok) {
        // A 401 simply means the visitor is not logged in.
        // This is not an error that needs to be shown to the customer.
        if (res.status === 401) {
          setEligiblePurchases([]);
          setReviewedPurchases([]);
          setHasPurchasedProduct(false);
          return;
        }

        throw new Error(data.message || "Failed to check review eligibility");
      }

      setEligiblePurchases(data.purchases || []);
      setReviewedPurchases(data.reviewedPurchases || []);
      setHasPurchasedProduct(data.hasPurchased ?? false);
    } catch (error) {
      console.error("Failed to check review eligibility:", error);

      setEligiblePurchases([]);
    } finally {
      setEligibilityLoading(false);
    }
  };

  useEffect(() => {
    loadReviewEligibility();
  }, [productId]);

  useEffect(() => {
    loadReviews(1, false);
  }, [productId]);

  const handleLoadMoreReviews = () => {
    if (reviewLoading || !hasMoreReviews) return;

    loadReviews(reviewPage + 1, true);
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
          <li className="text-neutral-800 font-bold truncate max-w-50 sm:max-w-xs">
            {product.name}
          </li>
        </ol>
      </nav>

      {/* 2. MAIN SECTION (Immersive columns layout) */}
      <section className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-start">
        {/* LEFT: IMAGES SHOWCASE (Carousel on Mobile/Tablet, Grid on Desktop) */}
        <div className="lg:col-span-7 w-full min-w-0 max-w-full overflow-hidden select-none">
          {/* ================= 📱 MOBILE & TABLET VIEW: Premium Swiper Carousel ================= */}
          <div className="block lg:hidden w-full relative aspect-3/4.5 sm:aspect-4/3 md:aspect-16/10 rounded-2xl overflow-hidden shadow-xs border border-neutral-100 dark:border-neutral-900 bg-[#faf9f6] dark:bg-neutral-950 min-w-0 max-w-full">
            <Swiper
              modules={[Pagination]}
              pagination={{ clickable: true }}
              loop={activeImages.length > 1}
              style={{ width: "100%", maxWidth: "100%" }}
              className="w-full h-full animate-fadeIn"
              spaceBetween={16}
              slidesPerView={1}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                768: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
              }}
            >
              {activeImages.map((image, index) => (
                <SwiperSlide
                  key={index}
                  className="relative w-full h-full overflow-hidden cursor-pointer"
                  onClick={() => {
                    setSelectedImage(index);
                    setOpenGallery(true);
                  }}
                >
                  <Image
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    fill
                    priority={index === 0}
                    className="object-cover object-top pointer-events-none"
                    sizes="100vw"
                    draggable={false}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {/* ================= 🖥️ DESKTOP VIEW: Default Grid Showcase ================= */}
          <div className="hidden lg:block space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {activeImages.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedImage(index);
                    setOpenGallery(true);
                  }}
                  className={`relative aspect-3/4.5 overflow-hidden rounded-xl bg-[#faf9f6] border border-neutral-100/50 cursor-zoom-in group ${
                    index === 0 ? "sm:col-span-2 aspect-3/4" : ""
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

            {/* PRODUCT RATING SUMMARY */}
            <div className="flex items-center gap-3 pt-1">
              {reviewRating.count > 0 ? (
                <>
                  {/* Display the actual calculated product rating */}
                  <div className="flex items-center gap-1">
                    <span className="text-sm font-semibold text-neutral-800">
                      {reviewRating.average.toFixed(1)}
                    </span>

                    <div
                      className="flex text-[#6A0F1F]"
                      aria-label={`${reviewRating.average} out of 5 stars`}
                    >
                      {[1, 2, 3, 4, 5].map((star) => (
                        <span key={star} className="text-sm">
                          {star <= Math.round(reviewRating.average) ? "★" : "☆"}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Link users directly to the review section */}
                  <button
                    type="button"
                    onClick={() => {
                      document
                        .getElementById("product-reviews")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }}
                    className="text-[10px] text-neutral-500 hover:text-[#6A0F1F] underline underline-offset-4 transition cursor-pointer"
                  >
                    {reviewRating.count}{" "}
                    {reviewRating.count === 1 ? "Review" : "Reviews"}
                  </button>
                </>
              ) : (
                <span className="text-[10px] uppercase tracking-widest text-neutral-400">
                  No reviews yet
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
                {product.variants.map((variant) => {
                  const isSelected = selectedVariant?.color === variant.color;

                  return (
                    <button
                      key={variant.color}
                      onClick={() => setSelectedVariant(variant)}
                      className={`px-5 py-2.5 rounded-sm border text-[10px] font-bold uppercase tracking-widest transition duration-200 cursor-pointer ${
                        isSelected
                          ? "bg-[#6A0F1F] text-white border-[#6A0F1F] dark:bg-[#e4e198] dark:text-neutral-950 dark:border-[#e4e198] shadow-sm"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300"
                      }`}
                    >
                      {variant.color}
                    </button>
                  );
                })}
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
                const isOutOfStock = qty === 0;
                const isSelected = selectedSize === size;

                return (
                  <button
                    key={size}
                    disabled={isOutOfStock}
                    onClick={() => setSelectedSize(size)}
                    className={`w-12 h-12 rounded-sm border flex items-center justify-center text-xs font-semibold tracking-wider transition duration-200 cursor-pointer ${
                      isSelected
                        ? "bg-[#6A0F1F] text-white border-[#6A0F1F] dark:bg-[#e4e198] dark:text-neutral-950 dark:border-[#e4e198] shadow-sm"
                        : isOutOfStock
                          ? "bg-neutral-200 dark:bg-neutral-900/50 border-neutral-400 dark:border-neutral-800 text-neutral-600 dark:text-neutral-700 opacity-35 cursor-not-allowed"
                          : "bg-white dark:bg-neutral-950 border-neutral-200 dark:border-neutral-800 hover:border-neutral-800 dark:hover:border-neutral-500 text-neutral-700 dark:text-neutral-300"
                    }`}
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

            {/* 💖 Premium Save to Wishlist Toggle (Floating Dropdown) */}
            <div ref={dropdownRef} className="relative w-full">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();

                  // 🔒 SECURITY/UX CHECK: If user is logged out, redirect them to the login screen
                  if (!user) {
                    toast.error("Please login to save items to your wishlist");
                    router.push("/account/login");
                    return;
                  }

                  setPdpWishlistOpen(!pdpWishlistOpen);
                }}
                className="w-full mt-4 py-3.5 border border-neutral-200 dark:border-neutral-800 hover:border-[#6A0F1F] dark:hover:border-[#e4e198] text-neutral-700 dark:text-neutral-300 bg-white dark:bg-neutral-950 text-xs font-semibold uppercase tracking-[0.2em] rounded-md transition duration-300 cursor-pointer flex items-center justify-center gap-2 select-none"
              >
                <Heart
                  size={14}
                  strokeWidth={1.5}
                  className={`transition-all duration-300 ${
                    isWishlisted
                      ? "fill-red-600 text-red-600 scale-105"
                      : "text-neutral-500"
                  }`}
                />
                <span>
                  {isWishlisted ? "Saved in Wishlist" : "Save to Wishlist"}
                </span>
                <ChevronDown
                  size={14}
                  className={`text-neutral-400 transition-transform duration-300 ${pdpWishlistOpen ? "rotate-180" : ""}`}
                />
              </button>

              {/* Wishlist Dropdown Overlay */}
              {pdpWishlistOpen && (
                <div className="absolute left-0 right-0 mt-1.5 bg-white dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-900 rounded-xl shadow-2xl p-4 z-30 text-left divide-y divide-neutral-100 dark:divide-neutral-900 select-none animate-fadeIn">
                  {/* Header */}
                  <div className="pb-2.5 text-left">
                    <p className="text-[8px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
                      Save to Wishlist folders
                    </p>
                  </div>

                  {/* Folders List (Single-selection list with ticks on the RIGHT side!) */}
                  <div className="py-2.5 space-y-1 max-h-36 overflow-y-auto custom-scroll text-left">
                    {Object.entries(favCollections || {}).map(([colName]) => {
                      const displayName = getDisplayFolderName(colName);
                      const isSelectedInThisFolder =
                        currentProductFolder &&
                        colName.toLowerCase() ===
                          currentProductFolder.toLowerCase();

                      return (
                        <button
                          key={colName}
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleMoveToFolder(colName);
                          }}
                          className="w-full flex items-center justify-between px-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-neutral-600 dark:text-neutral-400 hover:text-[#6A0F1F] dark:hover:text-[#e4e198] cursor-pointer text-left transition duration-200"
                        >
                          <span className="truncate pr-2 flex-1 text-left">
                            {displayName}
                          </span>
                          {isSelectedInThisFolder && (
                            <Check
                              size={10}
                              className="text-[#6A0F1F] dark:text-[#e4e198] shrink-0"
                              strokeWidth={2.5}
                            />
                          )}
                        </button>
                      );
                    })}
                  </div>

                  {/* Global Delete option (Only rendered if currently wishlisted!) */}
                  {isWishlisted && (
                    <div className="pt-2.5 text-left">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();

                          // Clear product from all folders globally
                          Object.keys(favCollections || {}).forEach(
                            (colName) => {
                              if (favCollections[colName].has(productId)) {
                                removeFromCollection(colName, productId);
                              }
                            },
                          );

                          setPdpWishlistOpen(false);
                          toast.error("Removed from wishlist");
                        }}
                        className="w-full flex items-center gap-2 px-1.5 py-2 text-[9px] font-bold uppercase tracking-widest text-red-600 hover:text-red-700 cursor-pointer text-left transition duration-200"
                      >
                        <X size={10} className="shrink-0" strokeWidth={2.5} />
                        <span className="flex-1 truncate text-left">
                          Remove from Wishlist
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
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
                3-Day Easy
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
                  easy, hassle-free 3-day returns on all un-worn items. Reach
                  out to our support at support@vastradrobe.com for any tracking
                  queries.
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* MODALS (Size Guide Modal) */}
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

      {/* 4. CUSTOMER REVIEWS */}
      <section
        id="product-reviews"
        className="border-t border-neutral-100 pt-16 scroll-mt-24"
      >
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.3em] uppercase mb-3">
              Customer Feedback
            </p>

            <h2 className="font-serif text-2xl sm:text-3xl text-neutral-800 uppercase tracking-wide">
              Customer Reviews
            </h2>
          </div>

          {reviewLoading ? (
            <div className="py-12 text-center text-xs text-neutral-400">
              Loading reviews...
            </div>
          ) : reviewRating.count === 0 ? (
            <div className="border border-neutral-100 rounded-xl p-10 text-center">
              <p className="text-sm text-neutral-600">No reviews yet.</p>

              <p className="text-xs text-neutral-400 mt-2">
                Be the first to review this product.
              </p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-[280px_1fr] gap-10">
                {/* Overall rating */}
                <div className="border border-neutral-100 rounded-xl p-8 text-center">
                  <p className="font-serif text-5xl text-neutral-800">
                    {reviewRating.average.toFixed(1)}
                  </p>

                  <div className="flex justify-center gap-1 mt-3 text-[#6A0F1F]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-lg">
                        {star <= Math.round(reviewRating.average) ? "★" : "☆"}
                      </span>
                    ))}
                  </div>

                  <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-3">
                    Based on {reviewRating.count}{" "}
                    {reviewRating.count === 1 ? "review" : "reviews"}
                  </p>
                </div>

                {/* Rating distribution */}
                <div className="space-y-3 flex flex-col justify-center">
                  {[5, 4, 3, 2, 1].map((rating) => {
                    const count =
                      reviewRating.distribution[
                        rating as keyof typeof reviewRating.distribution
                      ];

                    const percentage =
                      reviewRating.count > 0
                        ? (count / reviewRating.count) * 100
                        : 0;

                    return (
                      <div
                        key={rating}
                        className="flex items-center gap-3 text-xs"
                      >
                        <span className="w-8 text-neutral-500">{rating} ★</span>

                        <div className="flex-1 h-2 bg-neutral-100 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#6A0F1F] rounded-full transition-all duration-500"
                            style={{ width: `${percentage}%` }}
                          />
                        </div>

                        <span className="w-8 text-right text-neutral-400">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
              {/* INDIVIDUAL REVIEWS */}
              <div className="mt-14 border-t border-neutral-100 pt-10">
                <div className="space-y-8">
                  {reviews.map((review) => (
                    <article
                      key={review._id}
                      className="border-b border-neutral-100 pb-8 last:border-b-0"
                    >
                      {/* Reviewer information and rating */}
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-semibold text-neutral-800">
                              {review.isAnonymous
                                ? "Anonymous Customer"
                                : review.displayName}
                            </span>

                            {/* Only show this badge when the server has verified
                  that the reviewer actually purchased the product. */}
                            {review.verifiedPurchase && (
                              <span className="inline-flex items-center gap-1 text-[8px] font-bold uppercase tracking-wider text-green-700">
                                <Check size={10} strokeWidth={2.5} />
                                Verified Purchase
                              </span>
                            )}
                          </div>

                          <p className="text-[9px] text-neutral-400 mt-1">
                            {new Date(review.createdAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                              },
                            )}
                          </p>
                        </div>

                        {/* Review star rating */}
                        <div
                          className="flex gap-0.5 text-[#6A0F1F]"
                          aria-label={`${review.rating} out of 5 stars`}
                        >
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className="text-sm">
                              {star <= review.rating ? "★" : "☆"}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Review text */}
                      {review.comment && (
                        <p className="mt-4 text-xs sm:text-sm font-light text-neutral-600 leading-relaxed tracking-wide max-w-3xl">
                          {review.comment}
                        </p>
                      )}

                      {/* Variant reviewed */}
                      {(review.variant?.color || review.variant?.design) && (
                        <div className="flex flex-wrap gap-2 mt-4">
                          {review.variant.color && (
                            <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-100 rounded-sm text-[8px] uppercase tracking-wider text-neutral-500">
                              Color: {review.variant.color}
                            </span>
                          )}

                          {review.variant.design && (
                            <span className="px-2.5 py-1 bg-neutral-50 border border-neutral-100 rounded-sm text-[8px] uppercase tracking-wider text-neutral-500">
                              Design: {review.variant.design}
                            </span>
                          )}
                        </div>
                      )}
                    </article>
                  ))}
                </div>

                {/* Load more reviews */}
                {hasMoreReviews && (
                  <div className="flex justify-center mt-10">
                    <button
                      type="button"
                      onClick={handleLoadMoreReviews}
                      disabled={reviewLoading}
                      className="px-7 py-3 border border-neutral-200 hover:border-neutral-800 text-[9px] font-semibold uppercase tracking-[0.2em] text-neutral-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {reviewLoading ? "Loading..." : "Load More Reviews"}
                    </button>
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </section>

      {/* WRITE A REVIEW */}
      {!eligibilityLoading && eligiblePurchases.length > 0 && (
        <div className="mt-12">
          <div className="mb-6">
            <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
              Share Your Experience
            </p>

            <h3 className="font-serif text-xl text-neutral-800 mt-1">
              Write a Review
            </h3>

            <p className="text-xs text-neutral-400 mt-2">
              Your purchase has been verified. Select the version you purchased
              before writing your review.
            </p>
          </div>

          {/* --------------------------------------------------
        Purchased variant selector
        --------------------------------------------------
        A customer may have purchased multiple variants of the
        same product. We let them explicitly choose which one
        they are reviewing instead of guessing.
    */}
          <div className="space-y-3 mb-8">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
              Which version did you purchase?
            </p>

            <div className="grid sm:grid-cols-2 gap-3">
              {eligiblePurchases.map((purchase) => {
                const isSelected =
                  selectedReviewPurchase?.orderId === purchase.orderId &&
                  selectedReviewPurchase?.variant.color ===
                    purchase.variant.color &&
                  selectedReviewPurchase?.variant.design ===
                    purchase.variant.design;

                return (
                  <button
                    key={`${purchase.orderId}-${purchase.variant.color}-${purchase.variant.design}`}
                    type="button"
                    onClick={() => setSelectedReviewPurchase(purchase)}
                    className={`text-left border rounded-lg p-4 transition ${
                      isSelected
                        ? "border-[#6A0F1F] bg-[#6A0F1F]/5"
                        : "border-neutral-200 hover:border-neutral-400"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs font-semibold text-neutral-800">
                          {purchase.variant.color || "Default Color"}
                        </p>

                        {purchase.variant.design && (
                          <p className="text-[10px] text-neutral-500 mt-1">
                            Design: {purchase.variant.design}
                          </p>
                        )}

                        {purchase.size && (
                          <p className="text-[10px] text-neutral-400 mt-1">
                            Size: {purchase.size}
                          </p>
                        )}
                      </div>

                      {/* Visual selection indicator */}
                      <span
                        className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                          isSelected
                            ? "border-[#6A0F1F] bg-[#6A0F1F]"
                            : "border-neutral-300"
                        }`}
                      >
                        {isSelected && (
                          <Check
                            size={10}
                            className="text-white"
                            strokeWidth={3}
                          />
                        )}
                      </span>
                    </div>

                    <p className="text-[8px] uppercase tracking-wider text-neutral-400 mt-3">
                      Order #{purchase.orderNumber}
                    </p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --------------------------------------------------
        Review form
        --------------------------------------------------
        Only render the form after the customer chooses the
        exact purchased variant they want to review.
    */}
          {selectedReviewPurchase && (
            <ProductReviewForm
              productId={productId}
              orderId={selectedReviewPurchase.orderId}
              color={selectedReviewPurchase.variant.color}
              design={selectedReviewPurchase.variant.design}
              verifiedPurchase={true}
              onReviewSubmitted={() => {
                // Refresh the review list so the newly submitted review
                // appears immediately on the PDP.
                loadReviews(1, false);

                // Remove the reviewed purchase from the eligible list.
                loadReviewEligibility();

                // Clear the selected purchase after successful submission.
                setSelectedReviewPurchase(null);
              }}
            />
          )}
        </div>
      )}
      {/* ALREADY REVIEWED PURCHASES */}
      {reviewedPurchases.length > 0 && (
        <div className="mt-10 border border-neutral-100 rounded-xl p-6">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Your Reviews
          </p>

          <div className="mt-4 space-y-4">
            {reviewedPurchases.map((purchase) => (
              <div
                key={purchase.reviewId}
                className="flex items-center justify-between gap-4"
              >
                <div>
                  <p className="text-xs font-medium text-neutral-800">
                    {purchase.variant.color || "Default Color"}
                  </p>

                  {purchase.variant.design && (
                    <p className="text-[10px] text-neutral-400 mt-1">
                      Design: {purchase.variant.design}
                    </p>
                  )}
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#6A0F1F]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-xs">
                        {star <= purchase.rating ? "★" : "☆"}
                      </span>
                    ))}
                  </div>

                  <span className="text-[9px] text-green-700 font-semibold uppercase tracking-wider">
                    Reviewed
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      {/* UNVERIFIED REVIEW */}
{!eligibilityLoading &&
  !hasPurchasedProduct &&
  user && (
    <div className="mt-12">
      <div className="mb-6">
        <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
          Share Your Experience
        </p>

        <h3 className="font-serif text-xl text-neutral-800 mt-1">
          Write a Review
        </h3>

        <p className="text-xs text-neutral-400 mt-2">
          You can share your experience even if you haven&apos;t
          purchased this product.
        </p>
      </div>

      <ProductReviewForm
        productId={productId}
        color={selectedVariant?.color || ""}
        design={selectedDesign?.design || ""}
        verifiedPurchase={false}
        onReviewSubmitted={() => {
          loadReviews(1, false);
        }}
      />
    </div>
  )}
  {!user && (
  <GuestReviewForm
    productId={productId}
    color={selectedVariant?.color || ""}
    design={selectedDesign?.design || ""}
    onReviewSubmitted={() => {
      loadReviews(1, false);
    }}
  />
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
              <div className="relative z-10 aspect-3/4.5 w-full max-w-lg shadow-xl rounded-xl overflow-hidden bg-white">
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
