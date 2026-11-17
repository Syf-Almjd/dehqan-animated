"use client";
import { useRef } from "react";
import { PlusIcon } from "./Icons";
import { useCart } from "@/store/cart";
import { useUI } from "@/store/ui";
import { flyToCart } from "@/lib/flyToCart";
import { showHeader } from "./HeaderClient";
import type { CardProduct } from "@/lib/types";

export default function QuickAdd({ p, className = "" }: { p: CardProduct; className?: string }) {
  const add = useCart((s) => s.add);
  const toast = useUI((s) => s.toast);
  const btn = useRef<HTMLButtonElement>(null);
  if (p.stock === 0) return null;
  return (
    <button
      ref={btn}
      onClick={() => {
        showHeader();
        add(p);
        flyToCart(btn.current?.closest("[data-card]")?.querySelector("[data-art] svg"));
        toast(`${p.name} added`, { href: "/cart", cta: "View cart" });
      }}
      className={`btn btn-primary !py-2.5 !text-sm transition-all duration-300 md:translate-y-3 md:opacity-0 md:group-hover:translate-y-0 md:group-hover:opacity-100 md:focus-visible:translate-y-0 md:focus-visible:opacity-100 ${className}`}
      aria-label={`Add ${p.name} to cart`}
    >
      <PlusIcon /> Quick add
    </button>
  );
}
