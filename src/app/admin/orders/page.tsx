import { createClient } from "@/lib/supabase/server";
import { setOrderStatus } from "@/app/actions/admin";
import { dateFmt, money } from "@/lib/format";
import { ORDER_STATUSES, type Order } from "@/lib/types";

export default async function AdminOrders() {
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").order("created_at", { ascending: false }).limit(100);
  const orders = (data as Order[]) ?? [];
  return (
    <>
      <h1 className="font-display text-5xl font-extrabold">Orders</h1>
      <div className="mt-6 space-y-3">
        {orders.length === 0 && <p className="card p-8 text-center font-semibold">No orders yet.</p>}
        {orders.map((o) => (
          <div key={o.id} className="card p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div><p className="font-bold">#{o.id.slice(0, 8).toUpperCase()} · {o.shipping.name}</p><p className="text-sm opacity-60">{dateFmt(o.created_at)} · {o.shipping.email} · {o.shipping.address}, {o.shipping.city}</p></div>
              <div className="flex items-center gap-3">
                <b className="text-lg">{money(o.total_cents)}</b>
                <form action={setOrderStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={o.id} />
                  <select name="status" defaultValue={o.status} className="input !w-auto !py-1.5 text-sm">{ORDER_STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
                  <button className="btn btn-dark !px-4 !py-1.5 !text-sm">Update</button>
                </form>
              </div>
            </div>
            <p className="mt-2 text-sm opacity-70">{o.order_items?.map((i) => `${i.qty}× ${i.name}`).join(", ")}</p>
          </div>
        ))}
      </div>
    </>
  );
}
