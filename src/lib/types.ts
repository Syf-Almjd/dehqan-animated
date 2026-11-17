export type ArtKind = "can" | "bottle" | "tumbler" | "bag" | "box" | "jar";

export type CategoryNote = { title: string; title_ar: string; body: string; body_ar: string };

export type Category = {
  id: string;
  slug: string;
  name: string;
  name_ar: string | null;
  kicker: string | null;        // e.g. "KANDAHAR & OTHER REGIONS" style eyebrow
  kicker_ar: string | null;
  description: string | null;
  description_ar: string | null;
  image_url: string | null;
  color: string;
  notes?: CategoryNote[] | null;
};

export type Rating = { avg: number; count: number };

export type Product = {
  id: string;
  slug: string;
  name: string;
  name_ar: string | null;
  description: string;
  description_ar: string | null;
  origin: string | null;
  origin_ar: string | null;
  unit: string | null;
  gallery: string[] | null;
  price_cents: number;
  compare_at_cents: number | null;
  category_id: string | null;
  category?: { name: string; slug: string; name_ar?: string | null } | null;
  image_url: string | null;
  art_kind: ArtKind;
  color: string;
  stock: number;
  featured: boolean;
  active: boolean;
  rating?: Rating | null;
};

/** The subset of a product a card / cart / wishlist needs. */
export type CardProduct = Pick<Product, "id" | "slug" | "name" | "price_cents" | "compare_at_cents" | "art_kind" | "color" | "image_url" | "stock"> & {
  name_ar?: string | null;
  unit?: string | null;
  origin?: string | null;
  category?: { name: string; slug: string; name_ar?: string | null } | null;
  rating?: Rating | null;
};

export const toCard = (p: CardProduct): CardProduct => ({
  id: p.id, slug: p.slug, name: p.name, price_cents: p.price_cents, compare_at_cents: p.compare_at_cents,
  art_kind: p.art_kind, color: p.color, image_url: p.image_url, stock: p.stock, category: p.category ?? null, rating: p.rating ?? null,
  name_ar: p.name_ar ?? null, unit: p.unit ?? null, origin: p.origin ?? null,
});

export type Review = {
  id: string;
  product_id: string;
  rating: number;
  title: string | null;
  body: string;
  author_name: string;
  created_at: string;
  product?: { name: string; slug: string } | null;
};

export type Coupon = {
  code: string;
  percent_off: number | null;
  amount_off_cents: number | null;
  min_subtotal_cents: number;
  active: boolean;
  expires_at: string | null;
};

export type OrderStatus = "pending" | "paid" | "shipped" | "delivered" | "cancelled";
export const ORDER_STATUSES: OrderStatus[] = ["pending", "paid", "shipped", "delivered", "cancelled"];

export type Order = {
  id: string;
  user_id: string;
  status: OrderStatus;
  subtotal_cents: number;
  discount_cents: number;
  coupon_code: string | null;
  shipping_cents: number;
  total_cents: number;
  shipping: Record<string, string>;
  created_at: string;
  order_items?: { id: string; name: string; unit_price_cents: number; qty: number; product_id: string | null }[];
};
