/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { SHOP_BY_COLORS } from "@/lib/shopByColors";
import { IMSProduct } from "@/Types/Product";

type Props = {
  products: IMSProduct[];
};

/**
 * Shop By Color
 *
 * Compact homepage section.
 *
 * The color names act as the navigation while the product
 * strip below previews the selected color collection.
 */
export default function ShopByColor({ products }: Props) {
  /*
   * Build one representative image for every
   * configured storefront color.
   */
  const formattedColors = useMemo(() => {
    return SHOP_BY_COLORS.map((colorObj) => {
      const matchingProduct = products.find((product) =>
        product.variants?.some(
          (variant: any) =>
            variant.color &&
            colorObj.variants.some(
              (colorVariant) =>
                colorVariant.toLowerCase() === variant.color.toLowerCase(),
            ),
        ),
      );

      let displayImage = "/Assets/Images/Newplaceholder.png";

      if (matchingProduct) {
        const matchingVariant = matchingProduct.variants?.find(
          (variant: any) =>
            variant.color &&
            colorObj.variants.some(
              (colorVariant) =>
                colorVariant.toLowerCase() === variant.color.toLowerCase(),
            ),
        );

        displayImage =
          matchingVariant?.designs?.[0]?.images?.[0] ??
          matchingVariant?.images?.[0] ??
          displayImage;
      }

      return {
        ...colorObj,
        displayImage,
      };
    });
  }, [products]);

  const [activeColor, setActiveColor] = useState(
    formattedColors[0]?.slug ?? "",
  );

  const activeColorData =
    formattedColors.find((color) => color.slug === activeColor) ??
    formattedColors[0];

  if (!activeColorData) {
    return null;
  }

  /*
   * Get several representative products for the
   * currently selected color.
   *
   * This only affects the homepage preview. The actual
   * collection page performs its own paginated API query.
   */
  const previewProducts = products
    .filter((product) =>
      product.variants?.some(
        (variant: any) =>
          variant.color &&
          activeColorData.variants.some(
            (colorVariant) =>
              colorVariant.toLowerCase() === variant.color.toLowerCase(),
          ),
      ),
    )
    .slice(0, 5);

  return (
    <section className="border-y border-[#ddd5ca] bg-[#f0ebe3] py-12 dark:border-neutral-900 dark:bg-[#0d0d0d] sm:py-14">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-10">
        {/* =================================================
            HEADER
            ================================================= */}

        <div className="mb-7 flex items-end justify-between">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#9a8876]">
              Explore
            </p>

            <h2 className="mt-1 font-serif text-3xl text-[#4d433a] dark:text-white">
              Shop by color
            </h2>
          </div>

          {/* <Link
            href={`/shop-by-color/${activeColorData.slug}`}
            className="hidden text-[9px] font-semibold uppercase tracking-[0.2em] text-[#806f60] transition-colors hover:text-[#6A0F1F] sm:block"
          >
            View {activeColorData.name} →
          </Link> */}
        </div>

        {/* =================================================
                      COLOR NAVIGATION
          ================================================= */}

        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {formattedColors.map((colorObj) => {
            const isActive = colorObj.slug === activeColor;

            return (
              <Link
                key={colorObj.slug}
                href={`/shop-by-color/${colorObj.slug}`}
                onMouseEnter={() => setActiveColor(colorObj.slug)}
                onFocus={() => setActiveColor(colorObj.slug)}
                className={` group relative flex items-center gap-2 overflow-hidden rounded-full border px-4 py-2.5 transition-all duration-300
          ${
            isActive
              ? "border-[#6A0F1F] text-white"
              : "border-[#ddd4ca] bg-white text-[#66594e] hover:border-[#6A0F1F]/40 dark:border-neutral-800 dark:bg-neutral-950 dark:text-neutral-300"
          }
        `}
              >
                {/* Animated capsule background */}

                <span
                  aria-hidden="true"
                  className={` absolute inset-0 rounded-full bg-[#6A0F1F] transition-transform duration-300 ease-out ${isActive ? "translate-x-0" : "-translate-x-full"} group-hover:translate-x-0`}
                />

                {/* Color dot */}

                <span
                  className={` relative z-10 h-2.5 w-2.5 shrink-0 rounded-full border transition-transform duration-300 group-hover:scale-110
            ${
              colorObj.border
                ? isActive
                  ? "border-white/70"
                  : "border-neutral-300"
                : "border-black/10"
            }
          `}
                  style={{
                    backgroundColor: colorObj.color,
                  }}
                />

                {/* Color name */}

                <span
                  className={` relative z-10 text-[9px] font-semibold uppercase tracking-[0.14em] transition-colors duration-300  ${isActive ? "text-white" : "group-hover:text-white"} `}
                >
                  {colorObj.name}
                </span>

                {/* Arrow */}

                <span
                  className={` relative z-10 text-xs transition-all duration-300
            ${
              isActive
                ? "translate-x-0 opacity-100"
                : "-translate-x-1 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"
            }
          `}
                >
                  →
                </span>
              </Link>
            );
          })}
        </div>

        {/* =================================================
    PRODUCT PREVIEW
    ================================================= */}

<div className="relative">
  <div className="flex items-end justify-center gap-3 sm:gap-5 lg:gap-6">
    {previewProducts.map((product, index) => (
      <Link
  key={product.productId}
  href={`/shop-by-color/${activeColorData.slug}`}
  className={`
    group relative
    w-[calc(50%-6px)]
    sm:w-[calc(25%-12px)]
    lg:w-[calc(20%-13px)]
    ${index % 2 === 1 ? "translate-y-5" : ""}
  `}
>
  {/* Color glow behind image */}
  <div
    className="
      absolute
      -inset-1
      rounded-[1.25rem]
      opacity-0
      blur-xl
      transition-opacity
      duration-700
      group-hover:opacity-25
    "
    style={{
      backgroundColor: activeColorData.color,
    }}
  />

  {/* Image frame */}
  <div
    className=" relative aspect-4/5 overflow-hidden rounded-[1.15rem] bg-[#eee8e1] ring-1 ring-black/4 transition-all duration-500 group-hover:-translate-y-1 group-hover:ring-black/10"
  >
    <Image
      src={(() => {
        const variant = product.variants?.find(
          (v: any) =>
            v.color &&
            activeColorData.variants.some(
              (c) =>
                c.toLowerCase() ===
                v.color.toLowerCase(),
            ),
        );

        return (
          variant?.designs?.[0]?.images?.[0] ??
          variant?.images?.[0] ??
          "/Assets/Images/Newplaceholder.png"
        );
      })()}
      alt={product.name}
      fill
      sizes="
        (max-width: 640px) 48vw,
        (max-width: 1024px) 24vw,
        20vw
      "
      className="
        object-cover
        object-top
        transition-transform
        duration-700
        ease-out
        group-hover:scale-[1.035]
      "
    />

    {/* Editorial light sweep */}
    <div
      className=" pointer-events-none absolute inset-0 translate-x-[-120%] bg-linear-to-r from-transparent via-white/20 to-transparent transition-transform duration-1000 group-hover:translate-x-[120%]"
    />

    {/* Minimal color accent */}
    <div
      className="
        absolute
        bottom-3
        left-3
        h-1
        w-8
        rounded-full
        transition-all
        duration-500
        group-hover:w-14
      "
      style={{
        backgroundColor: activeColorData.color,
      }}
    />
  </div>
</Link>
    ))}
  </div>

  {/* Selected color label */}

  <div className="mt-10 flex items-center justify-center gap-4">
    <span
      className="h-2.5 w-2.5 rounded-full"
      style={{
        backgroundColor: activeColorData.color,
      }}
    />

    <span
      className="font-serif text-xl"
      style={{
        color: activeColorData.color,
      }}
    >
      {activeColorData.name}
    </span>

    <Link
      href={`/shop-by-color/${activeColorData.slug}`}
      className="text-[9px] font-semibold uppercase tracking-[0.25em] text-[#8d7d6d] transition-colors hover:text-[#6A0F1F]"
    >
      Explore →
    </Link>
  </div>
</div>

        {/* =================================================
            MOBILE COLLECTION LINK
            ================================================= */}

        <div className="mt-6 text-center sm:hidden">
          <Link
            href={`/shop-by-color/${activeColorData.slug}`}
            className="text-[9px] font-semibold uppercase tracking-[0.2em] text-[#806f60]"
          >
            View {activeColorData.name} collection →
          </Link>
        </div>
      </div>
    </section>
  );
}
