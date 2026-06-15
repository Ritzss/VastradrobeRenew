/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { IMSProduct } from "@/Types/Product";

interface Props {
  products: IMSProduct[];
  selectedProduct: IMSProduct | null;
  isOpen: boolean;
  onClose: () => void;
}

const STACK_SIZE = 4;
const STEP = 1;

export default function ProductStackMobile({
  products,
  selectedProduct,
  isOpen,
  onClose,
}: Props) {
  const router = useRouter();
  const [stackStart, setStackStart] = useState(0);

  useEffect(() => {
    if (!isOpen || !selectedProduct) return;

    const index = products.findIndex(
      (p) => p.productId === selectedProduct.productId,
    );

    if (index === -1) return;

    setStackStart(index);
  }, [selectedProduct, products, isOpen]);

  if (!isOpen) return null;

  const visibleProducts = Array.from(
    { length: STACK_SIZE },
    (_, i) => products[(stackStart + i) % products.length],
  );
  const nextStack = () => {
    setStackStart((prev) => (prev >= products.length - 1 ? 0 : prev + 1));
  };

  const prevStack = () => {
    setStackStart((prev) => (prev <= 0 ? products.length - 1 : prev - 1));
  };

  return (
    <div
      className="fixed inset-0 z-9999 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative h-full w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-50 rounded-full bg-white p-2 shadow-lg"
        >
          <X size={20} />
        </button>

        <div className="relative flex h-full items-center justify-center px-6">
          <AnimatePresence mode="popLayout">
            {visibleProducts.map((product, index) => {
              const depth = index;
              const isTopCard = index === 0;

              const variantImages =
                product.variants
                  ?.map((variant) => variant.images?.[0])
                  .filter(Boolean)
                  .slice(0, 2) || [];

              return (
                <motion.div
                  key={`${product.productId}-${stackStart}-${index}`}
                  className="absolute w-[88vw] max-w-sm"
                  style={{
                    zIndex: visibleProducts.length - index,
                  }}
                  initial={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  animate={{
                    opacity: 1,
                    scale: 1 - depth * 0.04,
                    x: depth * 12,
                    y: depth * 14,
                  }}
                  exit={{
                    opacity: 0,
                    scale: 0.9,
                  }}
                  transition={{
                    duration: 0.25,
                  }}
                  drag={isTopCard ? "x" : false}
                  dragConstraints={{
                    left: 0,
                    right: 0,
                  }}
                  dragElastic={0.2}
                  onDragEnd={(_, info) => {
                    if (!isTopCard) return;

                    if (info.offset.x < -120) {
                      nextStack();
                    }

                    if (info.offset.x > 120) {
                      prevStack();
                    }
                  }}
                >
                  <div className="overflow-hidden rounded-3xl bg-white shadow-2xl">
                    <div className="grid grid-cols-2 gap-2 bg-[#f7f4ef] p-2">
                      {variantImages.map((image, idx) => (
                        <div
                          key={idx}
                          className="relative aspect-3/4 overflow-hidden rounded-2xl"
                        >
                          <Image
                            src={image}
                            alt={`${product.name}-${idx}`}
                            fill
                            className="object-cover"
                          />
                        </div>
                      ))}
                    </div>

                    <div className="p-4">
                      <p className="text-xs uppercase tracking-wider text-neutral-500">
                        {product.category}
                      </p>

                      <h3 className="mt-2 line-clamp-2 text-lg font-medium">
                        {product.name}
                      </h3>

                      <div className="mt-2 flex items-center gap-2">
                        <span className="text-lg font-semibold">
                          ₹{product.price}
                        </span>

                        {product.mrp && product.mrp > product.price && (
                          <>
                            <span className="text-sm text-neutral-400 line-through">
                              ₹{product.mrp}
                            </span>

                            <span className="text-xs font-medium text-green-600">
                              {Math.round(
                                ((product.mrp - product.price) / product.mrp) *
                                  100,
                              )}
                              % OFF
                            </span>
                          </>
                        )}
                      </div>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {product.variants.slice(0, 4).map((variant) => (
                          <span
                            key={variant.color}
                            className="rounded-full bg-[#f5efe8] px-2 py-1 text-xs"
                          >
                            {variant.color}
                          </span>
                        ))}
                      </div>

                      <button
                        onClick={() =>
                          router.push(`/product/${product.productId}`)
                        }
                        className="mt-4 w-full rounded-xl bg-black py-3 text-white"
                      >
                        View Product
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
