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

// Demo bank transfer details shown when user selects Bank Transfer
function BankTransferDetails() {
  return (
    <div className="mt-4 rounded-2xl border-2 border-gold/40 bg-gold/10 p-5 space-y-3">
      <p className="flex items-center gap-2 text-sm font-bold text-forest">
        <span className="text-lg">🏦</span> Demo Bank Transfer Details
      </p>
      <div className="grid grid-cols-1 gap-2 text-sm sm:grid-cols-2">
        <div>
          <p className="label !mb-0.5">Bank Name</p>
          <p className="font-semibold text-ink">Demo International Bank</p>
        </div>
        <div>
          <p className="label !mb-0.5">Account Name</p>
          <p className="font-semibold text-ink">Dehqan Farms Export Co.</p>
        </div>
        <div>
          <p className="label !mb-0.5">Account Number</p>
          <p className="font-mono font-semibold text-ink">1234-5678-9012</p>
        </div>
        <div>
          <p className="label !mb-0.5">IBAN / SWIFT</p>
          <p className="font-mono font-semibold text-ink">DEMO0012 / DEMOBANK</p>
        </div>
        <div>
          <p className="label !mb-0.5">Routing Number</p>
          <p className="font-mono font-semibold text-ink">021-000-021</p>
        </div>
        <div>
          <p className="label !mb-0.5">Reference</p>
          <p className="font-mono font-semibold text-ink">Your order number</p>
        </div>
      </div>
      <p className="text-xs text-ink/60 border-t border-gold/30 pt-3">
        ⚠️ Please include your order reference in the payment description. Orders are processed after bank confirmation (1–3 business days).
      </p>
    </div>
  );
}

export default function CheckoutForm({ email, name }: { email: string; name: string }) {
  const router = useRouter();
  const { items, clear, coupon, setCoupon } = useCart();
  const mounted = useMounted();
  const [error, setError] = useState("");
  const [code, setCode] = useState("");
  const [couponMsg, setCouponMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [discount, setDiscount] = useState(0);
  const [payment, setPayment] = useState<"bank" | "cod">("bank");
  const [pending, start] = useTransition();
  const [checking, startCheck] = useTransition();

  if (!mounted) return <div className="min-h-[60vh]" />;
  const subtotal = cartSubtotal(items);
  const t = totals(subtotal, coupon ? discount : 0);

  if (!items.length)
    return (
      <div className="py-24 text-center px-5">
        <p className="text-6xl">🧺</p>
        <p className="font-display mt-4 text-4xl font-bold">Nothing to check out</p>
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
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-5 sm:py-12">
      {/* Breadcrumb */}
      <ol className="flex flex-wrap items-center gap-2 text-xs font-bold sm:gap-3 sm:text-sm">
        <li className="opacity-50"><Link href="/cart">Cart</Link></li><li className="opacity-30">→</li>
        <li className="rounded-full bg-ink px-3 py-1 text-cream">Details &amp; payment</li><li className="opacity-30">→</li>
        <li className="opacity-50">Done</li>
      </ol>
      <h1 className="font-display mt-4 text-4xl font-bold sm:text-5xl lg:text-6xl">Checkout</h1>

      <div className="mt-6 grid gap-6 sm:mt-8 sm:gap-8 lg:grid-cols-[1fr_400px]">
        <form action={submit} id="checkout" className="space-y-5 sm:space-y-6">

          {/* 1. Contact */}
          <fieldset className="card grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
            <legend className="font-display float-left mb-2 w-full text-xl font-bold sm:text-2xl">1. Contact</legend>
            <F n="name" label="Full name" def={name} auto="name" />
            <F n="email" label="Email" type="email" def={email} auto="email" />
            <F n="phone" label="Phone" type="tel" req={false} span auto="tel" />
          </fieldset>

          {/* 2. Shipping */}
          <fieldset className="card grid gap-4 p-5 sm:p-6 sm:grid-cols-2">
            <legend className="font-display float-left mb-2 w-full text-xl font-bold sm:text-2xl">2. Shipping address</legend>
            <F n="address" label="Street address" span auto="street-address" />
            <F n="city" label="City" auto="address-level2" />
            <F n="zip" label="ZIP / Postal code" auto="postal-code" />
            <F n="country" label="Country" def="United States" span auto="country-name" />
          </fieldset>

          {/* 3. Payment */}
          <fieldset className="card p-5 sm:p-6">
            <legend className="font-display float-left mb-3 w-full text-xl font-bold sm:text-2xl">3. Payment method</legend>

            {/* Bank Transfer */}
            <label
              className={`flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${payment === "bank" ? "border-gold bg-gold/10" : "border-ink/10 hover:border-gold/40"}`}
              onClick={() => setPayment("bank")}
            >
              <input
                type="radio" name="payment" value="bank"
                checked={payment === "bank"}
                onChange={() => setPayment("bank")}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--gold)]"
              />
              <div>
                <p className="font-bold">🏦 Bank Transfer</p>
                <p className="mt-0.5 text-xs text-ink/60">Transfer directly to our bank account. Order confirmed after payment clears.</p>
              </div>
            </label>

            {payment === "bank" && <BankTransferDetails />}

            {/* Cash on Delivery */}
            <label
              className={`mt-3 flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors ${payment === "cod" ? "border-leaf bg-leaf/10" : "border-ink/10 hover:border-leaf/30"}`}
              onClick={() => setPayment("cod")}
            >
              <input
                type="radio" name="payment" value="cod"
                checked={payment === "cod"}
                onChange={() => setPayment("cod")}
                className="mt-0.5 h-5 w-5 shrink-0 accent-[var(--leaf)]"
              />
              <div>
                <p className="font-bold">💵 Cash on delivery</p>
                <p className="mt-0.5 text-xs text-ink/60">Pay in cash when your order arrives.</p>
              </div>
            </label>
          </fieldset>

          {error && <p role="alert" className="rounded-2xl border-2 border-saffron bg-saffron/10 p-4 text-sm font-bold text-saffron">{error}</p>}
        </form>

        {/* Order Summary */}
        <aside className="card h-fit space-y-4 p-5 sm:p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-xl font-bold sm:text-2xl">Order summary</h2>
          <ul className="space-y-3">
            {items.map((i) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <div className="relative shrink-0">
                  <ProductVisual p={i} className="h-14 w-14 rounded-xl border border-ink/15" />
                  <span className="absolute -right-2 -top-2 grid h-5 w-5 place-items-center rounded-full bg-ink text-[10px] font-bold text-cream">{i.qty}</span>
                </div>
                <span className="flex-1 font-semibold leading-tight">{i.name}</span>
                <span className="font-bold shrink-0">{money(i.price_cents * i.qty)}</span>
              </li>
            ))}
          </ul>

          <div className="border-t border-ink/10 pt-4">
            {coupon ? (
              <div className="flex items-center justify-between rounded-xl bg-mint/15 px-3 py-2 text-sm font-bold text-mint">
                🎟 {coupon} <button onClick={() => { setCoupon(null); setDiscount(0); setCouponMsg(null); }} className="underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={(e) => { e.preventDefault(); apply(code); }} className="flex gap-2">
                <input value={code} onChange={(e) => setCode(e.target.value.toUpperCase())} placeholder="Discount code" aria-label="Discount code" className="input !py-2 uppercase" />
                <button disabled={checking || !code} className="btn btn-dark !py-2 shrink-0">{checking ? "…" : "Apply"}</button>
              </form>
            )}
            {couponMsg && !couponMsg.ok && <p className="mt-2 text-xs font-bold text-saffron">{couponMsg.text}</p>}
            {couponMsg?.ok && coupon && <p className="mt-2 text-xs font-bold text-mint">{couponMsg.text}</p>}
          </div>

          <div className="space-y-1.5 border-t border-ink/10 pt-4 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{money(t.subtotal)}</span></div>
            {t.discount > 0 && <div className="flex justify-between text-mint"><span>Discount</span><span className="font-bold">−{money(t.discount)}</span></div>}
            <div className="flex justify-between"><span>Shipping</span><span className="font-bold">{t.shipping ? money(t.shipping) : "Free"}</span></div>
          </div>
          <div className="flex justify-between border-t border-ink/10 pt-3 text-xl font-bold sm:text-2xl"><span>Total</span><span>{money(t.total)}</span></div>
          <button form="checkout" disabled={pending} className="btn btn-primary w-full !py-4 text-base">
            {pending ? "Placing order…" : `Place order · ${money(t.total)}`}
          </button>
          <p className="text-center text-xs opacity-50">🔒 Prices and stock are verified on our server.</p>
        </aside>
      </div>
    </div>
  );
}
