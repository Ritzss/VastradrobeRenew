"use client";

import Image from "next/image";
import { IMSProduct } from "@/Types/Product";
import { useAppContext } from "@/hooks/useAppContext";
import { useState } from "react";
import { IoIosArrowDown } from "react-icons/io";
import ProductCard from "@/components/Global/ProductCard";

const FALLBACK_SIZES = ["S", "M", "L", "XL"];

export default function ProductPDPClient({
  product,
  colorVariants,
  similarProducts,
}: {
  product: IMSProduct;
  colorVariants: IMSProduct[];
  similarProducts: IMSProduct[];
}) {
  const { addToCart } = useAppContext();
  const {
    showVariants,
    setShowVariants,
    showProductDeatils,
    setShowProductDeatils,
  } = useAppContext();
  const [activeImage, setActiveImage] = useState(
    product.images?.[0] || "/Assets/Images/Newplaceholder.png",
  );
  const [selectedSize, setSelectedSize] = useState(
    product.sizes?.[0] || "FREE",
  );

  const sizes =
    product.sizes && product.sizes.length > 0 ? product.sizes : FALLBACK_SIZES;

  return (
    <div className="px-10 py-8 flex flex-col gap-16">
      {/* TOP SECTION */}
      <section className="lg:flex md:block sm:block gap-7">
        <div className="flex gap-14">
          {/* THUMBNAILS */}
          <div className="flex flex-col gap-3 lg:w-[14%] w-[20%] ">
            {(product.images || []).map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImage(img)}
                className="relative h-[14vh] rounded-lg overflow-hidden border"
              >
                <Image src={img} fill alt="" />
              </button>
            ))}
          </div>

          {/* MAIN IMAGE */}
          <div className="relative lg:w-[69%] w-[90%] h-[87vh] aspect-4/4 bg-neutral-100 rounded-xl overflow-hidden">
            <Image
              src={activeImage}
              fill
              alt={product.name}
              className="object-contain"
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
              <span className="ml-3 text-sm line-through text-gray-400">
                ₹{product.mrp}
              </span>
            )}
          </div>

          {colorVariants.length > 1 && sizes.length > 1 && (
            <button
              onClick={() => setShowVariants((prev) => !prev)}
              className="text-sm font-medium flex items-center gap-2 underline w-fit bg-[#2b2b2b6c] p-3 rounded-lg hover:bg-[#2b2b2b88]"
            >
              {showVariants ? "Hide Variants" : "View Variants"}
              <IoIosArrowDown
                size={22}
                className={`${showVariants ? "rotate-0" : "rotate-180"} transition-all duration-700`}
              />
            </button>
          )}

          <div
            className={`${showVariants ? "opacity-100" : "opacity-0"} relative transition-all duration-1000`}
          >
            <div
              className={`${showVariants ? "relative" : "absolute -z-5 -translate-y-200"} transition-all duration-2000`}
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
                            ? "text-black"
                            : "text-gray-300"
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
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 rounded-lg border ${
                        selectedSize === size
                          ? "bg-black text-white"
                          : "hover:bg-black hover:text-white"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ADD TO CART */}
          <button
            onClick={() => addToCart(product.productId, selectedSize)}
            className="mt-4 px-8 py-3 bg-black text-white rounded-lg hover:scale-[1.02] transition"
          >
            Add to Cart
          </button>

          {/* PRODUCT DETAILS */}
          <button
            onClick={() => setShowProductDeatils((prev) => !prev)}
            className="text-sm font-medium flex items-center gap-2 underline w-fit bg-[#2b2b2b6c] p-3 rounded-lg hover:bg-[#2b2b2b88]"
          >
            {showProductDeatils
              ? "Hide Product Details"
              : "View Product Details"}
            <IoIosArrowDown
              size={22}
              className={`${showProductDeatils ? "rotate-0" : "rotate-180"} transition-all duration-700`}
            />
          </button>
          <div
            className={`${showProductDeatils ? "opacity-100" : "opacity-0"} transition-all duration-700 mt-6 border-t pt-4 text-sm text-gray-700 space-y-2`}
          >
            <p>
              <strong>Material:</strong> {product.material || "Cotton Blend"}
            </p>
            <p>
              <strong>Fit:</strong> Regular Fit
            </p>
            <p>
              <strong>Care:</strong> Machine wash cold
            </p>
            <p>
              <strong>Country of Origin:</strong> India
            </p>
          </div>
        </div>
      </section>

      {/* SIMILAR PRODUCTS */}
      {similarProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-semibold mb-4">Similar Products</h2>
          <div className="flex gap-6 overflow-x-auto pb-4">
            {similarProducts.slice(0, 8).map((p) => (
              <div key={p.productId} className="min-w-80">
                <ProductCard product={p} className="w-full" />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
