import { notFound } from "next/navigation";
import ProductClient from "./ProductClient";

type PageProps = {
  params: Promise<{
    category: string;
  }>;
};

const allowed = [
  "men",
  "women",
  "boys",
  "girls",
  "western",
  "traditionals",
  "offers",
  "electronics",
];

export default async function Page({ params }: PageProps) {
  const { category } = await params;

  const normalizedCategory = category.toLowerCase().replace(/\/$/, "");

  if (!allowed.includes(normalizedCategory)) {
    notFound();
  }

 const res = await fetch(
  `${process.env.IMS_BASE_URL}/api/ims/public/products`,
  { cache: "no-store" }
);

const data = await res.json();

  if (!res.ok) {
    return (
      <div style={{ color: "black", padding: 40 }}>
        <h1>Fetch failed</h1>
        <p>Status: {res.status}</p>
      </div>
    );
  }

  // ✅ THIS IS THE FIX

const products = data.products;
  console.log(products);
  

  return (
    <ProductClient
      products={products}
      category={normalizedCategory}
    />
  );
}
