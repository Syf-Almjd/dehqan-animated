"use server";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export type FormState = { error?: string; message?: string } | undefined;

const safeNext = (n: FormDataEntryValue | null) => (typeof n === "string" && n.startsWith("/") && !n.startsWith("//") ? n : "/account");

export async function login(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured yet. See README." };
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email: String(fd.get("email")), password: String(fd.get("password")) });
  if (error) return { error: error.message };
  revalidatePath("/", "layout");
  redirect(safeNext(fd.get("next")));
}

export async function signup(_: FormState, fd: FormData): Promise<FormState> {
  if (!isSupabaseConfigured) return { error: "Supabase isn't configured yet. See README." };
  const password = String(fd.get("password"));
  if (password.length < 8) return { error: "Password must be at least 8 characters." };
  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: String(fd.get("email")),
    password,
    options: { data: { full_name: String(fd.get("name") ?? "") } },
  });
  if (error) return { error: error.message };
  if (!data.session) return { message: "Check your email to confirm your account, then sign in." };
  revalidatePath("/", "layout");
  redirect(safeNext(fd.get("next")));
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/");
}
