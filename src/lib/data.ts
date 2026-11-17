// Demo catalog. Used as a fallback when Supabase isn't configured, and to generate supabase/seed.sql.
import type { Category, Coupon, Product, Review } from "./types";

export const demoCategories: Category[] = [
  { id: "sparkling", slug: "sparkling", name: "Sparkling Drinks", description: "Cold, crisp and full of bubbles.", color: "#FF4A1C" },
  { id: "bottles", slug: "bottles", name: "Bottles & Gear", description: "Carry the refreshment anywhere.", color: "#2BB673" },
  { id: "snacks", slug: "snacks", name: "Snacks", description: "Salty, sweet, shareable.", color: "#FFB800" },
  { id: "gifts", slug: "gifts", name: "Gift Sets", description: "Boxes made for sharing.", color: "#6C5CE7" },
];

type Seed = Omit<Product, "id" | "category" | "active" | "category_id" | "image_url"> & { cat: string };
const seeds: Seed[] = [
  { slug: "cherry-pop-12-pack", name: "Cherry Pop 12-Pack", description: "Wild cherry, a squeeze of lime and a mountain of bubbles. Twelve ice-cold cans of pure fizz.", price_cents: 1899, compare_at_cents: 2400, art_kind: "can", color: "#E8173B", stock: 120, featured: true, cat: "sparkling" },
  { slug: "citrus-spark-12-pack", name: "Citrus Spark 12-Pack", description: "Sunny lemon-orange sparkle. Zero sugar, all the zing.", price_cents: 1899, compare_at_cents: null, art_kind: "can", color: "#FFB800", stock: 90, featured: true, cat: "sparkling" },
  { slug: "mint-fizz-6-pack", name: "Mint Fizz 6-Pack", description: "Cool garden mint meets lime. Tastes like a summer porch.", price_cents: 1099, compare_at_cents: null, art_kind: "can", color: "#2BB673", stock: 64, featured: false, cat: "sparkling" },
  { slug: "blue-wave-glass-bottles", name: "Blue Wave Glass Bottles", description: "Blueberry-coconut sparkle in classic returnable glass. Set of 8.", price_cents: 2199, compare_at_cents: 2599, art_kind: "bottle", color: "#2D7DFF", stock: 48, featured: true, cat: "sparkling" },
  { slug: "ginger-snap-soda", name: "Ginger Snap Soda", description: "Fiery fresh ginger, brewed slow, bottled bold. Set of 6.", price_cents: 1299, compare_at_cents: null, art_kind: "bottle", color: "#C77D12", stock: 70, featured: false, cat: "sparkling" },
  { slug: "insulated-steel-bottle", name: "Insulated Steel Bottle", description: "Keeps drinks icy for 24 hours or hot for 12. 750ml, powder-coated, leak-proof.", price_cents: 3400, compare_at_cents: null, art_kind: "bottle", color: "#14110F", stock: 35, featured: true, cat: "bottles" },
  { slug: "stadium-tumbler", name: "Stadium Tumbler", description: "Double-wall tumbler with a straw lid. Fits every cup holder you own.", price_cents: 2800, compare_at_cents: 3200, art_kind: "tumbler", color: "#FF4A1C", stock: 52, featured: true, cat: "bottles" },
  { slug: "pocket-tumbler-mint", name: "Pocket Tumbler", description: "Compact 350ml tumbler for commutes and carry-ons.", price_cents: 2200, compare_at_cents: null, art_kind: "tumbler", color: "#7FDDB1", stock: 40, featured: false, cat: "bottles" },
  { slug: "sea-salt-popcorn", name: "Sea Salt Popcorn", description: "Light, crunchy, air-popped. A big bag made for sharing.", price_cents: 599, compare_at_cents: null, art_kind: "bag", color: "#FFD23F", stock: 200, featured: false, cat: "snacks" },
  { slug: "spicy-mango-chips", name: "Spicy Mango Chips", description: "Sweet mango, chili kick, ridiculous crunch.", price_cents: 649, compare_at_cents: null, art_kind: "bag", color: "#FF7A1A", stock: 150, featured: false, cat: "snacks" },
  { slug: "together-gift-box", name: "The Together Gift Box", description: "Six cans, two glasses and a bag of popcorn in a box that begs to be opened with friends.", price_cents: 4500, compare_at_cents: 5400, art_kind: "box", color: "#6C5CE7", stock: 25, featured: true, cat: "gifts" },
  { slug: "honey-citrus-concentrate", name: "Honey Citrus Concentrate", description: "Make a week of sparkling drinks at home. One jar, endless refreshment.", price_cents: 1699, compare_at_cents: null, art_kind: "jar", color: "#F2A900", stock: 44, featured: false, cat: "gifts" },
];

export const demoProducts: Product[] = seeds.map(({ cat, ...s }) => {
  const c = demoCategories.find((c) => c.id === cat)!;
  return { ...s, id: s.slug, category_id: c.id, category: { name: c.name, slug: c.slug }, image_url: null, active: true };
});

const NAMES = ["Maya R.", "Jonah K.", "Priya S.", "Leo M.", "Ava T.", "Sam W.", "Noor A.", "Diego F.", "Hana L.", "Chris P."];
const LINES: [string, string, number][] = [
  ["Dangerously good", "Bought one pack, came back for three. The fizz lasts way longer than anything else I've tried.", 5],
  ["Party hit", "Brought these to a BBQ and they were gone in twenty minutes. Everyone asked where they were from.", 5],
  ["Super fresh", "Arrived cold-packed and properly bubbly. The packaging is gorgeous too.", 5],
  ["Great gift", "Gave it to my sister and now she won't stop texting me about it.", 5],
  ["Really solid", "A touch sweeter than I expected, but I'd absolutely buy again.", 4],
  ["Fast shipping", "Ordered Monday, sipping by Wednesday. Love it.", 5],
  ["My new daily", "Replaced my afternoon coffee with this. Zero regrets.", 4],
  ["Looks amazing", "The colours are even better in person. Feels premium on the shelf.", 5],
];

export const demoReviews: Review[] = demoProducts.flatMap((p, pi) =>
  Array.from({ length: 2 + ((pi * 7) % 4) }, (_, k) => {
    const [title, body, rating] = LINES[(pi * 3 + k) % LINES.length];
    return {
      id: `${p.id}-r${k}`, product_id: p.id, rating, title, body,
      author_name: NAMES[(pi + k * 3) % NAMES.length],
      created_at: new Date(Date.UTC(2026, 9 - k, 1 + ((pi * 5 + k * 11) % 27))).toISOString(),
    };
  }),
);

export const demoCoupons: Coupon[] = [
  { code: "WELCOME10", percent_off: 10, amount_off_cents: null, min_subtotal_cents: 0, active: true, expires_at: null },
  { code: "FIZZ5", percent_off: null, amount_off_cents: 500, min_subtotal_cents: 3000, active: true, expires_at: null },
];
