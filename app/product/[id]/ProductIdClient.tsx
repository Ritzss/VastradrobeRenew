/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useEffect, useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from "@/components/Global/ProductCard";
import { IoExitOutline } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { MdOutlineRemoveShoppingCart } from "react-icons/md";
import { FaCartArrowDown } from "react-icons/fa6";
import ScrollReveal from "@/components/Global/ScrollReveal";
import Link from "next/link";
import SizeGuideModal from "@/components/products/SizeGuideModal";
import { sizeGuide } from "@/lib/sizeGuide";
import { RiHeartFill } from "react-icons/ri";
import { Heart } from "lucide-react";

const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function ProductPDPClient({
  product,
  colorVariants,
  similarProducts,
  inventory,
}: {
  product: IMSProduct;
  colorVariants: IMSProduct[];
  similarProducts: IMSProduct[];
  inventory: any[];
}) {
  const router = useRouter();

  const productId = Number(product.productId);

  const {
    addToCart,
    showVariants,
    favCollections,
    addToCollection,
    removeFromCollection,
    cartItems,
    removeFromCart,
    showProductDeatils,
    setShowProductDeatils,
  } = useAppContext();
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || "/Assets/Images/Newplaceholder.png",
  );
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [showCollections, setShowCollections] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(
    null,
  );

  const [activeIndex, setActiveIndex] = useState(0);

  const sizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : FALLBACK_SIZES;

  const isInCart = cartItems.some(
    (item) => item.productId === productId && item.size === selectedSize,
  );

  const stockMap = inventory.reduce((acc: any, item: any) => {
    acc[item.size] = item.quantity;
    return acc;
  }, {});

  useEffect(() => {
    if (!inventory.length) return;

    const availableSize = sizes.find((size) => stockMap[size] > 0) || sizes[0];

    setSelectedSize((prevSize) =>
      prevSize === availableSize ? prevSize : availableSize,
    );
  }, [inventory, sizes, stockMap]);

  const guide = product.sizeChartType
    ? sizeGuide[product.sizeChartType] || []
    : [];

  const selectedSizeData = guide.find((row) => row.size === selectedSize);

  const getStock = (size: string) => stockMap[size] ?? null;

  const handleCartToggle = () => {
    if (!selectedSize) return;
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    isInCart
      ? removeFromCart(productId, selectedSize)
      : addToCart(productId, selectedSize);
  };
  const handleBuyNow = () => {
    router.push(
      `/checkout?buyNow=1&productId=${productId}&size=${selectedSize}&qty=1`,
    );
  };
  return (
    <div className="px-10 py-8 flex flex-col gap-16">
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
      <section className="lg:flex md:block sm:block gap-7">
        <div className="flex relative md:flex-row flex-col-reverse gap-14">
          {/* THUMBNAILS */}
          <div className="hidden md:flex flex-col gap-3 lg:w-[14%] w-[20%] ">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="relative h-[14vh] sm:m-1  rounded-lg overflow-hidden border"
              >
                <Image src={img} fill sizes="photo" alt={`${product.name}`} />
              </button>
            ))}
          </div>
          {/* Phone Image */}
          <div
            className="flex md:hidden relative gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide"
            onScroll={(e) => {
              const scrollLeft = e.currentTarget.scrollLeft;
              const width = e.currentTarget.clientWidth;
              const index = Math.round(scrollLeft / width);
              setActiveIndex(index);
            }}
          >
            {(product.images || []).map((img, i) => (
              <div
                key={i}
                className="relative min-w-full h-[70vh] snap-center rounded-xl overflow-hidden border bg-neutral-100"
              >
                <Image
                  src={img}
                  fill
                  alt={product.name}
                  className="object-cover"
                />
              </div>
            ))}
          </div>
          <div className="md:hidden absolute bottom-[2%] left-[37%] z-1 flex justify-center gap-2 mt-4">
            {(product.images || []).map((_, i) => (
              <div
                key={i}
                className={`h-2 w-2 rounded-full transition-all duration-300 ${
                  i === activeIndex ? "bg-[#cd0000] w-4" : "bg-gray-300"
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
          {/* fav button */}
      <span
        className="absolute top-1.5 right-1 cursor-pointer text-center mx-auto hover:translate-y-1 rounded-full duration-500 transition-all bg-[#EEDDC7] p-1"
        onClick={() => {
          const collectionNames = Object.keys(favCollections);

          if (selectedCollection) {
            removeFromCollection(selectedCollection, productId);
            setSelectedCollection(null);
            setShowCollections(false);
            return;
          }

          // 🔥 If only one collection → auto add
          if (collectionNames.length === 1) {
            const defaultCollection = collectionNames[0];
            addToCollection(defaultCollection, productId);
            setSelectedCollection(defaultCollection);
            return;
          }

          // 👇 If multiple collections → show dropdown
          setShowCollections((prev) => !prev);
        }}
      >
        {selectedCollection ? (
          <RiHeartFill size={22} className="text-[#ff0000]" />
        ) : (
          <Heart size={22} />
        )}
      </span>

        </div>

        {/* DETAILS */}
        <div className={`flex flex-col gap-6 lg:w-[40%] overflow-hidden`}>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-gray-600">{product.description}</p>

          <div className="text-2xl font-semibold">
            ₹{product.price}
            {product.mrp && (
              <span className="text-[#008000] relative left-0 bottom-3 p-[0.35rem] rounded-md text-lg">
                {Math.floor((product.price * 100) / product.mrp)}% OFF
              </span>
            )}
            {product.mrp && (
              <span className="ml-3 text-sm line-through text-gray-400">
                ₹{product.mrp}
              </span>
            )}
          </div>

          <div
            className={`${showVariants ? "opacity-100" : "opacity-0"} relative transition-all duration-300`}
          >
            <div
              className={`${showVariants ? "relative" : "absolute -z-5 translate-x-200 overflow-hidden"} transition-all duration-2000`}
            >
              {/* COLORS */}
              {colorVariants.length > 1 && (
                <div>
                  <p className="font-medium mb-2">Colors</p>
                  <div className="flex gap-3 flex-wrap">
                    {colorVariants.map((v) => (
                      <a
                        key={v.productId}
                        href={`/product/${v.productId}`}
                        className={`  rounded-lg px-3 py-2 text-sm capitalize ${
                          v.productId === product.productId
                            ? "text-[#6a0f1f]"
                            : "text-gray-500"
                        }`}
                      >
                        {v.color?.[0] || `variant`}
                      </a>
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
                        } 
                          ${qty === 0 ? "opacity-40 cursor-not-allowed" : ""}`}
                      >
                        {size}
                        {stockMap[size] !== undefined &&
                          stockMap[size] < 15 && (
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
            </div>
          </div>

          {/* Buttons */}
          <div className="flex duration-500 gap-1 transition-all ">
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

          {/* PRODUCT DETAILS */}
          <div className="mt-6 border-t pt-6">
            <button
              onClick={() => setShowProductDeatils((prev) => !prev)}
              className="w-full flex items-center justify-between text-sm font-medium bg-[#2b2b2b10] px-4 py-3 rounded-xl hover:bg-[#2b2b2b20] transition-all duration-300"
            >
              <span>
                {showProductDeatils
                  ? "Hide Product Details"
                  : "View Product Details"}
              </span>

              <IoIosArrowDown
                size={20}
                className={`transition-transform duration-300 ${
                  showProductDeatils ? "rotate-180" : "rotate-0"
                }`}
              />
            </button>

            <div
              className={`overflow-hidden transition-all duration-500 ${
                showProductDeatils
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
        </div>
      </section>

      {/* 📂 COLLECTION DROPDOWN */}
      {showCollections && !selectedCollection && (
        <div className="absolute bubble top-3 flex flex-col z-50 right-8 mt-2 bg-white text-[#6a0f1f] border rounded-lg shadow-lg">
          {Object.keys(favCollections).map((collection) => (
            <div
              key={collection}
              onClick={(e) => {
                e.stopPropagation(); // 🚫 prevent heart click
                addToCollection(collection, productId);
                setSelectedCollection(collection);
                setShowCollections(false);
              }}
              className="px-4 py-2  text-sm hover:bg-[#6a0f1f] hover:text-white hover:rounded-xl cursor-pointer whitespace-nowrap"
            >
              {collection}
            </div>
          ))}
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
