"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { getCurrentUser } from "@/lib/queries";
import { slugify } from "@/lib/format";
import { ORDER_STATUSES, type OrderStatus } from "@/lib/types";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user?.isAdmin) throw new Error("Forbidden");
  return createClient();
}

export async function saveProduct(fd: FormData) {
  const supabase = await requireAdmin();
  const id = String(fd.get("id") ?? "");
  const name = String(fd.get("name") ?? "").trim();
  const compare = Number(fd.get("compare_at"));
  const row = {
    name,
    slug: slugify(String(fd.get("slug") || name)),
    description: String(fd.get("description") ?? ""),
    price_cents: Math.round(Number(fd.get("price")) * 100),
    compare_at_cents: compare > 0 ? Math.round(compare * 100) : null,
    category_id: String(fd.get("category_id") || "") || null,
    name_ar: String(fd.get("name_ar") || "").trim() || null,
    description_ar: String(fd.get("description_ar") || "").trim() || null,
    origin: String(fd.get("origin") || "").trim() || null,
    origin_ar: String(fd.get("origin_ar") || "").trim() || null,
    unit: String(fd.get("unit") || "").trim() || null,
    gallery: String(fd.get("gallery") || "").split(/\s*\n\s*/).map((u) => u.trim()).filter(Boolean),
    image_url: String(fd.get("image_url") || "") || null,
    art_kind: String(fd.get("art_kind") || "bag"),
    color: String(fd.get("color") || "#c99a2e"),
    stock: Math.max(0, Math.floor(Number(fd.get("stock")) || 0)),
    featured: fd.get("featured") === "on",
    active: fd.get("active") === "on",
  };
  if (!row.name || !(row.price_cents >= 0)) throw new Error("Name and a valid price are required");
  const { error } = id ? await supabase.from("products").update(row).eq("id", id) : await supabase.from("products").insert(row);
  if (error) throw new Error(error.message);
  revalidatePath("/", "layout");
  redirect("/admin/products");
}

export async function deleteProduct(fd: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("products").delete().eq("id", String(fd.get("id")));
  revalidatePath("/", "layout");
}

export async function setOrderStatus(fd: FormData) {
  const supabase = await requireAdmin();
  const status = String(fd.get("status")) as OrderStatus;
  if (!ORDER_STATUSES.includes(status)) return;
  await supabase.from("orders").update({ status }).eq("id", String(fd.get("id")));
  revalidatePath("/admin/orders");
}

export async function saveCoupon(fd: FormData) {
  const supabase = await requireAdmin();
  const code = String(fd.get("code") ?? "").trim().toUpperCase().replace(/\s+/g, "");
  const percent = Number(fd.get("percent_off")) || null;
  const amount = Math.round(Number(fd.get("amount_off")) * 100) || null;
  if (!code || (!percent && !amount)) throw new Error("Code and a discount are required");
  const { error } = await supabase.from("coupons").upsert({
    code, percent_off: percent, amount_off_cents: amount,
    min_subtotal_cents: Math.round(Number(fd.get("min_subtotal")) * 100) || 0,
    expires_at: String(fd.get("expires_at") || "") || null, active: true,
  });
  if (error) throw new Error(error.message);
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(fd: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("coupons").update({ active: fd.get("active") === "true" }).eq("code", String(fd.get("code")));
  revalidatePath("/admin/coupons");
}

export async function deleteCoupon(fd: FormData) {
  const supabase = await requireAdmin();
  await supabase.from("coupons").delete().eq("code", String(fd.get("code")));
  revalidatePath("/admin/coupons");
}
