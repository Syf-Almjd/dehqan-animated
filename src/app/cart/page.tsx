"use client";
import Link from "next/link";
import { useMounted } from "@/lib/useMounted";
import ProductVisual from "@/components/ProductVisual";
import { cartSubtotal, useCart } from "@/store/cart";
import { FREE_SHIPPING_MIN, money, shippingFor } from "@/lib/format";

export default function CartPage() {
  const { items, setQty, remove } = useCart();
  const mounted = useMounted();
  if (!mounted) return <div className="min-h-[50vh]" />;

  const subtotal = cartSubtotal(items);
  const shipping = shippingFor(subtotal);
  const toFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);

  if (!items.length)
    return (
      <div className="mx-auto max-w-xl px-5 py-28 text-center">
        <p className="text-6xl">🥤</p>
        <h1 className="font-display mt-4 text-5xl font-extrabold">Your cart is empty</h1>
        <p className="mt-2 opacity-70">Let&apos;s fix that.</p>
        <Link href="/products" className="btn btn-primary mt-8">Start shopping</Link>
      </div>
    );

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <h1 className="font-display text-6xl font-extrabold">Your cart</h1>
      <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_380px]">
        <ul className="space-y-4">
          {items.map((i) => (
            <li key={i.id} className="card flex gap-4 p-4">
              <Link href={`/products/${i.slug}`} className="w-24 shrink-0 sm:w-32"><ProductVisual p={i} className="aspect-square rounded-2xl" /></Link>
              <div className="flex flex-1 flex-col justify-between">
                <div className="flex justify-between gap-3">
                  <Link href={`/products/${i.slug}`} className="font-display text-xl font-bold leading-tight hover:text-fizz">{i.name}</Link>
                  <p className="font-bold">{money(i.price_cents * i.qty)}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center rounded-full border-2 border-ink">
                    <button className="h-9 w-9 font-bold" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease">−</button>
                    <span className="w-7 text-center text-sm font-bold">{i.qty}</span>
                    <button className="h-9 w-9 font-bold" onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase">+</button>
                  </div>
                  <button onClick={() => remove(i.id)} className="text-sm font-semibold underline opacity-60 hover:opacity-100">Remove</button>
                </div>
              </div>
            </li>
          ))}
        </ul>
        <aside className="card h-fit space-y-3 bg-white p-6 lg:sticky lg:top-24">
          <h2 className="font-display text-2xl font-extrabold">Summary</h2>
          {toFree > 0 ? (
            <div>
              <p className="text-sm font-semibold">Add {money(toFree)} more for free shipping</p>
              <div className="mt-2 h-2 overflow-hidden rounded-full bg-ink/10"><div className="h-full bg-mint" style={{ width: `${(subtotal / FREE_SHIPPING_MIN) * 100}%` }} /></div>
            </div>
          ) : <p className="text-sm font-bold text-mint">🎉 You&apos;ve unlocked free shipping</p>}
          <div className="flex justify-between"><span>Subtotal</span><span className="font-bold">{money(subtotal)}</span></div>
          <div className="flex justify-between"><span>Shipping</span><span className="font-bold">{shipping ? money(shipping) : "Free"}</span></div>
          <div className="flex justify-between border-t-2 border-ink pt-3 text-xl font-extrabold"><span>Total</span><span>{money(subtotal + shipping)}</span></div>
          <Link href="/checkout" className="btn btn-primary w-full">Checkout →</Link>
        </aside>
      </div>
    </div>
  );
}
