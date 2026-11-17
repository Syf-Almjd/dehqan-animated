import { createClient } from "@/lib/supabase/server";
import { deleteCoupon, saveCoupon, toggleCoupon } from "@/app/actions/admin";
import { dateFmt, money } from "@/lib/format";
import type { Coupon } from "@/lib/types";

export default async function AdminCoupons() {
  const supabase = await createClient();
  const { data } = await supabase.from("coupons").select("*").order("created_at", { ascending: false });
  const coupons = (data as Coupon[]) ?? [];
  return (
    <>
      <h1 className="font-display text-5xl font-bold">Coupons</h1>
      <form action={saveCoupon} className="card mt-6 grid gap-4 p-6 sm:grid-cols-5 sm:items-end">
        <div><label className="label" htmlFor="code">Code</label><input id="code" name="code" required className="input uppercase" placeholder="SUMMER20" /></div>
        <div><label className="label" htmlFor="percent_off">% off</label><input id="percent_off" name="percent_off" type="number" min={1} max={100} className="input" /></div>
        <div><label className="label" htmlFor="amount_off">or $ off</label><input id="amount_off" name="amount_off" type="number" step="0.01" min={0} className="input" /></div>
        <div><label className="label" htmlFor="min_subtotal">Min spend $</label><input id="min_subtotal" name="min_subtotal" type="number" step="0.01" min={0} className="input" /></div>
        <div><label className="label" htmlFor="expires_at">Expires</label><input id="expires_at" name="expires_at" type="date" className="input" /></div>
        <button className="btn btn-primary sm:col-span-5">Create / update coupon</button>
      </form>
      <div className="card mt-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-ink/10 text-xs uppercase tracking-wider"><tr><th className="p-4">Code</th><th>Discount</th><th>Min spend</th><th>Expires</th><th>Status</th><th /></tr></thead>
          <tbody className="divide-y divide-ink/10">
            {coupons.length === 0 && <tr><td colSpan={6} className="p-6 text-center opacity-60">No coupons yet.</td></tr>}
            {coupons.map((c) => (
              <tr key={c.code}>
                <td className="p-4 font-mono font-bold">{c.code}</td>
                <td>{c.percent_off ? `${c.percent_off}%` : ""}{c.percent_off && c.amount_off_cents ? " + " : ""}{c.amount_off_cents ? money(c.amount_off_cents) : ""}</td>
                <td>{c.min_subtotal_cents ? money(c.min_subtotal_cents) : "—"}</td>
                <td>{c.expires_at ? dateFmt(c.expires_at) : "Never"}</td>
                <td>
                  <form action={toggleCoupon}><input type="hidden" name="code" value={c.code} /><input type="hidden" name="active" value={String(!c.active)} />
                    <button className={`rounded-full px-3 py-1 text-xs font-bold ${c.active ? "bg-mint text-white" : "bg-ink/10"}`}>{c.active ? "Active" : "Paused"}</button>
                  </form>
                </td>
                <td className="p-4 text-right"><form action={deleteCoupon}><input type="hidden" name="code" value={c.code} /><button className="font-bold text-leaf underline">Delete</button></form></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
