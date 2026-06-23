import ProductClient from "@/components/products/ProductClient";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string;
  }>;
}

export default async function SearchPage({
  searchParams,
}: SearchPageProps) {
  const { q = "" } = await searchParams;

  const res = await fetch(
    `${process.env.IMS_BASE_URL}/api/ims/public/products?search=${encodeURIComponent(
      q
    )}`,
    {
      next: {
        revalidate: 120,
      },
    }
  );

  if (!res.ok) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-4">Search Results</h1>
        <p>Failed to load products.</p>
      </div>
    );
  }

  const data = await res.json();

  return (
    <div className="container mt-20 mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-2">Search Results</h1>

      {q && (
        <p className="text-gray-500 mb-6">
          Showing results for: <span className="font-semibold">{q}</span>
        </p>
      )}

      <ProductClient products={data?.products || []} />
    </div>
  );
}