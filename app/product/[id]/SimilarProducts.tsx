// app/product/[id]/SimilarProducts.tsx
import ProductCard from "@/components/Global/ProductCard";

export default async function SimilarProducts({
  category,
  currentId,
}: {
  category: string;
  currentId: number;
}) {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?category=${category}&limit=10`,
    
  );

  if (!res.ok) return null;

  const data = await res.json();
  const products = (data.products || []).filter(
    (p: any) => p.productId !== currentId,
  );

  if (products.length === 0) return null;

  return (
    <section className="px-12 pb-16">
      <h2 className="text-2xl font-semibold mb-6">Similar Products</h2>
      <div className="flex gap-6 overflow-x-auto">
        {products.map((p: any) => (
          <ProductCard
            key={p.productId}
            className="product-card border bg-white"
            product={p}
          />
        ))}
      </div>
    </section>
  );
}
