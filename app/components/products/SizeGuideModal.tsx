"use client";

import { sizeGuide } from "@/lib/sizeGuide";
import { IMSProduct } from "@/Types/Product";

export default function SizeGuideModal({
  product,
  onClose,
}: {
  product: IMSProduct;
  onClose?: () => void;
}) {
  if (!product.sizeChartType) return null;

  const guide =
    sizeGuide[
      product.sizeChartType as keyof typeof sizeGuide
    ] || [];

  const availableSizes =
    product.variants
      ?.flatMap((variant) => variant.sizes || [])
      ?.filter(Boolean) || [];

  const uniqueSizes = Array.from(new Set(availableSizes));

  const filteredGuide = guide.filter((row) =>
    uniqueSizes.includes(row.size)
  );

  if (!filteredGuide.length) return null;

  return (
    <div className="mt-6 border-t pt-4 relative">
      {onClose && (
        <button
          onClick={onClose}
          className="absolute top-0 right-0 text-sm"
        >
          ✕
        </button>
      )}

      <h3 className="font-semibold text-lg mb-4">
        Size Guide
      </h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(filteredGuide[0]).map((key) => (
                <th
                  key={key}
                  className="p-2 border capitalize"
                >
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredGuide.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td
                    key={i}
                    className="p-2 border text-center"
                  >
                    {value}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}