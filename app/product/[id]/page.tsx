// app/product/[id]/page.tsx
import ProductPDPClient from "./ProductIdClient";
import { IMSProduct } from "@/Types/Product";

async function getProduct(id: number): Promise<IMSProduct | null> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products/${id}`,
    { cache: "no-store" },
  );
  if (!res.ok) return null;
  const data = await res.json();
  return data.product ?? null;
}

async function getAllProducts(): Promise<IMSProduct[]> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?page=1&&limit=20`,
    { cache: "no-store" },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.products ?? [];
}

export default async function ProductPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;
  const productId = Number(id);
  if (Number.isNaN(productId)) {
    return <div className="p-10 text-center">Invalid product</div>;
  }

  const product = await getProduct(productId);
  if (!product) {
    return <div className="p-10 text-center">Product not found</div>;
  }

  const allProducts = await getAllProducts();

  const normalize = (str?: string) => str?.trim().toLowerCase() || "";

  const colorVariants = allProducts.filter(
    (p) =>
      normalize(p.name) === normalize(product.name) &&
      normalize(p.category) === normalize(product.category) &&
      normalize(p.subcategory) === normalize(product.subcategory),
  );
  // similar products = same category, exclude itself
  const similarProducts = allProducts.filter(
    (p) => p.category === product.category && p.productId !== product.productId,
  );

  return (
    <ProductPDPClient
      product={product}
      colorVariants={colorVariants}
      similarProducts={similarProducts}
    />
  );
}
