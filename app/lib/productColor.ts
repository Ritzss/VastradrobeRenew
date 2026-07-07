import { IMSProduct } from "@/Types/Product";

export function prioritizeVariant(
  product: IMSProduct,
  selectedColors: string[],
): IMSProduct {
  const variants = [...product.variants];

  variants.sort((a, b) => {
    const aMatch = selectedColors.some(
      (c) => c.toLowerCase() === a.color.toLowerCase(),
    );

    const bMatch = selectedColors.some(
      (c) => c.toLowerCase() === b.color.toLowerCase(),
    );

    if (aMatch && !bMatch) return -1;
    if (!aMatch && bMatch) return 1;

    return 0;
  });

  return {
    ...product,
    variants,
  };
}