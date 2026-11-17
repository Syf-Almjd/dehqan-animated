"use client";
import { useRef } from "react";
import gsap from "gsap";
import { HeartIcon } from "./Icons";
import { useWishlist } from "@/store/wishlist";
import { useUI } from "@/store/ui";
import { useMounted } from "@/lib/useMounted";
import type { CardProduct } from "@/lib/types";

export default function HeartButton({ p, className = "" }: { p: CardProduct; className?: string }) {
  const mounted = useMounted();
  const on = useWishlist((s) => s.items.some((i) => i.id === p.id)) && mounted;
  const toggle = useWishlist((s) => s.toggle);
  const toast = useUI((s) => s.toast);
  const btn = useRef<HTMLButtonElement>(null);

  const click = () => {
    const added = toggle(p);
    const el = btn.current!;
    gsap.fromTo(el, { scale: 0.6 }, { scale: 1, duration: 0.7, ease: "elastic.out(1, 0.35)" });
    if (added) {
      // little burst of hearts
      for (let i = 0; i < 6; i++) {
        const dot = document.createElement("span");
        dot.textContent = "♥";
        dot.className = "pointer-events-none absolute left-1/2 top-1/2 text-leaf text-xs";
        el.appendChild(dot);
        const a = (i / 6) * Math.PI * 2;
        gsap.fromTo(dot, { x: -4, y: -8, scale: 0.4, opacity: 1 }, { x: Math.cos(a) * 26 - 4, y: Math.sin(a) * 26 - 8, scale: 1, opacity: 0, duration: 0.7, ease: "power3.out", onComplete: () => dot.remove() });
      }
    }
    toast(added ? `Saved ${p.name}` : "Removed from wishlist", added ? { href: "/wishlist", cta: "View" } : { tone: "info" });
  };

  return (
    <span className={className || "relative"}>
      <button
        ref={btn} onClick={click} aria-pressed={on} aria-label={on ? `Remove ${p.name} from wishlist` : `Save ${p.name} to wishlist`}
        className={`relative grid h-10 w-10 place-items-center rounded-full border border-ink/15 bg-white transition-colors hover:bg-gold ${on ? "text-leaf" : ""}`}
      >
        <HeartIcon filled={on} className="h-5 w-5" />
      </button>
    </span>
  );
}
