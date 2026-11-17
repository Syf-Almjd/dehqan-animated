"use server";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { getCurrentUser } from "@/lib/queries";

export type ActionState = { ok?: boolean; error?: string; message?: string } | undefined;

export async function subscribe(_: ActionState, fd: FormData): Promise<ActionState> {
  const email = String(fd.get("email") ?? "").trim().toLowerCase();
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return { error: "That email doesn't look right." };
  if (isSupabaseConfigured) {
    const supabase = await createClient();
    const { error } = await supabase.from("newsletter_subscribers").insert({ email });
    if (error && error.code !== "23505") return { error: "Couldn't sign you up – try again?" };
  }
  return { ok: true, message: "You're in! Check your inbox for 10% off 🎉" };
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
