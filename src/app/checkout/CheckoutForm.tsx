"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import ProductVisual from "@/components/ProductVisual";
import { checkCoupon, placeOrder } from "@/app/actions/checkout";
import { cartSubtotal, useCart } from "@/store/cart";
import { money, totals } from "@/lib/format";
import { useMounted } from "@/lib/useMounted";

const F = ({ n, label, def = "", type = "text", req = true, span = false, auto }: { n: string; label: string; def?: string; type?: string; req?: boolean; span?: boolean; auto?: string }) => (
  <div className={span ? "sm:col-span-2" : ""}>
    <label className="label" htmlFor={n}>{label}{!req && <span className="normal-case opacity-50"> (optional)</span>}</label>
    <input id={n} name={n} type={type} defaultValue={def} required={req} autoComplete={auto} className="input" />
  </div>
);

export default function CheckoutForm({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const { items, clear, coupon, setCoupon } = useCart();
  const mounted = useMounted();
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [pending, start] = useTransition();
  const [checking, startCheck] = useTransition();

  if (!mounted) return <div className="min-h-[60vh]" />;
  const subtotal = cartSubtotal(items);
  const t = totals(subtotal, coupon ? discount : 0);

  if (!items.length)
    return (
      <div className="py-32 text-center">
        <p className="font-display text-5xl font-bold">Nothing to check out</p>
        <Link href="/products" className="btn btn-primary mt-6">Go shopping</Link>
      </div>
    );

  const apply = (raw: string) =>
    startCheck(async () => {
      const r = await checkCoupon(raw, subtotal);
      if (r.error) { setCoupon(null); setDiscount(0); setCouponMsg({ ok: false, text: r.error }); }
      else { setCoupon(r.code!); setDiscount(r.discount!); setCouponMsg({ ok: true, text: `${r.code} applied – you save ${money(r.discount!)}` }); }
    });

  function submit(fd: FormData) {
    setError("");
    const g = (k: string) => String(fd.get(k) ?? "");
    start(async () => {
      const res = await placeOrder({
        items: items.map((i) => ({ id: i.id, qty: i.qty })),
        shipping: { name: g("name"), email: g("email"), phone: g("phone"), address: g("address"), city: g("city"), zip: g("zip"), country: g("country") },
        coupon,
      });
      if (res.error) return setError(res.error);
      clear();
      router.push(`/orders/${res.orderId}?new=1`);
    });
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <ol className="flex items-center gap-3 text-sm font-bold">
        <li className="opacity-50"><Link href="/cart">Cart</Link></li><li className="opacity-30">→</li>
        <li className="rounded-full bg-ink px-3 py-1 text-cream">Details & payment</li><li className="opacity-30">→</li>
        <li className="opacity-50">Done</li>
      </ol>
      <h1 className="font-display mt-4 text-6xl font-bold">Checkout</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_400px]">
        <form action={submit} id="checkout" className="space-y-6">
          <fieldset className="card grid gap-4 p-6 sm:grid-cols-2">
            <legend className="font-display float-left mb-2 w-full text-2xl font-bold">1. Contact</legend>
            <F n="name" label="Full name" def={name} auto="name" /><F n="email" label="Email" type="email" def={email} auto="email" />
            <F n="phone" label="Phone" type="tel" req={false} span auto="tel" />
          </fieldset>
          <fieldset className="card grid gap-4 p-6 sm:grid-cols-2">
            <legend className="font-display float-left mb-2 w-full text-2xl font-bold">2. Shipping address</legend>
            <F n="address" label="Street address" span auto="street-address" /><F n="city" label="City" auto="address-level2" /><F n="zip" label="ZIP / Postal code" auto="postal-code" />
            <F n="country" label="Country" def="United States" span auto="country-name" />
          </fieldset>
          <fieldset className="card p-6">
            <legend className="font-display float-left mb-3 w-full text-2xl font-bold">3. Payment</legend>
            <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-ink/15 bg-gold/40 p-4 font-bold">
              <input type="radio" name="payment" defaultChecked className="h-5 w-5 accent-[var(--leaf)]" /> 💵 Pay on delivery
            </label>
            <p className="mt-2 text-xs opacity-60">Card payments plug in with Stripe – see README.</p>
          </fieldset>
          {error && <p role="alert" className="rounded-2xl border-2 border-leaf bg-leaf/10 p-4 text-sm font-bold text-leaf">{error}</p>}
        </form>

        <aside className="card h-fit space-y-4 p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-bold">Order summary</h2>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <div className="relative"><ProductVisual p={i} className="h-14 w-14 rounded-xl border border-ink/15" /><span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-cream">{i.qty}</span></div>
                <span className="flex-1 font-semibold">{i.name}</span><span className="font-bold">{money(i.price_cents * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-ink/10/10 pt-4">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-mint/15 px-3 py-2 text-sm font-bold text-mint">
                🎟 {coupon} <button onClick={() => { setCoupon(null); setDiscount(0); setCouponMsg(null); }} className="underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); apply(code); }} className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Discount code" aria-label="Discount code" className="input !py-2 uppercase" />
                <button disabled={checking || !code} className="btn btn-dark !py-2">{checking ? "…" : "Apply"}</button>
              </form>
            )}
            {couponMsg && !couponMsg.ok && <p className="mt-2 text-xs font-bold text-leaf">{couponMsg.text}</p>}
            {couponMsg?.ok && coupon && <p className="mt-2 text-xs font-bold text-mint">{couponMsg.text}</p>}
          </div>

          <div className="space-y-1.5 border-t border-ink/10/10 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{money(t.subtotal)}</span></div>
            {t.discount > 0 && <div className="flex justify-between text-mint"><span>Discount</span><span className="font-bold">−{money(t.discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span className="font-bold">{t.shipping ? money(t.shipping) : "Free"}</span></div>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-2xl font-bold"><span>Total</span><span>{money(t.total)}</span></div>
          <button form="checkout" disabled={pending} className="btn btn-primary w-full !py-4 text-base">{pending ? "Placing order…" : `Place order · ${money(t.total)}`}</button>
          <p className="text-center text-xs opacity-50">🔒 Prices and stock are verified on our server.</p>
        </aside>
      </div>
    </div>
  );
}
