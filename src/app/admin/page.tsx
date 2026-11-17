import { createClient } from "@/lib/supabase/server";
import { money } from "@/lib/format";

export default async function Admin() {
  const supabase = await createClient();
  const [{ data: orders }, { count: products }, { data: low }] = await Promise.all([
    supabase.from("orders").select("total_cents,status"),
    supabase.from("products").select("*", { count: "exact", head: true }),
    supabase.from("products").select("name,stock").lte("stock", 10).order("stock").limit(8),
  ]);
  const live = (orders ?? []).filter((o) => o.status !== "cancelled");
  const revenue = live.reduce((n, o) => n + o.total_cents, 0);
  const stats = [["Revenue", money(revenue)], ["Orders", String(orders?.length ?? 0)], ["Pending", String((orders ?? []).filter((o) => o.status === "pending").length)], ["Products", String(products ?? 0)]];
  return (
    <>
      <h1 className="font-display text-5xl font-bold">Dashboard</h1>
      <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(([l, v]) => <div key={l} className="card p-6"><p className="text-xs font-bold uppercase tracking-wider opacity-55">{l}</p><p className="font-display mt-1 text-4xl font-bold">{v}</p></div>)}
      </div>
      <h2 className="font-display mt-10 text-2xl font-bold">Low stock</h2>
      <ul className="card mt-3 divide-y divide-ink/10">
        {(low ?? []).length === 0 && <li className="p-4 opacity-60">All stocked up.</li>}
        {low?.map((p) => <li key={p.name} className="flex justify-between p-4"><span>{p.name}</span><b className={p.stock === 0 ? "text-leaf" : ""}>{p.stock} left</b></li>)}
      </ul>
    </>
  );
}
