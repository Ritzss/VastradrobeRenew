// lib/normalize.ts
export const normalize = (text?: string) =>
  text?.toLowerCase().replace(/\s+/g, "-") || "";
