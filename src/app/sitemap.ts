import type { MetadataRoute } from "next";
import { getCategories, getProducts } from "@/lib/queries";
import { SITE_URL } from "@/lib/format";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, categories] = await Promise.all([getProducts(), getCategories()]);
  return [
    { url: SITE_URL, priority: 1 },
    { url: `${SITE_URL}/products`, priority: 0.9 },
    ...categories.map((c) => ({ url: `${SITE_URL}/products?category=${c.slug}`, priority: 0.7 })),
    ...products.map((p) => ({ url: `${SITE_URL}/products/${p.slug}`, priority: 0.8 })),
  ];
}
