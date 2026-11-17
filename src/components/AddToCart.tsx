"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import HeartButton from "./HeartButton";
import { MinusIcon, PlusIcon } from "./Icons";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { flyToCart } from "@/lib/flyToCart";
import { money } from "@/lib/format";
import { showHeader } from "./HeaderClient";
import type { CardProduct } from "@/lib/types";

export default function AddToCart({ product }: { product: CardProduct }) {
  const router = useRouter();
  const add = useCart((s) => s.add);
  const setUI = useUI((s) => s.set);
  const [qty, setQty] = useState(1);
  const [busy, setBusy] = useState(false);
  const main = useRef<HTMLDivElement>(null);
  const bar = useRef<HTMLDivElement>(null);
  const out = product.stock === 0;

  // Sticky add-to-cart bar once the main button scrolls out of view.
  useEffect(() => {
    gsap.set(bar.current, { yPercent: 130 });
    const io = new IntersectionObserver(([e]) => {
      const show = !e.isIntersecting && e.boundingClientRect.top < 0;
      gsap.to(bar.current, { yPercent: show ? 0 : 130, duration: 0.5, ease: show ? "expo.out" : "power3.in" });
    });
    io.observe(main.current!);
    return () => io.disconnect();
  }, []);

  const addToCart = (then: "drawer" | "checkout") => {
    if (out || busy) return;
    setBusy(true);
    showHeader();
    add(product, qty);
    flyToCart(document.querySelector("[data-fly] svg, [data-fly] img"), () => {
      setBusy(false);
      if (then === "drawer") setUI({ cartOpen: true });
    });
    if (then === "checkout") router.push("/checkout");
  };

  const stepper = (
    <div className="flex items-center rounded-full border border-ink/15 bg-white">
      <button className="grid h-11 w-11 place-items-center" onClick={() => setQty((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><MinusIcon /></button>
      <span className="w-8 text-center font-bold" aria-live="polite">{qty}</span>
      <button className="grid h-11 w-11 place-items-center disabled:opacity-30" disabled={qty >= product.stock} onClick={() => setQty((q) => Math.min(product.stock, q + 1))} aria-label="Increase quantity"><PlusIcon /></button>
    </div>
  );

  return (
    <>
      <div ref={main} className="space-y-3">
        <div className="flex items-center gap-3">
          {stepper}
          <button disabled={out} onClick={() => addToCart("drawer")} className="btn btn-primary flex-1">
            {out ? "Sold out" : `Add to cart · ${money(product.price_cents * qty)}`}
          </button>
          <HeartButton p={product} />
        </div>
        {!out && <button onClick={() => addToCart("checkout")} className="btn btn-dark w-full">Buy it now</button>}
        {!out && product.stock <= 30 && (
          <p className="flex items-center gap-2 text-sm font-semibold text-leaf">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-leaf opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-leaf" /></span>
            Only {product.stock} left – selling fast
          </p>
        )}
      </div>

      <div ref={bar} className="fixed inset-x-0 bottom-0 z-40 border-t border-ink/10 bg-cream/95 px-4 py-3 backdrop-blur" aria-hidden={false}>
        <div className="mx-auto flex max-w-7xl items-center gap-4">
          <div className="hidden flex-1 sm:block">
            <p className="font-display text-lg font-bold leading-tight">{product.name}</p>
            <p className="text-sm font-bold opacity-60">{money(product.price_cents)}</p>
          </div>
          <div className="hidden sm:block">{stepper}</div>
          <button disabled={out} onClick={() => addToCart("drawer")} className="btn btn-primary flex-1 sm:flex-none">{out ? "Sold out" : "Add to cart"}</button>
        </div>
      </div>
    </>
  );
}
