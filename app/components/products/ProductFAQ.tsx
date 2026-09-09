"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { IMSProduct } from "../../Types/Product";

type ProductFAQProps = {
  product: IMSProduct;
};

type FAQItem = {
  question: string;
  answer: string;
};

export default function ProductFAQ({
  product,
}: ProductFAQProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(
    null,
  );

  // --------------------------------------------------
  // Build FAQs from actual product information.
  // We only create questions when the required information
  // exists, so we don't show empty or made-up answers.
  // --------------------------------------------------
  const faqs: FAQItem[] = [];

  if (product.productDetails?.material) {
    faqs.push({
      question: "What material is this product made from?",
      answer: `This product is made from ${product.productDetails.material}.`,
    });
  }

  if (product.productDetails?.careInstructions) {
    faqs.push({
      question: "How should I care for this product?",
      answer: product.productDetails.careInstructions,
    });
  }

  if (product.productDetails?.style) {
    faqs.push({
      question: "What is the style of this product?",
      answer: `This product features a ${product.productDetails.style} style.`,
    });
  }

  if (product.productDetails?.pattern) {
    faqs.push({
      question: "What pattern does this product have?",
      answer: `The product features a ${product.productDetails.pattern} pattern.`,
    });
  }

  if (product.variants?.length) {
    const sizes = Array.from(
      new Set(
        product.variants.flatMap(
          (variant) => variant.sizes || [],
        ),
      ),
    );

    if (sizes.length > 0) {
      faqs.push({
        question: "What sizes are available?",
        answer: `Available sizes are: ${sizes.join(", ")}.`,
      });
    }
  }

  if (product.productDetails?.countryOfOrigin) {
    faqs.push({
      question: "Where is this product made?",
      answer: `Country of origin: ${product.productDetails.countryOfOrigin}.`,
    });
  }

  // Don't render an empty FAQ section.
  if (faqs.length === 0) {
    return null;
  }

  return (
    <section
      id="product-faq"
      className="border-t border-neutral-100 pt-16 mt-16"
    >
      <div className="max-w-4xl mx-auto">
        {/* Section heading */}
        <div className="text-center mb-10">
          <p className="text-[10px] font-bold text-neutral-400 tracking-[0.25em] uppercase">
            Need to know?
          </p>

          <h2 className="font-serif text-2xl sm:text-3xl text-neutral-800 mt-2">
            Frequently Asked Questions
          </h2>

          <p className="text-xs text-neutral-400 mt-3">
            Everything you need to know about this product.
          </p>
        </div>

        {/* FAQ accordion */}
        <div className="border-t border-neutral-200">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;

            return (
              <div
                key={faq.question}
                className="border-b border-neutral-200"
              >
                <button
                  type="button"
                  onClick={() =>
                    setOpenIndex(
                      isOpen ? null : index,
                    )
                  }
                  className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-neutral-800">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-neutral-400 transition-transform duration-300 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`grid transition-[grid-template-rows] duration-300 ${
                    isOpen
                      ? "grid-rows-[1fr]"
                      : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="pb-5 pr-8 text-sm leading-6 text-neutral-500">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}