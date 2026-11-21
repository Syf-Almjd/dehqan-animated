"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/queries";
import { sendInquiryNotification } from "@/lib/email";

export type ActionState = { ok?: boolean; error?: string; message?: string } | undefined;

export async function subscribe(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email doesn't look right." };
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && error.code !== "23505") return { error: "Couldn't sign you up – try again?" };
  }
  return { ok: true, message: "Thank you – you're on the list." };
}

export async function addReview(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Sign in to leave a review." };
  const rating = Number(fd.get("rating"));
  const body = String(fd.get("body") ?? "").trim();
  if (!(rating >= 1 && rating <= 5)) return { error: "Pick a star rating." };
  if (body.length < 3) return { error: "Tell us a little more." };
  const supabase = await createClient();
  const { error } = await supabase.from("reviews").insert({
    product_id: String(fd.get("product_id")),
    user_id: user.id,
    rating,
    title: String(fd.get("title") ?? "").trim() || null,
    body,
    author_name: user.name || user.email.split("@")[0],
  });
  if (error) return { error: error.code === "23505" ? "You've already reviewed this one." : error.message };
  revalidatePath(`/products/${fd.get("slug")}`);
  return { ok: true, message: "Thanks for the review!" };
}

export async function updateProfile(_: ActionState, fd: FormData): Promise<ActionState> {
  const user = await getCurrentUser();
  if (!user) return { error: "Please sign in." };
  const supabase = await createClient();
  const { error } = await supabase.from("profiles").update({ full_name: String(fd.get("name") ?? "").trim() }).eq("id", user.id);
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  return { ok: true, message: "Saved." };
}

export async function sendInquiry(_: ActionState, fd: FormData): Promise<ActionState> {
  const g = (k: string) => String(fd.get(k) ?? "").trim().slice(0, 2000);
  const row = { name: g("name"), company: g("company") || null, email: g("email").toLowerCase(), phone: g("phone") || null,
    country: g("country") || null, products: g("products") || null, quantity: g("quantity") || null, message: g("message") || null };
  if (!row.name) return { error: "Please tell us your name." };
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(row.email)) return { error: "That email doesn't look right." };

  // Persist to Supabase if available
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("inquiries").insert(row);
    if (error) console.error("[supabase] inquiry insert failed:", error.message);
  }

  // Always send email notification via Brevo SMTP
  try {
    await sendInquiryNotification(row);
  } catch (err) {
    console.error("[email] inquiry notification failed:", err);
    // Still succeed if Supabase stored it; if not, surface the error
    if (!isSupabaseConfigured) return { error: "Couldn't send your enquiry – please email or WhatsApp us instead." };
  }

  return { ok: true, message: "Thank you! We'll reply with samples and a quote shortly." };
}
