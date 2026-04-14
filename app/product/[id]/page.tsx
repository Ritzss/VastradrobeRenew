// app/product/[id]/page.tsx
import ProductPDPClient from "./ProductIdClient";
import { IMSProduct } from "@/Types/Product";

async function getProduct(id: number): Promise<IMSProduct | null> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products/${id}`,
    { next: { revalidate: 120 } }
  );

  if (!res.ok) return null;

  const data = await res.json();
  const product = data.product ?? null;

  // Safety: ensure variants always exist
  if (product && !Array.isArray(product.variants)) {
    product.variants = [];
  }

  return product;
}

async function getAllProducts(): Promise<IMSProduct[]> {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?limit=20`,
    { next: { revalidate: 120 } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  return data.products ?? [];
}

async function getInventory(productId: number) {
  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/inventory/list?productId=${productId}`,
    { next: { revalidate: 120 } }
  );

  if (!res.ok) return [];

  const data = await res.json();
  // console.log("Inventory API response:", data);
  return data.inventory ?? [];
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

  const inventory = await getInventory(productId);

  const allProducts = await getAllProducts();

  const similarProducts = allProducts.filter(
    (p) =>
      p.category === product.category &&
      p.productId !== product.productId
  );


  // console.log("Inventory received:", inventory);



  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://vastradrobe.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: product.category,
        item: `https://vastradrobe.com/${product.category?.toLowerCase()}`,
      },
      ...(product.subcategory
        ? [
            {
              "@type": "ListItem",
              position: 3,
              name: product.subcategory,
              item: `https://vastradrobe.com/${product.category?.toLowerCase()}?subcategory=${product.subcategory}`,
            },
          ]
        : []),
      {
        "@type": "ListItem",
        position: product.subcategory ? 4 : 3,
        name: product.name,
        item: `https://vastradrobe.com/product/${product.productId}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbStructuredData),
        }}
      />

      <ProductPDPClient
        product={product}
        similarProducts={similarProducts}
        inventory={inventory}
      />
    </>
  );
}