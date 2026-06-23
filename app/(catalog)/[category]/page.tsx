/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductClient from "../../components/products/ProductClient";
// import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{ category: string }>;
};

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  kids: ["boys", "girls"],
};

const CATEGORY_META: Record<
  string,
  { title: string; description: string }
> = {
  men: {
    title: "Men's Fashion",
    description:
      "Shop the latest men's fashion, clothing, and accessories at VastraDrobe.",
  },
  women: {
    title: "Women's Fashion",
    description:
      "Discover trendy women's fashion, clothing, and accessories at VastraDrobe.",
  },
  kids: {
    title: "Kids Fashion",
    description:
      "Explore comfortable and stylish clothing for kids at VastraDrobe.",
  },
};

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { category } = await params;

  const meta =
    CATEGORY_META[category.toLowerCase()] ?? {
      title: "Fashion",
      description: "Shop fashion online at VastraDrobe.",
    };

  return {
    title: `${meta.title} | VastraDrobe`,
    description: meta.description,
    openGraph: {
      title: `${meta.title} | VastraDrobe`,
      description: meta.description,
      type: "website",
    },
  };
}

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase().replace(/\/$/, "");

  if (!CATEGORY_MAP[normalizedCategory]) {
    notFound();
  }

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?limit=20`,
    {
      next: { revalidate: 120 },
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();

  const categoryFilters = CATEGORY_MAP[normalizedCategory];

  const products = data.products.filter((p: any) =>
    categoryFilters.includes(p.category)
  );

  return <ProductClient products={products} />;
}