"use server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { demoCoupons } from "@/lib/data";
import { sendOrderNotification } from "@/lib/email";

export type CheckoutInput = {
  items: { id: string; qty: number }[];
  shipping: { name: string; email: string; phone: string; address: string; city: string; zip: string; country: string };
  coupon?: string | null;
};

export async function checkCoupon(code: string, subtotal: number): Promise<{ discount?: number; code?: string; error?: string }> {
  const clean = code.trim().toUpperCase();
  if (!clean) return { error: "Enter a code" };
  if (!isSupabaseConfigured) {
    const c = demoCoupons.find((x) => x.code === clean);
    if (!c) return { error: "That code isn't valid" };
    if (subtotal < c.min_subtotal_cents) return { error: `Spend $${c.min_subtotal_cents / 100} or more to use ${c.code}` };
    return { code: clean, discount: Math.min(subtotal, (c.amount_off_cents ?? 0) + Math.floor((subtotal * (c.percent_off ?? 0)) / 100)) };
  }
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("coupon_discount", { p_code: clean, p_subtotal: subtotal });
  if (error) return { error: error.message };
  return { code: clean, discount: data as number };
}

export async function placeOrder(input: CheckoutInput): Promise<{ orderId?: string; error?: string }> {
  const s = input.shipping;
  if (![s.name, s.address, s.city, s.zip, s.country].every((v) => v?.trim())) return { error: "Please fill in all shipping fields." };
  if (!input.items.length) return { error: "Your cart is empty." };

  let orderId: string;

  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { data, error } = await supabase.rpc("place_order", {
      p_items: input.items.map((i) => ({ product_id: i.id, qty: i.qty })),
      p_shipping: s,
      p_coupon: input.coupon ?? null,
    });
    if (error) return { error: error.message };
    orderId = data as string;
  } else {
    // No Supabase – generate a simple order ID and rely on email notification only
    orderId = `ORD-${Date.now()}`;
  }

  // Fire-and-forget email notification via Brevo SMTP
  sendOrderNotification({ orderId, items: input.items, shipping: s, coupon: input.coupon }).catch((err) =>
    console.error("[email] order notification failed:", err)
  );

  return { orderId };
}
