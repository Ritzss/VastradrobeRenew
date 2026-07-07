/* eslint-disable @typescript-eslint/no-explicit-any */

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductCard from "@/components/Global/ProductCard";
import { SHOP_BY_COLORS } from "@/lib/shopByColors";
import { prioritizeVariant } from "@/lib/productColor";

type Props = {
  params: Promise<{
    color: string;
  }>;
};

export async function generateMetadata({
  params,
}: Props): Promise<Metadata> {
  const { color } = await params;

  const selectedColor = SHOP_BY_COLORS.find(
    (c) => c.slug === color,
  );

  if (!selectedColor) {
    return {};
  }

  return {
    title: `${selectedColor.name} Clothing Collection | VastraDrobe`,

    description: `Shop premium ${selectedColor.name.toLowerCase()} clothing online at VastraDrobe. Discover stylish tops, shirts, co-ord sets, jackets, ethnic wear and more in ${selectedColor.name.toLowerCase()} shades.`,

    keywords: [
      `${selectedColor.name} Clothing`,
      `${selectedColor.name} Fashion`,
      `${selectedColor.name} Dresses`,
      `${selectedColor.name} Shirts`,
      `${selectedColor.name} Tops`,
      `${selectedColor.name} Co-Ord Sets`,
      "Online Fashion",
      "VastraDrobe",
    ],

    alternates: {
      canonical: `https://vastradrobe.com/shop-by-color/${selectedColor.slug}`,
    },

    robots: {
      index: true,
      follow: true,
    },

    openGraph: {
      title: `${selectedColor.name} Clothing Collection | VastraDrobe`,
      description: `Explore premium ${selectedColor.name.toLowerCase()} fashion at VastraDrobe.`,
      url: `https://vastradrobe.com/shop-by-color/${selectedColor.slug}`,
      siteName: "VastraDrobe",
      type: "website",
    },

    twitter: {
      card: "summary_large_image",
      title: `${selectedColor.name} Clothing Collection | VastraDrobe`,
      description: `Browse premium ${selectedColor.name.toLowerCase()} clothing at VastraDrobe.`,
    },
  };
}

export default async function ColorPage({
  params,
}: Props) {
  const { color } = await params;

  const selectedColor = SHOP_BY_COLORS.find(
    (c) => c.slug === color,
  );

  if (!selectedColor) {
    notFound();
  }

  const requests = selectedColor.variants.map((variant) =>
    fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products?color=${encodeURIComponent(
        variant,
      )}`,
      {
        next: {
          revalidate: 120,
        },
      },
    ),
  );

  const responses = await Promise.all(requests);

  const results = await Promise.all(
    responses.map((r) => r.json()),
  );

  const products = results.flatMap(
    (r) => r.products || [],
  );

  const uniqueProducts = Object.values(
    products.reduce(
      (acc, product: any) => {
        acc[product.productId] = product;
        return acc;
      },
      {} as Record<number, any>,
    ),
  );

  const displayProducts = uniqueProducts.map((product: any) =>
    prioritizeVariant(product, selectedColor.variants),
  );

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vastradrobe.com",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Shop by Color",
        item: "https://vastradrobe.com/shop-by-color",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: selectedColor.name,
        item: `https://vastradrobe.com/shop-by-color/${selectedColor.slug}`,
      },
    ],
  };

  const collectionSchema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${selectedColor.name} Clothing Collection`,
    description: `Browse premium ${selectedColor.name.toLowerCase()} fashion at VastraDrobe.`,
    url: `https://vastradrobe.com/shop-by-color/${selectedColor.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbSchema),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionSchema),
        }}
      />

      <section className="bg-[#f9f5ef] pt-5 pb-20 px-6">

        <h1 className="sr-only">
          {selectedColor.name} Clothing Collection | VastraDrobe
        </h1>

        <div className="max-w-7xl mx-auto text-center mb-16">

          <p className="uppercase tracking-[0.35em] text-xs text-[#957f6a]">
            Shop By Color
          </p>

          <h2 className="mt-4 text-5xl font-semibold text-[#5f5143]">
            {selectedColor.name} Collection
          </h2>

          <p className="mt-5 max-w-3xl mx-auto text-[#7a6a5c] leading-7">
            Discover premium {selectedColor.name.toLowerCase()} clothing,
            including stylish tops, shirts, co-ord sets, ethnic wear and
            seasonal fashion curated for every occasion.
          </p>

          <p className="mt-6 text-sm text-[#957f6a]">
            {displayProducts.length} Products
          </p>

        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {displayProducts.map((product) => (
            <ProductCard
              key={product.productId}
              product={product}
              Linked
            />
          ))}
        </div>

      </section>
    </>
  );
}