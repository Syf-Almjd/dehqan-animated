export const money = (cents: number) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(cents / 100);

export const FREE_SHIPPING_MIN = 5000;
export const SHIPPING_FLAT = 500;
export const shippingFor = (subtotal: number) => (subtotal >= FREE_SHIPPING_MIN || subtotal === 0 ? 0 : SHIPPING_FLAT);

/** Mirrors place_order() in schema.sql – the database is the source of truth at checkout. */
export const totals = (subtotal: number, discount = 0) => {
  const shipping = shippingFor(subtotal);
  return { subtotal, discount, shipping, total: Math.max(0, subtotal - discount) + shipping };
};

export const slugify = (s: string) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

export const dateFmt = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });

export const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
