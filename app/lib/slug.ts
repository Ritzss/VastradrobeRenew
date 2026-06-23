export function createSlug(name: string, productId: number) {
  return `${name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")}-${productId}`;
}

export function getProductIdFromSlug(slug: string) {
  const id = slug.split("-").pop();

  if (!id || isNaN(Number(id))) {
    throw new Error("Invalid product slug");
  }

  return Number(id);
}