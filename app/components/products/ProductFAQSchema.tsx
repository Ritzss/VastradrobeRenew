import type { IMSProduct } from "../../Types/Product";

type FAQItem = {
  question: string;
  answer: string;
};

type ProductFAQSchemaProps = {
  product: IMSProduct;
};

export default function ProductFAQSchema({
  product,
}: ProductFAQSchemaProps) {
  // --------------------------------------------------
  // Build the exact same FAQ information used by the
  // visible FAQ section.
  //
  // Only include information that actually exists in
  // the product data. Never invent product details for SEO.
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

  // Don't output empty structured data.
  if (faqs.length === 0) {
    return null;
  }

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(structuredData),
      }}
    />
  );
}