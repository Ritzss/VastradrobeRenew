/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { SHOP_BY_COLORS } from "@/lib/shopByColors";
import { IMSProduct } from "@/Types/Product";

type Props = {
  products: IMSProduct[];
};

/**
 * 👑 LUXURY REDESIGN: Shop By Color (Nangalia Ruchira Theme)
 * 
 * We completely overhauled the blocky masonry image grid into an ultra-premium, 
 * clean, and modern **Circular Editorial Swatches Grid**:
 * - Displays a perfectly centered row of 6 large, pristine circular swatches.
 * - Each circular card dynamically extracts the actual high-definition apparel image of that color from your products database.
 * - On hover, a soft scale zoom triggers alongside a refined overlay.
 * - Below each circle, a tracked minimalist name label ("SAGE GREEN", "COCOA BROWN") is displayed 
 *   with its solid-color bubble indicator.
 */
export default function ShopByColor({ products }: Props) {
  
  // Custom mapping for color indicators inside the circles
  const colorMapHex: Record<string, string> = {
    black: "#111111",
    blue: "#1e3a8a",
    brown: "#543d2b",
    green: "#4f5e3e",
    pink: "#dfb0b7",
    white: "#f7f5f0",
  };

  const formattedColors = useMemo(() => {
    return SHOP_BY_COLORS.map((colorObj) => {
      // Find the first live product matching this color's variants
      const matchingProduct = products.find((product) =>
        product.variants?.some((variant: any) =>
          colorObj.variants.some((v) => v.toLowerCase() === variant.color.toLowerCase()),
        ),
      );

      // Extract the correct color variant image
      let displayImage = "/Assets/Images/Newplaceholder.png";
      if (matchingProduct) {
        const matchingVariant = matchingProduct.variants.find((variant: any) =>
          colorObj.variants.some((v) => v.toLowerCase() === variant.color.toLowerCase()),
        ) ?? matchingProduct.variants[0];

        displayImage = matchingVariant.designs?.[0]?.images?.[0] ?? matchingVariant.images?.[0] ?? displayImage;
      }

      return {
        ...colorObj,
        displayImage,
        hex: colorMapHex[colorObj.name.toLowerCase()] ?? "#cccccc",
      };
    });
  }, [products]);

  return (
    <section className="py-20 bg-[#fcfbfa] dark:bg-black border-b border-neutral-100 dark:border-neutral-900 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* HEADER BLOCK (Premium uppercase tracked styling) */}
        <div className="text-center mb-16 space-y-1">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Color Palettes
          </p>

          <h2 className="font-serif text-3xl sm:text-4xl font-light text-neutral-800 dark:text-white tracking-wide uppercase">
            Shop By Color
          </h2>
        </div>

        {/* CIRCULAR EDITORIAL SWATCHES ROW (Centered & Fully Responsive) */}
        <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-10 md:gap-14">
          {formattedColors.map((colorObj) => (
            <Link
              key={colorObj.name}
              href={`/shop-by-color/${colorObj.name.toLowerCase()}`}
              className="group flex flex-col items-center text-center space-y-4 shrink-0"
            >
              {/* 1. Immersive Circular Editorial Card with smooth S-curve scaling */}
              <div className="relative w-32 h-32 sm:w-40 sm:h-40 md:w-44 md:h-44 rounded-full overflow-hidden border border-neutral-100 dark:border-neutral-900 bg-neutral-50 shadow-xs group transition duration-500 ease-out">
                <Image
                  src={colorObj.displayImage}
                  alt={colorObj.name}
                  fill
                  sizes="(max-width: 768px) 150px, 200px"
                  className="object-cover object-top transition-transform duration-700 ease-out group-hover:scale-105"
                />
                
                {/* Micro overlay that softens on hover */}
                <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors duration-300" />
              </div>

              {/* 2. Typographic details */}
              <div className="flex flex-col items-center space-y-1.5">
                {/* Color Name */}
                <h3 className="text-[11px] font-bold text-neutral-800 dark:text-neutral-200 uppercase tracking-widest transition duration-200 group-hover:text-[#6A0F1F] dark:group-hover:text-[#e4e198]">
                  {colorObj.name}
                </h3>
                
                {/* Miniature solid color indicator bubble */}
                <div 
                  className="w-4.5 h-4.5 rounded-full border border-neutral-200 dark:border-neutral-850 shadow-inner transition-transform duration-300 group-hover:scale-110"
                  style={{ backgroundColor: colorObj.hex }}
                />
              </div>

            </Link>
          ))}
        </div>

      </div>
    </section>
  );
}
