import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { saveProduct } from "@/app/actions/admin";
import { getCategories } from "@/lib/queries";
import type { Product } from "@/lib/types";


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
      <h1 className="font-display text-5xl font-bold">{p ? "Edit product" : "New product"}</h1>
      <form action={saveProduct} className="card mt-6 grid gap-4 p-6 sm:grid-cols-2">
        <input type="hidden" name="id" value={p?.id ?? ""} />
        <T n="name" l="Name" def={p?.name} req /><T n="name_ar" l="Name – Arabic (الاسم بالعربية)" def={p?.name_ar} />
        <T n="slug" l="Slug (auto if empty)" def={p?.slug} />
        <T n="price" l="Price (RM)" type="number" step="0.01" def={p ? p.price_cents / 100 : ""} req />
        <T n="compare_at" l="Compare-at price (optional)" type="number" step="0.01" def={p?.compare_at_cents ? p.compare_at_cents / 100 : ""} />
        <T n="stock" l="Stock" type="number" def={p?.stock ?? 0} req />
        <div><label className="label" htmlFor="category_id">Category</label>
          <select id="category_id" name="category_id" defaultValue={p?.category_id ?? ""} className="input"><option value="">—</option>{categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div>
        <div className="sm:col-span-2"><label className="label" htmlFor="description">Description</label><textarea id="description" name="description" rows={4} defaultValue={p?.description} className="input" /></div>
        <div className="sm:col-span-2" dir="rtl"><label className="label" htmlFor="description_ar">الوصف بالعربية (Arabic description)</label><textarea id="description_ar" name="description_ar" rows={3} defaultValue={p?.description_ar ?? ""} className="input font-ar" /></div>
        <T n="origin" l="Origin (e.g. Kandahar & other regions)" def={p?.origin} />
        <T n="origin_ar" l="Origin – Arabic" def={p?.origin_ar} />
        <T n="unit" l="Pack size (e.g. 1 kg, 500 g, 1 g)" def={p?.unit} />
        <T n="image_url" l="Main image URL (e.g. /products/green-raisins.jpg)" def={p?.image_url} />
        <div className="sm:col-span-2"><label className="label" htmlFor="gallery">Gallery images – one URL per line</label><textarea id="gallery" name="gallery" rows={3} defaultValue={(p?.gallery ?? []).join("\n")} className="input font-mono text-sm" /></div>
        <input type="hidden" name="art_kind" value={p?.art_kind ?? "bag"} />
        <input type="hidden" name="color" value={p?.color ?? "#c99a2e"} />
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="featured" defaultChecked={p?.featured} className="h-5 w-5" /> Featured on homepage</label>
        <label className="flex items-center gap-2 font-bold"><input type="checkbox" name="active" defaultChecked={p?.active ?? true} className="h-5 w-5" /> Visible in store</label>
        <button className="btn btn-primary sm:col-span-2">Save product</button>
      </form>
    </>
  );
}
