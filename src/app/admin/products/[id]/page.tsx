import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveProduct } from "@/app/actions/admin";
import { getCategories } from "@/lib/queries";
import type { Product } from "@/lib/types";

const KINDS = ["can", "bottle", "tumbler", "bag", "box", "jar"];

const T = ({ n, l, def, type = "text", req = false, step }: { n: string; l: string; def?: string | number | null; type?: string; req?: boolean; step?: string }) => (
  <div><label className="label" htmlFor={n}>{l}</label><input id={n} name={n} type={type} step={step} defaultValue={def ?? ""} required={req} className="input" /></div>
);

export default async function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const categories = await getCategories();
  let p: Product | null = null;
  if (id !== "new") {
    const { data } = await supabase.from("products").select("*").eq("id", id).maybeSingle();
    p = data as Product | null;
    if (!p) notFound();
  }
  return (
    <>
      <h1 className="font-display text-5xl font-extrabold">{p ? "Edit product" : "New product"}</h1>
      <form action={saveProduct} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <T n="name" l="Name" def={p?.name} req /><T n="slug" l="Slug (auto if empty)" def={p?.slug} />
        <T n="price" l="Price (USD)" type="number" step="0.01" def={p ? p.price_cents / 100 : ""} req />
        <T n="compare_at" l="Compare-at price (optional)" type="number" step="0.01" def={p?.compare_at_cents ? p.compare_at_cents / 100 : ""} />
        <T n="stock" l="Stock" type="number" def={p?.stock ?? 0} req />
        <div><label className="label" htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""} className="input"><option value="">—</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">Description</label><textarea id="description" name="description" rows={4} defaultValue={p?.description} className="input" /></div>
        <T n="image_url" l="Image URL (optional – illustration used if empty)" def={p?.image_url} />
        <div className="grid grid-cols-2 gap-4">
          <div><label className="label" htmlFor="art_kind">Illustration</label><select id="art_kind" name="art_kind" defaultValue={p?.art_kind ?? "can"} className="input">{KINDS.map((k) => <option key={k}>{k}</option>)}</select></div>
          <div><label className="label" htmlFor="color">Colour</label><input id="color" name="color" type="color" defaultValue={p?.color ?? "#ff4a1c"} className="input !h-[46px] !p-1" /></div>
        </div>
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-5 w-5" /> Featured on homepage</label>
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="h-5 w-5" /> Visible in store</label>
        <button className="btn btn-primary sm:col-span-2">Save product</button>
      </form>
    </>
  );
}
