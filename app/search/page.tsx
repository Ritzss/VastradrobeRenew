// app/search/page.tsx
import ProductClient from "@/[category]/ProductClient";

export default async function SearchPage({ searchParams }: any) {
  const category = searchParams.category || "";

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products`,
    { cache: "no-store" }
  );

  const data = await res.json();

  return (
    <ProductClient
      products={data.products}
    />
  );
}
