/* eslint-disable @typescript-eslint/no-explicit-any */
import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{ category: string }>;
};

const CATEGORY_MAP: Record<string, string[]> = {
  men: ["men"],
  women: ["women"],
  children: ["boys", "girls"],
  western: ["western"],
  traditionals: ["traditionals"],
  winter: ["winter"],
  offers:["offer"],
};

export default async function Page({ params }: PageProps) {
  const { category } = await params;
  const normalizedCategory = category.toLowerCase().replace(/\/$/, "");

  if (!CATEGORY_MAP[normalizedCategory]) {
    notFound();
  }

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    return (
      <div style={{ color: "black", padding: 40 }}>
        <h1>Fetch failed</h1>
        <p>Status: {res.status}</p>
      </div>
    );
  }

  const data = await res.json();
  const categoryFilters = CATEGORY_MAP[normalizedCategory];

  const products = data.products.filter((p: any) =>
    categoryFilters.includes(p.category)
  );

  return (
    <ProductClient
      products={products}
      category={normalizedCategory}
    />
  );
}
