"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { IMSProduct } from "@/Types/Product";
import { useEffect, useMemo, useState } from "react";

type Props = {
  title: string;
  color: string;
  href: string;
  products: IMSProduct[];
  variants?: string[];
};

export default function ColorCard({
  title,
  color,
  href,
  products,
  variants = [],
}: Props) {
  const displayProducts = useMemo(() => {
    if (!products || !Array.isArray(products)) return [];
    return products.map((product) => {
      const variant =
        product.variants?.find((v: any) =>
          variants.some((c) => c.toLowerCase() === v.color.toLowerCase()),
        ) ?? product.variants?.[0];

      const firstDesign = variant?.designs?.[0];

      return {
        ...product,
        displayVariant: variant,
        displayImage:
          firstDesign?.images?.[0] ||
          variant?.images?.[0] ||
          "/Assets/Images/Newplaceholder.png",
      };
    });
  }, [products, variants]);

  const [index, setIndex] = useState(0);
  const [pause, setPause] = useState(false);

  useEffect(() => {
    if (pause || displayProducts.length <= 1) return;

    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % displayProducts.length);
    }, 4000);

    return () => clearInterval(timer);
  }, [displayProducts.length, pause]);

  // Handle empty products state (prevent crashes during fallback)
  if (displayProducts.length === 0) {
    return (
      <Link href={href}>
        <div className="group relative h-full overflow-hidden rounded-4xl dark:bg-black/85 not-dark:bg-white shadow-sm flex flex-col justify-end p-7 border border-neutral-100 dark:border-neutral-900">
          <div className="absolute inset-0 bg-neutral-100 dark:bg-neutral-900/40 flex items-center justify-center text-neutral-400/80 dark:text-neutral-600 font-medium text-sm">
            No Products Available
          </div>

          <div className="absolute inset-0 bg-linear-to-t from-black/5 via-transparent to-transparent" />

          <div className="relative z-10 text-neutral-800 dark:text-white">
            <div
              className="mb-5 h-5 w-5 rounded-full border border-neutral-200 dark:border-neutral-700"
              style={{
                background: color,
              }}
            />
            <h3 className="text-3xl font-semibold">{title}</h3>
            <p className="mt-2 text-sm text-neutral-500 dark:text-neutral-400">
              0 Products
            </p>
            <span className="mt-6 inline-flex font-medium text-[#5f5143] dark:text-neutral-300">
              Explore →
            </span>
          </div>
        </div>
      </Link>
    );
  }

  const product = displayProducts[index];

  return (
    <Link
      href={`${href}?color=${product.displayVariant?.color || ""}`}
      onMouseEnter={() => setPause(true)}
      onMouseLeave={() => setPause(false)}
    >
      <motion.div
        layout
        whileHover={{
          y: -6,
        }}
        transition={{
          duration: 0.15,
        }}
        className="group relative h-full overflow-hidden rounded-4xl dark:bg-black/85 not-dark:bg-white shadow-sm"
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={`${product.productId}-${index}`}
            initial={{
              opacity: 0,
              y: 80,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              y: -80,
            }}
            transition={{
              duration: 0.7,
            }}
            className="absolute inset-0"
          >
            <Image
              src={product.displayImage}
              alt={product.name}
              sizes="(max-width:768px) 100vw, 50vw"
              fill
              className="object-cover duration-700 group-hover:scale-105"
            />
          </motion.div>
        </AnimatePresence>

        <div className="absolute inset-0 bg-linear-to-t from-black/75 via-black/10 to-transparent" />

        <div className="absolute bottom-0 left-0 right-0 p-7 text-white">
          <motion.div
            animate={{
              scale: [1, 1.18, 1],
            }}
            transition={{
              duration: 0.4,
              delay: 3.7,
              repeat: Infinity,
              repeatDelay: 3.6,
            }}
            className="mb-5 h-5 w-5 rounded-full border border-white"
            style={{
              background: color,
            }}
          />

          <motion.h3
            key={product.name}
            initial={{
              opacity: 0,
              y: 12,
            }}
            animate={{
              opacity: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
            }}
            className="text-3xl font-semibold"
          >
            {title}
          </motion.h3>

          <motion.p
            key={product.productId}
            initial={{
              opacity: 0,
            }}
            animate={{
              opacity: 1,
            }}
            className="mt-2 line-clamp-1 text-white/85"
          >
            {product.name}
          </motion.p>

          <p className="mt-2 text-sm text-white/70">
            {displayProducts.length} Products
          </p>

          <motion.span
            whileHover={{
              x: 5,
            }}
            className="mt-6 inline-flex font-medium"
          >
            Explore →
          </motion.span>
        </div>
      </motion.div>
    </Link>
  );
}
