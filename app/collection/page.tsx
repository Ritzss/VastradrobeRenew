import type { Metadata } from "next";
import AllProductClient from "../components/products/AllProductClient";

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
    `${process.env.IMS_BASE_URL}/api/ims/public/products?view=subcategories`,
    {
      next: {
        revalidate: 120,
      },
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  const sections = data.sections || [];

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
    itemListElement: sections.flatMap(
      (
        section: {
          products: {
            category: string;
            name: string;
            productId: number;
          }[];
        },
        sectionIndex: number,
      ) =>
        section.products.map((product, productIndex) => ({
          "@type": "ListItem",
          position: sectionIndex * 100 + productIndex + 1,
          url: `https://vastradrobe.com/${product.category.toLowerCase()}/${product.name
            .toLowerCase()
            .replace(/\s+/g, "-")}-${product.productId}`,
        })),
    ),
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

      <AllProductClient sections={sections} />
    </>
  );
};

export default ProductPage;