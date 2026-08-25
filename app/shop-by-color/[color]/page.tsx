import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { SHOP_BY_COLORS } from "@/lib/shopByColors";
import ColorProductsClient from "@/components/products/ColorProductsClient";
import Link from "next/link";

type Props = {
  params: Promise<{
    color: string;
  }>;
};

/* =========================================================
   METADATA
   ========================================================= */

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

/* =========================================================
   PAGE
   ========================================================= */

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

  /* =======================================================
     INITIAL PRODUCT FETCH

     Only the first 12 products are rendered on the initial
     request. ColorProductsClient handles infinite scrolling.
     ======================================================= */

  const colorQuery =
    selectedColor.variants.join(",");

  const response = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?color=${encodeURIComponent(
      colorQuery,
    )}&page=1&limit=12`,
    {
      next: {
        revalidate: 120,
      },
    },
  );

  if (!response.ok) {
    console.error(
      "Color products API failed:",
      response.status,
    );
  }

  const data = response.ok
    ? await response.json()
    : {
        products: [],
        pagination: {
          page: 1,
          limit: 12,
          total: 0,
          hasNextPage: false,
        },
      };

  const initialProducts =
    data.products || [];

  const total =
    data.pagination?.total || 0;

  /* =======================================================
     STRUCTURED DATA
     ======================================================= */

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
      {/* ===================================================
          SEO SCHEMA
          =================================================== */}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            breadcrumbSchema,
          ),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            collectionSchema,
          ),
        }}
      />

      {/* ===================================================
          PAGE
          =================================================== */}

      <main className="min-h-screen bg-[#f8f5f0] text-[#3f3933]">
        {/* =================================================
            HERO
            ================================================= */}

        <section className="px-5 sm:px-8 lg:px-12 pt-6 sm:pt-8">
          <div className="max-w-350 mx-auto">
            {/* Breadcrumb */}

            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-[10px] sm:text-xs uppercase tracking-[0.2em] text-[#927f6c]"
            >
              <Link
                href="/"
                className="hover:text-[#5f5143] transition-colors"
              >
                Home
              </Link>

              {/* <span className="text-[#c5b8aa]">
                /
              </span>

              <Link
                href="/shop-by-color"
                className="hover:text-[#5f5143] transition-colors"
              >
                Shop by Color
              </Link> */}

              <span className="text-[#c5b8aa]">
                /
              </span>

              <span className="text-[#5f5143]">
                {selectedColor.name}
              </span>
            </nav>

            {/* Hero card */}

            <div className="relative mt-6 sm:mt-8 overflow-hidden rounded-4xl bg-[#e9e1d8]">
              {/* Decorative circles */}

              <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full border border-white/40" />

              <div className="absolute -right-10 -bottom-32 h-80 w-80 rounded-full border border-white/30" />

              <div className="absolute left-[48%] top-1/2 hidden h-48 w-48 -translate-y-1/2 rounded-full bg-white/20 blur-3xl lg:block" />

              <div className="relative grid min-h-105 lg:min-h-125 grid-cols-1 lg:grid-cols-[1.25fr_0.75fr]">
                {/* Main content */}

                <div className="flex flex-col justify-center px-7 py-14 sm:px-12 lg:px-20 lg:py-20">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-8 bg-[#927f6c]" />

                    <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#927f6c]">
                      Shop by Color
                    </span>
                  </div>

                  <h1 className="sr-only">
                    {selectedColor.name} Clothing
                    Collection | VastraDrobe
                  </h1>

                  <h2 className="mt-7 max-w-3xl font-serif text-5xl leading-[0.95] tracking-[-0.03em] text-[#4d433a] sm:text-6xl lg:text-8xl">
                    {selectedColor.name}
                    <span className="block text-[#776759]">
                      Collection
                    </span>
                  </h2>

                  <p className="mt-7 max-w-xl text-sm leading-7 text-[#776a5e] sm:text-base">
                    A curated edit of premium clothing
                    in carefully selected{" "}
                    {selectedColor.name.toLowerCase()}{" "}
                    shades. From everyday essentials
                    to occasion-ready pieces.
                  </p>

                  <div className="mt-9 flex flex-wrap items-center gap-3">
                    <span className="rounded-full border border-[#cfc2b5] bg-white/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c5d50]">
                      {total}{" "}
                      {total === 1
                        ? "Piece"
                        : "Pieces"}
                    </span>

                    <span className="rounded-full border border-[#cfc2b5] bg-white/50 px-4 py-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#6c5d50]">
                      Curated Collection
                    </span>
                  </div>
                </div>

                {/* Visual side */}

                <div className="relative hidden lg:flex items-center justify-center overflow-hidden">
                  <div className="relative h-72 w-72 xl:h-80 xl:w-80">
                    {/* Outer ring */}

                    <div className="absolute inset-0 rounded-full border border-white/60" />

                    <div className="absolute inset-5 rounded-full border border-white/50" />

                    {/* Color identity */}

                    <div className="absolute inset-12 rounded-full bg-white/35 backdrop-blur-sm shadow-[0_20px_60px_rgba(80,60,40,0.08)]" />

                    <div className="absolute inset-18 flex items-center justify-center rounded-full bg-[#6b5a4b] text-center shadow-xl">
                      <div>
                        <p className="text-[9px] uppercase tracking-[0.35em] text-white/60">
                          VastraDrobe
                        </p>

                        <p className="mt-2 font-serif text-2xl text-white">
                          {selectedColor.name}
                        </p>

                        <p className="mt-1 text-[8px] uppercase tracking-[0.3em] text-white/60">
                          Edit
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            COLLECTION INTRO
            ================================================= */}

        {/* <section className="px-5 sm:px-8 lg:px-12 pt-20 sm:pt-24">
          <div className="max-w-350 mx-auto">
            <div className="flex flex-col gap-5 pb-7 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-semibold uppercase tracking-[0.3em] text-[#9a8876]">
                  The Edit
                </p>

                <h3 className="mt-2 font-serif text-3xl text-[#4d433a] sm:text-4xl">
                  {selectedColor.name} essentials
                </h3>
              </div>

              <p className="max-w-md text-xs leading-6 text-[#85766a] sm:text-right">
                Explore the complete collection and
                discover pieces designed to work across
                everyday, festive and occasion dressing.
              </p>
            </div>
          </div>
        </section> */}

        {/* =================================================
            PRODUCTS
            ================================================= */}

        <section className="px-5 sm:px-8 lg:px-12 pt-8 pb-24">
          <div className="max-w-350 mx-auto">
            <ColorProductsClient
              initialProducts={initialProducts}
              variants={selectedColor.variants}
              total={total}
            />
          </div>
        </section>
      </main>
    </>
  );
}