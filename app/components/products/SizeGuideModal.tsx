/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { sizeGuide } from "@/lib/sizeGuide";

export default function SizeGuideModal({ product }: { product: any }) {
  if (!product.sizeChartType) return null;

  const guide = sizeGuide[product.sizeChartType as keyof typeof sizeGuide] || [];

  const filteredGuide = guide.filter(row =>
    product.sizes?.includes(row.size)
  );

  if (!filteredGuide.length) return null;

  return (
    <div className="mt-6 border-t pt-4">
      <h3 className="font-semibold text-lg mb-4">Size Guide</h3>

      <div className="overflow-x-auto">
        <table className="w-full text-sm border">
          <thead className="bg-gray-100">
            <tr>
              {Object.keys(filteredGuide[0]).map(key => (
                <th key={key} className="p-2 border capitalize">
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {filteredGuide.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i} className="p-2 border text-center">
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