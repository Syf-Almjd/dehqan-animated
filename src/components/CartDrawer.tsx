"use client";
import Link from "next/link";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ProductVisual from "./ProductVisual";
import { CloseIcon, MinusIcon, PlusIcon, TrashIcon } from "./Icons";
import { cartCount, cartSubtotal, useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { FREE_SHIPPING_MIN, money } from "@/lib/format";
import { lockScroll } from "@/lib/lenis";
import { useIsoLayoutEffect } from "@/lib/useIsoLayoutEffect";
import { useMounted } from "@/lib/useMounted";

export default function CartDrawer() {
  const open = useUI((s) => s.cartOpen);
  const set = useUI((s) => s.set);
  const { items, setQty, remove } = useCart();
  const mounted = useMounted();
  const panel = useRef<HTMLDivElement>(null);
  const overlay = useRef<HTMLDivElement>(null);
  const meter = useRef<HTMLDivElement>(null);
  const closeBtn = useRef<HTMLButtonElement>(null);
  const first = useRef(true);

  const subtotal = cartSubtotal(items);
  const toFree = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_MIN) * 100);

  useIsoLayoutEffect(() => {
    gsap.set(panel.current, { xPercent: 105, x: 0 });
    gsap.set(overlay.current, { autoAlpha: 0 });
  }, []);

  useEffect(() => {
    if (first.current) { first.current = false; if (!open) return; }
    lockScroll(open);
    if (open) {
      gsap.to(overlay.current, { autoAlpha: 1, duration: 0.35 });
      gsap.to(panel.current, { xPercent: 0, autoAlpha: 1, duration: 0.7, ease: "expo.out" });
      gsap.fromTo(panel.current!.querySelectorAll("[data-line-item]"), { x: 60, opacity: 0 }, { x: 0, opacity: 1, stagger: 0.05, duration: 0.6, ease: "power3.out", delay: 0.12 });
      closeBtn.current?.focus();
      const esc = (e: KeyboardEvent) => e.key === "Escape" && set({ cartOpen: false });
      window.addEventListener("keydown", esc);
      return () => window.removeEventListener("keydown", esc);
    }
    gsap.to(panel.current, { xPercent: 105, duration: 0.5, ease: "power3.in" });
    gsap.to(overlay.current, { autoAlpha: 0, duration: 0.35 });
  }, [open, set]);

  useEffect(() => { if (meter.current) gsap.to(meter.current, { width: `${pct}%`, duration: 0.8, ease: "power3.out" }); }, [pct]);

  const close = () => set({ cartOpen: false });

  return (
    <>
      <div ref={overlay} onClick={close} className="invisible fixed inset-0 z-[60] bg-ink/40 backdrop-blur-[2px]" aria-hidden="true" />
      <aside
        ref={panel}
        inert={!open}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping cart"
        className="invisible fixed inset-y-0 right-0 z-[61] flex w-full max-w-md flex-col border-l border-ink/10 bg-cream"
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-3xl font-bold">Your cart <span className="text-leaf">({mounted ? cartCount(items) : 0})</span></h2>
          <button ref={closeBtn} onClick={close} className="grid h-10 w-10 place-items-center rounded-full border border-ink/15 hover:bg-gold" aria-label="Close cart"><CloseIcon /></button>
        </div>

        <div className="border-b border-ink/10/10 px-6 py-4">
          <p className="text-sm font-bold">{toFree > 0 ? <>You&apos;re <span className="text-leaf">{money(toFree)}</span> away from free shipping</> : "🎉 Free shipping unlocked!"}</p>
          <div className="mt-2 h-2.5 overflow-hidden rounded-full bg-ink/10"><div ref={meter} className="h-full w-0 rounded-full bg-mint" /></div>
        </div>

        <div data-lenis-prevent className="flex-1 overflow-y-auto px-6 py-4">
          {mounted && items.length === 0 ? (
            <div className="grid h-full place-items-center text-center">
              <div>
                <p className="text-6xl">🧺</p>
                <p className="font-display mt-3 text-2xl font-bold">Nothing in here yet</p>
                <Link href="/products" onClick={close} className="btn btn-primary mt-6">Start shopping</Link>
              </div>
            </div>
          ) : (
            <ul className="space-y-3">
              {mounted && items.map((i) => (
                <li key={i.id} data-line-item className="flex gap-3 rounded-2xl border border-ink/15 bg-white p-3">
                  <Link href={`/products/${i.slug}`} onClick={close} className="w-20 shrink-0"><ProductVisual p={i} className="aspect-square rounded-xl" /></Link>
                  <div className="flex flex-1 flex-col justify-between">
                    <div className="flex justify-between gap-2">
                      <Link href={`/products/${i.slug}`} onClick={close} className="font-bold leading-tight hover:text-leaf">{i.name}</Link>
                      <p className="font-bold">{money(i.price_cents * i.qty)}</p>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-ink/15">
                        <button className="grid h-8 w-8 place-items-center" onClick={() => setQty(i.id, i.qty - 1)} aria-label="Decrease"><MinusIcon /></button>
                        <span className="w-6 text-center text-sm font-bold">{i.qty}</span>
                        <button className="grid h-8 w-8 place-items-center disabled:opacity-30" disabled={i.qty >= i.stock} onClick={() => setQty(i.id, i.qty + 1)} aria-label="Increase"><PlusIcon /></button>
                      </div>
                      <button onClick={() => remove(i.id)} className="grid h-8 w-8 place-items-center rounded-full opacity-50 hover:bg-leaf/10 hover:text-leaf hover:opacity-100" aria-label={`Remove ${i.name}`}><TrashIcon /></button>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {mounted && items.length > 0 && (
          <div className="space-y-3 border-t border-ink/10 bg-white px-6 py-5">
            <div className="flex justify-between text-lg font-bold"><span>Subtotal</span><span>{money(subtotal)}</span></div>
            <p className="text-xs opacity-60">Shipping and discount codes are applied at checkout.</p>
            <Link href="/checkout" onClick={close} className="btn btn-primary w-full">Checkout →</Link>
            <Link href="/cart" onClick={close} className="block text-center text-sm font-bold underline">View full cart</Link>
          </div>
        )}
      </aside>
    </>
  );
}
