// app/search/page.tsx
// import ProductClient from "@/[category]/ProductClient";

import ProductClient from "@/components/products/ProductClient";

export default async function SearchPage() {

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products`,
    { next: { revalidate: 120 } }
  );

  const data = await res.json();

  return (
    <ProductClient
      products={data.products}
    />
  );
}
