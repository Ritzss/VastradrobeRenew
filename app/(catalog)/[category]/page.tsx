/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "../../components/products/ProductClient";

type PageProps = {
  params: Promise<{ category: string }>;
};

const CATEGORY_MAP: Record<string, string[]> = {
  all: ["men", "women", "boys", "girls"],
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
};

type Category = "all" | "men" | "women" | "kids";

const CATEGORY_META: Record<
  string,
  { title: string; description: string; keywords: string[] }
> = {
  all: {
    title: "Online Fashion Store",
    description:
      "Shop the latest men's, women's and kids fashion online at VastraDrobe. Discover premium clothing, ethnic wear, western wear and accessories.",
    keywords: [
      "online fashion store",
      "fashion shopping india",
      "vastradrobe",
      "men clothing",
      "women clothing",
      "kids clothing",
    ],
  },

  men: {
    title: "Men's Fashion",
    description:
      "Shop premium men's shirts, t-shirts, jeans, trousers, ethnic wear and accessories online at VastraDrobe.",
    keywords: [
      "men clothing",
      "men shirts",
      "men jeans",
      "men fashion",
      "vastradrobe men",
    ],
  },

  women: {
    title: "Women's Fashion",
    description:
      "Discover women's dresses, tops, co-ords, ethnic wear, kurtis and trendy fashion online at VastraDrobe.",
    keywords: [
      "women clothing",
      "women dresses",
      "women tops",
      "ethnic wear",
      "vastradrobe women",
    ],
  },

  kids: {
    title: "Kids Fashion",
    description:
      "Explore stylish clothing for boys and girls including casual wear, festive wear and everyday essentials.",
    keywords: [
      "kids clothing",
      "boys fashion",
      "girls fashion",
      "kids wear",
      "vastradrobe kids",
    ],
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  const normalizedCategory = category.toLowerCase();

  const meta = CATEGORY_META[normalizedCategory] ?? CATEGORY_META.all;

  const url = `https://vastradrobe.com/${normalizedCategory}`;

  return {
    title: `${meta.title} | VastraDrobe`,
    description: meta.description,

    keywords: meta.keywords,

    metadataBase: new URL("https://vastradrobe.com"),

    alternates: {
      canonical: url,
    },

    openGraph: {
      title: `${meta.title} | VastraDrobe`,
      description: meta.description,
      url,
      siteName: "VastraDrobe",
      locale: "en_IN",
      type: "website",

      images: [
        {
          url: `/Assets/Banners/${normalizedCategory}.webp`,
          width: 1200,
          height: 630,
          alt: meta.title,
        },
      ],
    },

    twitter: {
      card: "summary_large_image",
      title: `${meta.title} | VastraDrobe`,
      description: meta.description,

      images: [`/Assets/Banners/${normalizedCategory}.webp`],
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
      },
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase().replace(/\/$/, "");

  if (!CATEGORY_MAP[normalizedCategory]) {
    notFound();
  }

  let products: any[] = [];

  try {
    const res = await fetch(
      `${process.env.IMS_BASE_URL}/api/ims/public/products?limit=28`,
      {
        next: { revalidate: 120 },
      },
    );

    if (res.ok) {
      const data = await res.json();
      const categoryFilters = CATEGORY_MAP[normalizedCategory];
      const fetchedProducts = data.products || [];
      products = fetchedProducts.filter((p: any) =>
        categoryFilters.includes(p.category),
      );
    } else {
      console.warn("Category products fetch returned non-200:", res.status);
    }
  } catch (err) {
    console.error(
      "CATEGORY PRODUCTS FETCH FAILED (Graceful fallback to empty):",
      err,
    );
  }

  const schema = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: CATEGORY_META[normalizedCategory]?.title,
    description: CATEGORY_META[normalizedCategory]?.description,
    url: `https://vastradrobe.com/${normalizedCategory}`,
    publisher: {
      "@type": "Organization",
      name: "VastraDrobe",
      logo: {
        "@type": "ImageObject",
        url: "https://vastradrobe.com/logo.png",
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(schema),
        }}
      />

      <ProductClient
        products={products}
        category={normalizedCategory as Category}
      />
    </>
  );
}
