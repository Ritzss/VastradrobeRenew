import type { Metadata } from "next";
import AllProductClient from "./AllProductClient";
import { createSlug } from "@/lib/slug";

const PAGE_SIZE = 20;

export const metadata: Metadata = {
  title: "All Products | VastraDrobe",
  description:
    "Browse all fashion products at VastraDrobe. Shop women's wear, men's wear, kids wear, co-ord sets, shirts, tops and more.",

  alternates: {
    canonical: "https://vastradrobe.com/collection",
  },

  robots: {
    index: true,
    follow: true,
  },

  openGraph: {
    title: "All Products | VastraDrobe",
    description:
      "Browse all fashion products at VastraDrobe. Shop women's wear, men's wear, kids wear, co-ord sets, shirts, tops and more.",
    url: "https://vastradrobe.com/collection",
    siteName: "VastraDrobe",
    type: "website",
  },
};

const ProductPage = async () => {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?page=1&limit=${PAGE_SIZE}`,
    {
      next: { revalidate: 120 },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  const initialProducts = Array.isArray(data.products)
    ? data.products
    : [];

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
        name: "Collection",
        item: "https://vastradrobe.com/collection",
      },
    ],
  };

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: initialProducts.map((product: { category: string; name: string; productId: number; }, index: number) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `https://vastradrobe.com/${product.category.toLowerCase()}/${createSlug(
        product.name,
        product.productId,
      )}`,
    })),
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
          __html: JSON.stringify(itemListSchema),
        }}
      />

      <AllProductClient
        initialProducts={initialProducts}
        pageSize={PAGE_SIZE}
      />
    </>
  );
};

export default ProductPage;