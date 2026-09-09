import type { Metadata } from "next";
import AllProductClient from "../components/products/AllProductClient";

export const metadata: Metadata = {
  metadataBase: new URL("https://vastradrobe.com"),

  title: "Fashion Collections | VastraDrobe",

  description:
    "Explore VastraDrobe's fashion collections featuring premium shirts, tops, dresses, co-ord sets, kurtas, jeans, trousers, kids wear, and more. Shop stylish clothing for every occasion with quality fabrics and modern designs.",

  keywords: [
    "VastraDrobe",
    "Fashion Collection",
    "Online Clothing Store",
    "Women's Fashion",
    "Men's Fashion",
    "Kids Wear",
    "Shirts",
    "Tops",
    "Dresses",
    "Co-Ord Sets",
    "Kurtas",
    "Jeans",
    "Trousers",
    "Premium Clothing",
    "Indian Fashion",
  ],

  applicationName: "VastraDrobe",
  category: "Fashion",
  creator: "VastraDrobe",
  publisher: "VastraDrobe",

  alternates: {
    canonical: "https://vastradrobe.com/collection",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },

  openGraph: {
    title: "Fashion Collections | VastraDrobe",

    description:
      "Browse premium fashion collections including shirts, tops, dresses, kurtas, co-ord sets, jeans, trousers, and kids wear at VastraDrobe.",

    url: "https://vastradrobe.com/collection",

    siteName: "VastraDrobe",

    type: "website",

    locale: "en_IN",

    images: [
      {
        url: "/Assets/Images/Logo2.png",
        width: 1200,
        height: 630,
        alt: "VastraDrobe Fashion Collections",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Fashion Collections | VastraDrobe",
    description:
      "Discover premium clothing collections for women, men, and kids at VastraDrobe.",
    images: ["/Assets/Images/Logo2.png"],
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