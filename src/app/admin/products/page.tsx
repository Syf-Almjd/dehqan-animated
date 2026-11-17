import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { deleteProduct } from "@/app/actions/admin";
import { money } from "@/lib/format";
import type { Product } from "@/lib/types";

export default async function AdminProducts() {
  const supabase = await createClient();
  const { data } = await supabase.from("products").select("*, category:categories(name, slug)").order("created_at", { ascending: false });
  const products = (data as unknown as Product[]) ?? [];
  return (
    <>
      <div className="flex items-center justify-between"><h1 className="font-display text-5xl font-bold">Products</h1><Link href="/admin/products/new" className="btn btn-primary">+ New product</Link></div>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider"><tr><th className="p-4">Name</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-ink/10">
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-4 font-bold">{p.name}</td><td>{p.category?.name ?? "—"}</td><td>{money(p.price_cents)}</td>
                <td className={p.stock <= 5 ? "font-bold text-leaf" : ""}>{p.stock}</td>
                <td>{p.active ? "Live" : "Hidden"}{p.featured && " ★"}</td>
                <td className="space-x-3 whitespace-nowrap p-4 text-right">
                  <Link href={`/admin/products/${p.id}`} className="font-bold underline">Edit</Link>
                  <form action={deleteProduct} className="inline"><input type="hidden" name="id" value={p.id} /><button className="font-bold text-leaf underline">Delete</button></form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
