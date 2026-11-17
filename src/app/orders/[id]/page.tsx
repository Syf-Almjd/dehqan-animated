import Link from "next/link";
import { notFound } from "next/navigation";
import OrderTimeline from "@/components/OrderTimeline";
import { createClient } from "@/lib/supabase/server";
import { dateFmt, money } from "@/lib/format";
import type { Order } from "@/lib/types";

export const metadata = { title: "Your order" };

export default async function OrderPage({ params, searchParams }: { params: Promise<{ id: string }>; searchParams: Promise<{ new?: string }> }) {
  const [{ id }, { new: isNew }] = await Promise.all([params, searchParams]);
  const supabase = await createClient();
  const { data } = await supabase.from("orders").select("*, order_items(*)").eq("id", id).maybeSingle();
  const o = data as Order | null;
  if (!o) notFound();
  return (
    <div className="mx-auto max-w-3xl px-5 py-16">
      {isNew ? <><p className="text-6xl">🎉</p><h1 className="font-display mt-3 text-6xl font-bold">Order placed!</h1><p className="mt-2 opacity-70">Thanks{o.shipping.name ? `, ${o.shipping.name.split(" ")[0]}` : ""}! We&apos;ll email {o.shipping.email} when it ships.</p></>
        : <h1 className="font-display text-6xl font-bold">Order #{o.id.slice(0, 8).toUpperCase()}</h1>}
      <p className="mt-2 text-sm font-semibold opacity-60">#{o.id.slice(0, 8).toUpperCase()} · {dateFmt(o.created_at)}</p>
      <div className="mt-8"><OrderTimeline status={o.status} /></div>
      <div className="card mt-6 space-y-2 p-6">
        {o.order_items?.map((i) => <div key={i.id} className="flex justify-between"><span>{i.qty} × {i.name}</span><span className="font-bold">{money(i.unit_price_cents * i.qty)}</span></div>)}
        <div className="flex justify-between border-t border-ink/20 pt-2"><span>Subtotal</span><span>{money(o.subtotal_cents)}</span></div>
        {o.discount_cents > 0 && <div className="flex justify-between text-mint"><span>Discount ({o.coupon_code})</span><span>−{money(o.discount_cents)}</span></div>}
        <div className="flex justify-between"><span>Shipping</span><span>{o.shipping_cents ? money(o.shipping_cents) : "Free"}</span></div>
        <div className="flex justify-between border-t border-ink/10 pt-2 text-xl font-bold"><span>Total</span><span>{money(o.total_cents)}</span></div>
      </div>
      <div className="card mt-4 p-6 text-sm">
        <p className="label">Shipping to</p>
        <p className="font-semibold">{o.shipping.name}<br />{o.shipping.address}<br />{o.shipping.city} {o.shipping.zip}, {o.shipping.country}</p>
      </div>
      <div className="mt-8 flex gap-3"><Link href="/account" className="btn btn-dark">My orders</Link><Link href="/products" className="btn btn-ghost">Keep shopping</Link></div>
    </div>
  );
}
