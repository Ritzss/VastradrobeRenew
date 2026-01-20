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
  // 🔥 IMPORTANT: await params
  const { category } = await params;


const normalizedCategory = category
  .toLowerCase()
  .replace(/\/$/, "");

if (!allowed.includes(normalizedCategory)) {
  notFound();
}


  const res = await fetch("https://fakestoreapi.com/products", {
    cache: "no-store",
  });

  if (!res.ok) {
  return (
    <div style={{ color: "black", padding: 40 }}>
      <h1>Fetch failed</h1>
      <p>Status: {res.status}</p>
    </div>
  );
}

  const products = await res.json();

  return <ProductClient products={products} category={normalizedCategory}/>;
}
