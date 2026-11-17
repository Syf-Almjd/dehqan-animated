import { createClient } from "./supabase/server";
import { isSupabaseConfigured } from "./supabase/env";
import { demoCategories, demoProducts, demoReviews } from "./data";
import type { Category, Order, Product, Rating, Review } from "./types";

export type Sort = "newest" | "price-asc" | "price-desc" | "rating";
export type PriceBand = "under-15" | "15-30" | "30-plus";
export type ProductFilter = { category?: string; q?: string; sort?: Sort; featured?: boolean; limit?: number; price?: PriceBand; inStock?: boolean; sale?: boolean };

export const PRICE_BANDS: { id: PriceBand; label: string; min: number; max: number }[] = [
  { id: "under-15", label: "Under $15", min: 0, max: 1499 },
  { id: "15-30", label: "$15 – $30", min: 1500, max: 2999 },
  { id: "30-plus", label: "$30 +", min: 3000, max: 1e9 },
];

const SELECT = "*, category:categories(name, slug)";

function aggregate(rows: { product_id: string; rating: number }[]): Record<string, Rating> {
  const acc: Record<string, { sum: number; count: number }> = {};
  rows.forEach((r) => { (acc[r.product_id] ??= { sum: 0, count: 0 }); acc[r.product_id].sum += r.rating; acc[r.product_id].count++; });
  return Object.fromEntries(Object.entries(acc).map(([k, v]) => [k, { avg: v.sum / v.count, count: v.count }]));
}

export async function getRatings(): Promise<Record<string, Rating>> {
  if (!isSupabaseConfigured) return aggregate(demoReviews);
  const supabase = await createClient();
  const { data } = await supabase.from("reviews").select("product_id, rating");
  return aggregate(data ?? []);
}

export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured) return demoCategories;
  const supabase = await createClient();
  const { data } = await supabase.from("categories").select("*").order("sort");
  return (data as Category[]) ?? [];
}

export async function getProducts(f: ProductFilter = {}): Promise<Product[]> {
  const band = PRICE_BANDS.find((b) => b.id === f.price);
  let list: Product[];

  if (!isSupabaseConfigured) {
    list = demoProducts.filter((p) => p.active);
    if (f.category) list = list.filter((p) => p.category?.slug === f.category);
    if (f.featured) list = list.filter((p) => p.featured);
    if (f.q) list = list.filter((p) => (p.name + " " + p.description).toLowerCase().includes(f.q!.toLowerCase()));
    if (band) list = list.filter((p) => p.price_cents >= band.min && p.price_cents <= band.max);
    if (f.inStock) list = list.filter((p) => p.stock > 0);
  } else {
    const supabase = await createClient();
    let query = supabase.from("products").select(SELECT).eq("active", true);
    if (f.category) {
      const { data: cat } = await supabase.from("categories").select("id").eq("slug", f.category).maybeSingle();
      if (!cat) return [];
      query = query.eq("category_id", cat.id);
    }
    if (f.featured) query = query.eq("featured", true);
    if (f.q) {
      const term = f.q.replace(/[%,()*]/g, " ").trim();
      query = query.or(`name.ilike.%${term}%,description.ilike.%${term}%`);
    }
    if (band) query = query.gte("price_cents", band.min).lte("price_cents", band.max);
    if (f.inStock) query = query.gt("stock", 0);
    const { data } = await query.order("created_at", { ascending: false });
    list = (data as unknown as Product[]) ?? [];
  }

  if (f.sale) list = list.filter((p) => p.compare_at_cents && p.compare_at_cents > p.price_cents);
  const ratings = await getRatings();
  list = list.map((p) => ({ ...p, rating: ratings[p.id] ?? null }));
  if (f.sort === "price-asc") list = [...list].sort((a, b) => a.price_cents - b.price_cents);
  if (f.sort === "price-desc") list = [...list].sort((a, b) => b.price_cents - a.price_cents);
  if (f.sort === "rating") list = [...list].sort((a, b) => (b.rating?.avg ?? 0) - (a.rating?.avg ?? 0));
  return f.limit ? list.slice(0, f.limit) : list;
}

export async function getProduct(slug: string): Promise<Product | null> {
  let p: Product | null;
  if (!isSupabaseConfigured) p = demoProducts.find((x) => x.slug === slug) ?? null;
  else {
    const supabase = await createClient();
    const { data } = await supabase.from("products").select(SELECT).eq("slug", slug).eq("active", true).maybeSingle();
    p = (data as unknown as Product) ?? null;
  }
  if (!p) return null;
  return { ...p, rating: (await getRatings())[p.id] ?? null };
}

export async function getReviews(productId?: string, limit = 50): Promise<Review[]> {
  if (!isSupabaseConfigured) {
    const list = productId ? demoReviews.filter((r) => r.product_id === productId) : demoReviews;
    return list
      .map((r) => {
        const p = demoProducts.find((x) => x.id === r.product_id);
        return { ...r, product: p ? { name: p.name, slug: p.slug } : null };
      })
      .sort((a, b) => b.created_at.localeCompare(a.created_at))
      .slice(0, limit);
  }
  const supabase = await createClient();
  let q = supabase.from("reviews").select("*, product:products(name, slug)").order("created_at", { ascending: false }).limit(limit);
  if (productId) q = q.eq("product_id", productId);
  const { data } = await q;
  return (data as unknown as Review[]) ?? [];
}

export async function getCurrentUser() {
  if (!isSupabaseConfigured) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data: profile } = await supabase.from("profiles").select("full_name, role").eq("id", user.id).maybeSingle();
  return { id: user.id, email: user.email ?? "", name: (profile?.full_name as string | null) ?? null, isAdmin: profile?.role === "admin" };
}
export type CurrentUser = Awaited<ReturnType<typeof getCurrentUser>>;

export async function getMyOrders(): Promise<Order[]> {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false });
  return (data as Order[]) ?? [];
}
