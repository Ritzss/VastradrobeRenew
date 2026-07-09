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
    return products.map((product) => {
      const variant =
        product.variants.find((v) =>
          variants.some((c) => c.toLowerCase() === v.color.toLowerCase()),
        ) ?? product.variants[0];

      return {
        ...product,
        displayVariant: variant,
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

  const product = displayProducts[index];

  return (
    <Link
      href={`${href}?color=${product.displayVariant.color}`}
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
              src={product.displayVariant.images[0]}
              alt={product.name}
              // sizes="(max-width: 768px) 100vw, 25vw"
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
