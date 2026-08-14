/* eslint-disable @typescript-eslint/no-explicit-any */
// app/product/[id]/page.tsx

import type { Metadata } from "next";
import ProductPDPClient from "../../components/products/ProductIdClient";
import { IMSProduct } from "@/Types/Product";
import { createSlug, getProductIdFromSlug } from "@/lib/slug";
import { redirect } from "next/navigation";
import WhatsAppPageMessage from "@/components/Global/WhatsAppPageMessage";
import { whatsappMessages } from "@/lib/whatsapp";
import ProductFAQSchema from "@/components/products/ProductFAQSchema";

async function getProduct(id: number): Promise<IMSProduct | null> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products/${id}`,
    { next: { revalidate: 120 } },
  );

  if (!res.ok) return null;

  const data = await res.json();
  const product = data.product ?? null;

  if (product && !Array.isArray(product.variants)) {
    product.variants = [];
  }

  return product;
}

async function getAllProducts(): Promise<IMSProduct[]> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?limit=20`,
    { next: { revalidate: 120 } },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.products ?? [];
}

async function getInventory(productId: number) {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/inventory/list?productId=${productId}`,
    { next: { revalidate: 120 } },
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.inventory ?? [];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}): Promise<Metadata> {
  const { slug } = await params;

  let productId: number;

  try {
    productId = getProductIdFromSlug(slug);
  } catch {
    return {
      title: "Product Not Found | VastraDrobe",
    };
  }

  const product = await getProduct(productId);

  if (!product) {
    return {
      title: "Product Not Found | VastraDrobe",
    };
  }

  const description =
    product.description || `${product.name} available online at VastraDrobe.`;

  const image =
    product.variants?.[0]?.images?.[0] || "https://vastradrobe.com/logo.png";

  const productUrl = `https://vastradrobe.com/${product.category.toLowerCase()}/${createSlug(
    product.name,
    product.productId,
  )}`;

  return {
    title: `${product.name} | ${product.category} | VastraDrobe`,

    description,

    keywords: [
      product.name,
      product.category,
      product.subcategory,
      "VastraDrobe",
      "Fashion",
      "Online Shopping",
    ].filter(Boolean) as string[],

    alternates: {
      canonical: productUrl,
    },

    openGraph: {
      title: product.name,
      description,
      url: productUrl,
      siteName: "VastraDrobe",
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
        },
      ],
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: product.name,
      description,
      images: [image],
    },
  };
}

async function getProductReviewRating(productId: number) {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_SITE_URL || "https://vastradrobe.com"}/api/reviews?productId=${productId}`,
      {
        next: { revalidate: 120 },
      },
    );

    if (!res.ok) {
      return null;
    }

    const data = await res.json();

    // Don't generate aggregateRating when the product
    // doesn't have any reviews yet.
    if (
      !data.success ||
      !data.rating ||
      Number(data.rating.count) === 0
    ) {
      return null;
    }

    return {
      average: Number(data.rating.average),
      count: Number(data.rating.count),
    };
  } catch (error) {
    console.error(
      "Failed to fetch product review rating:",
      error,
    );

    return null;
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}) {
  const { slug, category } = await params;

  let productId: number;

  try {
    productId = getProductIdFromSlug(slug);
  } catch {
    return <div className="p-10 text-center">Invalid product</div>;
  }

  const product = await getProduct(productId);

  if (product && product.category.toLowerCase() !== category.toLowerCase()) {
    redirect(
      `/${product.category.toLowerCase()}/${createSlug(
        product.name,
        product.productId,
      )}`,
    );
  }

  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  const inventory = await getInventory(productId);

  const reviewRating = await getProductReviewRating(productId);

  const allProducts = await getAllProducts();

  const similarProducts = allProducts.filter(
    (p) => p.category === product.category && p.productId !== product.productId,
  );

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vastradrobe.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `https://vastradrobe.com/${product.category?.toLowerCase()}`,
      },
      ...(product.subcategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.subcategory,
              item: `https://vastradrobe.com/${product.category?.toLowerCase()}?subcategory=${product.subcategory}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.subcategory ? 4 : 3,
        name: product.name,
        item: `https://vastradrobe.com/${product.category.toLowerCase()}/${createSlug(
          product.name,
          product.productId,
        )}`,
      },
    ],
  };

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",

    name: product.name,

  image:
    product.variants?.flatMap(
      (variant) => variant.images,
    ) || [],

  description: product.description || "",

  sku: String(product.productId),

  brand: {
    "@type": "Brand",
    name: product.brand || "VastraDrobe",
  },

  category: product.category,

  ...(reviewRating
    ? {
        aggregateRating: {
          "@type": "AggregateRating",
          ratingValue: reviewRating.average,
          reviewCount: reviewRating.count,
          bestRating: 5,
          worstRating: 1,
        },
      }
    : {}),

    offers: {
      "@type": "Offer",

      url: `https://vastradrobe.com/${product.category.toLowerCase()}/${createSlug(
        product.name,
        product.productId,
      )}`,

      priceCurrency: "INR",

      price: product.price,

      availability: inventory.some((variant: any) => {
        // Product without designs
        if (variant.sizes && Object.keys(variant.sizes).length > 0) {
          return Object.values(variant.sizes).some(
            (qty: any) => Number(qty) > 0,
          );
        }

        // Product with designs
        if (variant.designs) {
          return Object.values(variant.designs).some((design: any) =>
            Object.values(design).some((qty: any) => Number(qty) > 0),
          );
        }

        return false;
      })
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
    },
  };

  return (
    <>
      <WhatsAppPageMessage
        message={whatsappMessages.product(
          product.name,
          `https://vastradrobe.com/${product.category.toLowerCase()}/${createSlug(
            product.name,
            product.productId,
          )}`,
        )}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productStructuredData),
        }}
      />

      <ProductFAQSchema product={product} />

      <ProductPDPClient
        product={product}
        similarProducts={similarProducts}
        inventory={inventory}
      />
    </>
  );
}
