// app/products/page.tsx (or wherever this lives)

import AllProductClient from "./AllProductClient";


const PAGE_SIZE = 10;

const ProductPage = async () => {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?page=1&limit=${PAGE_SIZE}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch products");
  }

  const data = await res.json();
  const initialProducts = Array.isArray(data.products)
    ? data.products
    : [];

  return (
    <AllProductClient
      initialProducts={initialProducts}
      pageSize={PAGE_SIZE}
    />
  );
};

export default ProductPage;
